import type { SingleParsedRule } from './parse'

export function toClassName(rule: SingleParsedRule): string {
  return [...rule.v, (rule.i ? '!' : '') + rule.n].join(':')
}
