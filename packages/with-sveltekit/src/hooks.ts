import type { Handle } from '@sveltejs/kit'

import type { InlineOptions } from '@twind/core'

import { inline } from '@twind/core'

export type { InlineOptions }

export default function handleTwind(options: InlineOptions['tw'] | InlineOptions = {}): Handle {
  return async function handleTwind$({ event, resolve }) {
    return resolve(event, {
      transformPageChunk: ({ html, done }) => (done ? inline(html, options) : html),
    })
  }
}
