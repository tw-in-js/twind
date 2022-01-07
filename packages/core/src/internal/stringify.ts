import type { TwindRule } from '../types'
import { escape } from '../utils'

export function stringify(rule: TwindRule): string | undefined {
  // TODO If selector contains a vendor prefix after a pseudo element or class,
  // we consider them separately because merging the declarations into
  // a single rule will cause browsers that do not understand the
  // vendor prefix to throw out the whole rule
  //  let selectorGroupName = selector.includes(':-') || selector.includes('::-') ? selector : '__DEFAULT__'

  if (rule.declarations) {
    const groups: string[] = []

    let selector = rule.name && '.' + escape(rule.name)

    for (const condition of rule.conditions) {
      if (condition[0] == '@') {
        groups.push(condition)
      } else {
        selector = selector
          ? selector
              .split(/,(?![^[]*])/g)
              .map((selectorPart) =>
                condition.split(/,(?![^[]*])/g).map((conditionPart) =>
                  // If the current part has a nested selector replace it
                  conditionPart.replace(/&/g, selectorPart),
                ),
              )
              .join(',')
          : condition
      }
    }

    if (selector) groups.push(selector)

    return groups.reduceRight((body, grouping) => grouping + '{' + body + '}', rule.declarations)
  }
}
