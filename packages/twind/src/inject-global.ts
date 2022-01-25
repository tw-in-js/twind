import type { CSSNested, CSSObject, CSSValue } from './types'

import { tw as tw$ } from './runtime'
import { astish } from './internal/astish'
import { css } from './css'

/**
 * Injects styles into the global scope and is useful for applications such as gloabl styles, CSS resets or font faces.
 *
 * It **does not** return a class name, but adds the styles within the base layer to the stylesheet directly.
 */
export function injectGlobal(
  this: ((tokens: string) => string) | undefined | void,
  style: CSSNested | string,
): void

export function injectGlobal(
  this: ((tokens: string) => string) | undefined | void,
  strings: TemplateStringsArray,
  ...interpolations: readonly CSSValue[]
): void

export function injectGlobal(
  this: ((tokens: string) => string) | undefined | void,
  strings: CSSNested | string | TemplateStringsArray,
  ...interpolations: readonly CSSValue[]
): void {
  const tw = typeof this == 'function' ? this : tw$

  tw(
    css({
      '@layer base': astish(strings as CSSObject, interpolations),
    } as CSSObject),
  )
}
