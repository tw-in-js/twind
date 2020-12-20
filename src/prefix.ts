import type { Prefixer } from './types'

import { prefixProperty, prefixValue } from 'tiny-css-prefixer'

export const noprefix: Prefixer = (property: string, value: string, important?: boolean): string =>
  `${property}:${value}${important ? ' !important' : ''}`

export const autoprefix: Prefixer = (
  property: string,
  value: string,
  important?: boolean,
): string => {
  const declaration = noprefix(property, prefixValue(property, value), important)

  let cssText = declaration

  const flag = prefixProperty(property)

  if (flag & 1 /* 0b001 */) cssText += `;-ms-${declaration}`
  if (flag & 2 /* 0b010 */) cssText += `;-moz-${declaration}`
  if (flag & 4 /* 0b100 */) cssText += `;-webkit-${declaration}`

  return cssText
}
