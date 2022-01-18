/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { TwindRule } from '../types'
import { escape } from '../utils'

export function stringify(rule: TwindRule): string | undefined {
  if (rule.d) {
    const groups: string[] = []

    const selector = rule.r[('reduce' + (rule.n ? 'Right' : '')) as 'reduceRight'](
      (selector, condition) => {
        if (condition[0] == '@') {
          groups.unshift(condition)
          return selector
        }

        // Go over the selector and replace the matching multiple selectors if any
        return selector.replace(
          /^$| *((?:\\,|\(.+?\)|\[.+?\]|[^,])+) *(,|$)/g,
          (_, selectorPart = _, comma = '') =>
            // Return the current selector with the key matching multiple selectors if any
            condition.replace(
              / *((?:\\,|\(.+?\)|\[.+?\]|[^,])+) *(,|$)/g,
              // If the current condition has a nested selector replace it
              (_, conditionPart: string, comma = '') =>
                conditionPart.replace(/&/g, selectorPart as string) + comma,
            ) + comma,
        )
      },
      rule.n ? '.' + escape(rule.n) : '',
    )

    if (selector) {
      groups.push(selector)
    }

    return groups.reduceRight((body, grouping) => grouping + '{' + body + '}', rule.d)
  }
}
