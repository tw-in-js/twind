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
      // eslint-disable-next-line unicorn/no-reduce
      return properties.reduce((declarations, property) => {
        declarations[joinTruthy([prefix, property, suffix])] = value
        return declarations
      }, {} as CSSRules)
    }
  }
}

const CORNERS: Record<string, undefined | string[]> = {
  t: ['top-left', 'top-right'],
  r: ['top-right', 'bottom-right'],
  b: ['bottom-left', 'bottom-right'],
  l: ['bottom-left', 'top-left'],
  tl: ['top-left'],
  tr: ['top-right'],
  bl: ['bottom-left'],
  br: ['bottom-right'],
}

export const corners = positions((key) => CORNERS[key])

const X_Y_TO_EDGES: Record<string, undefined | string> = { x: 'lr', y: 'tb' }

const EDGES: Record<string, undefined | string> = {
  t: 'top',
  r: 'right',
  b: 'bottom',
  l: 'left',
}

export const expandEdges = (key: string): string[] | undefined => {
  const parts = (X_Y_TO_EDGES[key] || key || '')
    .split('')
    .sort()
    // eslint-disable-next-line unicorn/no-reduce, array-callback-return
    .reduce((result, edge) => {
      if (result && EDGES[edge]) {
        result.push(EDGES[edge] as string)
        return result
      }
    }, [] as string[] | undefined | void) as string[] | undefined

  if (parts && parts.length > 0) return parts
}

// Support several edges like 'tr'
// 'x' and 'y' can not be combined with others because size 'xl'
// Every char must be a edge position
// Sort to have consistent declaration ordering
export const edges = positions(expandEdges)
