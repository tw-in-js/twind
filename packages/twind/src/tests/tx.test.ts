import { assert, test, afterEach } from 'vitest'

import type { TwindUserConfig } from '..'

import { twind, setup, virtual, tx, tw, colorFromTheme } from '..'

const config = {
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
    },
    spacing: {
      lg: '2rem',
      xl: '3rem',
      '0.5': '0.5rem',
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
  },
  rules: [
    ['bg-', colorFromTheme({ section: 'colors', property: 'background-color' })],
    ['text-', colorFromTheme({ section: 'colors', property: 'color' })],
  ],
} as TwindUserConfig

setup(config, virtual())

afterEach(() => tw.clear())

test('using tx', () => {
  assert.strictEqual(tx`${true && 'bg-gray-500'} ${false && 'text-gray-500'}`, 'bg-gray-500')
  assert.deepEqual(tw.target, [
    '.bg-gray-500{--tw-bg-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
  ])
})

test('using custom tw with tx', () => {
  const custom = twind(config, virtual())

  const tx$ = tx.bind(custom)

  assert.strictEqual(tx$({ 'text-gray-100': true, 'text-gray-700': false }), 'text-gray-100')

  assert.deepEqual(custom.target, [
    '.text-gray-100{--tw-text-opacity:1;color:rgba(243,244,246,var(--tw-text-opacity))}',
  ])
  assert.lengthOf(tw.target as string[], 0)
})
