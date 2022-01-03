import type { Token, Directive, CSSRules, Context, MaybeTokenInterpolation } from '../types'

import { parse } from './parse'
import { directive } from './directive'

// see MaybeTokenInterpolation type union of possible args array spread
export interface Apply {
  (strings: TemplateStringsArray, ...interpolations: Token[]): Directive<CSSRules>

  (...tokens: Token[]): Directive<CSSRules>
}

const applyFactory = (tokens: MaybeTokenInterpolation, { css }: Context) => css(parse(tokens))

export const apply: Apply = (...tokens: MaybeTokenInterpolation): Directive<CSSRules> =>
  directive(applyFactory, tokens)
