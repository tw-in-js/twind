/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  BaseTheme,
  ExtractThemes,
  Preset,
  Twind,
  Sheet,
  TwindConfig,
  TwindRule,
  TwindUserConfig,
} from './types'

import { sortedInsertionIndex } from './internal/sorted-insertion-index'
import { stringify } from './internal/stringify'
import { createContext } from './internal/context'
import { translate } from './internal/translate'
import { parse } from './internal/parse'
import { defineConfig } from './define-config'
import { asArray } from './utils'
import { serialize } from './internal/serialize'
import { Layer } from './internal/precedence'
import { interpolate } from './internal/interpolate'

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
  const cache = new Map<string, string>()

  // An array of precedence by index within the sheet
  // always sorted
  const sortedPrecedences: TwindRule[] = []

  // Cache for already inserted css rules
  // to prevent double insertions
  const insertedRules = new Set<string>()

  function insert(rule: TwindRule): string | undefined {
    if (rule.name) {
      rule = { ...rule, name: context.tag(rule.name) }
    }

    const css = stringify(rule)

    // If not already inserted
    if (css && !insertedRules.has(css)) {
      // Mark rule as inserted
      insertedRules.add(css)

      // Find the correct position
      const index = sortedInsertionIndex(sortedPrecedences, rule)

      // Insert
      sheet.insert(css, index, rule)

      // Update sorted index
      sortedPrecedences.splice(index, 0, rule)
    }

    return rule.name
  }

  return Object.defineProperties(
    function tw(strings, ...interpolations) {
      if (!cache.size) {
        asArray(config.preflight).forEach((preflight) => {
          if (typeof preflight == 'function') {
            preflight = preflight(context)
          }

          if (preflight) {
            serialize(preflight, {}, context, Layer.b).forEach(insert)
          }
        })
      }

      const tokens = interpolate(strings, interpolations)

      let className = cache.get(tokens)

      if (!className) {
        const classNames = new Set<string>()

        for (const rule of translate(parse(tokens), context)) {
          const name = insert(rule)

          if (rule.className) {
            rule.className.split(' ').forEach((x) => classNames.add(x))
          }

          if (name) classNames.add(name)
        }

        // TODO try do keep classNames unmodified or same order
        className = [...classNames].join(' ')

        // Remember the generated class name
        cache.set(tokens, className).set(className, className)
      }

      return className
    } as Twind,
    Object.getOwnPropertyDescriptors({
      get target() {
        return sheet.target
      },

      theme: context.theme,

      clear() {
        sheet.clear()
        insertedRules.clear()
        cache.clear()
        sortedPrecedences.length = 0
      },

      destroy() {
        this.clear()
        sheet.destroy()
      },
    }),
  )
}
