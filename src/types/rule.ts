import type { Context } from './context'
import type { CSSRules } from './css'
import type { Falsy } from './util'

export interface Rule {
  /**
   * The variants: `[":sm", ":dark", ":hover"]`
   */
  v: string[]

  /**
   * The directive: `"text-sm"`, `"rotate-45"`
   */
  d: string | InlineDirective

  /** Is this rule negated: `"-rotate-45"` =\> `true` */
  n?: boolean
}

export interface InlineDirective {
  (context: Context): CSSRules | string | Falsy
}
