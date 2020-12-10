import type * as CSS from 'csstype'

import type { Falsy } from './util'

/**
 * Pseudo class
 * watch out for ':root' - that could use '*' instead
 */
// [`:${string}`]: CSSRules
export type CSSSimplePseudos = { [K in CSS.SimplePseudos as `&${string & K}`]?: CSSRules }

export interface CSSPseudos extends CSSSimplePseudos {
  '&:nth-child(2n)'?: CSSRules
  '&:nth-child(odd)'?: CSSRules
}

export interface CSSCustomProperties {
  '--tw-rotate'?: string
  '--tw-gradient-stops'?: string
}

export interface CSSProperties
  extends CSS.PropertiesFallback<string, string>,
    CSS.PropertiesHyphenFallback<string, string>,
    CSSCustomProperties {}

export type CSSAtKeyframes = Record<string, CSSProperties>
export type CSSAtMedia = Record<string, CSSRules>
export type CSSAtSupports = Record<string, CSSRules>

/**
 * See: https://drafts.csswg.org/css-nesting/#nest-selector
 *
 * ```
 * "& > * + *": {
 *   marginLeft: 16
 * },
 *
 * // In a comma-separated list, each individual selector shall start with "&"
 * "&:focus, &:active": {
 *   outline: "solid"
 * },
 *
 * // Self-references are also supported
 * "& + &": {
 *   color: "green"
 * }
 * ```
 */
export interface CSSRules {
  // '@media (....)'?: CSSAtMedia
  // '@supports (...)'?: CSSAtSupports
  // '@keyframes name'?: CSSAtKeyframes

  // | '@font-face'
  // | '@counter-style'
  // | '@property'

  /** Global defaults */
  // ':root'?: CSSProperties
  // '*'?: CSSProperties

  // TODO it would be great if we could use CSS Properties with mapped types to typechecked CSS rules
  [key: string]:
    | CSSProperties
    | CSSAtMedia
    | CSSAtSupports
    | CSSAtKeyframes
    | CSSRules
    | string
    | string[]
    | Falsy
}
