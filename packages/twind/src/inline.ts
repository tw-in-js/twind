import { extract } from './extract'
import { tw as tw$ } from './runtime'
import { identity } from './utils'

/**
 * Options for {@link inline}
 */
export interface InlineOptions {
  /**
   * {@link Twind} instance to use (default: {@link tw$ | module tw})
   */
  tw?: typeof tw$

  /**
   * Allows to minify the resulting CSS.
   */
  minify?: (css: string) => string
}

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
 * import { inline } from 'twind'
 *
 * function render() {
 *   return inline(renderApp())
 * }
 * ```
 *
 * Minify CSS with [@parcel/css](https://www.npmjs.com/package/@parcel/css):
 *
 * ```js
 * import { inline } from 'twind'
 * import { transform } from '@parcel/css'
 *
 * function render() {
 *   return inline(renderApp(), { minify: (css) => transform({ filename: 'twind.css', code: Buffer.from(css), minify: true }) })
 * }
 * ```
 *
 * You can provide your own Twind instance:
 *
 * ```js
 * import { inline } from 'twind'
 * import { tw } from './custom/twind/instance'
 *
 * function render() {
 *   return inline(renderApp(), { tw })
 * }
 * ```
 *
 * @param markup HTML to process
 * @param tw a {@link Twind} instance
 * @returns the resulting HTML
 */
export function inline(markup: string, options: InlineOptions['tw'] | InlineOptions = {}): string {
  const { tw = tw$, minify = identity } =
    typeof options == 'function' ? ({ tw: options } as InlineOptions) : options

  const { html, css } = extract(markup, tw)

  // inject as last element into the head
  return html.replace('</head>', `<style data-twind>${minify(css)}</style></head>`)
}
