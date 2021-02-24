import type {
  Context,
  Hasher,
  Falsy,
  MaybeThunk,
  CSSRules,
  ThemeScreen,
  ThemeScreenValue,
  CSSRuleValue,
} from '../types'

interface Includes {
  (value: string, search: string): boolean
  <T>(value: readonly T[], search: T): boolean
}

export const includes: Includes = (value: string | readonly unknown[], search: unknown) =>
  // eslint-disable-next-line no-implicit-coercion
  !!~(value as string).indexOf(search as string)

export const join = (parts: readonly string[], separator = '-'): string => parts.join(separator)

export const joinTruthy = (parts: readonly (string | Falsy)[], separator?: string): string =>
  join(parts.filter(Boolean) as string[], separator)

export const tail = <T extends string | readonly unknown[]>(array: T, startIndex = 1): T =>
  array.slice(startIndex) as T

export const identity = <T>(value: T): T => value

export const noop = (): void => {
  /* no-op */
}

export const capitalize = (value: string): string => value[0].toUpperCase() + tail(value)

export const hyphenate = (value: string): string => value.replace(/[A-Z]/g, '-$&').toLowerCase()

export const evalThunk = <T>(value: MaybeThunk<T>, context: Context): T => {
  while (typeof value == 'function') {
    value = (value as (context: Context) => T)(context)
  }

  return value
}

export const ensureMaxSize = <K, V>(map: Map<K, V>, max: number): void => {
  // Ensure the cache does not grow unlimited
  if (map.size > max) {
    map.delete(map.keys().next().value)
  }
}

// string, number or Array => a property with a value
export const isCSSProperty = (key: string, value: CSSRuleValue): boolean =>
  includes('rg', (typeof value)[5]) || (Array.isArray(value) && key[0] != '@')

export const merge = (target: CSSRules, source: CSSRules, context: Context): CSSRules =>
  source
    ? Object.keys(source).reduce((target, key) => {
        const value = evalThunk(source[key], context)

        if (isCSSProperty(key, value)) {
          // hyphenate target key only if key is property like (\w-)
          target[hyphenate(key)] = value
        } else {
          // Keep all @font-face, @import, @global as is
          target[key] =
            key[0] == '@' && includes('fig', key[1])
              ? ((target[key] || []) as CSSRules[]).concat(value as CSSRules)
              : merge((target[key] || {}) as CSSRules, value as CSSRules, context)
        }

        return target
      }, target)
    : target

export const escape =
  (typeof CSS !== 'undefined' && CSS.escape) ||
  // Simplified: escaping only special characters
  // Needed for NodeJS and Edge <79 (https://caniuse.com/mdn-api_css_escape)
  ((className: string): string => {
    const firstCodeUnit = className.charCodeAt(0)
    let firstChar = ''

    // If the character is the first character and is in the range [0-9] (2xl, ...)
    if (firstCodeUnit >= 0x0030 && firstCodeUnit <= 0x0039) {
      // https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
      firstChar = '\\' + firstCodeUnit.toString(16) + ' '
      className = tail(className)
    }

    // Simplifed escape testing only for chars that we know happen to be in tailwind directives
    return firstChar + className.replace(/[!./:#]/g, '\\$&')
  })

export const buildMediaQuery = (screen: ThemeScreen): string => {
  if (!Array.isArray(screen)) {
    screen = [screen as ThemeScreenValue]
  }

  return (
    '@media ' +
    join(
      (screen as ThemeScreenValue[]).map((screen) => {
        if (typeof screen == 'string') {
          screen = { min: screen }
        }

        return (
          (screen as { raw?: string }).raw ||
          join(
            Object.keys(screen).map(
              (feature) => `(${feature}-width:${(screen as Record<string, string>)[feature]})`,
            ),
            ' and ',
          )
        )
      }),
      ',',
    )
  )
}

// Based on https://stackoverflow.com/a/52171480
export const cyrb32: Hasher = (value: string): string => {
  let h = 9

  for (let index = value.length; index--; ) {
    h = Math.imul(h ^ value.charCodeAt(index), 0x5f356495)
  }

  return 'tw-' + ((h ^ (h >>> 9)) >>> 0).toString(36)
}

/**
 * Find the array index of where to add an element to keep it sorted.
 *
 * @returns The insertion index
 */
export const sortedInsertionIndex = (array: readonly number[], element: number): number => {
  let high = array.length

  // Theres only one option then
  if (high === 0) return 0

  // Find position by binary search
  for (let low = 0; low < high; ) {
    const pivot = (high + low) >> 1

    // Less-Then-Equal to add new equal element after all existing equal elements (stable sort)
    if (array[pivot] <= element) {
      low = pivot + 1
    } else {
      high = pivot
    }
  }

  return high
}
