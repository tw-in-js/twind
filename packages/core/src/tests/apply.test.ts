import { assert, test, afterEach } from 'vitest'

import { twind, virtual, colorFromTheme, fromTheme, apply, cx } from '..'

const tw = twind(
  {
    theme: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
      },
      spacing: {
        none: 'none',
        full: '100%',
        sm: '1rem',
        base: '1.2rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        0: '0px',
        '1': '.25rem',
        '0.5': '0.5rem',
        '2': '1rem',
        '2.5': '1.125rem',
        '6': '1.5rem',
        '9': '2.5rem',
        '12': '3rem',
      },
      colors: {
        transparent: 'transparent',
        white: '#fff',
        gray: {
          100: '#f3f4f6',
          500: '#6b7280',
          900: '#111827',
        },
        orange: {
          100: '#ffedd5',
          500: '#f97316',
          900: '#7c2d12',
        },
      },
    },
    rules: [
      ['h-', fromTheme('spacing', 'height')],
      ['p-', fromTheme('spacing', 'padding')],
      ['top-', fromTheme('spacing', 'top')],
      ['text-', fromTheme('spacing', 'font-size')],
      ['text-', colorFromTheme({ section: 'colors', property: 'color' })],
      ['bg-', colorFromTheme({ section: 'colors', property: 'background-color' })],
      ['border-', colorFromTheme({ section: 'colors', property: 'border-color' })],
      ['rounded-', fromTheme('spacing', 'borderRadius')],
    ],
  },
  virtual(),
)

afterEach(() => tw.clear())

test('keeps order as declared', () => {
  // reference using shortcut
  assert.strictEqual(tw('~(text-2 text-0 h-1)'), '~(text-2,text-0,h-1)')
  assert.deepEqual(tw.target, [
    '.\\~\\(text-2\\,text-0\\,h-1\\){height:.25rem;font-size:0px;font-size:1rem}',
  ])
  tw.clear()

  assert.strictEqual(tw('@(text-2 text-0 h-1)'), '@(text-2,text-0,h-1)')
  assert.deepEqual(tw.target, [
    '.\\@\\(text-2\\,text-0\\,h-1\\){font-size:1rem;font-size:0px;height:.25rem}',
  ])
  tw.clear()
})

test('named apply', () => {
  assert.strictEqual(apply.PrimaryButton`bg-red-500 text-white`, 'PrimaryButton#1athxj9')

  assert.strictEqual(apply['red-link']`bg-red-500 text-white`, 'red-link#pribq7')

  assert.deepEqual(tw.target, [])

  assert.strictEqual(
    tw(cx(apply.PrimaryButton`bg-orange-500 text-white`, 'text-sm')),
    'PrimaryButton#176yabo text-sm',
  )

  assert.deepEqual(tw.target, [
    '.PrimaryButton\\#176yabo{--tw-bg-opacity:1;background-color:rgba(249,115,22,var(--tw-bg-opacity));--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}',
    '.text-sm{font-size:1rem}',
  ])

  tw.clear()

  assert.strictEqual(
    tw(`text-sm hover:${apply.PrimaryButton`bg-orange-500 text-white`}`),
    'hover:PrimaryButton#176yabo text-sm',
  )

  assert.deepEqual(tw.target, [
    '.hover\\:PrimaryButton\\#176yabo:hover{--tw-bg-opacity:1;background-color:rgba(249,115,22,var(--tw-bg-opacity));--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}',
    '.text-sm{font-size:1rem}',
  ])

  tw.clear()

  assert.strictEqual(
    tw(`text-sm hover:PrimaryButton~(bg-orange-500 text-white)`),
    'hover:PrimaryButton#12852aj text-sm',
  )

  assert.deepEqual(tw.target, [
    '.hover\\:PrimaryButton\\#12852aj:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(249,115,22,var(--tw-bg-opacity))}',
    '.text-sm{font-size:1rem}',
  ])
})
