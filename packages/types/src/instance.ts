import type { Configuration } from './config'
import type { Token } from './token'

export interface TW {
  (strings: TemplateStringsArray, ...interpolations: Token[]): string
  (...tokens: Token[]): string
}

export interface Instance {
  readonly tw: TW
  readonly setup: (options?: Configuration) => void
}
