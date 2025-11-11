import type { Twind } from './types'
import { changed } from './internal/changed'
import { tw as tw$ } from './runtime'
import { identity } from './utils'
import { stringify } from './sheets'
import { fixClassList, parseHTML } from './internal/parse-html'

/**
 * Options for {@link inline}
 */
export interface InlineOptions {
  /**
   * {@link Twind} instance to use (default: {@link @twind/core.tw})
   */
  tw?: Twind<any, any>

  /**
   * Allows to minify the resulting CSS.
   */
  minify?: InlineMinify
}

export interface InlineMinify {
  /**
   * Called to minify the CSS.
   *
   * @param css the CSS to minify
   * @param html the HTML that will be used — allows to only include above-the-fold CSS
   * @return the resulting CSS
   */
  (css: string, html: string): string
}
/**
 * Used for static HTML processing (usually to provide SSR support for your javascript-powered web apps)
 *
 * 1. parse the markup and process element classes with the provided Twind instance
 * 2. update the class attributes _if_ necessary
 * 3. inject a style element with the CSS as last element into the head
 * 4. return the HTML string with the final element classes
 *
 * ```js
 * import { inline } from '@twind/core'
 *
 * function render() {
 *   return inline(renderApp())
 * }
 * ```
 *
 * Minify CSS with [@parcel/css](https://www.npmjs.com/package/@parcel/css):
 *
 * ```js
 * import { inline } from '@twind/core'
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
 * import { inline } from '@twind/core'
 * import { tw } from './custom/twind/instance'
 *
 * function render() {
 *   return inline(renderApp(), { tw })
 * }
 * ```
 *
 * @group Static Extraction
 * @param markup HTML to process
 * @param options to customize the processing
 * @returns the resulting HTML
 */
export function inline(markup: string, options: InlineOptions['tw'] | InlineOptions = {}): string {
  const { tw = tw$, minify = identity } =
    typeof options == 'function' ? ({ tw: options } as InlineOptions) : options

  const { html, css, json } = extract(markup, tw)

  // inject as last element into the head
  return html
    .replace('</head>', `<style data-twind>${minify(css, html)}</style></head>`)
    .replace('</body>', `<script type="application/json" data-twind-cache>${json}</script></body>`)
}

/**
 * Result of {@link extract}
 */
export interface ExtractResult {
  /** The possibly modified HTML */
  html: string

  /** The generated CSS */
  css: string

  /** The json state necessary for hydration on the browser */
  json: string
}

/**
 * Used for static HTML processing (usually to provide SSR support for your javascript-powered web apps)
 *
 * **Note**: Consider using {@link inline} instead.
 *
 * 1. parse the markup and process element classes with the provided Twind instance
 * 2. update the class attributes _if_ necessary
 * 3. return the HTML string with the final element classes
 *
 * ```js
 * import { extract } from '@twind/core'
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
 * import { extract } from '@twind/core'
 * import { tw } from './custom/twind/instance'
 *
 * function render() {
 *   const { html, css, json } = extract(renderApp(), tw)
 *
 *   // inject as last element into the head
 *   return html
 *      .replace('</head>', `<style data-twind>${css}</style></head>`)
 *      .replace('</body>', `<script type="application/json" data-twind-cache>${json}</script></body>`)
 * }
 * ```
 *
 * @group Static Extraction
 * @param markup HTML to process
 * @param tw a {@link Twind} instance (default: twind managed tw)
 * @returns the possibly modified html and css
 */
export function extract(html: string, tw: Twind<any, any> = tw$): ExtractResult {
  const restore = tw.snapshot()

  const result = { html: consume(html, tw), css: stringify(tw.target), json: tw.cache.toString() }

  restore()

  return result
}

/**
 * Used for static HTML processing (usually to provide SSR support for your javascript-powered web apps)
 *
 * **Note**: Consider using {@link inline} or {@link extract} instead.
 *
 * 1. parse the markup and process element classes with the provided Twind instance
 * 2. update the class attributes _if_ necessary
 * 3. return the HTML string with the final element classes
 *
 * ```js
 * import { consume, stringify, tw } from '@twind/core'
 *
 * function render() {
 *   const html = renderApp()
 *
 *   // remember global classes
 *   const restore = tw.snapshot()
 *
 *   // generated markup
 *   const markup = consume(html)
 *
 *   // create CSS
 *   const css = stringify(tw.target)
 *
 *   // restore global classes
 *   restore()
 *
 *   // inject as last element into the head
 *   return markup.replace('</head>', `<style data-twind>${css}</style></head>`)
 * }
 * ```
 *
 * You can provide your own Twind instance:
 *
 * ```js
 * import { consume, stringify } from '@twind/core'
 * import { tw } from './custom/twind/instance'
 *
 * function render() {
 *   const html = renderApp()
 *
 *   // remember global classes
 *   const restore = snapshot(tw.target)
 *
 *   // generated markup
 *   const markup = consume(html)
 *
 *   // restore global classes
 *   restore()
 *
 *   // create CSS
 *   const css = stringify(tw.target)
 *
 *   // inject as last element into the head
 *   return markup.replace('</head>', `<style data-twind>${css}</style></head>`)
 * }
 * ```
 *
 * @group Static Extraction
 * @param markup HTML to process
 * @param tw a {@link Twind} instance
 * @returns possibly modified HTML
 */
export function consume(markup: string, tw: (className: string) => string = tw$): string {
  let result = ''
  let lastChunkStart = 0

  parseHTML(markup, (startIndex, endIndex, quote) => {
    const value = markup.slice(startIndex, endIndex)
    const className = tw(fixClassList(value, quote))

    // We only need to shift things around if we need to actually change the markup
    if (changed(value, className)) {
      // We've hit another mutation boundary

      // Add quote if necessary
      quote = quote ? '' : '"'

      result += markup.slice(lastChunkStart, startIndex) + quote + className + quote

      lastChunkStart = endIndex
    }
  })

  // Combine the current result with the tail-end of the input
  return result + markup.slice(lastChunkStart, markup.length)
}
