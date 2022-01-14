import type { Class } from './types'
import { format } from './internal/format'
import { parse } from './internal/parse'
import { interpolate } from './internal/interpolate'

export function shortcut(
  strings: TemplateStringsArray | Class,
  ...interpolations: Class[]
): string {
  return format([parse(interpolate(strings, interpolations))])
}
