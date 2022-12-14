import type {
  BaseTheme,
  ExtractThemes,
  Preset,
  Twind,
  TwindConfig,
  TwindUserConfig,
} from '@twind/core'

import { matchSorter, type MatchSorterOptions } from 'match-sorter'
import cssbeautify from 'cssbeautify'
import QuickLRU from 'quick-lru'

import type { Boundary } from './internal/types'
import type {
  DocumentationAt,
  DocumentationForOptions,
  Intellisense,
  IntellisenseOptions,
  Suggestion,
} from './types'

import { parse, type ParsedDevRule } from '@twind/core'

import { createIntellisenseContext } from './internal/create-context'
import { spacify } from './internal/spacify'
import { compareSuggestions } from './internal/compare-suggestion'

export * from './types'

const MDN = 'https://developer.mozilla.org'

export function createIntellisense<Theme extends BaseTheme = BaseTheme>(
  twind: Twind<Theme>,
  options?: IntellisenseOptions,
): Intellisense<Theme>

export function createIntellisense<Theme extends BaseTheme = BaseTheme>(
  config: TwindConfig<Theme>,
  options?: IntellisenseOptions,
): Intellisense<Theme>

export function createIntellisense<Theme = BaseTheme, Presets extends Preset<any>[] = Preset[]>(
  config: TwindUserConfig<Theme, Presets>,
  options?: IntellisenseOptions,
): Intellisense<BaseTheme & ExtractThemes<Theme, Presets>>

export function createIntellisense(
  config: Twind | TwindConfig | TwindUserConfig,
  options: IntellisenseOptions = {},
): Intellisense {
  const suggestionCache = new QuickLRU<string, Suggestion[]>({ maxSize: 1000, ...options.cache })
  const documentationCache = new QuickLRU<string, string | null>({
    maxSize: 1000,
    ...options.cache,
  })

  const context = createIntellisenseContext(config, options)
  const { mdnOrigin = MDN } = options

  // Precache empty input as it is the most common and take a while
  suggestionCache.set('', context.suggestions.map(toSuggestion))

  function generateClassDescription(className: string): string {
    const css = context.generateCSS(className)

    const bodyStart = css.lastIndexOf('{')
    const bodyEnd = css.indexOf('}')

    if (bodyStart === -1 || bodyEnd === -1) {
      return css
    }

    return cssbeautify(`.x{${css.slice(bodyStart + 1, bodyEnd)}}`, { indent: '' })
      .split('\n')
      .slice(1, -1)
      .join(' ')
  }

  function toSuggestion(suggestion: Suggestion): Suggestion {
    if (suggestion.type === 'variant') {
      return {
        type: suggestion.type,
        name: suggestion.name,
        value: suggestion.value,
        description: suggestion.description,
        detail: suggestion.detail,
        color: suggestion.color,
      }
    }

    return {
      type: suggestion.type,
      name: suggestion.name,
      value: suggestion.value,
      description: (suggestion.description ||= generateClassDescription(suggestion.name)),
      detail: suggestion.detail,
      color: suggestion.color,
    }
  }

  let mdnIndexPromise: Promise<{ title: string; url: string }[]> | null = null
  const mdnCache = new QuickLRU<
    string,
    Promise<{ title: string; summary?: string | undefined; browserCompat?: string[] | undefined }>
  >({
    maxSize: 1000,
    ...options.cache,
  })
  return {
    get theme() {
      return context.tw.theme
    },
    get config() {
      return context.tw.config
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    async suggest(input, { prefix = '', ignore } = {}) {
      const key = JSON.stringify({ input, prefix, ignore })
      let result = suggestionCache.get(key)

      if (!result) {
        let source = context.suggestions
        let threshold: MatchSorterOptions['threshold'] = matchSorter.rankings.MATCHES

        const token = prefix + input

        const match = /^(.+(?:-\[.+])?)\/([^/]+|\[.+])?$/.exec(token)
        if (match) {
          const { 1: key, 2: modifier = '' } = match
          const suggestion = context.classes.get(key) || context.variants.get(key)
          if (suggestion?.modifiers) {
            source = suggestion?.modifiers
            input = modifier
          }
        }

        if (token[0] === '-') {
          source = source.filter(({ name }) => name[0] === '-')

          if (prefix) {
            prefix = prefix.slice(1)
          } else {
            input = input.slice(1)
          }
        }

        if (ignore?.length) {
          source = source.filter(({ value }) => !ignore.includes(value))
        }

        if (prefix) {
          source = source
            .filter(({ type, value }) => type === 'variant' || value.startsWith(prefix))
            .map((suggestion) =>
              suggestion.type === 'variant'
                ? suggestion
                : {
                    ...suggestion,
                    filter: spacify(suggestion.value.slice(prefix.length)),
                    value: suggestion.value.slice(prefix.length),
                  },
            )
        }

        const { length } = input.replace(/[-\s]+/g, '')

        if (length === 0) {
          if (prefix) {
            source = source.sort((a, b) => compareSuggestions(a, b, prefix))
          }

          suggestionCache.set(key, (result = source.map(toSuggestion)))
        } else {
          if (length < 2) {
            threshold = matchSorter.rankings.CONTAINS
          }

          // TODO: spacify should ignore `[...]`
          const search = spacify(input)

          suggestionCache.set(
            key,
            (result = matchSorter(source, search, {
              keys: ['filter'],
              threshold,
              baseSort: (a, b) => compareSuggestions(a.item, b.item, prefix),
            }).map(toSuggestion)),
          )
        }
      }

      return result
    },
    async suggestAt(content, position, language) {
      // html: class="..." | class='...' | class=...
      // markdown, mdx: <html>
      // javascript|typescript: "..." | '...' | `...`
      //  TODO: lit: html`...`
      // javascriptreact, typescriptreact: className="..." | className='...'| className={<js>} | class={<js>} | <html>
      // svelte: class:...= | class={<js>} | class="{<js>}" | class='{<js>}' | <html> | <js>
      // vue, vue-html: <html> | <js> | :class="{<js>}"> | :class="[<js>]"> // TODO :class="{underline: true}"
      // alpinejs: x-bind:class="! open ? 'hidden' : ''"
      // solidjs: classList={{ active: state.active, editing: state.currentId === row.id }}

      // TODO: *react, svelte

      // TODO: autocomplete for theme(): https://github.com/tailwindlabs/tailwindcss-intellisense/blob/1f1c3fcd7978865aff06fa1f8616c6b6447c1fa1/packages/tailwindcss-language-server/src/language/cssServer.ts#L159
      const { extractBoundary } =
        language === 'html'
          ? await import('./languages/html')
          : {
              extractBoundary: (content: string, position?: number): Boundary | null => {
                const start =
                  Math.max(
                    content.lastIndexOf(' ', position),
                    content.lastIndexOf('\n', position),
                    content.lastIndexOf('\t', position),
                  ) + 1

                let end = content.indexOf(' ', start)

                if (end === -1) end = content.indexOf('\n', start)
                if (end === -1) end = content.indexOf('\t', start)
                if (end === -1) end = content.length

                return { start, end, content: content.slice(start, end) }
              },
            }

      const boundary = extractBoundary(content, position)

      if (!boundary) return null

      const isEmptyPosition = !boundary.content || /[\s():/!-@]$/.test(boundary.content)

      const parsed = parse(boundary.content + (isEmptyPosition ? '\uffff' : ''))

      const rule = parsed[parsed.length - 1] as ParsedDevRule | undefined

      if (!rule) return null
      if (context.isIgnored(rule.n)) return null

      const active = isEmptyPosition ? rule.a.slice(0, -1) : rule.a

      let negated = false
      const parts: string[] = []
      for (let value of active) {
        if (value == '(' || /[~@]$/.test(value)) {
          parts.push('')
          continue
        }

        if (value[0] == '!') {
          value = value.slice(1)
        }

        if (value.endsWith(':')) {
          parts.push('')
          continue
        }

        if (value[0] == '-') {
          value = value.slice(1)
          negated = !negated
        }

        if (value.endsWith('-')) {
          value = value.slice(0, -1)
        }

        if (value && value != '&') {
          parts.push(value)
        }
      }

      let prefix = (negated ? '-' : '') + parts.slice(0, -1).filter(Boolean).join('-')
      if (prefix && negated) {
        prefix = '-' + prefix + '-'
      } else if (prefix) {
        prefix = prefix + '-'
      }

      const input = (isEmptyPosition ? rule.n.replace(/\uffff$/, '') : rule.n).slice(prefix.length)

      return {
        start: position - input.length,
        end: position,
        suggestions: await this.suggest(input, { prefix, ignore: rule.v.map((v) => v + ':') }),
      }
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    async documentationFor(token, { format = 'md' }: DocumentationForOptions = {}) {
      if (documentationCache.has(token)) {
        return convert(documentationCache.get(token), format)
      }

      const rule = parse(token)[0] || {
        n: token.endsWith(':') ? '' : token,
        v: token.endsWith(':') ? [token] : [],
      }

      const css = cssbeautify(context.generateCSS(token), { autosemicolon: true, indent: '  ' })

      // { title: "display", url: "/en-US/docs/Web/CSS/display" },
      // { title: "@media", url: "/en-US/docs/Web/CSS/@media" },
      // { title: "prefers-contrast", url: "/en-US/docs/Web/CSS/@media/prefers-contrast" }
      // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/index.json
      // {doc: { summary: "", "browserCompat": [ "css.properties.display" ] },
      // https://caniuse.com/mdn-css_properties_display
      const mdnIndex = await (mdnIndexPromise ||= (async () => {
        try {
          const response = await fetch(`${mdnOrigin}/en-US/search-index.json`)

          if (response.ok && response.status === 200) {
            const index: { title: string; url: string }[] = await response.json()

            return index.filter(({ url }) => url.includes('/CSS/'))
          }
        } catch (error) {
          console.warn('Failed to fetch MDN index')
        }

        return []
      })())

      const cssFeatureLinks =
        mdnIndex.length &&
        (await Promise.all(
          Array.from(
            css.matchAll(
              /\\[!"'`*+.,;:\\/<=>?@#$%&^|~()[\]{}]|(@\S+|:?:[a-z-]+(?:\([^)]+\))?|[a-z-]+:)/g,
            ),
            (match) => {
              const candidate = match[1]
              if (candidate && !candidate.startsWith('-')) {
                // color: transparent
                // @media (prefers-contrast:) -> @media, prefers-contrast
                // &:hover -> :hover, hover
                // ::backdrop -> ::backdrop, backdrop
                // :nth-child(odd) -> :nth-child(odd), :nth-child(), :nth-child, nth-child
                const candidates = new Set([
                  candidate,
                  // :nth-child(odd) -> :nth-child()
                  candidate.replace(/\(.+?\)/g, '()'),
                  // :nth-child(odd) -> :nth-child
                  candidate.replace(/\(.*?\)/g, ''),
                  // :nth-child(odd) -> nth-child
                  // ::backdrop -> backdrop
                  candidate.replace(/\(.*?\)|[^a-z-]+/gi, ''),
                ])

                for (const candidate of candidates) {
                  const found = mdnIndex.find(({ title }) => title === candidate)
                  if (found) {
                    return { match, mdn: found }
                  }
                }
              }
            },
          )
            .filter(
              <T>(result: T, index: number, list: T[]): result is NonNullable<T> =>
                result && list.indexOf(result) === index,
            )
            .map(async (result) => {
              let cached = mdnCache.get(result.mdn.url)

              if (!cached) {
                mdnCache.set(
                  result.mdn.url,
                  (cached = (async () => {
                    try {
                      const response = await fetch(`${mdnOrigin}${result.mdn.url}/index.json`)

                      // http://www.whateverorigin.org/get?url=https://developer.mozilla.org/en-US/search-index.json
                      // http://www.whateverorigin.org/get?url=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fsearch-index.json
                      // https://cors-anywhere.herokuapp.com/https://developer.mozilla.org/en-US/search-index.json
                      // https://mdn-twind-run.sastan.workers.dev/en-US/search-index.json
                      if (response.ok && response.status === 200) {
                        const index: {
                          doc: { title: string; summary?: string; browserCompat?: string[] }
                        } = await response.json()

                        return {
                          title: index.doc.title,
                          summary: index.doc.summary,
                          browserCompat: index.doc.browserCompat,
                        }
                      }
                    } catch (error) {
                      console.warn('Failed to fetch MDN index')
                    }

                    return { title: result.mdn.title }
                  })()),
                )
              }

              const { title, browserCompat } = await cached
              const links = [
                `[Documentation](${MDN}${result.mdn.url})`,
                browserCompat?.[0] &&
                  `[Browser Support](https://caniuse.com/mdn-${browserCompat[0].replaceAll(
                    '.',
                    '_',
                  )})`,
              ]
                .filter(Boolean)
                .join(' • ')

              return `⁃ \`${title}\` (${links})`
            }),
        ))

      let theme: any
      const sources: string[] = []

      // TODO: arbitrary class/variant lookup would not work
      for (const completion of [
        ...rule.v.map((v) => context.variants.get(v + ':')),
        context.classes.get(rule.n),
      ]) {
        if (!completion) continue

        const links =
          // regexp -> create links to Regex101 and Regexper
          completion.source.startsWith('/') && completion.source.endsWith('/')
            ? [
                `[Regex101](https://regex101.com/?flavor=JavaScript&regex=${encodeURIComponent(
                  completion.source.slice(1, -1),
                )}&testString=${encodeURIComponent(completion.value)})`,
                `[Regexper](https://regexper.com/#${encodeURIComponent(completion.source)})`,
              ].join(' • ')
            : ''

        sources.push(
          `⁃ \`${completion.name}\` → \`${completion.source}\`${links && ' (' + links + ')'}`,
        )

        if (completion.theme) {
          const { section, key } = completion.theme

          const keys =
            completion.color || /color|fill|stroke/i.test(section)
              ? key.replace(/-/g, '.').split('.')
              : [key]

          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          let obj: any = ((theme ||= {})[section] = {})

          while (keys.length) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            obj = obj[keys.shift() as string] = keys.length
              ? {}
              : context.tw.theme(section, key) ?? '…'
          }
        }
      }

      const result =
        [
          css && '```css\n' + css + '\n```',
          cssFeatureLinks &&
            cssFeatureLinks.length &&
            `### CSS Features\n\n${cssFeatureLinks.join('<br>')}\n`,
          theme && '### Theme\n\n```json\n' + JSON.stringify(theme, null, 2) + '\n```',
          sources.length && `### Source\n\n${sources.join('<br>')}\n`,
        ]
          .filter(Boolean)
          .join('\n\n') || null

      documentationCache.set(token, result)

      return convert(result, format)
    },
    async documentationAt(content, offset, language) {
      let result: DocumentationAt | null = null

      if (language === 'html') {
        const { documentationAt } = await import('./languages/html')

        result = documentationAt(content, offset, context)
      }

      if (result) {
        const documentation = await this.documentationFor(result.value)

        if (documentation) {
          return { ...result, value: documentation }
        }
      }

      return null
    },
    async collectColors(content, language) {
      if (language === 'html') {
        const { collectColors } = await import('./languages/html')

        return collectColors(content, context)
      }

      return []
    },
    async validate(content, language) {
      if (language === 'html') {
        const { validate } = await import('./languages/html')

        return validate(content, context)
      }

      return []
    },
    *enumerate() {
      for (const completion of context.suggestions) {
        yield toSuggestion(completion)
      }
    },
  }
}

function convert(
  md: string | null | undefined,
  format?: DocumentationForOptions['format'],
): string | null | Promise<string> {
  if (md && format === 'html') {
    return import('showdown').then((showdown) => {
      const Converter = showdown.Converter || showdown.default.Converter
      const converter = new Converter({ openLinksInNewWindow: true })
      converter.setFlavor('github')
      return converter.makeHtml(md)
    })
  }

  return md ?? null
}
