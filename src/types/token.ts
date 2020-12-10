import type { Falsy } from './util'
import type { InlineDirective } from './rule'

export interface TokenGrouping extends Record<string, Token> {}

export type TypescriptCompat = boolean | number

export type Token = string | TokenGrouping | InlineDirective | Token[] | Falsy | TypescriptCompat
