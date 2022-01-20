import { extract } from './extract'
import { tw as tw$ } from './runtime'

/**
 * Used for static HTML processing (usually to provide SSR support for your javascript-powered web apps)
 *
 * **Note**: This {@link Twind.clear clears} the Twind instance before processing the HTML.
 *
 * 1. parse the markup and process element classes with the provided Twind instance
 * 2. update the class attributes _if_ necessary
 * 3. inject a style element with the CSS as last element into the head
 * 4. return the HTML string with the final element classes
 *
 * ```js
 * import { inject } from 'twind'
 *
 * function render() {
 *   return inject(renderApp())
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
 *   return inject(renderApp(), tw)
 * }
 * ```
 *
 * @param markup HTML to process
 * @param tw a {@link Twind} instance
 * @returns the resulting HTML
 */
export function inject(markup: string, tw = tw$): string {
  const { html, css } = extract(markup, tw)

  // inject as last element into the head
  return html.replace('</head>', `<style data-twind>${css}</style></head>`)
}
