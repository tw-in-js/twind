/* eslint-disable no-return-assign, no-cond-assign, no-implicit-coercion */

// Based on https://github.com/kripod/otion
// License MIT

import type { ThemeResolver } from '../types'

import { tail, includes } from './util'

// Shared variables
let _: string | RegExpExecArray | null | number

// 0=none, 1=sm, 2=md, 3=lg, 4=xl, 5=2xl, 6=??, 7=??
// 0 - 31: 5 bits
//  576px -> 3
// 1536px -> 9
// 36rem -> 3
// 96rem -> 9
export const responsivePrecedence = (css: string): number =>
  (((_ = /(?:^|min-width: *)(\d+(?:.\d+)?)(p)?/.exec(css)) ? +_[1] / (_[2] ? 15 : 1) / 10 : 0) &
    31) <<
  23

// Colon and dash count of string (ascending): 0 -> 7 => 3 bits
export const seperatorPrecedence = (string: string): number => {
  _ = 0

  for (let index = string.length; index--; ) {
    _ += (includes('-:,', string[index]) as unknown) as number
  }

  return _
}

export const atRulePresedence = (css: string): number => (seperatorPrecedence(css) & 15) << 18

// Pesudo variant presedence
// Chars 3 - 8: Uniquely identifies a pseudo selector
// represented as a bit set for each relevant value
// 17 bits: one for each variant plus one for unknown variants
//
// ':group-*' variants are normalized to their native pseudo class (':group-hover' -> ':hover')
// as they already have a higher selector presedence due to the add '.group' ('.group:hover .group-hover:...')

// Sources:
// - https://bitsofco.de/when-do-the-hover-focus-and-active-pseudo-classes-apply/#orderofstyleshoverthenfocusthenactive
// - https://developer.mozilla.org/docs/Web/CSS/:active#Active_links
// - https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js#L718

const PRECEDENCES_BY_PSEUDO_CLASS = [
  /* fi */ 'rst' /* : 0 */,
  /* la */ 'st' /* : 1 */,
  /* ev */ 'en' /* : 2 */,
  /* od */ 'd' /* : 3 */,
  /* li */ 'nk' /* : 4 */,
  /* vi */ 'sited' /* : 5 */,
  /* em */ 'pty' /* : 6 */,
  /* ch */ 'ecked' /* : 7 */,
  /* fo */ 'cus-w' /* ithin : 8 */,
  /* ho */ 'ver' /* : 9 */,
  /* fo */ 'cus' /* : 10 */,
  /* fo */ 'cus-v' /* isible : 11 */,
  /* ac */ 'tive' /* : 12 */,
  /* di */ 'sable' /* d : 13 */,
  /* re */ 'ad-on' /* ly: 14 */,
  /* op */ 'tiona' /* l: 15 */,
  /* re */ 'quire' /* d: 16 */,
]

const pseudoPrecedence = (pseudoClass: string): number =>
  1 <<
  (~(_ = PRECEDENCES_BY_PSEUDO_CLASS.indexOf(pseudoClass.replace(/^:group-/, ':').slice(3, 8)))
    ? _
    : 17)

// Variants: 28 bits
export const makeVariantPresedenceCalculator = (
  theme: ThemeResolver,
  variants: Record<string, string | undefined>,
) => (presedence: number, variant: string): number =>
  presedence |
  // 5: responsive
  ((_ = theme('screens', tail(variant), ''))
    ? // 0=none, 1=sm, 2=md, 3=lg, 4=xl, 5=2xl, 6=??, 7=??
      // 0 - 31: 5 bits
      // 576px -> 3
      // 1536px -> 9
      // 36rem -> 3
      // 96rem -> 9
      // Move into screens layer and adjust based on min-width
      (3 << 28) | responsivePrecedence(_)
    : // 1: dark mode flag
    variant === ':dark'
    ? 1 << 22
    : // 4: precedence of other at-rules
    (_ = variants[variant] || variant)[0] === '@'
    ? atRulePresedence(_)
    : // 17: pseudo and group variants
      pseudoPrecedence(variant))

// https://github.com/kripod/otion/blob/main/packages/otion/src/propertyMatchers.ts
// "+1": [
// 	/* ^border-.*(w|c|sty) */
// 	"border-.*(width,color,style)",

// 	/* ^[tlbr].{2,4}m?$ */
// 	"top",
// 	"left",
// 	"bottom",
// 	"right",

// 	/* ^c.{7}$ */
// 	"continue",
// ],

// "-1": [
// 	/* ^[fl].{5}l */
// 	"flex-flow",
// 	"line-clamp",

// 	/* ^g.{8}$ */
// 	"grid-area",

// 	/* ^pl */
// 	"place-content",
// 	"place-items",
// 	"place-self",
// ],

// group: 1 => +1
// group: 2 => -1

// 0 - 15 => 4 bits
// Ignore vendor prefixed and custom properties
export const declarationPropertyPrecedence = (property: string): number =>
  property[0] === '-'
    ? 0
    : seperatorPrecedence(property) +
      ((_ = /^(?:(border-(?!w|c|sty)|[tlbr].{2,4}m?$|c.{7}$)|([fl].{5}l|g.{8}$|pl))/.exec(property))
        ? +!!_[1] /* +1 */ || -!!_[2] /* -1 */
        : 0) +
      1

/* eslint-enable no-return-assign, no-cond-assign, no-implicit-coercion */
