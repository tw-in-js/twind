import { error, invalid } from '@sveltejs/kit'

import { dev } from '$app/environment'
import { env } from '$env/dynamic/private'

import initialTemplate from '$lib/templates/initial/_'

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
interface Metadata {
  version: string

  encoding?: 'gzip'
}

const EXPECTED_VERSION = '1'

export async function load({
  params: { key },
  platform: { env },
}: Parameters<import('./$types').PageServerLoad>[0]) {
  if (!key) {
    return { workspace: initialTemplate }
  }

  console.time('load:' + key)
  try {
    const data = await env.WORKSPACES.get(key)

    if (!data) {
      throw error(404, 'Not found')
    }

    console.debug(data)
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

      const parts: BlobPart[] = []

      await (async function read(reader): Promise<void> {
        const { done, value } = await reader.read()
        if (!done) {
          parts.push(value)
          return read(reader)
        }
      })(data.body.pipeThrough(await createDecompressionStream()).getReader())

      return {
        workspace: JSON.parse(await new Blob(parts).text()) as typeof initialTemplate,
      }
    }

    return {
      workspace: (await data.json()) as typeof initialTemplate,
    }
  } finally {
    console.timeEnd('load:' + key)
  }
}

export const actions: import('./$types').Actions = {
  share: async ({ request, platform }) => {
    console.time('share')
    try {
      const body = await request.formData()

      const token = body.get('cf-turnstile-response')
      if (!token) {
        return invalid(400)
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
        return invalid(400)
      }

      // TODO: ensure the request is valid
      // TODO: ensure max request size is 512kb???
      const version = body.get('version')

      if (version !== EXPECTED_VERSION) {
        return invalid(400, { version: 'mismatch' })
      }

      const workspaceRaw = body.get('workspace')

      if (workspaceRaw == null) {
        return invalid(400, { workspace: 'missing' })
      }

      const workspace = JSON.parse(
        typeof workspaceRaw === 'string' ? workspaceRaw : await workspaceRaw.text(),
      )

      // TODO: validate workspace {[html | script | config | manifest]: {path: string, value: string}}
      // if (workspace.html) {
      //   return invalid(400, { script: 'missing' })
      // }

      const blob =
        typeof workspaceRaw === 'string'
          ? new Blob([workspaceRaw], { type: 'application/json' })
          : workspaceRaw

      const buffer = await blob.arrayBuffer()
      let { key, slug, sha256 } = await generate(buffer)

      const existing = await platform.env.WORKSPACES.head(key)
      if (!existing) {
        // not found
        const stream = (await blob.stream()).pipeThrough(await createCompressionStream())

        const data = await platform.env.WORKSPACES.put(key, stream, {
          customMetadata: { version },
          httpMetadata: {
            contentType: 'application/json',
            contentEncoding: 'gzip',
          },
          sha256,
        })
        console.debug('put', data)
      }

      console.debug({ key, slug, sha256 })

      return { success: true, key }
    } catch (error) {
      console.error(error)
      return invalid(500)
    } finally {
      console.timeEnd('share')
    }
  },
}

async function generate(source: BufferSource) {
  const sha256 = await crypto.subtle.digest('SHA-256', source)
  const integrity = toBase64(sha256)

  //key: three words plus hash
  const view = new DataView(sha256, 0)

  return {
    sha256,
    key: toBase64url(integrity),
    slug: [
      // <word>-<word>-<word>-<hash>
      wordlist[view.getUint16(0) & wordlist.length],
      wordlist[view.getUint16(2) & wordlist.length],
      wordlist[view.getUint16(4) & wordlist.length],
      integrity
        .toLowerCase()
        // no vowels or similiar looking chars
        .replace(/[=+/01aefijlout]/g, '')
        .slice(-6),
    ].join('-'),
  }
}
async function createCompressionStream(): Promise<ReadableWritablePair<Uint8Array, Uint8Array>> {
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

async function createDecompressionStream(): Promise<ReadableWritablePair<Uint8Array, Uint8Array>> {
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

function toBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

function toBase64url(base64: string): string {
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}
