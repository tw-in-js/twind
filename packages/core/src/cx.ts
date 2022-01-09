import type { Falsey } from './types'
import { interleave } from './internal/interleave'
import { parse } from './internal/parse'
import { format } from './internal/format'

export interface ClassObject {
  [key: string]: boolean | number | unknown
}

export type Class = string | number | boolean | Falsey | ClassObject | Class[]

// based on https://github.com/lukeed/clsx and https://github.com/jorgebucaran/classcat
export function cx(strings: TemplateStringsArray | Class, ...interpolations: Class[]): string {
  return format(
    parse(
      Array.isArray(strings) && Array.isArray((strings as unknown as TemplateStringsArray).raw)
        ? interleave(strings as unknown as TemplateStringsArray, interpolations, (value) =>
            toString(value).trim(),
          )
        : interpolations
            .filter(Boolean)
            .reduce(
              (result: string, value) => result + toString(value),
              strings ? toString(strings as Class) : '',
            ),
    ),
  )
}

function toString(value: Class): string {
  let result = ''
  let tmp: string

  if (typeof value == 'string' || typeof value == 'number') {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    result += ' ' + value
  } else if (Array.isArray(value)) {
    if ((tmp = cx(...value))) {
      result += ' ' + tmp
    }
  } else {
    for (const key in value as ClassObject) {
      if ((value as ClassObject)[key]) result += ' ' + key
    }
  }

  return result
}
