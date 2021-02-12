/* eslint-env node */
// ^^^^ This comment is need to prevent browser bundles of this file

/**
 * [[include:src/shim/server/README.md]]
 *
 * @packageDocumentation
 * @module twind/shim/server
 */

import type { TW } from '../../types'
import * as htmlparser2 from 'htmlparser2'
import { tw as defaultTW } from '../../index'

// htmlparser2 has no esm bundle =>
// a little dance to work around different cjs loaders
const { Tokenizer } =
  ((htmlparser2 as unknown) as { default: typeof import('htmlparser2') }).default || htmlparser2

/**
 * Options for {@link shim}.
 */
export interface ShimOptions {
  /**
   * Custom {@link twind.tw | tw} instance to use (default: {@link twind.tw}).
   */
  tw?: TW
}

export { virtualSheet, getStyleTag, getStyleTagProperties } from '../../sheets/index'

const noop = () => undefined

/**
 * Shim the passed html.
 *
 * 1. tokenize the markup and process element classes with either the
 *    {@link twind.tw | default/global tw} instance or a {@link ShimOptions.tw | custom} instance
 * 2. populate the provided sheet with the generated rules
 * 3. output the HTML markup with the final element classes

 * @param markup the html to shim
 * @param options to use
 * @return the HTML markup with the final element classes
 */
export const shim = (markup: string, options: TW | ShimOptions = {}): string => {
  const { tw = defaultTW } = typeof options === 'function' ? { tw: options } : options

  let lastAttribName = ''
  let lastChunkStart = 0
  const chunks: string[] = []

  const tokenizer = new Tokenizer(
    {
      decodeEntities: false,
      xmlMode: false,
    },
    {
      onattribend: noop,
      onattribdata: (value) => {
        if (lastAttribName === 'class') {
          const currentIndex = tokenizer.getAbsoluteIndex()
          const startIndex = currentIndex - value.length
          const parsedClassNames = tw(value)

          // We only need to shift things around if we need to actually change the markup
          if (parsedClassNames !== value) {
            // We've hit another mutation boundary
            chunks.push(markup.slice(lastChunkStart, startIndex))
            chunks.push(parsedClassNames)
            lastChunkStart = currentIndex
          }
        }
        // This may not be strictly necessary
        lastAttribName = ''
      },
      onattribname: (name) => {
        lastAttribName = name
      },
      oncdata: noop,
      onclosetag: noop,
      oncomment: noop,
      ondeclaration: noop,
      onend: noop,
      onerror: noop,
      onopentagend: noop,
      onopentagname: noop,
      onprocessinginstruction: noop,
      onselfclosingtag: noop,
      ontext: noop,
    },
  )

  tokenizer.end(markup)

  // Avoid unnecessary array operations and string concatenation if we never
  // needed to slice and dice things.
  if (!chunks.length) {
    return markup
  }

  // Combine the current set of chunks with the tail-end of the input
  return chunks.join('') + markup.slice(lastChunkStart || 0, markup.length)
}
