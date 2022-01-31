/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { TwindRule } from '../types'
import { Layer } from './precedence'

const collator = new Intl.Collator('en', { numeric: true })

/**
 * Find the array index of where to add an element to keep it sorted.
 *
 * @returns The insertion index
 */
export function sortedInsertionIndex(array: readonly TwindRule[], element: TwindRule): number {
  // Find position using binary search
  // eslint-disable-next-line no-var
  for (var low = 0, high = array.length; low < high; ) {
    const pivot = (high + low) >> 1

    // Less-Then-Equal to add new equal element after all existing equal elements (stable sort)
    if (compareTwindRules(array[pivot], element) <= 0) {
      low = pivot + 1
    } else {
      high = pivot
    }
  }

  return high
}

export function compareTwindRules(a: TwindRule, b: TwindRule): number {
  // base and overrides (css) layers are kept in order they are declared
  const layer = a.p & Layer.o

  if (layer == (b.p & Layer.o) && (layer == Layer.b || layer == Layer.o)) {
    return 0
  }

  return (
    a.p - b.p ||
    a.o - b.o ||
    // XXX: should we compare the conditions as well — already included in precedence
    // collator.compare(a.r as unknown as string, b.r as unknown as string) ||
    collator.compare(a.n as string, b.n as string)
  )
}
