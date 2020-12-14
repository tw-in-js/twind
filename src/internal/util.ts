import type { Hasher, Falsy } from '../types'

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

export const capitalize = (value: string): string => value[0].toUpperCase() + tail(value)

export const hyphenate = (value: string): string => value.replace(/[A-Z]/g, '-$&').toLowerCase()

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
