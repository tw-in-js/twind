import type { ParsedRule } from './parse'
import { toClassName } from './to-class-name'

export function format(rules: ParsedRule[], seperator = ','): string {
  return rules.map(toClassName).join(seperator)
}
