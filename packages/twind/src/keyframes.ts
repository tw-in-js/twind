import type { CSSObject, CSSValue, StringLike } from './types'

import { escape, hash } from './utils'
import { tw as tw$ } from './runtime'
import { astish } from './internal/astish'
import { css } from './css'

export interface KeyframesFunction {
  (style: CSSObject | string): StringLike

  (strings: TemplateStringsArray, ...interpolations: readonly CSSValue[]): StringLike

  bind(thisArg?: ((tokens: string) => string) | undefined | void): Keyframes & {
    [label: string]: KeyframesFunction
  }
}

export type Keyframes = KeyframesFunction & {
  [label: string]: KeyframesFunction
}

export const keyframes = /* @__PURE__ */ bind()

function bind(thisArg: ((tokens: string) => string) | undefined | void): Keyframes {
  return new Proxy(
    function keyframes(
      strings: CSSObject | string | TemplateStringsArray,
      ...interpolations: readonly CSSValue[]
    ): StringLike {
      return keyframes$(thisArg, '', strings, interpolations)
    } as Keyframes,
    {
      get(target, name) {
        if (name === 'bind') {
          return bind
        }

        return function namedKeyframes(
          strings: CSSObject | string | TemplateStringsArray,
          ...interpolations: readonly CSSValue[]
        ): StringLike {
          return keyframes$(thisArg, name as string, strings, interpolations)
        }
      },
    },
  )
}

function keyframes$(
  thisArg: ((tokens: string) => string) | undefined | void,
  name: string,
  strings: CSSObject | string | TemplateStringsArray,
  interpolations: readonly CSSValue[],
): StringLike {
  const ast = astish(strings, interpolations)

  const keyframeName = escape(name + hash(JSON.stringify([name, ast])))

  const tw = typeof thisArg == 'function' ? thisArg : tw$

  // lazy inject keyframes
  return {
    toString() {
      tw(
        css({
          [`@keyframes ${keyframeName}`]: astish(strings, interpolations),
        } as unknown as CSSObject),
      )

      return keyframeName
    },
  } as StringLike
}
