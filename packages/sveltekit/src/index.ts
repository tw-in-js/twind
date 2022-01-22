/**
 * [[include:packages/preset-sveltekit/README.md]]
 *
 * @packageDocumentation
 * @module
 */

import type { Handle } from '@sveltejs/kit'

import { inline, tw as tw$ } from 'twind'

export function withTwind(tw = tw$): Handle {
  return async function withTwind$({ event, resolve }) {
    const response = await resolve(event)

    if (response.headers?.get('content-type')?.startsWith('text/html')) {
      const body = await response.text()

      return new Response(inline(body, tw), response)
    }

    return response
  }
}
