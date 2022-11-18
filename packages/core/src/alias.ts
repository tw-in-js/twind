import type { Class, Nested } from './types'
import { format } from './internal/format'
import { parse } from './parse'
import { interpolate } from './internal/interpolate'

/**
 * @group Class Name Generators
 */
export const apply = /* #__PURE__ */ alias('@')

/**
 * @group Class Name Generators
 */
export const shortcut = /* #__PURE__ */ alias('~')

function alias(marker: string): Nested {
  return new Proxy(
    function alias(strings: TemplateStringsArray | Class, ...interpolations: Class[]): string {
      return alias$('', strings, interpolations)
    } as Nested,
    {
      get(target, name) {
        if (name in target) return target[name as string]

        return function namedAlias(
          strings: TemplateStringsArray | Class,
          ...interpolations: Class[]
        ): string {
          return alias$(name as string, strings, interpolations)
        }
      },
    },
  )

  function alias$(
    name: string,
    strings: TemplateStringsArray | Class,
    interpolations: Class[],
  ): string {
    return format(parse(name + marker + '(' + interpolate(strings, interpolations) + ')'))
  }
}
