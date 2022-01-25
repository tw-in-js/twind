import type { ParsedRule } from './parse'
import { toClassName } from './to-class-name'

export function format(rules: ParsedRule[], space = ' '): string {
  return rules
    .map((rule) =>
      Array.isArray(rule)
        ? (space == ',' ? '' : '~(') + format(rule, ',') + (space == ',' ? '' : ')')
        : toClassName(rule),
    )
    .join(space)
}
