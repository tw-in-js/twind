import genex from 'genex'

import {
  asArray,
  type AutocompleteContext,
  type AutocompleteItem,
  defineConfig,
  getAutocompleteProvider,
  type MatchResult,
  type MaybeArray,
  mql,
  type ScreenValue,
  stringify,
  twind,
  type Twind,
  type TwindConfig,
  type TwindUserConfig,
  virtual,
} from '@twind/core'

import { toCondition } from '../../../core/src/internal/context'

import type { IntellisenseOptions } from '../types'
import type { IntellisenseContext, IntellisenseClass, IntellisenseVariant } from './types'

import { simplePseudoClasses } from './simple-pseudo-classes'
import { VARIANT_MARKER_RULE } from './constants'
import { parseColor } from './color'
import { spacify } from './spacify'
import { compareSuggestions } from './compare-suggestion'
import QuickLRU from 'quick-lru'

export function createIntellisenseContext(
  config: Twind | TwindConfig | TwindUserConfig,
  options: IntellisenseOptions = {},
): IntellisenseContext {
  const tw = twind(
    defineConfig({
      hash: false,
      preflight: false,
      // disable autoprefix
      stringify(property, value) {
        return property + ':' + value
      },
      presets: [
        defineConfig((typeof config == 'function' ? config.config : config) as TwindUserConfig),
      ],
      rules: [
        // Allows to generate CSS for a variant
        [VARIANT_MARKER_RULE, { '…': '…' }],
      ],
      ignorelist: [
        // Prevent invalid class warning when generating documentation
        /-\[…]$/,
      ],
    } as TwindUserConfig),
    virtual(true),
  )

  const ignorelist = asArray(tw.config.ignorelist).map(toCondition)
  const isIgnored = (className: string) => ignorelist.some((re) => re.test(className))
  const variants: IntellisenseContext['variants'] = new Map()
  const classes: IntellisenseContext['classes'] = new Map()
  const suggestions: IntellisenseContext['suggestions'] = []

  const cssCache = new QuickLRU<string, string>({ maxSize: 1000, ...options.cache })

  const add = <T extends IntellisenseClass | IntellisenseVariant>(
    target: Map<string, T>,
    {
      modifiers,
      ...completion
    }: Omit<T, 'filter' | 'value' | 'description' | 'modifiers'> & {
      filter?: string
      value?: string
      description?: string
      modifiers?: AutocompleteItem['modifiers']
    },
  ) => {
    if (completion.type === 'class' && isIgnored(completion.name)) return

    if (
      target.has(completion.name) &&
      JSON.stringify(target.get(completion.name), ['type', 'name']) !==
        JSON.stringify(completion, ['type', 'name'])
    ) {
      console.warn(`Duplicate ${completion.type}: ${JSON.stringify(completion.name)}`)
    } else {
      completion.value ||= completion.name
      completion.filter ||= spacify(completion.value)
      completion.description ||= ''

      target.set(completion.name, completion as T)
      suggestions.push(completion as T)

      if (modifiers && modifiers.length) {
        suggestions.push({
          ...(completion as T),
          name: completion.name + '/',
          value: completion.value + '/',
          filter: spacify(completion.value + '/'),
          description: '',
        })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ;(completion as any).modifiers = modifiers
          .map(({ modifier, theme, color, label }, position) => ({
            ...(completion as Omit<T, 'modifiers'>),
            position,
            name: `${completion.name}/${modifier}`,
            value: `${completion.value}/${modifier}`,
            filter: spacify(modifier),
            description: label || '',
            theme,
            color: color && parseColor(color) ? color : undefined,
          }))
          .filter((suggestion) => {
            if (completion.type === 'class' && isIgnored(completion.name)) {
              return false
            }

            target.set(suggestion.name, suggestion as T)

            return true
          })
      }
    }
  }

  const deferreds: (() => void)[] = []

  const context: AutocompleteContext = {
    get theme() {
      return tw.theme
    },
    get variants() {
      return Object.fromEntries(
        Array.from(variants.values(), (variant) => [
          variant.name.slice(0, -1),
          variant.description || variant.name,
        ]),
      )
    },
  }

  let nextIndex = 0

  for (const screen of Object.keys(tw.theme('screens'))) {
    const name = screen + ':'
    add(variants, {
      type: 'variant',
      source: `theme('screens')`,
      index: nextIndex++,
      position: variants.size,
      name,
      theme: { section: 'screens', key: screen },
      description: mql(tw.theme('screens', screen) as MaybeArray<ScreenValue>),
    })
  }

  for (const [pattern, resolver] of tw.config.variants) {
    const index = nextIndex++
    let position = 0

    const provider = typeof resolver === 'function' && getAutocompleteProvider(resolver)

    for (const value of asArray(pattern)) {
      const condition = toCondition(value)
      const source = condition.toString()

      const re = new RegExp(condition.source.replace(/\\[dw][*+?]*/g, '\0'), condition.flags)
      const pattern = genex(re)
      const count = pattern.count()

      if (count === Infinity) {
        if (provider) {
          deferreds.push(() => {
            const match: MatchResult = Object.create([String(value)], {
              index: { value: 0 },
              input: { value: String(value) },
              $$: { value: '' },
            })

            for (const completion of provider(match, context)) {
              if (typeof completion === 'string') {
                add(variants, {
                  type: 'variant',
                  source,
                  index,
                  position: position++,
                  name: completion + ':',
                })
              } else {
                add(variants, {
                  type: 'variant',
                  source,
                  index,
                  position: position++,
                  name: (completion.prefix || '') + (completion.suffix || '') + ':',
                  theme: completion.theme,
                  description: completion.label,
                  modifiers: completion.modifiers,
                })
              }
            }
          })
        } else {
          console.warn(
            `Can not generate completion for variant ${condition}: infinite possibilities`,
          )
        }
      } else {
        pattern.generate((value) => {
          const match = re.exec(value) as MatchResult | null

          if (match) {
            match.$$ = value.slice(match[0].length)

            const base = value.replace(/\0/g, '')

            if (provider) {
              for (const completion of provider(match, context)) {
                if (typeof completion === 'string') {
                  add(variants, {
                    type: 'variant',
                    source,
                    index,
                    position: position++,
                    name: base + completion + ':',
                    description: '',
                  })
                } else {
                  add(variants, {
                    type: 'variant',
                    source,
                    index,
                    position: position++,
                    name: (completion.prefix ?? base) + (completion.suffix ?? '') + ':',
                    theme: completion.theme,
                    description: completion.label,
                    modifiers: completion.modifiers,
                  })
                }
              }
            } else {
              if (value.includes('\0') || value.endsWith('-')) {
                console.warn(
                  `Can not generate completion for variant ${condition} with ${JSON.stringify(
                    value,
                  )}: missing provider`,
                )
              } else {
                add(variants, {
                  type: 'variant',
                  source,
                  index,
                  position: position++,
                  name: value + ':',
                  description: typeof resolver == 'string' ? resolver : '',
                })
              }
            }
          }
        })
      }
    }
  }

  for (const pseudoClass of simplePseudoClasses) {
    const name = pseudoClass.slice(1) + ':'
    if (!variants.has(name)) {
      add(variants, {
        type: 'variant',
        source: 'builtin',
        index: nextIndex++,
        position: variants.size,
        name,
        value: name,
        description: `&${pseudoClass}`,
      })
    }
  }

  if (deferreds.length) {
    for (const deferred of deferreds) {
      deferred()
    }
  }

  for (const rule of tw.config.rules) {
    const [pattern, resolver] = asArray(rule)

    const index = nextIndex++
    let position = 0

    const provider = typeof resolver === 'function' && getAutocompleteProvider(resolver)

    for (const value of asArray(pattern)) {
      if (value === VARIANT_MARKER_RULE) {
        continue
      }

      const condition = toCondition(value)
      const source = condition.toString()

      const re = new RegExp(condition.source.replace(/\\[dw][*+?]*/g, '\0'), condition.flags)
      const pattern = genex(re)
      const count = pattern.count()

      if (count === Infinity) {
        if (provider) {
          const match: MatchResult = Object.create([String(value)], {
            index: { value: 0 },
            input: { value: String(value) },
            $$: { value: '' },
          })

          for (const completion of provider(match, context)) {
            if (typeof completion === 'string') {
              add(classes, {
                type: 'class',
                source,
                index,
                position: position++,
                name: completion,
              })
            } else {
              add(classes, {
                type: 'class',
                source,
                index,
                position: position++,
                name: (completion.prefix || '') + (completion.suffix || ''),
                theme: completion.theme,
                description: completion.label,
                color:
                  completion.color && parseColor(completion.color) ? completion.color : undefined,
                modifiers: completion.modifiers,
              })
            }
          }
        } else {
          console.warn(`Can not generate completion for rule ${condition}: infinite possibilities`)
        }
      } else {
        pattern.generate((name) => {
          const match = re.exec(name) as MatchResult | null

          if (match) {
            match.$$ = name.slice(match[0].length)
            const base = name.replace(/\0/g, '')

            if (provider) {
              for (const completion of provider(match, context)) {
                if (typeof completion === 'string') {
                  add(classes, {
                    type: 'class',
                    source,
                    index,
                    position: position++,
                    name: base + completion,
                  })
                } else {
                  add(classes, {
                    type: 'class',
                    source,
                    index,
                    position: position++,
                    name: (completion.prefix ?? base) + (completion.suffix ?? ''),
                    theme: completion.theme,
                    description: completion.label,
                    color:
                      completion.color && parseColor(completion.color)
                        ? completion.color
                        : undefined,
                    modifiers: completion.modifiers,
                  })
                }
              }
            } else {
              if (name.includes('\0') || name.endsWith('-')) {
                console.warn(
                  `Can not generate completion for rule ${condition} with ${JSON.stringify(
                    name,
                  )}: missing provider`,
                )
              } else {
                add(classes, {
                  type: 'class',
                  source,
                  index,
                  position: position++,
                  name,
                })
              }
            }
          }
        })
      }
    }
  }

  suggestions.sort(compareSuggestions)

  return {
    tw,
    variants,
    classes,
    suggestions,
    isIgnored,
    generateCSS: (token) => {
      let result = cssCache.get(token)

      if (!result) {
        tw.clear()

        const isVariant = variants.has(token)

        let name =
          isVariant && token.endsWith('[:')
            ? `${token.slice(0, -1)}…]:`
            : token.endsWith('[')
            ? `${token}…]`
            : isVariant && token.endsWith('/:')
            ? `${token.slice(0, -1)}…:`
            : token.endsWith('/')
            ? `${token}…`
            : token

        if (isVariant) {
          if (!name.endsWith(':')) {
            name += ':'
          }

          name += '…'
        }

        tw(name)

        const css = stringify(tw.target)

        const needle = `,${name}*/`
        const startIndex = css.indexOf(needle)

        if (startIndex === -1) {
          result = css
        } else {
          const nextDeclarationStart = css.indexOf('/*', startIndex)

          result = css.slice(
            startIndex + needle.length,
            nextDeclarationStart !== -1 ? nextDeclarationStart : css.length,
          )
        }

        if (isVariant) {
          result = result.replace(/…:…;?/, '')
        }

        cssCache.set(token, result)
      }

      return result
    },
  }
}
