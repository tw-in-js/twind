/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { CSSRules } from '../types'

import { joinTruthy } from '../internal/util'

const positions = (resolve: (position: string) => undefined | string[] | void) => (
  value: string | string[] | undefined,
  position: string,
  prefix?: string,
  suffix?: string,
): CSSRules | undefined => {
  if (value) {
    const properties = position && resolve(position)

    if (properties && properties.length > 0) {
      return properties.reduce((declarations, property) => {
        declarations[joinTruthy([prefix, property, suffix])] = value
        return declarations
      }, {} as CSSRules)
    }
  }
}

export const corners = positions(
  (key) =>
    (({
      t: ['top-left', 'top-right'],
      r: ['top-right', 'bottom-right'],
      b: ['bottom-left', 'bottom-right'],
      l: ['bottom-left', 'top-left'],
      tl: ['top-left'],
      tr: ['top-right'],
      bl: ['bottom-left'],
      br: ['bottom-right'],
    } as Record<string, undefined | string[]>)[key]),
)

export const expandEdges = (key: string): string[] | undefined => {
  const parts = (({ x: 'lr', y: 'tb' } as Record<string, undefined | string>)[key] || key || '')
    .split('')
    .sort()

  for (let index = parts.length; index--; ) {
    if (
      !(parts[index] = ({
        t: 'top',
        r: 'right',
        b: 'bottom',
        l: 'left',
      } as Record<string, string>)[parts[index]])
    )
      return
  }

  if (parts.length) return parts
}

// Support several edges like 'tr'
// 'x' and 'y' can not be combined with others because size 'xl'
// Every char must be a edge position
// Sort to have consistent declaration ordering
export const edges = positions(expandEdges)
/* eslint-enable @typescript-eslint/consistent-type-assertions */
