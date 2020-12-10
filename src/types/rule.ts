import type { Context } from './context'
import type { CSSRules } from './css'
import type { Falsy } from './util'

export interface Rule {
  /** [":sm", ":dark", ":hover"] */
  variants: string[]

  /** "text-sm", "rotate-45" */
  directive: string | InlineDirective

  /** "-rotate-45" =\> true */
  negate?: boolean
}

export interface InlineDirective {
  (context: Context): CSSRules | string | Falsy
}
