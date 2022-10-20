import type { ColorInformation } from '../types'

import QuickLRU from 'quick-lru'
import { names as namedColors, TinyColor } from '@ctrl/tinycolor'

const colorNames = Object.keys(namedColors)
export const editabelColorRe = new RegExp(
  `-\\[(${colorNames.join('|')}|(?:(?:#|(?:(?:hsl|rgb)a?|hwb|lab|lch|color)\\())[^]\\(]+)\\]$`,
  'i',
)

const colorCache = new QuickLRU<string, ColorInformation['rgba'] | null>({ maxSize: 1000 })

export function parseColor(value: string): ColorInformation['rgba'] | null {
  let result = colorCache.get(value)

  if (!result) {
    const color = new TinyColor(value)

    colorCache.set(value, (result = color.isValid ? color.toRgb() : null))
  }

  return result
}
