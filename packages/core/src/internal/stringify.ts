/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { TwindRule } from '../types'
import { escape } from '../utils'

export function stringify(rule: TwindRule): string | undefined {
  // TODO If selector contains a vendor prefix after a pseudo element or class,
  // we consider them separately because merging the declarations into
  // a single rule will cause browsers that do not understand the
  // vendor prefix to throw out the whole rule
  //  let selectorGroupName = selector.includes(':-') || selector.includes('::-') ? selector : '__DEFAULT__'

  if (rule.d) {
    const groups: string[] = []

    const selector = rule.r.reduceRight((selector, condition) => {
      if (condition[0] == '@') {
        groups.unshift(condition)
        return selector
      }

      return selector
        ? // Go over the selector and replace the matching multiple selectors if any
          selector.replace(
            / *((?:\\,|\(.+?\)|\[.+?\]|[^,])+) *(,|$)/g,
            (_, selectorPart: string, comma = '') =>
              // Return the current selector with the key matching multiple selectors if any
              condition.replace(
                / *((?:\\,|\(.+?\)|\[.+?\]|[^,])+) *(,|$)/g,
                // If the current condition has a nested selector replace it
                (_, conditionPart: string, comma = '') =>
                  conditionPart.replace(/&/g, selectorPart) + comma,
              ) + comma,
          )
        : // selector
          //     .split(/,(?![^[(]*])/g)
          //     .map((selectorPart) =>
          //       condition.split(/,(?![^[(]*])/g).map((conditionPart) =>
          //         // If the current part has a nested selector replace it
          //         conditionPart.replace(/&/g, selectorPart),
          //       ),
          //     )
          //     .join(',')
          condition
    }, rule.n && '.' + escape(rule.n))

    if (selector) groups.push(selector)

    return groups.reduceRight((body, grouping) => grouping + '{' + body + '}', rule.d)
  }
}
