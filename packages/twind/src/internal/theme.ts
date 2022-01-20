/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  BaseTheme,
  MaybeColorValue,
  ThemeConfig,
  ThemeFunction,
  ThemeSectionResolverContext,
} from '../types'

export function makeThemeFunction<Theme extends BaseTheme = BaseTheme>({
  extend = {},
  ...base
}: ThemeConfig<Theme>): ThemeFunction<Theme> {
  const resolved: Record<string, any> = {}

  const resolveContext: ThemeSectionResolverContext<Theme> = {
    colors: theme('colors'),

    theme,

    // Stub implementation as negated values are automatically infered and do _not_ need to be in the theme
    negative() {
      return {}
    },

    breakpoints(screens) {
      const breakpoints = {} as Record<string, string>

      for (const key in screens) {
        if (typeof screens[key] == 'string') {
          breakpoints['screen-' + key] = screens[key] as string
        }
      }

      return breakpoints
    },
  }

  return theme as ThemeFunction<Theme>

  function theme(sectionKey?: string, key?: string, defaultValue?: any): any {
    if (sectionKey) {
      if (/[.[]/.test(sectionKey)) {
        const path: string[] = []

        // dotted deep access: colors.gray.500 or or spacing[2.5]
        sectionKey.replace(
          /\[([^\]]+)\]|([^.[]+)/g,
          (_, $1, $2 = $1) => path.push($2) as unknown as string,
        )

        sectionKey = path.shift() as string
        defaultValue = key
        key = path.join('-')
      }

      const section =
        resolved[sectionKey] ||
        // two-step deref to allow extend section to reference base section
        Object.assign(
          Object.assign(
            // Make sure to not get into recursive calls
            (resolved[sectionKey] = {}),
            deref(base, sectionKey),
          ),
          deref(extend, sectionKey),
        )

      if (key == null) return section

      return section[key || 'DEFAULT'] ?? defaultValue
    }

    // Collect the whole theme
    const result = {} as Record<string, any>

    for (const section in base) {
      result[section] = theme(section)
    }

    return result
  }

  function deref(source: any, section: string): any {
    let value = source[section]

    if (typeof value == 'function') {
      value = value(resolveContext)
    }

    if (value && /color/i.test(section)) {
      return flattenColorPalette(value)
    }

    return value
  }
}

function flattenColorPalette(colors: Record<string, MaybeColorValue>, path: string[] = []): any {
  const flattend: Record<string, MaybeColorValue> = {}

  for (const key in colors) {
    const value = colors[key]
    const keyPath = key == 'DEFAULT' ? path : [...path, key]

    if (typeof value == 'object') {
      Object.assign(flattend, flattenColorPalette(value, keyPath))
    }

    flattend[keyPath.join('-')] = value

    if (key == 'DEFAULT') {
      flattend[[...path, key].join('-')] = value
    }
  }

  return flattend
}
