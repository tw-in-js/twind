import type { BaseTheme, MaybeArray, ThemeConfig } from '..'
import { assert, test } from 'vitest'

import { makeThemeFunction } from './theme'

interface Theme extends BaseTheme {
  spacing: Record<string, string>
  borderColor: BaseTheme['colors']
  fontFamily: Record<string, MaybeArray<string>>
}

const defaultTheme: ThemeConfig<Theme> = {
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  spacing: {
    px: '1px',
    0: '0px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
  },
  colors: {
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  borderColor: ({ theme }) => theme('colors'),
  fontFamily: {
    sans: 'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'.split(
      ',',
    ),
    serif: 'ui-serif,Georgia,Cambria,"Times New Roman",Times,serif'.split(','),
    mono: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace'.split(
      ',',
    ),
  },
}

test('resolve whole theme', () => {
  const theme = makeThemeFunction<Theme>(defaultTheme)

  assert.deepEqual(theme(), {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    spacing: {
      '0': '0px',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      px: '1px',
      '0.5': '0.125rem',
      '1.5': '0.375rem',
      '2.5': '0.625rem',
      '3.5': '0.875rem',
    },
    colors: {
      'gray-50': '#f9fafb',
      'gray-100': '#f3f4f6',
      'gray-200': '#e5e7eb',
      'gray-300': '#d1d5db',
      'gray-400': '#9ca3af',
      'gray-500': '#6b7280',
      'gray-600': '#4b5563',
      'gray-700': '#374151',
      'gray-800': '#1f2937',
      'gray-900': '#111827',
      gray: {
        '50': '#f9fafb',
        '100': '#f3f4f6',
        '200': '#e5e7eb',
        '300': '#d1d5db',
        '400': '#9ca3af',
        '500': '#6b7280',
        '600': '#4b5563',
        '700': '#374151',
        '800': '#1f2937',
        '900': '#111827',
      },
    },
    borderColor: {
      'gray-50': '#f9fafb',
      'gray-100': '#f3f4f6',
      'gray-200': '#e5e7eb',
      'gray-300': '#d1d5db',
      'gray-400': '#9ca3af',
      'gray-500': '#6b7280',
      'gray-600': '#4b5563',
      'gray-700': '#374151',
      'gray-800': '#1f2937',
      'gray-900': '#111827',
      gray: {
        '50': '#f9fafb',
        '100': '#f3f4f6',
        '200': '#e5e7eb',
        '300': '#d1d5db',
        '400': '#9ca3af',
        '500': '#6b7280',
        '600': '#4b5563',
        '700': '#374151',
        '800': '#1f2937',
        '900': '#111827',
      },
    },
    fontFamily: {
      sans: [
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
    },
  } as Theme)
})

test('resolve whole section', () => {
  const theme = makeThemeFunction<Theme>({
    ...defaultTheme,
    borderColor: ({ theme }) => ({
      ...theme('colors'),
      DEFAULT: '#e5e7eb',
    }),
  })

  assert.deepEqual(theme('borderColor'), {
    'gray-50': '#f9fafb',
    'gray-100': '#f3f4f6',
    'gray-200': '#e5e7eb',
    'gray-300': '#d1d5db',
    'gray-400': '#9ca3af',
    'gray-500': '#6b7280',
    'gray-600': '#4b5563',
    'gray-700': '#374151',
    'gray-800': '#1f2937',
    'gray-900': '#111827',
    gray: {
      '50': '#f9fafb',
      '100': '#f3f4f6',
      '200': '#e5e7eb',
      '300': '#d1d5db',
      '400': '#9ca3af',
      '500': '#6b7280',
      '600': '#4b5563',
      '700': '#374151',
      '800': '#1f2937',
      '900': '#111827',
    },
    '': '#e5e7eb',
    DEFAULT: '#e5e7eb',
  })
})

// test('default color', () => {
//   const theme = makeThemeFunction<Theme>({
//     ...defaultTheme,
//     extend: {
//       colors: {
//         gray: {
//           DEFAULT: '#aaa',
//         },
//       },
//     },
//   })

//   assert.strictEqual(theme('borderColor', 'gray'), '#aaa')
// })

test('custom color', () => {
  const theme = makeThemeFunction<Theme>({
    ...defaultTheme,
    extend: {
      colors: {
        gray: {
          custom: '#aaa',
        },
      },
    },
  })

  assert.strictEqual(theme('borderColor.gray.custom'), '#aaa')
  // assert.strictEqual(theme('borderColor', 'gray.custom'), '#aaa')
  assert.strictEqual(theme('borderColor', 'gray-custom'), '#aaa')

  assert.strictEqual(theme('borderColor.gray.300'), '#d1d5db')
  // assert.strictEqual(theme('borderColor', 'gray.300'), '#d1d5db')
  assert.strictEqual(theme('borderColor', 'gray-300'), '#d1d5db')

  assert.strictEqual(theme('borderColor.gray.special', '#bbb'), '#bbb')
  // assert.strictEqual(theme('borderColor', 'gray.special', '#bbb'), '#bbb')
  assert.strictEqual(theme('borderColor', 'gray-special', '#bbb'), '#bbb')
})

test('deep custom color', () => {
  const theme = makeThemeFunction<Theme>({
    ...defaultTheme,
    extend: {
      colors: {
        gray: {
          a: {
            b: {
              c: {
                d: {
                  e: {
                    f: '#abcdef',
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  assert.strictEqual(theme('colors.gray.a.b.c.d.e.f'), '#abcdef')
  // assert.strictEqual(theme('colors', 'gray.a.b.c.d.e.f'), '#abcdef')
  assert.strictEqual(theme('colors', 'gray-a-b-c-d-e-f'), '#abcdef')

  assert.strictEqual(theme('colors.gray.300'), '#d1d5db')
  // assert.strictEqual(theme('colors', 'gray.300'), '#d1d5db')
  assert.strictEqual(theme('colors', 'gray-300'), '#d1d5db')
})

test('negative is available and no-op', () => {
  const theme = makeThemeFunction<Theme>({
    ...defaultTheme,
    extend: {
      spacing: ({ negative }) => ({
        ...negative({ xs: '1rem' }),
      }),
    },
  })

  assert.strictEqual(theme('spacing', 'xs'), undefined)
  assert.strictEqual(theme('spacing', '-xs'), undefined)

  assert.strictEqual(theme('spacing', 'px'), '1px')
})

test('reference the default theme', () => {
  const theme = makeThemeFunction<Theme>({
    ...defaultTheme,
    extend: {
      fontFamily: ({ theme }) => ({
        sans: ['"Inter var"', ...(theme('fontFamily.sans') as string[])],
      }),
    },
  })

  assert.deepEqual(theme('fontFamily', 'sans'), [
    '"Inter var"',
    ...(defaultTheme.fontFamily as Theme['fontFamily']).sans,
  ])
})

test('can apply alpha values to colors', () => {
  const theme = makeThemeFunction<Theme>(defaultTheme)

  assert.strictEqual(theme('colors.gray.500 / 0.5'), 'rgba(107,114,128,0.5)')
  assert.strictEqual(
    theme('colors.gray.500 / var(--my-alpha)'),
    'rgba(107,114,128,var(--my-alpha))',
  )
})
