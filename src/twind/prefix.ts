import type { Prefixer } from '../types'

import { cssPropertyAlias, cssPropertyPrefixFlags, cssValuePrefixFlags } from 'style-vendorizer'

export const noprefix: Prefixer = (property: string, value: string, important?: boolean): string =>
  `${property}:${value}${important ? ' !important' : ''}`

export const autoprefix: Prefixer = (
  property: string,
  value: string,
  important?: boolean,
): string => {
  let cssText = ''

  // Resolve aliases, e.g. `gap` -> `grid-gap`
  const propertyAlias = cssPropertyAlias(property)
  if (propertyAlias) cssText += `${noprefix(propertyAlias, value, important)};`

  // Prefix properties, e.g. `backdrop-filter` -> `-webkit-backdrop-filter`
  let flags = cssPropertyPrefixFlags(property)
  if (flags & 0b001) cssText += `-webkit-${noprefix(property, value, important)};`
  if (flags & 0b010) cssText += `-moz-${noprefix(property, value, important)};`
  if (flags & 0b100) cssText += `-ms-${noprefix(property, value, important)};`

  // Prefix values, e.g. `position: "sticky"` -> `position: "-webkit-sticky"`
  // Notice that flags don't overlap and property prefixing isn't needed here
  flags = cssValuePrefixFlags(property, value)
  if (flags & 0b001) cssText += `${noprefix(property, `-webkit-${value}`, important)};`
  if (flags & 0b010) cssText += `${noprefix(property, `-moz-${value}`, important)};`
  if (flags & 0b100) cssText += `${noprefix(property, `-ms-${value}`, important)};`

  /* Include the standardized declaration last */
  /* https://css-tricks.com/ordering-css3-properties/ */
  cssText += noprefix(property, value, important)

  return cssText
}
