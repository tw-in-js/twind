/* THIS IS A JS FILE BECAUSE IT IS IMPORTED BY ../mdsvex.config.js */
/**
 * Parses a lines spec string like `1,2-4,5:7`.
 *
 * @param {string} raw
 * @returns {number[]}
 */
export function parseLineNumbers(raw) {
  return raw
    .split(',')
    .flatMap((value) => {
      if (/[:-]/.test(value)) {
        const [start, end] = value.split(/[:-]/).map((value) => Number(value))

        return ' '
          .repeat(end - start + 1)
          .split('')
          .map((_, index) => start + index)
      }
      return Number(value)
    })
    .filter(Boolean)
    .sort()
}

/**
 *
 * @param {string} code
 * @param {string | undefined} lang
 * @param {string | null | undefined} metastring `app.js highlight=2-4 focus=1,3-4`
 * @return {{ code: string, lang: string | undefined, isDiff: boolean, filename: string | undefined, lineOptions: {line: number, classes: string[]}[] }}
 */
export function parseMeta(code, lang, metastring) {
  const lines = code.split('\n')

  const filename = (metastring?.match(/^ *([\w.-]+)/) || [])[1]

  /** @type {Map<number, Set<string>>} */
  const lineOptions = new Map()

  /**
   * @param {number} line
   * @param {string} className
   */
  const addLineClass = (line, className) => {
    let classNames = lineOptions.get(line)

    if (!classNames) {
      lineOptions.set(line, (classNames = new Set()))
    }

    classNames.add(className)
  }

  if (metastring) {
    for (const match of metastring.matchAll(/(\w+)=([\d,-:]+)/g)) {
      if (match[1] == 'focus') {
        // TODO: .line { &.focus {opacity: 0.99;} &.not-focus {opacity: 0.33;} }
        const lineNumbers = parseLineNumbers(match[2])
        lineNumbers.forEach((line) => addLineClass(line, 'line-focus'))
        Array.from({ length: lines.length }, (_, index) => index + 1)
          .filter((line) => !lineNumbers.includes(line))
          .map((line) => addLineClass(line, 'line-not-focus'))
      } else {
        // TODO: .line-highlight { border-left: ..., background: ...}
        parseLineNumbers(match[2]).map((line) => addLineClass(line, 'line-' + match[1]))
      }
      // TODO: line-numbers
      // TODO: hidden=2,3-5
      // TODO: mark=2[16:26]
      // TODO: link=2[16:26] https://github.com/code-hike/codehike
    }
  }

  // lang=diff-js -> replace `+` and `-` by classes
  // TODO: .line { &.inserted {...} &.deleted {...} &.unchanged { ...} }
  const isDiff = !!lang?.startsWith('diff-')
  if (isDiff) {
    lang = lang?.slice(5)

    code = lines
      .map((line, index) => {
        addLineClass(
          index + 1,
          line[0] == '+' ? 'line-inserted' : line[0] == '-' ? 'line-deleted' : 'line-unchanged',
        )
        return line.slice(1)
      })
      .join('\n')
  }

  return {
    filename,
    code,
    lang,
    isDiff,
    lineOptions: Array.from(lineOptions, ([line, classes]) => ({
      line,
      classes: [...classes],
    })).sort((a, b) => a.line - b.line),
  }
}
