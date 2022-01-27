/**
 * [[include:packages/preset-line-clamp/README.md]]
 *
 * @packageDocumentation
 * @module
 */

import type { BaseTheme, CSSObject, Preset } from 'twind'

import { fromTheme } from 'twind'

export interface LineClampTheme extends BaseTheme {
  lineClamp: Record<string, string>
}

export default function presetLineClamp(): Preset<LineClampTheme> {
  return {
    rules: [
      ['line-clamp-none', { '-webkit-line-clamp': 'unset' }],
      ['line-clamp-', fromTheme('lineClamp', ({ _ }) => lineClamp(_))],
      ['line-clamp-(\\d+)', ({ 1: _ }) => lineClamp(_)],
    ],
  }
}

function lineClamp(lines: string | number): CSSObject {
  return {
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': `${lines}`,
  }
}
