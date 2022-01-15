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
    if (current?.p == rule.p && '' + current.r == '' + rule.r) {
      current.c = [current.c, rule.c].filter(Boolean).join(' ')
      current.d = [current.d, rule.d].filter(Boolean).join(';')
    } else {
      // only set name for named rules eg not for global or className propagation rules
      result.push((current = { ...rule, n: rule.n && name }))
    }
  }

  return result
}
