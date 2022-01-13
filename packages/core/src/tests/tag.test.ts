import { assert, test, afterEach } from 'vitest'

import { twind, virtual, colorFromTheme, fromTheme, apply, css } from '..'

const tw = twind(
  {
    tag: true,
    theme: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
      },
      spacing: {
        0: '0px',
      },
    },
    rules: [
      ['(block|flex|table|grid|inline|contents|flow-root|list-item)', 'display'],
      ['text-(left|center|right|justify)', 'textAlign'],
      ['w-', fromTheme('spacing', 'width')],
    ],
  },
  virtual(),
)

afterEach(() => tw.clear())

test('class names are hashed', () => {
  assert.strictEqual(tw('flex text-center'), '#e9txhd #1vaw68m')
  assert.deepEqual(tw.target, ['.\\#1vaw68m{text-align:center}', '.\\#e9txhd{display:flex}'])
})

test('accept already hashed rules', () => {
  assert.strictEqual(tw('#1bk5mm5 #bibj42'), '#1bk5mm5 #bibj42')
  assert.deepEqual(tw.target, [])
})

test('different variant produce different hashes', () => {
  assert.strictEqual(tw('sm:text-center lg:text-center'), '#7n36h2 #18xkmkh')
  assert.deepEqual(tw.target, [
    '@media (min-width:640px){.\\#7n36h2{text-align:center}}',
    '@media (min-width:1024px){.\\#18xkmkh{text-align:center}}',
  ])
})

test('same style in different layers has different hash', () => {
  assert.strictEqual(
    tw(`w-0 ${css({ width: '0px' })} ${apply(`w-0`)}`),
    '#1wdxrmr #xs3c6s #1hg5x5u',
  )
  assert.deepEqual(tw.target, [
    // apply(`w-0`)
    '.\\#1wdxrmr{width:0px}',
    // w-0
    '.\\#xs3c6s{width:0px}',
    // css({ width: '0px' })
    '.\\#1hg5x5u{width:0px}',
  ])
})
