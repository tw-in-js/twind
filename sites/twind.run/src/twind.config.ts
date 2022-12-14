import { defineConfig } from '@twind/core'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind/base'
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
} from '@twind/preset-radix-ui/colors'

import darkColor from '@twind/preset-radix-ui/darkColor'

export default defineConfig({
  presets: [
    presetAutoprefix(),
    presetTailwind({
      colors: {
        brand,
        brandDark,
        accent,
        accentDark,
        neutral,
        neutralDark,

        // Error: Red/Tomato/Crimson
        error,
        errorDark,

        // Success: Teal/Green/Grass/Mint
        success,
        successDark,

        // Warning: Yellow/Amber
        warning,
        warningDark,

        // Info: Blue/Sky/Cyan
        info,
        infoDark,
      },
    }),
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
        // Some well known css-in-js prefixes
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
  darkColor,
  theme: {
    extend: {
      maxWidth: {
        '8xl': '90rem',
      },
    },
  },
  // For now no hashing - seems to break monaco
  hash: false,
})
