import type { Token, ApplyDirective, TW, Context } from '../types'

import { parse } from './parse'
import { directive } from './directive'

const applyFactory = (tokens: unknown[], { css }: Context) => css(parse(tokens))

export function apply(
  this: TW | null | undefined | void,
  strings: TemplateStringsArray,
  ...interpolations: Token[]
): ApplyDirective

export function apply(...tokens: Token[]): ApplyDirective

export function apply(...tokens: unknown[]): ApplyDirective {
  return directive(applyFactory, tokens)
}
