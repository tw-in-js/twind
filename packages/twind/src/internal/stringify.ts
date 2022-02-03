import type { TwindRule } from '../types'
import { escape } from '../utils'

export function stringify(rule: TwindRule): string | undefined {
  if (rule.d) {
    const groups: string[] = []

    const selector = replaceEach(
      // merge all conditions into a selector string
      rule.r.reduce((selector, condition) => {
        if (condition[0] == '@') {
          groups.push(condition)
          return selector
        }

        // Go over the selector and replace the matching multiple selectors if any
        return condition ? merge(selector, condition) : selector
      }, '&'),
      // replace '&' with rule name or an empty string
      (selectorPart) => replaceReference(selectorPart, rule.n ? '.' + escape(rule.n) : ''),
    )

    if (selector) {
      groups.push(selector.replace(/:merge\((.+?)\)/g, '$1'))
    }

    return groups.reduceRight((body, grouping) => grouping + '{' + body + '}', rule.d)
  }
}

function replaceEach(selector: string, iteratee: (selectorPart: string) => string): string {
  return selector.replace(
    / *((?:\(.+?\)|\[.+?\]|[^,])+) *(,|$)/g,
    (_, selectorPart: string, comma: string) => iteratee(selectorPart) + comma,
  )
}

function replaceReference(selector: string, reference: string): string {
  return selector.replace(/&/g, reference)
}

function merge(selector: string, condition: string): string {
  return replaceEach(selector, (selectorPart) =>
    replaceEach(
      condition,
      // If the current condition has a nested selector replace it
      (conditionPart) => {
        const mergeMatch = /(:merge\(.+?\))(:[a-z-]+|\\[.+])/.exec(conditionPart)

        if (mergeMatch) {
          const selectorIndex = selectorPart.indexOf(mergeMatch[1])

          if (~selectorIndex) {
            // [':merge(.group):hover .rule', ':merge(.group):focus &'] -> ':merge(.group):focus:hover .rule'
            // ':merge(.group)' + ':focus' + ':hover .rule'
            return (
              selectorPart.slice(0, selectorIndex) +
              mergeMatch[0] +
              selectorPart.slice(selectorIndex + mergeMatch[1].length)
            )
          }

          // [':merge(.peer):focus~&', ':merge(.group):hover &'] -> ':merge(.peer):focus~:merge(.group):hover &'
          return replaceReference(selectorPart, conditionPart)
        }

        // Return the current selector with the key matching multiple selectors if any
        return replaceReference(conditionPart, selectorPart)
      },
    ),
  )
}
