import { error, invalid } from '@sveltejs/kit'

import { normalizeImportMap } from '@jsenv/importmap'
import { Semver } from 'sver'

import { dev } from '$app/environment'
import { env } from '$env/dynamic/private'

import { loadDefaultTemplate, loadTemplate } from '$lib/templates'
import { toBase64, toBase64url } from '$lib/base64'
import type { Manifest, Workspace } from '$lib/types'

import pkg from 'lz-string'
const { decompressFromEncodedURIComponent, compressToEncodedURIComponent } = pkg

import { version as SITE_VERSION } from '../../../package.json'

const MANIFEST_PATH = '/_app/cdn.json'
const HOSTNAME = 'twind-run.pages.dev'

// interface PageData {
//   manifests: {
//     latest: Manifest | undefined
//     next: Manifest | undefined
//     canary: Manifest | undefined
//   }
// }

import wordlistraw from './wordlist.txt?raw'

// Based on
// - https://gist.github.com/fogleman/c4a1f69f34c7e8a00da8
// - https://www.eff.org/files/2016/09/08/eff_short_wordlist_1.txt from https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases
// 4547 words that are 3-5 chars and good candidates for a prefix search
const wordlist = wordlistraw.trim().split(/\s+/g)

// content adressable store
// twind.run/<base64url(integrity)> -> twind.run/Ttj8VsbHHK9N0k1KS94JH_RYFxFwOQ6D7hFg3XUnSTw
// actions: share

// after login named/aliased urls with default to three named path generated from integrity
// actions: save (same scope), fork (different scope), share
// properties: title, description, slug
// twind.run/~<user>/<alias> -> twind.run/~sastan/brother-santa-bruno
// twind.run/@<team>/<alias> -> twind.run/@twind/brother-santa-bruno

// Metadata of up to 1024 bytes per key
const EXPECTED_VERSION = '1'

import { z } from 'zod'

const workspaceFileSchema = z.object({
  path: z.string().min(1),
  value: z.string(),
})

const workspaceSchema = z.object({
  version: z.string().min(1),
  html: workspaceFileSchema,
  script: workspaceFileSchema,
  config: workspaceFileSchema,
})

export async function load({
  request,
  params: { key },
  platform: { env, caches },
  fetch,
}: Parameters<import('./$types').PageServerLoad>[0]) {
  const { workspace } = await loadWorkspace()

  // default no version: use version from local manifest
  // specific version: load manifest from v1-0-0.twind-run.pages.dev
  // dist tag: load manifest from twind-run.pages.dev for 'latest' or dist-tag.twind-run.pages.dev

  const [localManifest, workspaceManifest, latestManifest, nextManifest] = await Promise.all([
    loadManifest(SITE_VERSION),
    loadManifest(workspace?.version).catch((error) => {
      console.warn(`Failed to fetch CDN manifest for ${workspace?.version}`, error)
      return null
    }),
    loadManifest('latest').catch((error) => {
      console.warn(`Failed to fetch CDN manifest for latest`, error)
      return null
    }),
    loadManifest('next').catch((error) => {
      console.warn(`Failed to fetch CDN manifest for next`, error)
      return null
    }),
  ])

  workspace.version = workspaceManifest?.version || ''

  if (
    !(
      workspace.version &&
      [
        localManifest.version,
        workspaceManifest?.version,
        latestManifest?.version,
        nextManifest?.version,
      ].includes(workspace.version)
    )
  ) {
    workspace.version ||= localManifest.version
  }

  const manifests = [localManifest, workspaceManifest, latestManifest, nextManifest]
    // remove nullish (not found)
    .filter(<T>(x: T): x is NonNullable<T> => x != null)
    // remove duplicate versions
    .filter(
      ({ version }, index, source) =>
        source.findIndex((other) => other.version === version) === index,
    )
    // sort in reverse order: latest, next, canary
    // order: latest (current release), next (upcoming release), canary (PR preview),
    .sort((a, b) => Semver.compare(b.version, a.version))

  // console.debug({ workspace, manifests })
  return { workspace, manifests }

  async function loadWorkspace(): Promise<{ workspace: Workspace }> {
    if (!key) {
      return loadDefaultTemplate()
    }

    const template = await loadTemplate(key)

    if (template) {
      return template
    }

    const data = await env.WORKSPACES.get(key).catch((error) => {
      if (error.message.includes('(10020)')) {
        // get: The specified object name is not valid. (10020)
        // maybe a lz-string encoded url
        return null
      }

      if (error.message.includes('(414)')) {
        // get: UTF-8 encoded length of 1747 exceeds key length limit of 1024. (414)
        // maybe a lz-string encoded url
        return null
      }

      throw error
    })

    if (!data) {
      const data = decompressFromEncodedURIComponent(key)

      if (!data) {
        throw error(404, 'Not found')
      }

      if (!data.startsWith(`${EXPECTED_VERSION}:`)) {
        // TODO: better error message
        throw error(404, 'Not found')
      }

      const workspace = JSON.parse(data.slice(`${EXPECTED_VERSION}:`.length))

      const result = workspaceSchema.safeParse(workspace)

      if (!result.success) {
        throw error(400, 'invalid workspace')
      }

      return { workspace: result.data }
    }

    if (data.httpMetadata?.contentType !== 'application/json') {
      // TODO: better error message
      throw error(404, 'Not found')
    }

    if (data.customMetadata?.version !== EXPECTED_VERSION) {
      throw error(404, 'Not found')
    }

    if (data.httpMetadata.contentEncoding) {
      if (data.httpMetadata.contentEncoding !== 'gzip') {
        // TODO: better error message
        throw error(404, 'Not found')
      }

      const blob = await toBlob(data.body.pipeThrough(await createGunzipStream()), {
        type: 'application/json',
      })

      return { workspace: JSON.parse(await blob.text()) }
    }

    return { workspace: await data.json() }
  }

  async function loadManifest(version: string): Promise<Manifest> {
    // Branch name aliases are lowercased and non-alphanumeric characters are replaced with a hyphen
    const alias = version === '*' ? 'latest' : version.toLowerCase().replace(/[^a-z\d]/g, '-')

    const origin =
      version === SITE_VERSION
        ? new URL(request.url).origin
        : alias === 'latest'
        ? `https://${HOSTNAME}`
        : `https://${/^\d\.\d\.\d/.test(alias) ? 'v' + alias : alias}.${HOSTNAME}`

    const url = origin + MANIFEST_PATH

    const cache = caches?.default

    let response = await cache?.match(url).catch((error) => {
      console.warn(`Failed to use cached CDN manifest for ${version} (${origin})`, error)
      return null
    })

    if (!response) {
      console.debug(`Fetching CDN manifest for ${version} (${origin})`)
      response = await fetch(url)

      if (!(response.ok && response.status === 200)) {
        throw new Error(`[${response.status}] ${response.statusText || 'request failed'}`)
      }

      cache?.put(url, response.clone())
    }

    const manifest = await response.json<Manifest>()

    if (manifest.version !== version) {
      try {
        console.debug(
          `Resolving CDN manifest for ${version} (${origin}) using v${manifest.version}`,
        )
        return await loadManifest(manifest.version)
      } catch (error) {
        console.warn(`Failed to fetch CDN manifest for v${manifest.version}`, error)
      }
    }

    console.debug(`Loaded CDN manifest for ${version} (${origin})`)

    return {
      ...manifest,
      ...normalizeImportMap(manifest, response.url),
      url: response.url,
    }
  }
}

export const actions: import('./$types').Actions = {
  share: async ({ request, platform }) => {
    try {
      const body = await request.formData()

      const token = body.get('cf-turnstile-response')
      if (!token) {
        return invalid(400, { missing: 'turnstile' })
      }

      const ip = request.headers.get('CF-Connecting-IP')

      // Validate the token by calling the
      // "/siteverify" API endpoint.
      const trunstileData = new FormData()
      trunstileData.append('secret', env.TURNSTILE_SECRET)
      trunstileData.append('response', token)
      if (ip) {
        trunstileData.append('remoteip', ip)
      }

      const turnstileResult = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          body: trunstileData,
        },
      )

      const outcome: {
        success: boolean
        challenge_ts: string
        hostname: string
        'error-codes': string[]
        action?: string
        cdata?: string
      } = await turnstileResult.json()

      if (!(outcome.success && (dev || outcome.action === 'share'))) {
        return invalid(400, outcome)
      }

      // TODO: ensure the request is valid
      // TODO: ensure max request size is 512kb???
      const version = body.get('version')

      if (version !== EXPECTED_VERSION) {
        return invalid(400, { version: 'mismatch' })
      }

      const workspaceRaw = body.get('workspace')

      if (!workspaceRaw) {
        return invalid(400, { workspace: 'missing' })
      }

      if (typeof workspaceRaw !== 'string') {
        return invalid(400, { workspace: 'invalid' })
      }

      const result = workspaceSchema.safeParse(JSON.parse(workspaceRaw))

      if (!result.success) {
        return invalid(400, { workspace: 'invalid', error: result.error.format() })
      }

      const blob = new Blob([JSON.stringify(result.data)], { type: 'application/json' })

      try {
        const { key, integrity, missing } = await generate(platform, await blob.arrayBuffer())

        // not found
        if (missing) {
          // This dance is the only way I could get it work
          const value = await toBlob(blob.stream().pipeThrough(await createGzipStream()))
          const { readable, writable } =
            typeof FixedLengthStream === 'function'
              ? new FixedLengthStream(value.size)
              : { readable: value, writable: null }

          await Promise.all([
            writable && value.stream().pipeTo(writable),
            platform.env.WORKSPACES.put(key, readable, {
              customMetadata: { version, integrity },
              httpMetadata: {
                contentType: 'application/json',
                contentEncoding: 'gzip',
              },
            }),
          ])
        }

        return { success: true, key, inserted: missing }
      } catch (error) {
        return {
          success: true,
          key: compressToEncodedURIComponent(version + ':' + (await blob.text())),
          message: (error as Error).message,
          code: (error as any).code,
          stack: (error as Error).stack,
        }
      }
    } catch (error) {
      return invalid(500, {
        message: (error as Error).message,
        code: (error as any).code,
        stack: (error as Error).stack,
      })
    }
  },
}

async function generate(platform: App.Platform, source: BufferSource) {
  const sha256 = await crypto.subtle.digest('SHA-512', source)
  const integrity = toBase64(sha256)

  const view = new DataView(sha256)

  // try different slugs
  for (let i = 0; i < view.byteLength - 6; i += 2) {
    const key = [
      // 2685 * 2685 * 2685 = 19.356.769.125
      // <word>-<word>-<word>
      wordlist[view.getUint16(i) % wordlist.length],
      wordlist[view.getUint16((i += 2)) % wordlist.length],
      wordlist[view.getUint16((i += 2)) % wordlist.length],
    ].join('-')

    const existing = await platform.env.WORKSPACES.head(key)

    // does not exist or it is the same data
    if (
      !existing ||
      (existing.customMetadata?.integrity && existing.customMetadata.integrity === integrity)
    ) {
      return { key, integrity, missing: !existing }
    }
  }

  // fallback to short readable integrity
  {
    const key = integrity
      .toLowerCase()
      // no vowels or similiar looking chars
      .replace(/[=+/01aefijlout]/g, '')
      .slice(-12)
      .replace(/(.{4})(?!$)/g, '$1-')

    const existing = await platform.env.WORKSPACES.head(key)

    // does not exist or it is the same data
    if (
      !existing ||
      (existing.customMetadata?.integrity && existing.customMetadata.integrity === integrity)
    ) {
      return { key, integrity, missing: !existing }
    }
  }

  // fallback to long readable integrity
  {
    const key = integrity
      .toLowerCase()
      // no vowels or similiar looking chars
      .replace(/[=+/01aefijlout]/g, '')
      .slice(-25)
      .replace(/(.{5})(?!$)/g, '$1-')

    const existing = await platform.env.WORKSPACES.head(key)

    // does not exist or it is the same data
    if (
      !existing ||
      (existing.customMetadata?.integrity && existing.customMetadata.integrity === integrity)
    ) {
      return { key, integrity, missing: !existing }
    }
  }

  // fallback to full integrity
  const key = toBase64url(integrity)

  const existing = await platform.env.WORKSPACES.head(key)

  return { key, integrity, missing: !existing }
}

async function createGzipStream(): Promise<ReadableWritablePair<Uint8Array, Uint8Array>> {
  if (dev && typeof CompressionStream !== 'function') {
    const zlib = await import('node:zlib')
    const gzip = zlib.createGzip({ level: zlib.constants.Z_BEST_COMPRESSION })

    const stream = await import('node:stream')

    return {
      writable: stream.Writable.toWeb(gzip),
      readable: stream.Readable.toWeb(gzip),
    }
  }

  return new CompressionStream('gzip')
}

async function createGunzipStream(): Promise<ReadableWritablePair<Uint8Array, Uint8Array>> {
  if (dev && typeof CompressionStream !== 'function') {
    const zlib = await import('node:zlib')
    const gzip = zlib.createGunzip()

    const stream = await import('node:stream')

    return {
      writable: stream.Writable.toWeb(gzip),
      readable: stream.Readable.toWeb(gzip),
    }
  }

  return new DecompressionStream('gzip')
}

async function toBlob(
  readable: ReadableStream<BlobPart>,
  options?: BlobPropertyBag,
): Promise<Blob> {
  const parts: BlobPart[] = []

  await readable.pipeTo(
    new WritableStream({
      write(chunk) {
        parts.push(chunk)
      },
    }),
  )

  return new Blob(parts, options)
}
