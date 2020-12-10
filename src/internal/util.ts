import type { Rule, Hasher, Falsy } from '../types'

import * as is from './is'

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
  ((className: string): string => className.replace(/[!"#$%&'()*+,./:;<=>?@[\]^`{|}~]/g, '\\$&'))

export const toClassName = (rule: Rule): string => {
  if (is.function(rule.directive)) return ''

  const base = join(rule.variants, '')

  return (base && tail(base) + ':') + (rule.negate ? '-' : '') + rule.directive
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
