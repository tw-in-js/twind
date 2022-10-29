import { error, invalid } from '@sveltejs/kit'

import { normalizeImportMap } from '@jsenv/importmap'
import { Semver } from 'sver'

import { dev } from '$app/environment'
import { env } from '$env/dynamic/private'

import initialTemplate from '$lib/templates/initial/_'
import { toBase64, toBase64url } from '$lib/base64'
import type { Manifest, Workspace } from '$lib/types'

import pkg from 'lz-string'
const { decompressFromEncodedURIComponent, compressToEncodedURIComponent } = pkg

const MANIFEST_PATH = '/_app/cdn.json'
const HOSTNAME = 'twind-run.pages.dev'

// interface PageData {
//   manifests: {
//     latest: Manifest | undefined
//     next: Manifest | undefined
//     canary: Manifest | undefined
//   }
// }

// import wordlistraw from './wordlist.txt?raw'

// Based on
// - https://gist.github.com/fogleman/c4a1f69f34c7e8a00da8
// - https://www.eff.org/files/2016/09/08/eff_short_wordlist_1.txt from https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases
// 4547 words that are 3-5 chars and good candidates for a prefix search
// const wordlist = wordlistraw.trim().split(/\s+/g)

// content adressable store
// twind.run/<base64url(integrity)> -> twind.run/Ttj8VsbHHK9N0k1KS94JH_RYFxFwOQ6D7hFg3XUnSTw
// actions: share

// after login named/aliased urls with default to three named path generated from integrity
// actions: save (same scope), fork (different scope), share
// properties: title, description, slug
// twind.run/~<user>/<alias> -> twind.run/~sastan/brother-santa-bruno
// twind.run/@<team>/<alias> -> twind.run/@twind/brother-santa-bruno

// Metadata of up to 1024 bytes per key
interface Metadata {
  version: string

  encoding?: 'gzip'
}

const EXPECTED_VERSION = '1'

export async function load({
  params: { key },
  platform: { env },
  fetch,
}: Parameters<import('./$types').PageServerLoad>[0]) {
  const workspace = await loadWorkspace()

  // default no version: use version from local manifest
  // specific version: load manifest from v1-0-0.twind-run.pages.dev
  // dist tag: load manifest from twind-run.pages.dev for 'latest' or dist-tag.twind-run.pages.dev

  const [localManifest, workspaceManifest, latestManifest, nextManifest] = await Promise.all([
    loadManifest(),
    loadManifest(workspace.version).catch(() => null),
    loadManifest('latest').catch(() => null),
    loadManifest('next').catch(() => null),
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
    // remove duplicates
    .filter((x, index, source) => source.indexOf(x) === index)
    // sort in reverse order: latest, next, canary
    // order: latest (current release), next (upcoming release), canary (PR preview),
    .sort((a, b) => Semver.compare(b.version, a.version))

  // console.debug({ workspace, manifests })
  return { workspace, manifests }

  async function loadWorkspace(): Promise<Workspace> {
    if (!key) {
      return initialTemplate
    }

    const data = await env.WORKSPACES.get(key).catch((error) => {
      if (error.message.includes('(10020)')) {
        // get: The specified object name is not valid. (10020)
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

      try {
        const workspace = JSON.parse(data.slice(`${EXPECTED_VERSION}:`.length))
        // TODO: validate workspace loaded from url
        // TODO:
        return workspace
      } catch {
        throw error(404, 'Not found')
      }
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

      return JSON.parse(await blob.text())
    }

    return await data.json()
  }

  async function loadManifest(version = ''): Promise<Manifest> {
    // Branch name aliases are lowercased and non-alphanumeric characters are replaced with a hyphen
    const alias = version === '*' ? '' : version.toLowerCase().replace(/[^a-z\d]/g, '-')

    const origin =
      alias && (alias === 'latest' ? `https://${HOSTNAME}` : `https://${alias}.${HOSTNAME}`)

    const url = origin + MANIFEST_PATH

    // TODO: https://developers.cloudflare.com/workers/runtime-apis/cache/
    // platform.env.caches
    const response = await fetch(url)

    if (!(response.ok && response.status === 200)) {
      throw new Error(`[${response.status}] ${response.statusText || 'request failed'}`)
    }

    const manifest = await response.json<Manifest>()

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

      // TODO: validate workspace {[html | script | config]: {path: string, value: string}, version: string }
      // if (workspace.html) {
      //   return invalid(400, { script: 'missing' })
      // }

      try {
        const blob =
          typeof workspaceRaw === 'string'
            ? new Blob([workspaceRaw], { type: 'application/json' })
            : workspaceRaw

        let { key, sha256 } = await generate(await blob.arrayBuffer())

        const existing = await platform.env.WORKSPACES.head(key)
        if (!existing) {
          // not found
          await platform.env.WORKSPACES.put(
            key,
            await toBlob((await blob.stream()).pipeThrough(await createGzipStream()), {
              type: 'application/json',
            }),
            {
              customMetadata: { version },
              httpMetadata: {
                contentType: 'application/json',
                contentEncoding: 'gzip',
              },
              sha256,
            },
          )
        }

        return { success: true, key }
      } catch (error) {
        return {
          success: true,
          key: compressToEncodedURIComponent(version + ':' + workspaceRaw),
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

async function generate(source: BufferSource) {
  const sha256 = await crypto.subtle.digest('SHA-256', source)
  const integrity = toBase64(sha256)

  // const view = new DataView(sha256)

  return {
    sha256,
    key: toBase64url(integrity),
    // slug: [
    //   // <word>-<word>-<word>-<hash>
    //   wordlist[view.getUint16(0) & wordlist.length],
    //   wordlist[view.getUint16(2) & wordlist.length],
    //   wordlist[view.getUint16(4) & wordlist.length],
    //   integrity
    //     .toLowerCase()
    //     // no vowels or similiar looking chars
    //     .replace(/[=+/01aefijlout]/g, '')
    //     .slice(-6),
    // ].join('-'),
  }
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
