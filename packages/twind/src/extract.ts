import { consume } from './consume'
import { stringify } from './sheets'
import { tw as tw$ } from './runtime'

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
 * **Note**: Consider using {@link inject} instead.
 *
 * **Note**: This {@link Twind.clear clears} the Twind instance before processing the HTML.
 *
 * 1. parse the markup and process element classes with the provided Twind instance
 * 2. update the class attributes _if_ necessary
 * 3. return the HTML string with the final element classes
 *
 * ```js
 * import { extract } from 'twind'
 *
 * function render() {
 *   const { html, css } = extract(renderApp())
 *
 *   // inject as last element into the head
 *   return html.replace('</head>', `<style data-twind>${css}</style></head>`)
 * }
 * ```
 *
 * You can provide your own Twind instance:
 *
 * ```js
 * import { extract } from 'twind'
 * import { tw } from './custom/twind/instance'
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
 * @param tw a {@link Twind} instance (default: twind managed tw)
 * @returns the possibly modified html and css
 */
export function extract(html: string, tw = tw$): ExtractResult {
  tw.clear()
  return { html: consume(html, tw), css: stringify(tw.target) }
}
