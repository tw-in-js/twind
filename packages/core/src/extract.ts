import type { Twind } from './types'

import { consume } from './consume'
import { stringify } from './sheets'

/**
 * Result of {@link extract}
 */
export interface ExtractResult {
  /** The possibly modified HTML */
  html: string

  /** The generated CSS */
  css: string
}

/**
 * Used for static HTML processing (usually to provide SSR support for your javascript-powered web apps)
 *
 * **Note**:This {@link Twind.clear clears} the Twind instance before processing the HTML.
 *
 * 1. parse the markup and process element classes with the provided Twind instance
 * 2. update the class attributes _if_ necessary
 * 3. return the HTML string with the final element classes
 *
 * ```js
 * import { twind, virtual, extract } from '@twind/core'
 *
 * // can be re-used
 * const tw = twind(config, virtual()}
 *
 * function render() {
 *   const { html, css } = extract(renderApp(), tw)
 *
 *   // inject as last element into the head
 *   return html.replace('</head>', `<style data-twind>${css}</style></head>`)
 * }
 * ```
 *
 * @param markup HTML to process
 * @param tw a {@link Twind} instance
 * @returns the possibly modified html and css
 */
export function extract(html: string, tw: Twind): ExtractResult {
  tw.clear()
  return { html: consume(html, tw), css: stringify(tw.target) }
}
