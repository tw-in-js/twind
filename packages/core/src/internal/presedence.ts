// Based on https://github.com/kripod/otion
// License MIT

import { tail, includes } from './util'

// Shared variables
let precedence: number
let match: RegExpExecArray | null

// 0=none, 1=sm, 2=md, 3=lg, 4=xl, 5=2xl, 6=??, 7=??
// 0 - 31: 5 bits
//  576px -> 3
// 1536px -> 9
// 36rem -> 3
// 96rem -> 9
// eslint-disable-next-line no-return-assign
export const responsivePrecedence = (css: string): number =>
  // eslint-disable-next-line no-cond-assign
  (match = /^(\d+(?:.\d+)?)(p)?/.exec(css))
    ? +match[1] / (match[2] ? 15 : 1) / 10 // eslint-disable-line no-implicit-coercion
    : 0

// Colon and dash count of string (ascending): 0 -> 7 => 3 bits
export const seperatorPrecedence = (string: string): number => {
  precedence = 0

  for (let index = string.length; index--; ) {
    // eslint-disable-next-line no-implicit-coercion
    if (includes('-:,', string[index])) {
      ++precedence
    }
  }

  return precedence
}

// Pesude and groupd variant presedence
// Chars 3 - 8: Uniquely identifies a pseudo selector
// represented as a bit set for each relevant value
// 16 bits: one for each variant above plus one for unknown variants

// Sources:
// - https://bitsofco.de/when-do-the-hover-focus-and-active-pseudo-classes-apply/#orderofstyleshoverthenfocusthenactive
// - https://developer.mozilla.org/docs/Web/CSS/:active#Active_links
// - https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js#L718

/* eslint-disable capitalized-comments */
const PRECEDENCES_BY_PSEUDO_CLASS = [
  /* fi */ 'rst' /* : 0 */,
  /* la */ 'st' /* : 1 */,
  /* ev */ 'en' /* : 2 */,
  /* od */ 'd' /* : 3 */,
  /* li */ 'nk' /* : 4 */,
  /* vi */ 'sited' /* : 5 */,
  /* em */ 'pty' /* : 6 */,
  /* ch */ 'ecked' /* : 7 */,
  /* gr */ 'oup-h' /* over : 8 */,
  /* gr */ 'oup-f' /* ocus : 9 */,
  /* fo */ 'cus-w' /* ithin : 10 */,
  /* ho */ 'ver' /* : 11 */,
  /* fo */ 'cus' /* : 12 */,
  /* fo */ 'cus-v' /* isible : 13 */,
  /* ac */ 'tive' /* : 14 */,
  /* di */ 'sable' /* d : 15 */,
]
/* eslint-enable capitalized-comments */

// eslint-disable-next-line no-return-assign
export const pseudoPrecedence = (pseudoClass: string): number =>
  ~(precedence = PRECEDENCES_BY_PSEUDO_CLASS.indexOf(pseudoClass.slice(3, 8)))
    ? precedence
    : PRECEDENCES_BY_PSEUDO_CLASS.length

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
const PROPERTY_PRECEDENCE_CORRECTION_GROUPS = /^(?:(border-(?:[tlbr].{2,4}-)?(?:w|c|sty)|[tlbr].{2,4}m?$|c.{7}$)|([fl].{5}l|g.{8}$|pl))/

// 0 - 15 => 4 bits
const propertyPrecedence = (property: string): number => {
  // The property's baseline precedence is based on "-" counting
  const unprefixedProperty =
    property[0] === '-' ? tail(property, property.indexOf('-', 1) + 1) : property

  const match = PROPERTY_PRECEDENCE_CORRECTION_GROUPS.exec(unprefixedProperty)

  return (
    seperatorPrecedence(unprefixedProperty) +
    // eslint-disable-next-line no-implicit-coercion
    (match ? +!!match[1] /* +1 */ || -!!match[2] /* -1 */ : 0) +
    1
  )
}

// 0 - 15 => 4 bits
// Ignore vendor prefixed and custom properties
export const declarationPropertyPrecedence = (property: string): number =>
  property[0] === '-' ? 0 : propertyPrecedence(property)

export const descending = (value: number): number => Math.max(0, 15 - value)

// 0 - 15 => 4 bits
export const declarationValuePrecedence = (value: string): number =>
  descending(seperatorPrecedence(value))
