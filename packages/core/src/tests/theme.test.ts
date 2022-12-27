/* eslint-disable @typescript-eslint/ban-ts-comment */
import { assert, test } from 'vitest'

import { makeThemeFunction } from '../internal/theme'

test('default color', () => {
  const theme = makeThemeFunction({
    colors: {},
    extend: {
      colors: {
        gray: {
          DEFAULT: '#aaa',
        },
      },
    },
  })

  assert.strictEqual(theme('colors.gray'), '#aaa')
  assert.strictEqual(theme('colors.gray.DEFAULT'), '#aaa')
  assert.strictEqual(theme('colors', 'gray'), '#aaa')
  assert.strictEqual(theme('colors', 'gray-DEFAULT'), '#aaa')
  // @ts-ignore
  assert.deepEqual(theme(), { colors: { gray: '#aaa', 'gray-DEFAULT': '#aaa' } })
})

test('custom color', () => {
  const theme = makeThemeFunction({
    colors: {
      gray: {
        300: '#d1d5db',
      },
    },
    extend: {
      colors: {
        gray: {
          custom: '#aaa',
        },
      },
    },
  })

  assert.strictEqual(theme('colors.gray.custom'), '#aaa')
  assert.strictEqual(theme('colors', 'gray-custom'), '#aaa')

  assert.strictEqual(theme('colors.gray.300'), '#d1d5db')
  assert.strictEqual(theme('colors', 'gray-300'), '#d1d5db')

  assert.strictEqual(theme('colors.gray.special', '#bbb'), '#bbb')
  assert.strictEqual(theme('colors', 'gray-special', '#bbb'), '#bbb')
})

test('deep custom color', () => {
  const theme = makeThemeFunction({
    colors: {
      gray: {
        300: '#d1d5db',
      },
    },
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
  assert.strictEqual(theme('colors', 'gray-a-b-c-d-e-f'), '#abcdef')

  assert.strictEqual(theme('colors.gray.300'), '#d1d5db')
  assert.strictEqual(theme('colors', 'gray-300'), '#d1d5db')
})

test('negative is available and no-op', () => {
  const theme = makeThemeFunction({
    spacing: {
      px: '1px',
    },
    extend: {
      // @ts-ignore
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
  const theme = makeThemeFunction({
    fontFamily: {
      sans: 'ui-sans-serif,system-ui'.split(','),
    },
    extend: {
      // @ts-ignore
      fontFamily: ({ theme }) => ({
        sans: ['"Inter var"', theme('fontFamily.sans')],
      }),
    },
  })

  assert.deepEqual(theme('fontFamily', 'sans'), ['"Inter var"', ['ui-sans-serif', 'system-ui']])
})

test('access values with dots', () => {
  const theme = makeThemeFunction({
    colors: {},
    screens: {},
    spacing: {
      0.5: '0.125rem',
    },
  })

  assert.strictEqual(theme('spacing', '0.5'), '0.125rem')
  assert.strictEqual(theme('spacing[0.5]'), '0.125rem')

  // dotted values need to use square bracket syntax
  assert.strictEqual(theme('spacing.0.5'), undefined)
})
