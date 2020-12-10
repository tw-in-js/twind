export interface Rule {
  /** [":sm", ":dark", ":hover"] */
  variants: string[]

  /** "text-sm", "rotate-45" */
  directive: string

  /** "-rotate-45" =\> true */
  negate: boolean
}
