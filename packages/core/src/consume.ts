import { changed } from './internal/changed'

/**
 * Used for static HTML processing (usually to provide SSR support for your javascript-powered web apps)
 *
 * 1. parse the markup and process element classes with the provided Twind instance
 * 2. update the class attributes _if_ necessary
 * 3. return the HTML string with the final element classes
 *
 * ```js
 * import { twind, virtual, consume} from '@twind/core'
 *
 * // can be re-used
 * const tw = twind(config, virtual()}
 *
 * function render() {
 *   const html = app()
 *
 *   // clear all styles
 *   tw.clear()
 *
 *   // generated markup
 *   const markup = consume(html, tw)
 *
 *   // create CSS
 *   const css = tw.target.join('')
 *
 *   // inject as last element into the head
 *   return markup.replace('</head>', `<style id="tw">${css}</style></head>`)
 * }
 * ```
 *
 * @param markup HTML to process
 * @param tw a {@link Twind} instance
 * @returns possibly modified HTML
 */
export function consume(markup: string, tw: (className: string) => string): string {
  let result = ''
  let lastChunkStart = 0

  extract(markup, (startIndex, endIndex, quote) => {
    const value = markup.slice(startIndex, endIndex)
    const className = tw(value)

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

function extract(
  markup: string,
  onClass: (startIndex: number, endIndex: number, quote: string) => void,
): void {
  let mode = MODE_TEXT
  let startIndex = 0
  let quote = ''
  let char = ''
  let attributeName = ''

  const commit = (currentIndex: number): void => {
    if (mode == MODE_ATTRIBUTE && attributeName == 'class') {
      onClass(startIndex, currentIndex, quote)
    }
  }

  for (let position = 0; position < markup.length; position++) {
    char = markup[position]

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
