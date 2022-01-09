import type { Class, ClassObject } from '../types'
import { interleave } from './interleave'

// based on https://github.com/lukeed/clsx and https://github.com/jorgebucaran/classcat
export function interpolate(
  strings: TemplateStringsArray | Class,
  interpolations: Class[],
): string {
  return Array.isArray(strings) && Array.isArray((strings as unknown as TemplateStringsArray).raw)
    ? interleave(strings as unknown as TemplateStringsArray, interpolations, (value) =>
        toString(value).trim(),
      )
    : interpolations
        .filter(Boolean)
        .reduce(
          (result: string, value) => result + toString(value),
          strings ? toString(strings as Class) : '',
        )
}

function toString(value: Class): string {
  let result = ''
  let tmp: string

  if (typeof value == 'string' || typeof value == 'number') {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    result += ' ' + value
  } else if (Array.isArray(value)) {
    if ((tmp = interpolate(value[0], value.slice(1)))) {
      result += ' ' + tmp
    }
  } else {
    for (const key in value as ClassObject) {
      if ((value as ClassObject)[key]) result += ' ' + key
    }
  }

  return result
}
