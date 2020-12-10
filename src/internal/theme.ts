import type {
  Theme,
  ThemeColor,
  ThemeConfiguration,
  ThemeResolver,
  ThemeSectionResolverContext,
} from '../types'

import * as is from './is'
import { defaultTheme } from '../tailwind/theme'
import { join, tail, includes } from './util'

// https://github.com/tailwindlabs/tailwindcss/blob/master/src/util/flattenColorPalette.js
const flattenColorPalette = (colors: Record<string, ThemeColor>): Record<string, ThemeColor> =>
  Object.keys(colors).reduce((flatColors, key) => {
    const value = colors[key]

    flatColors[key] = value

    return is.object(value)
      ? Object.keys(value).reduce((flatColors, number) => {
          if (number === 'DEFAULT') {
            flatColors[key] = value[number]
          }

          flatColors[key + '-' + number] = value[number]
          flatColors[key + '.' + number] = value[number]

          return flatColors
        }, flatColors)
      : flatColors
  }, {} as Record<string, ThemeColor>)

const resolveContext: ThemeSectionResolverContext = {
  // ?negative: (source) =>
  //   Object.keys(source).reduce(
  //     (target, key) => {
  //       if (source[key]) target['-' + key] = '-' + (source[key] as string)

  //       return target
  //     },
  //     { ...source },
  //   ),
  // Stub implementation as negated values are automatically infered and do _not_ not to be in the theme
  negative: () => ({}),

  breakpoints: (source) =>
    Object.keys(source).reduce((target, key) => {
      target['screen-' + key] = source[key]

      return target
    }, {} as Record<string, string | undefined>),
}

export const makeThemeResolver = (config?: ThemeConfiguration): ThemeResolver => {
  const cache = Object.create(null) as { [K in keyof Theme]?: Record<string, unknown> }

  const theme = { ...defaultTheme, ...config }

  const themeResolver = <T>(key: string, defaultValue?: T): T => {
    const keypath = key.split('.')

    /* eslint-disable @typescript-eslint/no-use-before-define, @typescript-eslint/no-explicit-any */
    return resolve(
      keypath[0] as keyof Theme,
      (keypath.length > 1 ? tail(keypath) : undefined) as any,
      defaultValue as any,
    ) as T
    /* eslint-enable @typescript-eslint/no-use-before-define, @typescript-eslint/no-explicit-any */
  }

  const deref = (
    theme: undefined | Partial<Theme>,
    section: keyof Theme,
  ): Record<string, unknown> | undefined => {
    const base = theme && theme[section]

    const value = is.function(base) ? base(themeResolver, resolveContext) : base

    return value && section === 'colors'
      ? flattenColorPalette(value as Record<string, ThemeColor>)
      : (value as Record<string, unknown>)
  }

  const resolve = ((
    section: keyof Theme,
    key?: string | string[],
    defaultValue?: unknown,
  ): unknown => {
    const base =
      cache[section] ||
      (cache[section] = {
        ...deref(theme, section),
        ...deref(theme.extend, section),
      })

    if (key != null) {
      const value: unknown = base[(is.array(key) ? join(key) : key) || 'DEFAULT']

      return value == null
        ? defaultValue
        : is.array(value) &&
          // https://github.com/tailwindlabs/tailwindcss/blob/master/src/util/transformThemeValue.js
          // only testing for sections that uses an array for values
          !includes(['fontSize', 'outline'], section)
        ? join(value, ',')
        : value
    }

    return base
  }) as ThemeResolver

  return resolve
}
