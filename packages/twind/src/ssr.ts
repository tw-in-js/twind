import type { Twind } from './types'
import { changed } from './internal/changed'
import { tw as tw$ } from './runtime'
import { identity } from './utils'
import { stringify } from './sheets'

/**
 * Options for {@link inline}
 */
export interface InlineOptions {
  /**
   * {@link Twind} instance to use (default: {@link tw$ | module tw})
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
  return html.replace('</head>', `<style data-twind>${minify(css, html)}</style></head>`)
}

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
 * **Note**: Consider using {@link inline} instead.
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
export function extract(html: string, tw: Twind<any, any> = tw$): ExtractResult {
  const restore = tw.snapshot()

  const result = { html: consume(html, tw), css: stringify(tw.target) }

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
 * import { consume, stringify, snapshot, tw } from 'twind'
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
 * You can provide your own Twind instance:
 *
 * ```js
 * import { consume, stringify } from 'twind'
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
 * @param markup HTML to process
 * @param tw a {@link Twind} instance
 * @returns possibly modified HTML
 */
export function consume(markup: string, tw: (className: string) => string = tw$): string {
  let result = ''
  let lastChunkStart = 0

  parse(markup, (startIndex, endIndex, quote) => {
    const value = markup.slice(startIndex, endIndex)

    // Lets handle some special react case that messes with arbitrary values for `content-`
    // <span class="before:content-[&#x27;asas&#x27;]"></span>
    // <span class="before:content-[&quot;asas&quot;]"></span>
    //
    // if a class name contains `'` or `"` those will be replaced with HTMl entities
    // To fix this we replace those for depending on the actual quote that is being used
    // as an alternative we could always escape class names direcly in twind like react does
    // but this works for now
    const token =
      quote == `"`
        ? value.replace(/(\[)&#x27;|&#x27;(])/g, `$1'$2`)
        : quote == `'`
        ? value.replace(/(\[)&quot;|&quot;(])/g, `$1"$2`)
        : value

    const className = tw(token)

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

// For now we are using a simple parser adapted from htm (https://github.com/developit/htm/blob/master/src/build.mjs)
// If we find any issues we can switch to something more sophisticated like
// - https://github.com/acrazing/html5parser
// - https://github.com/fb55/htmlparser2

const MODE_SLASH = 0
const MODE_TEXT = 1
const MODE_WHITESPACE = 2
const MODE_TAGNAME = 3
const MODE_COMMENT = 4
const MODE_ATTRIBUTE = 5

function parse(
  markup: string,
  onClass: (startIndex: number, endIndex: number, quote: string) => void,
): void {
  let mode = MODE_TEXT
  let startIndex = 0
  let quote = ''
  let attributeName = ''

  const commit = (currentIndex: number): void => {
    if (mode == MODE_ATTRIBUTE && attributeName == 'class') {
      onClass(startIndex, currentIndex, quote)
    }
  }

  for (let position = 0; position < markup.length; position++) {
    const char = markup[position]

    if (mode == MODE_TEXT) {
      if (char == '<') {
        mode = markup.substr(position + 1, 3) == '!--' ? MODE_COMMENT : MODE_TAGNAME
      }
    } else if (mode == MODE_COMMENT) {
      // Ignore everything until the last three characters are '-', '-' and '>'
      if (char == '>' && markup.slice(position - 2, position) == '--') {
        mode = MODE_TEXT
      }
    } else if (quote) {
      if (char == quote && markup[position - 1] != '\\') {
        commit(position)
        mode = MODE_WHITESPACE
        quote = ''
      }
    } else if (char == '"' || char == "'") {
      quote = char
      startIndex += 1
    } else if (char == '>') {
      commit(position)
      mode = MODE_TEXT
    } else if (!mode) {
      // MODE_SLASH
      // Ignore everything until the tag ends
    } else if (char == '=') {
      attributeName = markup.slice(startIndex, position)
      mode = MODE_ATTRIBUTE
      startIndex = position + 1
    } else if (char == '/' && (mode < MODE_ATTRIBUTE || markup[position + 1] == '>')) {
      commit(position)
      mode = MODE_SLASH
    } else if (/\s/.test(char)) {
      // <a class=font-bold>
      commit(position)
      mode = MODE_WHITESPACE
      startIndex = position + 1
    }
  }
}
