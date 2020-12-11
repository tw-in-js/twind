import type { Prefixer } from './types'

import { prefixProperty, prefixValue } from 'tiny-css-prefixer'

export const autoprefix: Prefixer = (property: string, value: string): string => {
  const declaration = `${property}:${prefixValue(property, value)}`

  let cssText = declaration

  const flag = prefixProperty(property)

  if (flag & 1 /* 0b001 */) cssText += `;-ms-${declaration}`
  if (flag & 2 /* 0b010 */) cssText += `;-moz-${declaration}`
  if (flag & 4 /* 0b100 */) cssText += `;-webkit-${declaration}`

  return cssText
}

export const noprefix: Prefixer = (property: string, value: string): string =>
  `${property}:${value}`
