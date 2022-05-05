import type * as Mdast from 'mdast'
import type { IThemeRegistration, Lang, ILanguageRegistration } from 'shiki'

import { createHash } from 'crypto'

import { visit } from 'unist-util-visit'
import { toHtml } from 'hast-util-to-html'

import * as shiki from 'shiki'

// @ts-ignore
import { escape } from 'html-escaper'

import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rangeParser from 'parse-numeric-range'
import { cx } from 'twind'

// js title="..." showLineNumbers {1-3,4} /needle/3-5
// diff-js title focus=1-3,5
//
// [(diff-)?lang]? [title|title="..."]? [showLineNumbers|line-numbers]? [highlightLines]* [highlightTerm]* [focusLines]*
// highlightLines: {1-3,5} or highlight=1-3,5
// highlightTerm: /needle/ or /needle/3-5 (Highlight only the third to fifth instances)
// focusLines: [1-3,5] or focus=1-3,5
// line-numbers or showLineNumber
// TODO: mark=2[16:26]
// TODO: link=2[16:26] https://github.com/code-hike/codehike
// TODO: copy diff include +/-
// TODO: replace style="..." with class?
// TODO: highlight inline code: https://rehype-pretty-code.netlify.app

interface ClassNames {
  figure: string
  figcaption: string
  toolbar: string
  lang: string
  copy: string
  pre: string
  code: string
  'inline-code': string
  line: string
  'line-highlight': string
  'line-focus': string
  'line-not-focus': string
  'line-inserted': string
  'line-removed': string
  'line-unchanged': string
  'term-highlight': string
}

export default function attacher({
  themes,
  langs,
  classNames,
  tokenMap,
}: {
  themes: { light: IThemeRegistration; dark: IThemeRegistration }
  classNames?: Partial<ClassNames>
  /**
   * A list of languages to load upfront.
   */
  langs?: ILanguageRegistration[]
  tokenMap?: Record<string, string>
}): import('unified').Transformer<Mdast.Root, Mdast.Root> {
  return async function transformer(tree) {
    const [lightHighligher, darkHighlighter] = await Promise.all([
      shiki.getHighlighter({
        theme: themes.light,
        langs: [...(langs || []), ...shiki.BUNDLED_LANGUAGES],
      }),
      shiki.getHighlighter({
        theme: themes.dark,
        langs: [...(langs || []), ...shiki.BUNDLED_LANGUAGES],
      }),
    ])

    const loadedLanguages = lightHighligher.getLoadedLanguages()
    const light = { colors: {}, ...lightHighligher.getTheme() }
    const dark = { colors: {}, ...darkHighlighter.getTheme() }

    const resolvedClassNames: ClassNames = {
      figure: cx`relative group text-([${light.fg}] dark:[${dark.fg}]) bg-([${light.bg}] dark:[${dark.bg}]) border-([${light.colors['editorRuler.foreground']}] dark:[${dark.colors['editorRuler.foreground']}]) hover:border-([${light.colors['tab.border']}] dark:[${dark.colors['tab.border']}]) rounded-md shadow [data-line-numbers]:[counterReset:line]`,
      figcaption: cx`px-4 py-2 text-([${light.colors['tab.activeForeground']}] dark:[${dark.colors['tab.activeForeground']}]) bg-([${light.colors['tab.activeBackground']}] dark:[${dark.colors['tab.activeBackground']}]) border-b border-b-([${light.colors['tab.border']}] dark:[${dark.colors['tab.border']}]) rounded-t-md`,
      toolbar: cx`flex mb-2 relative text-xs`,
      lang: cx`ml-4 px-3 py-1 text-([${light.colors['tab.unfocusedActiveForeground']}] dark:[${dark.colors['tab.unfocusedActiveForeground']}]) bg-([${light.colors['tab.inactiveBackground']}] dark:[${dark.colors['tab.inactiveBackground']}]) border-r border-b border-l border-([${light.colors['tab.border']}] dark:[${dark.colors['tab.border']}]) rounded-bl-md rounded-br-md shadow-sm uppercase`,
      copy: cx`absolute top-0 right-0 flex items-center justify-center w-8 h-7 border border-transparent rounded-md transition-all origin-bottom-left text-([${light.colors['tab.unfocusedActiveForeground']}] dark:[${dark.colors['tab.unfocusedActiveForeground']}]) group-hover:(bg-([${light.colors['tab.activeBackground']}]/75 dark:[${dark.colors['tab.activeBackground']}]/75) border-([${light.colors['tab.border']}] dark:[${dark.colors['tab.border']}]) shadow-sm scale-125) &&:hocus:(text-([${light.colors['button.foreground']}] dark:[${dark.colors['button.foreground']}]) bg-([${light.colors['button.hoverBackground']}] dark:[${dark.colors['button.hoverBackground']}]) border-([${light.colors['tab.unfocusedActiveBorder']}] dark:[${dark.colors['tab.unfocusedActiveBorder']}]) scale-125) &&:focus-visible:(border-([${light.colors['focusBorder']}] dark:[${dark.colors['focusBorder']}]) ring-2 ring-([${light.colors['focusBorder']}] dark:[${dark.colors['focusBorder']}]) outline-none) [data-clipboard-copy='success']:!text-([${light.colors['terminal.ansiBrightGreen']} dark:[${dark.colors['terminal.ansiBrightGreen']}]]) [data-clipboard-copy='error']:!text-([${light.colors['terminal.ansiBrightRed']}] dark:[${dark.colors['terminal.ansiBrightRed']}])`,
      pre: cx`m-0 p-0 pb-2 text-([${light.colors['editor.foreground']}] dark:[${dark.colors['editor.foreground']}]) bg-([${light.colors['editor.background']}] dark:[${dark.colors['editor.background']}]) border-none rounded-t-none`,
      code: cx`grid`,
      'inline-code': cx`font-normal text-([${light.colors['editor.foreground']}] dark:[${dark.colors['editor.foreground']}]) bg-([${light.colors['editor.background']}] dark:[${dark.colors['editor.background']}]) dark:(mx-1 px-1 ring-1 ring-[${dark.colors['editor.background']}]/100 rounded-sm before:content-[''] after:content-[''])`,
      // TODO: with-line-numbers as own class
      line: cx`~(px-4 border-l-2 border-l-transparent empty:h-5 not-only-child:hover:bg-([${light.colors['editor.selectionBackground']}] dark:[${dark.colors['editor.selectionBackground']}]) [data-line-numbers]_&:not-only-child:hover:before:text-([${light.colors['editorLineNumber.activeForeground']}] dark:[${dark.colors['editorLineNumber.activeForeground']}]) [data-line-numbers]_&:pl-2 [data-line-numbers]_&:before:(inline-block w-4 mr-4 text-right text-([${light.colors['editorLineNumber.foreground']}] dark:[${dark.colors['editorLineNumber.foreground']}]) content-[counter(line)] counter-increment[line]))`,
      'line-highlight': cx`bg-([${light.colors['editor.lineHighlightBackground']}] dark:[${dark.colors['editor.lineHighlightBackground']}]) border-l-([${light.colors['focusBorder']}] dark:[${dark.colors['focusBorder']}]) [data-line-numbers]_&:before:text-([${light.colors['editorLineNumber.activeForeground']}] dark:[${dark.colors['editorLineNumber.activeForeground']}])`,
      'line-focus': cx`opacity-100 [data-line-numbers]_&:before:text-([${light.colors['editorLineNumber.activeForeground']}] dark:[${dark.colors['editorLineNumber.activeForeground']}])`,
      'line-not-focus': cx`opacity-50`,
      'line-inserted': cx`pl-2 bg-([${light.colors['diffEditor.insertedTextBackground']}] dark:[${dark.colors['diffEditor.insertedTextBackground']}]) before:(inline-block w-2 mr-1 content-['+'])`,
      'line-removed': cx`pl-2 bg-([${light.colors['diffEditor.removedTextBackground']}] dark:[${dark.colors['diffEditor.removedTextBackground']}]) before:(inline-block w-2 mr-1 content-['-'])`,
      'line-unchanged': cx`pl-2 opacity-50 before:(inline-block w-2 mr-1 content-['&nbsp;'])`,
      'term-highlight': cx`bg-([${light.colors['editor.selectionBackground']}] dark:[${dark.colors['editor.selectionBackground']}]) rounded-sm ring-2 ring-([${light.colors['editor.selectionBackground']}]/100 dark:[${dark.colors['editor.selectionBackground']}]/100)`,
      ...classNames,
    }

    const resolvedTokenMap: Record<string, string | undefined> = {
      import: 'constant.other.symbol',
      module: 'constant.other.symbol',
      package: 'entity.name.module.js',
      fn: 'entity.name.function',
      function: 'entity.name.function',
      arg: 'variable.parameter',
      param: 'variable.parameter',
      parameter: 'variable.parameter',
      let: 'support.other.variable',
      const: 'support.other.variable',
      var: 'support.other.variable',
      variable: 'support.other.variable',
      nil: 'constant.language.undefined',
      undefined: 'constant.language.undefined',
      null: 'constant.language.null',
      ...tokenMap,
    }

    function highlight(
      code: string,
      lang: string | undefined,
      lineOptions?: { line: number; classes: string[] }[],
    ) {
      if (lang && !loadedLanguages.includes(lang as Lang)) {
        console.warn(`Unrecognised language: ${lang}`)
        lang = undefined
      }

      const darkCode = unified()
        .use(rehypeParse, { fragment: true })
        .parse(darkHighlighter.codeToHtml(code, { lang: lang as Lang, lineOptions }))

      const darkClasses: string[][] = []
      visit(darkCode, 'element', (node) => {
        if (node.properties) {
          darkClasses.push(styleToClassNames((node.properties.style as string) || ''))
        }
      })

      const lightCode = unified()
        .use(rehypeParse, { fragment: true })
        .parse(lightHighligher.codeToHtml(code, { lang: lang as Lang, lineOptions }))

      visit(lightCode, 'element', (node) => {
        if (node.properties) {
          const darkClassNames = darkClasses.shift() as string[]
          const lightClassNames = styleToClassNames((node.properties.style as string) || '')

          const classNames = mergeClassNames(
            lightClassNames,
            darkClassNames,
            node.properties.className as string[],
          )

          node.properties.style = undefined
          node.properties.className = classNames.length ? classNames : undefined
        }
      })

      return lightCode
    }

    visit(tree, 'inlineCode', function visitor(node) {
      const { value } = node
      if (!value) {
        return
      }

      // TODO: allow escape characters to break out of highlighting
      let meta = ''
      const code = value.replace(/{:([a-z.-]+)}$/i, (_, $1) => {
        meta = $1
        return ''
      })

      const isLang = !meta.startsWith('.')

      let html: any

      if (isLang) {
        html = (highlight(code, meta).children[0] as any).children[0]
      } else {
        const lightToken = light.settings.find(
          ({ scope }) => meta && scope?.includes(resolvedTokenMap[meta.slice(1)] || meta.slice(1)),
        )?.settings

        const darkToken = dark.settings.find(
          ({ scope }) => meta && scope?.includes(resolvedTokenMap[meta.slice(1)] || meta.slice(1)),
        )?.settings

        const lightClassNames = [
          `text-[${lightToken?.foreground || light.fg}]`,
          lightToken?.background && `bg-[${lightToken.background}]`,
          // "bold underline italic"
          /\bbold\b/.test(lightToken?.fontStyle as string) && `font-bold`,
          /\bunderline\b/.test(lightToken?.fontStyle as string) && `underline`,
          /\bitalic\b/.test(lightToken?.fontStyle as string) && `italic`,
        ].filter(Boolean) as string[]

        const darkClassNames = [
          `text-[${darkToken?.foreground || dark.fg}]`,
          darkToken?.background && `bg-[${darkToken.background}]`,
          // "bold underline italic"
          /\bbold\b/.test(darkToken?.fontStyle as string) && `font-bold`,
          /\bunderline\b/.test(darkToken?.fontStyle as string) && `underline`,
          /\bitalic\b/.test(darkToken?.fontStyle as string) && `italic`,
        ].filter(Boolean) as string[]

        const classNames = mergeClassNames(lightClassNames, darkClassNames)

        html = unified()
          .use(rehypeParse, { fragment: true })
          .parse(
            `<code><span class="line"><span class="${classNames.join(' ')}">${escape(
              code,
            )}</span></span>`,
          )
      }

      visit(html, 'element', function (node) {
        if (node.tagName === 'code') {
          node.properties = {
            ...node.properties,
            'data-inline-code': true,
            className: resolvedClassNames['inline-code'].split(' '),
          }
          if (meta && isLang) {
            node.properties['data-lang'] = meta
          }

          node.children = node.children[0].children
        }
      })
      ;(node as any).type = 'html'
      node.value = toHtml(html)
    })

    visit(tree, 'code', function visitor(node) {
      const id =
        ':code:' +
        createHash('sha1')
          .update(JSON.stringify(node))
          .digest()
          .toString('hex')
          .replace(/[=/]/g, '')
          .slice(0, 8)

      let { code, lang, title, isDiff, showLineNumbers, terms, lineOptions } = parse(
        node,
        resolvedClassNames,
      )

      let html = highlight(code, lang, lineOptions)

      if (terms.length) {
        highlightTerms(html, terms, resolvedClassNames['term-highlight'] || 'term-highlight')
      }

      visit(html, 'element', function (node) {
        if (node.tagName === 'pre') {
          node.properties = {
            ...node.properties,
            className: (resolvedClassNames['pre'] || '').split(' '),
          }
        } else if (node.tagName === 'code') {
          node.properties = {
            ...node.properties,
            id,
            className: (resolvedClassNames['code'] || '').split(' '),
          }
        } else if (
          node.tagName === 'span' &&
          (node.properties?.className as undefined | string[])?.includes('line')
        ) {
          const classNames = new Set([
            ...(node.properties?.className as string[]).filter((className) => className !== 'line'),
            ...(resolvedClassNames['line'] || 'line').split(' '),
          ])

          node.properties = {
            ...node.properties,
            className: [...classNames],
          }
        }
      })

      const toolbar = [
        lang && `<span class="${resolvedClassNames['lang']}">${escape(lang)}</span>`,
        `<button data-clipboard-copy for="${id}" class="${resolvedClassNames['copy']}" aria-label="Copy code to clipboard">
          <svg xmlns="http://www.w3.org/2000/svg" class="hidden [data-clipboard-copy='']_&:block h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
          </svg>

          <span class="hidden [data-clipboard-copy='success']_&:block" aria-label="success">
            <span aria-hidden="true">✓</span>
          </span>

          <span class="hidden [data-clipboard-copy='error']_&:block" aria-label="failed">
            <span aria-hidden="true">✗</span>
          </span>
        </button>`,
      ]
        .filter(Boolean)
        .join('')

      const attributes = [
        'data-code',
        lang && `data-lang="${escape(lang)}"`,
        isDiff && 'data-diff',
        showLineNumbers && 'data-line-numbers',
        `class="${resolvedClassNames['figure']}"`,
      ]
        .filter(Boolean)
        .join(' ')

      const body = [
        title &&
          `<figcaption class="${resolvedClassNames['figcaption']}">${escape(title)}</figcaption>`,
        `<div class="${resolvedClassNames['toolbar']}">${toolbar}</div>`,
        toHtml(html),
      ]
        .filter(Boolean)
        .join('')

      ;(node as any).type = 'html'
      node.value = `<figure ${attributes}>${body}</figure>`
    })
  }
}

function parse(node: Mdast.Code, classNames: ClassNames) {
  let { meta, lang, value: code } = node

  meta = (meta || '').trim()
  const lines = code.split('\n')
  /** @type {Map<number, Set<string>>} */
  const lineOptions = new Map()

  /**
   * @param {number} line
   * @param {string} className
   */
  const addLineClass = (line: number, className: keyof ClassNames) => {
    let lineClassNames = lineOptions.get(line)

    if (!lineClassNames) {
      lineOptions.set(line, (lineClassNames = new Set()))
    }

    lineClassNames.add(classNames[className])
  }

  // [(diff-)?lang]? [title|title="..."]? [showLineNumbers|line-numbers]? [highlightLines]* [highlightTerm]* [focusLines]*
  // title=asas or title="..." or title='...' or title=`...`
  let title: string | undefined
  meta = meta.replace(/ *title=(?:([^"'`]\S+)|(["'`])(.+?)\2) */, (_, unqoted, quote, quoted) => {
    title = unqoted || quoted

    // remove the match
    return ''
  })

  // showLineNumber or line-numbers
  let showLineNumbers = false
  meta = meta.replace(/ *(showLineNumbers|line-numbers) */, () => {
    showLineNumbers = true

    // remove the match
    return ''
  })

  // highlightLines: {1-3,5} or highlight=1-3,5
  meta = meta.replace(/ *(?:{([\d.,-]+)}|highlight=([\d.,-]+)) */g, (_, unkeyed, keyed) => {
    rangeParser(unkeyed || keyed).map((line) => addLineClass(line, 'line-highlight'))

    // remove the match
    return ''
  })

  // focusLines: [1-3,5] or focus=1-3,5
  meta = meta.replace(/ *(?:\[([\d.,-]+)\]|focus=([\d.,-]+)) */, (_, unkeyed, keyed) => {
    const lineNumbers = rangeParser(unkeyed || keyed)
    lineNumbers.forEach((line) => addLineClass(line, 'line-focus'))
    Array.from({ length: lines.length }, (_, index) => index + 1)
      .filter((line) => !lineNumbers.includes(line))
      .map((line) => addLineClass(line, 'line-not-focus'))

    // remove the match
    return ''
  })

  const terms: { value: string; instances: number[] | null | undefined; count: number }[] = []

  // highlightTerm: /needle/ or /needle/3-5 (Highlight only the third to fifth instances)
  meta = meta.replace(
    / *\/((?:\\\/|'[^']+'|"[^"]+"|`[^`]+`|[^/])+)\/([\d.,-]+)? */g,
    (_, value, instances) => {
      terms.push({
        value: value.replace(/\\\//g, '/'),
        instances: instances && rangeParser(instances),
        count: 0,
      })

      // remove the match
      return ''
    },
  )

  // the remaining may be the title
  if (!title && meta) {
    title = meta
  }

  // lang=diff-js -> replace `+` and `-` by classes
  const isDiff = lang?.startsWith('diff-')
  if (isDiff) {
    lang = lang!.slice(5)

    code = lines
      .map((line, index) => {
        addLineClass(
          index + 1,
          line[0] == '+' ? 'line-inserted' : line[0] == '-' ? 'line-removed' : 'line-unchanged',
        )
        return line.slice(1)
      })
      .join('\n')
  }

  return {
    title,
    code,
    lang: lang || undefined,
    isDiff,
    showLineNumbers,
    terms,
    lineOptions: Array.from(lineOptions, ([line, classes]) => ({
      line,
      classes: [...classes].filter(Boolean),
    })).sort((a, b) => a.line - b.line),
  }
}

function highlightTerms(html: any, terms: any, className: string) {
  const cloneNode = (node: any, value: string, highlight = false) => {
    const classNames = highlight
      ? [...new Set([...(node.properties?.className || []), ...className.split(' ')])].filter(
          Boolean,
        )
      : node.properties?.className

    return {
      ...node,
      properties: { ...node.properties, className: classNames },
      children: [{ ...node.children[0], value, position: undefined }],
      position: undefined,
    }
  }

  visit(html, 'element', function (node) {
    if (
      node.tagName === 'span' &&
      (node.properties?.className as undefined | string | string[])?.includes('line')
    ) {
      // [ <span>...<span>, <span>...</span>, ...]

      for (const term of terms) {
        let needle = term.value
        let lineContent = ''
        for (let i = 0; i < node.children.length; i++) {
          const span = node.children[i]
          const textContent = (span as any).children[0].value as string

          if (!textContent) {
            lineContent = ''
            continue
          }

          lineContent += textContent

          // 1. includes: prefix[needle]suffix
          const index = textContent.indexOf(needle)
          if (~index) {
            // <span>prefix.needle.suffix</span>
            // => <span>prefix.</span><span class="term-highlight">needle</span><span>.suffix</span>
            term.count += 1
            if (!term.instances || term.instances.includes(term.count)) {
              const prefix = textContent.slice(0, index)
              const suffix = textContent.slice(index + needle.length)
              // console.log({ textContent, needle, prefix, suffix })
              const newNodes = [
                prefix && cloneNode(span, prefix),
                cloneNode(span, needle, true),
                suffix && cloneNode(span, suffix),
              ].filter(Boolean)

              node.children.splice(i, 1, ...newNodes)
              if (prefix) {
                i += 1
              }
              lineContent = ''
            }
          } else {
            // <span>prefix.nee</span><span>dl</span><span>e.suffix</span>
            // => <span>prefix.</span><span class="term-highlight"><span>nee</span><span>dl</span><span>e</span></span><span>.suffix</span>
            // walk backwords through the nodes
            // prefix.nee|dl|e.suffix
            //
            let startIndex = lineContent.indexOf(needle)
            if (~startIndex) {
              term.count += 1

              if (!term.instances || term.instances.includes(term.count)) {
                let position = lineContent.length
                let endIndex = startIndex + needle.length

                let suffixNode
                const wrappedNodes = []
                for (let j = i; j >= 0; j--) {
                  const span = node.children[j]
                  const textContent = (span as any).children[0].value as string

                  position -= textContent.length
                  const index =
                    position <= startIndex
                      ? Math.max(position, startIndex)
                      : Math.min(lineContent.length, endIndex)

                  const prefix = lineContent.slice(position, index)
                  const suffix = lineContent.slice(index)
                  lineContent = lineContent.slice(0, position)

                  if (j === i) {
                    // last node
                    suffixNode = suffix && cloneNode(span, suffix)
                  }

                  if (position <= startIndex) {
                    // first node
                    if (suffix) {
                      wrappedNodes.unshift(cloneNode(span, suffix))
                    }
                  } else if (prefix) {
                    wrappedNodes.unshift(cloneNode(span, prefix))
                  }

                  if (position <= startIndex) {
                    const newNodes = [
                      prefix && cloneNode(span, prefix),
                      {
                        type: 'element',
                        tagName: 'span',
                        properties: { className: className.split(' ') },
                        children: wrappedNodes,
                        position: undefined,
                      },
                      suffixNode,
                    ].filter(Boolean)

                    node.children.splice(j, i - j + 1, ...newNodes)
                    i = j + newNodes.length - 1
                    break
                  }
                }
              }

              lineContent = ''
            }
          }
        }
      }
    }
  })
}

function styleToClassNames(style: string): string[] {
  const classNames: string[] = []

  for (const [, property, value] of style.matchAll(/\s*([a-z-]+):\s*([^;]+)\s*;?\s*/g)) {
    switch (property) {
      case 'background-color': {
        classNames.push(`bg-[${value.toLowerCase()}]`)
        break
      }
      case 'color': {
        classNames.push(`text-[${value.toLowerCase()}]`)
        break
      }
      case 'font-weight': {
        classNames.push(`font-${value}`)
        break
      }
      case 'font-style':
      case 'text-decoration': {
        classNames.push(value)
        break
      }
      default: {
        console.warn(`Could not convert "${property}:${value}" to class name.`)
        classNames.push(`[${property}:${value}]`)
      }
    }
  }

  return classNames
}

function mergeClassNames(
  lightClassNames: string[],
  darkClassNames: string[],
  initialClassNames?: string[],
): string[] {
  const classNames = new Set<string>(initialClassNames || [])

  // reset non color styles for dark mode
  if (lightClassNames.includes('font-bold') && !darkClassNames.includes('font-bold')) {
    darkClassNames.push('font-normal')
  }
  if (lightClassNames.includes('italic') && !darkClassNames.includes('italic')) {
    darkClassNames.push('not-italic')
  }
  if (lightClassNames.includes('underline') && !darkClassNames.includes('underline')) {
    darkClassNames.push('no-underline')
  }

  lightClassNames.forEach((className) => classNames.add(className))
  darkClassNames.forEach((className) => classNames.add(`dark:${className}`))

  return [...classNames]
}
