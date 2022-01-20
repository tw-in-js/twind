import type { ColorValue, ColorFunctionOptions } from './types'

function parseColorComponent(chars: string, factor: number): number {
  return Math.round(parseInt(chars, 16) * factor)
}

export function toColorValue(color: ColorValue, options: ColorFunctionOptions = {}): string {
  if (typeof color == 'function') {
    return color(options)
  }

  const { opacityValue = '1', opacityVariable } = options
  const opacity = opacityVariable ? `var(${opacityVariable})` : opacityValue

  if (opacity == '1') return color
  if (opacity == '0') return '#0000'

  // rgb hex: #0123 and #001122
  if (color[0] == '#' && (color.length == 4 || color.length == 7)) {
    const size = (color.length - 1) / 3
    const factor = [17, 1, 0.062272][size - 1]

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `rgba(${[
      parseColorComponent(color.substr(1, size), factor),
      parseColorComponent(color.substr(1 + size, size), factor),
      parseColorComponent(color.substr(1 + 2 * size, size), factor),
      opacity,
    ]})`
  }

  return color
}
