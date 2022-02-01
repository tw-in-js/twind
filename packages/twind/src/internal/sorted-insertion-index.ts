/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Layer } from './precedence'

const collator = new Intl.Collator('en', { numeric: true })

export interface SortableRule {
  /** The calculated precedence taking all variants into account. */
  p: number

  /* The precedence of the properties within {@link d}. */
  o: number

  /** The name to use for `&` expansion in selectors. Maybe empty for at-rules like `@import`, `@font-face`, `@media`, ... */
  n?: string | null
}

/**
 * Find the array index of where to add an element to keep it sorted.
 *
 * @returns The insertion index
 */
export function sortedInsertionIndex(
  array: readonly SortableRule[],
  element: SortableRule,
): number {
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

export function compareTwindRules(a: SortableRule, b: SortableRule): number {
  // base and overrides (css) layers are kept in order they are declared
  const layer = a.p & Layer.o

  if (layer == (b.p & Layer.o) && (layer == Layer.b || layer == Layer.o)) {
    return 0
  }

  return a.p - b.p || a.o - b.o || collator.compare(a.n as string, b.n as string)
}
