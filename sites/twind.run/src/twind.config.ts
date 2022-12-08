import type { ColorValue } from '@twind/core'
import { defineConfig } from '@twind/core'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'
import presetTypography from '@twind/preset-typography'

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
  presets: [
    presetAutoprefix(),
    presetTailwind(),
    presetTypography({
      defaultColor: 'brand',
      colors: {
        body: '11',
        headings: '12',
        lead: '11',
        links: '12',
        bold: '12',
        counters: '7',
        bullets: '6',
        hr: '6',
        quotes: '12',
        'quote-borders': '6',
        captions: '11',
        code: '11',
        'pre-code': '11',
        'pre-bg': '3',
        'th-borders': '7',
        'td-borders': '6',
        // invert colors (dark mode) — default to auto dark color
        dark: null,
      },
    }),
  ],
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
  // For now no hashing - seems to break monaco
  hash: false,
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
