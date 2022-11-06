// Based on https://github.com/tailwindlabs/tailwindcss-forms/blob/ce5386b66a8a5833372fd245e95bf3c4e21da8d3/src/index.js
// License MIT

import type { Preset, CSSObject, MaybeThunk, Preflight } from 'twind'
import type { TailwindTheme } from '@twind/preset-tailwind'

import { toColorValue } from 'twind'

import * as colors from '@twind/preset-tailwind/colors'
import defaultTheme from '@twind/preset-tailwind/defaultTheme'

const [baseFontSize, baseLineHeight] = defaultTheme.fontSize.base
const { spacing, borderWidth, borderRadius } = defaultTheme

export interface TailwindFormsPresetOptions {
  strategy?: 'base' | 'class'
}

export default function presetTailwindForms({
  strategy,
}: TailwindFormsPresetOptions = {}): Preset<TailwindTheme> {
  const config: Preset<TailwindTheme> = {}

  if (strategy !== 'base') {
    config.rules = [
      [
        '(' +
          rules
            .map((r) => r.c)
            .filter(Boolean)
            .join('|') +
          ')',
        (match, context) =>
          ({
            '@layer base': rules
              .filter((r) => r.c?.includes(match[1]))
              .map(({ c: classes, s: styles }) => ({
                ['' +
                (classes as string[]).map((className) => '.' + context.e(context.h(className)))]:
                  typeof styles == 'function' ? styles(context) : styles,
              })),
          } as CSSObject),
      ],
    ]
  }

  if (strategy !== 'class') {
    config.preflight = (context) => {
      const preflight: Preflight = {}

      for (const { b: base, s: styles } of rules) {
        preflight['' + base] = typeof styles == 'function' ? styles(context) : styles
      }

      return preflight
    }
  }

  return config
}

const rules: {
  b: string[]
  c?: string[]
  s: MaybeThunk<CSSObject, TailwindTheme>
}[] = [
  {
    b: [
      "[type='text']",
      "[type='email']",
      "[type='url']",
      "[type='password']",
      "[type='number']",
      "[type='date']",
      "[type='datetime-local']",
      "[type='month']",
      "[type='search']",
      "[type='tel']",
      "[type='time']",
      "[type='week']",
      '[multiple]',
      'textarea',
      'select',
    ],
    c: ['form-input', 'form-textarea', 'form-select', 'form-multiselect'],
    s: ({ theme }) => ({
      appearance: 'none',
      'background-color': '#fff',
      'border-color': toColorValue(theme('colors.gray.500', colors.gray[500])),
      'border-width': borderWidth['DEFAULT'],
      'border-radius': borderRadius.none,
      'padding-top': spacing[2],
      'padding-right': spacing[3],
      'padding-bottom': spacing[2],
      'padding-left': spacing[3],
      'font-size': baseFontSize,
      'line-height': baseLineHeight,
      '--tw-shadow': '0 0 #0000',
      '&:focus': {
        outline: '2px solid transparent',
        'outline-offset': '2px',
        '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-ring-offset-width': '0px',
        '--tw-ring-offset-color': '#fff',
        '--tw-ring-color': toColorValue(theme('colors.blue.600', colors.blue[600])),
        '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
        '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
        'box-shadow': `var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)`,
        'border-color': toColorValue(theme('colors.blue.600', colors.blue[600])),
      },
    }),
  },
  {
    b: ['input', 'textarea'],
    c: ['form-input', 'form-textarea'],
    s: ({ theme }) => ({
      '&::placeholder': {
        color: toColorValue(theme('colors.gray.500', colors.gray[500])),
        opacity: '1',
      },
    }),
  },
  {
    b: [''],
    c: ['form-input'],
    s: {
      '&::-webkit-datetime-edit-fields-wrapper': {
        padding: '0',
      },
      // Unfortunate hack until https://bugs.webkit.org/show_bug.cgi?id=198959 is fixed.
      // This sucks because users can't change line-height with a utility on date inputs now.
      // Reference: https://github.com/twbs/bootstrap/pull/31993
      '&::-webkit-date-and-time-value': {
        'min-height': '1.5em',
      },
    },
  },
  {
    b: ['select'],
    c: ['form-select'],
    s: ({ theme }) => ({
      'background-image': `url("${svgToDataUri(
        `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="${toColorValue(
          theme('colors.gray.500', colors.gray[500]),
        )}" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/></svg>`,
      )}")`,
      'background-position': `right ${spacing[2]} center`,
      'background-repeat': `no-repeat`,
      'background-size': `1.5em 1.5em`,
      'padding-right': spacing[10],
      'color-adjust': `exact`,
    }),
  },
  {
    b: ['[multiple]'],
    // class: null,
    s: {
      'background-image': 'initial',
      'background-position': 'initial',
      'background-repeat': 'unset',
      'background-size': 'initial',
      'padding-right': spacing[3],
      'color-adjust': 'unset',
    },
  },
  {
    b: [`[type='checkbox']`, `[type='radio']`],
    c: ['form-checkbox', 'form-radio'],
    s: ({ theme }) => ({
      appearance: 'none',
      padding: '0',
      'color-adjust': 'exact',
      display: 'inline-block',
      'vertical-align': 'middle',
      'background-origin': 'border-box',
      'user-select': 'none',
      'flex-shrink': '0',
      height: spacing[4],
      width: spacing[4],
      color: toColorValue(theme('colors.blue.600', colors.blue[600])),
      'background-color': '#fff',
      'border-color': toColorValue(theme('colors.gray.500', colors.gray[500])),
      'border-width': borderWidth['DEFAULT'],
      '--tw-shadow': '0 0 #0000',
      '&:focus': {
        outline: '2px solid transparent',
        'outline-offset': '2px',
        '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-ring-offset-width': '2px',
        '--tw-ring-offset-color': '#fff',
        '--tw-ring-color': toColorValue(theme('colors.blue.600', colors.blue[600])),
        '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
        '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
        'box-shadow': `var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)`,
      },
      '&:checked': {
        'border-color': `transparent`,
        'background-color': `currentColor`,
        'background-size': `100% 100%`,
        'background-position': `center`,
        'background-repeat': `no-repeat`,
        '&:hover,&:focus': {
          'border-color': 'transparent',
          'background-color': 'currentColor',
        },
      },
    }),
  },
  {
    b: [`[type='checkbox']`],
    c: ['form-checkbox'],
    s: {
      'border-radius': borderRadius['none'],
      '&:checked': {
        'background-image': `url("${svgToDataUri(
          `<svg viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"/></svg>`,
        )}")`,
      },
      '&:indeterminate': {
        'background-image': `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h8"/></svg>`,
        )}")`,
        'border-color': `transparent`,
        'background-color': `currentColor`,
        'background-size': `100% 100%`,
        'background-position': `center`,
        'background-repeat': `no-repeat`,
        '&:hover,&:focus': {
          'border-color': 'transparent',
          'background-color': 'currentColor',
        },
      },
    },
  },
  {
    b: [`[type='radio']`],
    c: ['form-radio'],
    s: {
      'border-radius': '100%',
      '&:checked': {
        'background-image': `url("${svgToDataUri(
          `<svg viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3"/></svg>`,
        )}")`,
      },
    },
  },
  {
    b: [`[type='file']`],
    // class: null,
    s: {
      background: 'unset',
      'border-color': 'inherit',
      'border-width': '0',
      'border-radius': '0',
      padding: '0',
      'font-size': 'unset',
      'line-height': 'inherit',
      '&:focus': {
        outline: [`1px solid ButtonText`, `1px auto -webkit-focus-ring-color`],
      },
    },
  },
]

// Based on https://github.com/tigt/mini-svg-data-uri/blob/master/index.js (License MIT)
function specialHexEncode(match: string): string {
  switch (
    match // Browsers tolerate these characters, and they're frequent
  ) {
    case '%20':
      return ' '
    case '%3D':
      return '='
    case '%3A':
      return ':'
    case '%2F':
      return '/'
    default:
      return match.toLowerCase() // compresses better
  }
}

function svgToDataUri(svgString: string): string {
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(svgString.trim().replace(/\s+/g, ' ').replace(/"/g, "'")).replace(
      /%[\dA-F]{2}/g,
      specialHexEncode,
    )
  )
}
