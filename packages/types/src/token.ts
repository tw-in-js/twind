import type { Falsy } from "./util"

export interface TokenGrouping extends Record<string, Token> {}

type TypescriptCompat = boolean | number

export type Token = string | TokenGrouping | Token[] | Falsy | TypescriptCompat
