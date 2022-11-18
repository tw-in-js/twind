import type { ParsedRule } from '../parse'

export function toClassName(rule: ParsedRule): string {
  return [...rule.v, (rule.i ? '!' : '') + rule.n].join(':')
}
