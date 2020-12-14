import type { Falsy } from './util'
import type { InlineDirective } from './rule'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TokenGrouping extends Record<string, Token> {
  /* for recusive types */
}

export type TypescriptCompat = boolean | number

export type Token = string | TokenGrouping | InlineDirective | Token[] | Falsy | TypescriptCompat
