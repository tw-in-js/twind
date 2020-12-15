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
  n: boolean | undefined

  /**
   * The id is the tailwind rule including variants, negate and directive
   *
   * Initialy this is set to an empty string.
   *
   * This is used to cache the id of static rules (from template literals).
   */
  $: string
}

export interface InlineDirective {
  (context: Context): CSSRules | string | Falsy
}
