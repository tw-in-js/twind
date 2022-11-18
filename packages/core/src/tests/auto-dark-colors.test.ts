import { assert, test, afterEach } from 'vitest'

import { twind, virtual, colorFromTheme, autoDarkColor } from '..'

const tw = twind(
  {
    darkMode: 'class',
    darkColor: autoDarkColor,
    theme: {
      colors: {
        transparent: 'transparent',
        white: '#fff',
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
    },
    rules: [
      ['text-', colorFromTheme({ section: 'colors', property: 'color' })],
      ['bg-', colorFromTheme({ section: 'colors', property: 'background-color' })],
      ['border-', colorFromTheme({ section: 'colors', property: 'border-color' })],
    ],
    variants: [
      [
        '((group|peer)(~[^-[]+)?)(-[a-z-]+|\\[.+])',
        ({ 1: $1, 4: $4 }, { e, h }) =>
          `:merge(.${e(h($1))})${$4[0] == '[' ? $4 : ':' + $4.slice(1)}${
            $1[0] == 'p' ? '~' : ' '
          }&`,
      ],
    ],
  },
  virtual(),
)

afterEach(() => tw.clear())

test('adds auto dark color', () => {
  assert.strictEqual(tw('text-gray-50'), 'text-gray-50')
  assert.deepEqual(tw.target, [
    '.text-gray-50{--tw-text-opacity:1;color:rgba(248,250,252,var(--tw-text-opacity))}',
    '.dark .text-gray-50{--tw-text-opacity:1;color:rgba(15,23,42,var(--tw-text-opacity))}',
  ])

  tw.clear()

  assert.strictEqual(tw('text-gray-900'), 'text-gray-900')
  assert.deepEqual(tw.target, [
    '.text-gray-900{--tw-text-opacity:1;color:rgba(15,23,42,var(--tw-text-opacity))}',
    '.dark .text-gray-900{--tw-text-opacity:1;color:rgba(248,250,252,var(--tw-text-opacity))}',
  ])
})

test('allows to overwrite dark color', () => {
  assert.strictEqual(tw('text-gray-900 dark:text-gray-100'), 'text-gray-900 dark:text-gray-100')
  assert.deepEqual(tw.target, [
    '.text-gray-900{--tw-text-opacity:1;color:rgba(15,23,42,var(--tw-text-opacity))}',
    '.dark .text-gray-900{--tw-text-opacity:1;color:rgba(248,250,252,var(--tw-text-opacity))}',
    '.dark .dark\\:text-gray-100{--tw-text-opacity:1;color:rgba(241,245,249,var(--tw-text-opacity))}',
  ])
})

test('does not add color if already for dark', () => {
  assert.strictEqual(tw('dark:text-gray-600'), 'dark:text-gray-600')
  assert.deepEqual(tw.target, [
    '.dark .dark\\:text-gray-600{--tw-text-opacity:1;color:rgba(71,85,105,var(--tw-text-opacity))}',
  ])
})

test('works with peer and group', () => {
  assert.strictEqual(tw('peer-hover:text-gray-200'), 'peer-hover:text-gray-200')
  assert.deepEqual(tw.target, [
    '.peer:hover~.peer-hover\\:text-gray-200{--tw-text-opacity:1;color:rgba(226,232,240,var(--tw-text-opacity))}',
    '.dark .peer:hover~.peer-hover\\:text-gray-200{--tw-text-opacity:1;color:rgba(51,65,85,var(--tw-text-opacity))}',
  ])

  tw.clear()

  assert.strictEqual(
    tw('group~special-focus-visible:text-gray-700'),
    'group~special-focus-visible:text-gray-700',
  )
  assert.deepEqual(tw.target, [
    '.group\\~special:focus-visible .group\\~special-focus-visible\\:text-gray-700{--tw-text-opacity:1;color:rgba(51,65,85,var(--tw-text-opacity))}',
    '.dark .group\\~special:focus-visible .group\\~special-focus-visible\\:text-gray-700{--tw-text-opacity:1;color:rgba(226,232,240,var(--tw-text-opacity))}',
  ])
})
