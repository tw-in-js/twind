import type { ColorValue, ColorFunctionOptions, Context, Falsey } from './types'

function parseColorComponent(chars: string, factor: number): number {
  return Math.round(parseInt(chars, 16) * factor)
}

export function toColorValue(color: ColorValue, options: ColorFunctionOptions = {}): string {
  if (typeof color == 'function') {
    return color(options)
  }

  const { opacityValue = '1', opacityVariable } = options
  const opacity = opacityVariable ? `var(${opacityVariable})` : opacityValue

  // rgb hex: #0123 and #001122
  if (color[0] == '#' && (color.length == 4 || color.length == 7)) {
    const size = (color.length - 1) / 3
    const factor = [17, 1, 0.062272][size - 1]

    return `rgba(${[
      parseColorComponent(color.substr(1, size), factor),
      parseColorComponent(color.substr(1 + size, size), factor),
      parseColorComponent(color.substr(1 + 2 * size, size), factor),
      opacity,
    ]})`
  }

  if (opacity == '1') return color
  if (opacity == '0') return '#0000'

  // convert rgb and hsl to alpha variant
  return color.replace(/^(rgb|hsl)(\([^)]+)\)$/, `$1a$2,${opacity})`)
}

/**
 * Looks for a matching dark color within a [tailwind color palette](https://tailwindcss.com/docs/customizing-colors) (`50`, `100`, `200`, ..., `800`, `900`).
 *
 * ```js
 * defineConfig({
 *   darkColor: autoDarkColor,
 * })
 * ```
 *
 * **Note**: Does not work for arbitrary values like `[theme(colors.gray.500)]` or `[theme(colors.gray.500, #ccc)]`.
 *
 * @param section within theme to use
 * @param key of the light color or an arbitrary value
 * @param context to use
 * @returns the dark color if found
 */
export function autoDarkColor(
  section: string,
  key: string,
  { theme }: Context<any>,
): ColorValue | Falsey {
  // 50 -> 900, 100 -> 800, ..., 800 -> 100, 900 -> 50
  // key: gray-50, gray.50
  key = key.replace(
    /\d+$/,
    (shade) =>
      // ~~(parseInt(shade, 10) / 100): 50 -> 0, 900 -> 9
      // (9 - 0) -> 900, (9 - 9) -> 50
      ((9 - ~~(parseInt(shade, 10) / 100) || 0.5) * 100) as any,
  )

  return theme(section as 'colors', key)
}
