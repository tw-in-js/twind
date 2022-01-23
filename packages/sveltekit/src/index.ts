/**
 * [[include:packages/preset-sveltekit/README.md]]
 *
 * @packageDocumentation
 * @module
 */

import type { Handle } from '@sveltejs/kit'

import type { InlineOptions } from 'twind'

import { inline } from 'twind'

export type { InlineOptions }

export function withTwind(options?: InlineOptions['tw'] | InlineOptions): Handle {
  return async function withTwind$({ event, resolve }) {
    const response = await resolve(event)

    if (response.headers?.get('content-type')?.startsWith('text/html')) {
      const body = await response.text()

      return new Response(inline(body, options), response)
    }

    return response
  }
}
