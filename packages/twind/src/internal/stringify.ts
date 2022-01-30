/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { TwindRule } from '../types'
import { escape } from '../utils'

export function stringify(rule: TwindRule): string | undefined {
  if (rule.d) {
    const groups: string[] = []

    let selector = rule.n ? '.' + escape(rule.n) : ''
    let conditions = rule.r
    // move dark selector condition last
    // ['.dark &', '.group:hover &'] -> '.dark .group:hover .rule'
    if (rule.p & (1 << 30) /* Shifts.darkMode */ && conditions[0][0] != '@') {
      conditions = [...conditions.slice(1), conditions[0]]
    }

    for (const condition of conditions) {
      if (condition[0] == '@') {
        groups.push(condition)
      } else {
        // Go over the selector and replace the matching multiple selectors if any
        selector = selector.replace(
          /^$| *((?:\\,|\(.+?\)|\[.+?\]|[^,])+) *(,|$)/g,
          (_, selectorPart = _, comma = '') =>
            // Return the current selector with the key matching multiple selectors if any
            condition.replace(
              / *((?:\\,|\(.+?\)|\[.+?\]|[^,])+) *(,|$)/g,
              // If the current condition has a nested selector replace it
              (_, conditionPart: string, comma = '') =>
                conditionPart.replace(/&/g, selectorPart) + comma,
            ) + comma,
        )
      }
    }

    if (selector) {
      groups.push(selector)
    }

    return groups.reduceRight((body, grouping) => grouping + '{' + body + '}', rule.d)
  }
}
