import type { Class } from './types'
import { parse } from './parse'
import { format } from './internal/format'
import { interpolate } from './internal/interpolate'

export function cx(strings: TemplateStringsArray | Class, ...interpolations: Class[]): string {
  return format(parse(interpolate(strings, interpolations)), ' ')
}
