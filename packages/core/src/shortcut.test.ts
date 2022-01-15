import { assert, test, afterEach } from 'vitest'

import { twind, virtual, colorFromTheme, fromTheme, shortcut } from '.'

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

test('comments', () => {
  assert.strictEqual(
    shortcut`
      underline
      /* multi
        line
        comment
      */
      hover:focus:!(
        sm:(italic why)
        lg:-(px)
        -mx-1
      )
      ${false} ${undefined} ${null} ${''}
      // Position
      !top-1 !-bottom-${2} mx-${0}
      text-(xl black)
    `,
    '~(underline,hover:focus:sm:!italic,hover:focus:sm:!why,hover:focus:lg:!-px,hover:focus:!-mx-1,!top-1,!-bottom-2,mx-0,text-xl,text-black)',
  )
})

test('named shortcuts', () => {
  assert.strictEqual(shortcut.PrimaryButton`bg-red-500 text-white`, 'PrimaryButton#140ikvd')

  assert.strictEqual(shortcut['red-link']`bg-red-500 text-white`, 'red-link#140ikvd')

  assert.deepEqual(tw.target, [])

  assert.strictEqual(
    tw(shortcut.PrimaryButton`bg-orange-500 text-white`, 'text-sm'),
    'PrimaryButton#1nckg2k text-sm',
  )

  assert.deepEqual(tw.target, [
    '.PrimaryButton\\#1nckg2k{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(249,115,22,var(--tw-bg-opacity))}',
    '.text-sm{font-size:1rem}',
  ])

  tw.clear()

  assert.strictEqual(
    tw`text-sm hover:${shortcut.PrimaryButton`bg-orange-500 text-white`}`,
    'hover:PrimaryButton#1nckg2k text-sm',
  )

  assert.deepEqual(tw.target, [
    '.hover\\:PrimaryButton\\#1nckg2k:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(249,115,22,var(--tw-bg-opacity))}',
    '.text-sm{font-size:1rem}',
  ])

  tw.clear()

  assert.strictEqual(
    tw`text-sm hover:PrimaryButton~(bg-orange-500 text-white)`,
    'PrimaryButton#hlo461 text-sm',
  )

  assert.deepEqual(tw.target, [
    '.PrimaryButton\\#hlo461:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(249,115,22,var(--tw-bg-opacity))}',
    '.text-sm{font-size:1rem}',
  ])
})
