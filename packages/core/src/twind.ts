import type {
  BaseTheme,
  ExtractThemes,
  Preset,
  Sheet,
  Twind,
  TwindConfig,
  TwindRule,
  TwindUserConfig,
} from './types'
import type { SortableRule } from './internal/sorted-insertion-index'

import { sortedInsertionIndex } from './internal/sorted-insertion-index'
import { stringify } from './internal/stringify'
import { createContext } from './internal/context'
import { translate, translateWith } from './internal/translate'
import { parse } from './parse'
import { defineConfig } from './define-config'
import { asArray } from './utils'
import { serialize } from './internal/serialize'
import { Layer } from './internal/precedence'
import { hash } from './utils'

export function twCache() {
  let serialized = '[]'

  if (typeof document !== 'undefined') {
    const element: HTMLElement | null = document.querySelector('script[data-twind-cache=""]')

    if (element) {
      element.dataset.twindCache = 'restored'
      serialized = element.innerText

      console.log(serialized)
    }
  }

  let cache = new Map<string, string>(Object.entries(JSON.parse(serialized)))

  return {
    get(key: string) {
      return cache.get(hash(key))
    },

    set(key: string, value: string) {
      cache.set(hash(key), value)
    },

    size() {
      return cache.size
    },

    clear() {
      cache = new Map()
    },

    snapshot() {
      const cache$ = new Map(cache)

      return () => {
        cache = cache$
      }
    },

    toString() {
      return JSON.stringify(
        Object.fromEntries(
          Array.from(cache.entries()).filter(([key, value]) => key !== hash(value)),
        ),
      )
    },
  }
}

type Cache = ReturnType<typeof twCache>

/**
 * @group Runtime
 * @param config
 * @param sheet
 */
export function twind<Theme extends BaseTheme = BaseTheme, Target = unknown>(
  config: TwindConfig<Theme>,
  sheet: Sheet<Target>,
): Twind<Theme, Target>

export function twind<
  Theme = BaseTheme,
  Presets extends Preset<any>[] = Preset[],
  Target = unknown,
>(
  config: TwindUserConfig<Theme, Presets>,
  sheet: Sheet<Target>,
): Twind<BaseTheme & ExtractThemes<Theme, Presets>, Target>

export function twind(userConfig: TwindConfig<any> | TwindUserConfig<any>, sheet: Sheet): Twind {
  const config = defineConfig(userConfig as TwindUserConfig<any>)

  const context = createContext(config)

  // Map of tokens to generated className
  const cache = twCache()

  // An array of precedence by index within the sheet
  // always sorted
  let sortedPrecedences: SortableRule[] = []

  // Cache for already inserted css rules
  // to prevent double insertions
  let insertedRules = new Set<string>()

  sheet.resume(
    (tokens, className) => cache.set(tokens, className ?? tokens),
    (cssText, rule) => {
      sortedPrecedences.push(rule)
      insertedRules.add(cssText)
    },
  )

  function insert(rule: TwindRule): string | undefined {
    const finalRule = context.f(rule)

    const cssText = stringify(finalRule)

    // If not already inserted
    if (cssText && !insertedRules.has(cssText)) {
      // Mark rule as inserted
      insertedRules.add(cssText)

      // Find the correct position
      const index = sortedInsertionIndex(sortedPrecedences, rule)

      // Insert
      sheet.insert(cssText, index, rule)

      // Update sorted index
      sortedPrecedences.splice(index, 0, rule)
    }

    return finalRule.n
  }

  return Object.defineProperties(
    function tw(tokens) {
      if (!cache.size()) {
        for (let preflight of asArray(config.preflight)) {
          if (typeof preflight == 'function') {
            preflight = preflight(context)
          }

          if (preflight) {
            ;(typeof preflight == 'string'
              ? translateWith('', Layer.b, parse(preflight), context, Layer.b, [], false, true)
              : serialize(preflight, {}, context, Layer.b)
            ).forEach(insert)
          }
        }
      }

      tokens = '' + tokens

      let className = cache.get(tokens)

      if (!className) {
        const classNames = new Set<string | undefined>()

        for (const rule of translate(parse(tokens), context)) {
          classNames.add(rule.c).add(insert(rule))
        }

        className = [...classNames].filter(Boolean).join(' ')

        // Remember the generated class name
        cache.set(tokens, className)
      }

      return className
    } as Twind,
    Object.getOwnPropertyDescriptors({
      get target() {
        return sheet.target
      },

      theme: context.theme,

      config,

      cache,

      snapshot() {
        const restoreSheet = sheet.snapshot()
        const restoreCache = cache.snapshot()
        const insertedRules$ = new Set(insertedRules)
        const sortedPrecedences$ = [...sortedPrecedences]

        return () => {
          restoreSheet()
          restoreCache()

          insertedRules = insertedRules$
          sortedPrecedences = sortedPrecedences$
        }
      },

      clear() {
        sheet.clear()
        cache.clear()

        insertedRules = new Set()
        sortedPrecedences = []
      },

      destroy() {
        this.clear()
        sheet.destroy()
      },
    }),
  )
}
