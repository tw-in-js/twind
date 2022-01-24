import type { Class } from './types'
import { format } from './internal/format'
import { parse } from './internal/parse'
import { interpolate } from './internal/interpolate'

export type ShortcutFunction = (
  strings: TemplateStringsArray | Class,
  ...interpolations: Class[]
) => string

export type Shortcut = ShortcutFunction & {
  [label: string]: ShortcutFunction
}

export const shortcut = /* @__PURE__ */ new Proxy(
  function shortcut(strings: TemplateStringsArray | Class, ...interpolations: Class[]): string {
    return shortcut$('', strings, interpolations)
  } as Shortcut,
  {
    get: function (target, name) {
      return function namedShortcut(
        strings: TemplateStringsArray | Class,
        ...interpolations: Class[]
      ): string {
        return shortcut$(name as string, strings, interpolations)
      }
    },
  },
)

function shortcut$(
  name: string,
  strings: TemplateStringsArray | Class,
  interpolations: Class[],
): string {
  return format(parse(name + '~(' + interpolate(strings, interpolations) + ')'))
}
