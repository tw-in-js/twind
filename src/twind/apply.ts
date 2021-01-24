import type { Token, Directive, CSSRules, Context } from '../types'

import { parse } from './parse'
import { directive } from './directive'

export interface Apply {
  (strings: TemplateStringsArray, ...interpolations: Token[]): Directive<CSSRules>

  (...tokens: Token[]): Directive<CSSRules>
}

const applyFactory = (tokens: unknown[], { css }: Context) => css(parse(tokens))

export const apply: Apply = (...tokens: unknown[]): Directive<CSSRules> =>
  directive(applyFactory, tokens)
