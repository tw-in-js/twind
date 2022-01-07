/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { TwindRule } from '../types'

export function merge(rules: TwindRule[], name: string): TwindRule[] {
  // merge:
  // - same conditions
  // - replace name with hash of name + condititions + declarations
  // - precedence:
  //   - combine bits or use max precendence
  //   - set layer bit to merged
  const result: TwindRule[] = []

  let current: TwindRule | undefined

  for (const rule of rules) {
    if (current?.precedence == rule.precedence) {
      Object.assign(current, {
        className: [current.className, rule.className].filter(Boolean).join(' '),
        declarations: [current.declarations, rule.declarations].filter(Boolean).join(';'),
      })
    } else {
      // only set name for named rules eg not for global rules
      result.push((current = { ...rule, name: rule.name && name }))
    }
  }

  return result
}
