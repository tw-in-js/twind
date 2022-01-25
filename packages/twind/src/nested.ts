import type { Class, Nested } from './types'
import { format } from './internal/format'
import { parse } from './internal/parse'
import { interpolate } from './internal/interpolate'

export const apply = /* @__PURE__ */ nested('@')
export const shortcut = /* @__PURE__ */ nested('~')

function nested(marker: string): Nested {
  return new Proxy(
    function nested(strings: TemplateStringsArray | Class, ...interpolations: Class[]): string {
      return nested$('', strings, interpolations)
    } as Nested,
    {
      get(target, name) {
        return function namedNested(
          strings: TemplateStringsArray | Class,
          ...interpolations: Class[]
        ): string {
          return nested$(name as string, strings, interpolations)
        }
      },
    },
  )

  function nested$(
    name: string,
    strings: TemplateStringsArray | Class,
    interpolations: Class[],
  ): string {
    return format(parse(name + marker + '(' + interpolate(strings, interpolations) + ')'))
  }
}
