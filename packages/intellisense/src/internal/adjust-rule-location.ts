import type { ParsedDevRule } from 'twind'

export function adjustRuleLocation(
  token: string,
  rule: ParsedDevRule,
  offset: number,
): { start: number; end: number } {
  let start = rule.l[0]
  const end = rule.l[1]
  let index = rule.a.length
  let value = rule.a[--index]

  while (index--) {
    const active = rule.a[index]

    if (active == '(' || active == '&' || /[~@]$/.test(active)) {
      break
    }

    value = active + value
    if (token.slice(start - active.length, end) === value) {
      start -= active.length
    } else {
      break
    }
  }

  return {
    start: offset + start,
    end: offset + end,
  }
}
