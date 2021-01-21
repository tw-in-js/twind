import type { Token, ApplyDirective, Context } from '../types'

import { parse } from './parse'
import { directive } from './directive'

export interface Apply {
  (strings: TemplateStringsArray, ...interpolations: Token[]): ApplyDirective

  (...tokens: Token[]): ApplyDirective
}

const applyFactory = (tokens: unknown[], { css }: Context) => css(parse(tokens))

export const apply: Apply = (...tokens: unknown[]): ApplyDirective =>
  directive(applyFactory, tokens)
