import type { SingleParsedRule } from './parse'

export function toClassName(rule: SingleParsedRule): string {
  return [...rule.variants, (rule.important ? '!' : '') + rule.name].join(':')
}
