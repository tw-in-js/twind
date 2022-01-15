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
    return format([parse(interpolate(strings, interpolations))])
  } as Shortcut,
  {
    get: function (target, prop) {
      return function namedShortcut(
        strings: TemplateStringsArray | Class,
        ...interpolations: Class[]
      ): string {
        return format(parse((prop as string) + '~(' + interpolate(strings, interpolations) + ')'))
      }
    },
  },
)
