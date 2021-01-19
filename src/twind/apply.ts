import type { Token, ApplyDirective, TW } from '../types'

import { parse } from './parse'
import { directive } from './directive'

export function apply(
  this: TW | null | undefined | void,
  strings: TemplateStringsArray,
  ...interpolations: Token[]
): ApplyDirective

export function apply(this: TW | null | undefined | void, ...tokens: Token[]): ApplyDirective

export function apply(this: TW | null | undefined | void, ...tokens: unknown[]): ApplyDirective {
  return directive(({ css }) => css(parse(tokens)), tokens, this)
}
