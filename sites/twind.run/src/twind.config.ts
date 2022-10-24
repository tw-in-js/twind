import type { ColorValue } from 'twind'
import { defineConfig } from 'twind'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'

// https://www.radix-ui.com/docs/colors/palette-composition/composing-a-palette
// Using semantic color names
import {
  sky as brand,
  skyDark as brandDark,
  plum as accent,
  plumDark as accentDark,
  slate as neutral,
  slateDark as neutralDark,

  // Error: Red/Tomato/Crimson
  tomato as error,
  tomatoDark as errorDark,

  // Success: Teal/Green/Grass/Mint
  green as success,
  greenDark as successDark,

  // Warning: Yellow/Amber
  amber as warning,
  amberDark as warningDark,

  // Info: Blue/Sky/Cyan
  cyan as info,
  cyanDark as infoDark,
} from '@radix-ui/colors'

// TODO: @radix-ui/colors as own package with colors converted to rgb
// TODO: preset-tailwind: tree-shakeable theme and preset
// TODO: adjust theme and preflight default colors

export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind()],
  ignorelist: import.meta.env.DEV
    ? [
        // Some well known css-in.js prefixes
        /^(s-|css-|go\d+|_)/,
        // BEM
        /__|--/,
        // Splitpanes
        'splitpanes',
        'default-theme',
        // Monaco
        /monaco|codicon|mtk|minimap|(^|-)lines?(-|$)/,
        /^(bracket-|core-|squiggly-|margin-|editor-|view-|cursors-|rename-|actions?-)/,
        'important',
      ]
    : undefined,
  darkMode: '[theme="dark"] &',
  // auto dark colors
  darkColor: (section, key, { theme }) => theme(`${section}.${key}-dark`) as ColorValue,
  theme: {
    extend: {
      maxWidth: {
        '8xl': '90rem',
      },
      colors: {
        brand: { ...mapColors(brand), ...mapColors(brandDark, '-dark') },
        accent: { ...mapColors(accent), ...mapColors(accentDark, '-dark') },
        neutral: { ...mapColors(neutral), ...mapColors(neutralDark, '-dark') },
        error: { ...mapColors(error), ...mapColors(errorDark, '-dark') },
        success: { ...mapColors(success), ...mapColors(successDark, '-dark') },
        warning: { ...mapColors(warning), ...mapColors(warningDark, '-dark') },
        info: { ...mapColors(info), ...mapColors(infoDark, '-dark') },
      },
    },
  },
})

function mapColors(input: Record<string, string>, suffix = ''): Record<string, string> {
  const output: Record<string, string> = {}

  for (const key in input) {
    output[key.replace(/\D+/, '') + suffix] = hslToHex(input[key])
  }

  return output
}

// https://stackoverflow.com/a/44134328/968997
function hslToHex(hsl: string): string {
  let {
    // eslint-disable-next-line prefer-const
    1: h,
    // eslint-disable-next-line prefer-const
    2: s,
    3: l,
  } = /(\d+), ([\d.]+)%, ([\d.]+)%/.exec(hsl) as unknown as { 1: number; 2: number; 3: number }

  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    // convert to Hex and prefix "0" if needed
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }

  return `#${f(0)}${f(8)}${f(4)}`
}
