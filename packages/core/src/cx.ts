import type { Class } from './types'
import { parse } from './parse'
import { format } from './internal/format'
import { interpolate } from './internal/interpolate'

/**
 * Constructs `class` strings conditionally.
 *
 * Twinds version of popular libraries like [classnames](https://github.com/JedWatson/classnames) or [clsx](https://github.com/lukeed/clsx).
 * The key advantage of `cx` is that it supports twinds enhanced class name syntax like grouping and aliases.
 *
 * @group Class Name Generators
 * @param strings
 * @param interpolations
 * @returns
 */
export function cx(strings: TemplateStringsArray, ...interpolations: Class[]): string

/**
 * Constructs `class` strings conditionally.
 *
 * Twinds version of popular libraries like [classnames](https://github.com/JedWatson/classnames) or [clsx](https://github.com/lukeed/clsx).
 * The key advantage of `cx` is that it supports twinds enhanced class name syntax like grouping and aliases.
 *
 * @group Class Name Generators
 * @param input
 */
export function cx(...input: Class[]): string

export function cx(strings: TemplateStringsArray | Class, ...interpolations: Class[]): string {
  return format(parse(interpolate(strings, interpolations)), ' ')
}
