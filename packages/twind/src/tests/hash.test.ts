import { assert, test, afterEach } from 'vitest'

import { twind, virtual, fromTheme, shortcut, css, keyframes } from '..'

const tw = twind(
  {
    hash: true,
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
  virtual(true),
)

afterEach(() => tw.clear())

test('class names are hashed', () => {
  assert.strictEqual(tw('flex text-center'), '#e9txhd #1vaw68m')
  assert.deepEqual(tw.target, [
    '/*!dbgidc,v,#e9txhd*/.\\#e9txhd{display:flex}',
    '/*!0,y,#1vaw68m*/.\\#1vaw68m{text-align:center}',
  ])
})

test('accept already hashed rules', () => {
  assert.strictEqual(tw('#1bk5mm5 #bibj42'), '#1bk5mm5 #bibj42')
  assert.deepEqual(tw.target, [])
})

test('different variant produce different hashes', () => {
  assert.strictEqual(tw('sm:text-center lg:text-center'), '#7n36h2 #18xkmkh')
  assert.deepEqual(tw.target, [
    '/*!epppts,y,#7n36h2*/@media (min-width:640px){.\\#7n36h2{text-align:center}}',
    '/*!4zsow,y,#18xkmkh*/@media (min-width:1024px){.\\#18xkmkh{text-align:center}}',
  ])
})

test('keyframes are hashed', () => {
  const breath = keyframes.bind(tw)({
    '0%': {
      transform: 'scaleY(1)',
    },
    '50%,100%': {
      transform: 'scaleY(0.5)',
    },
  })

  assert.strictEqual(
    tw(
      css`
        animation: ${breath} 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
      `,
    ),
    '#e55o0r',
  )
  assert.deepEqual(tw.target, [
    '/*!0,0*/@keyframes \\#1hjufz5{0%{transform:scaleY(1)}50%,100%{transform:scaleY(0.5)}}',
    '/*!fjd9fk,v,#e55o0r*/.\\#e55o0r{animation:\\#1hjufz5 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite}',
  ])
})

test('same style in different layers has different hash', () => {
  assert.strictEqual(
    tw(`w-0 ${css({ width: '0px' })} ${shortcut(`w-0`)}`),
    '#1wdxrmr #xs3c6s #q8j53i',
  )
  assert.deepEqual(tw.target, [
    // apply(`w-0`)
    '/*!b3jrb4,0,#1wdxrmr*/.\\#1wdxrmr{width:0px}',
    // w-0
    '/*!27wr28,v,#xs3c6s*/.\\#xs3c6s{width:0px}',
    // css({ width: '0px' })
    '/*!27wr28,v,#q8j53i*/.\\#q8j53i{width:0px}',
  ])
})

test('hash shortcut only', () => {
  const tw = twind(
    {
      hash(className, defaultHash) {
        if (/^[~@]\(/.test(className)) {
          // a shortcut like `~(...)` or `Button~(...)`
          return defaultHash(className)
        }

        return className
      },
      theme: {
        spacing: {
          0: '0px',
        },
      },
      rules: [['w-', fromTheme('spacing', 'width')]],
    },
    virtual(),
  )

  assert.strictEqual(
    tw(`w-0 ${css({ width: '0px' })} ${shortcut(`w-0`)}`),
    '#1wdxrmr w-0 css#1qxe0w9',
  )
  assert.deepEqual(tw.target, [
    // apply(`w-0`)
    '.\\#1wdxrmr{width:0px}',
    // w-0
    '.w-0{width:0px}',
    // css({ width: '0px' })
    '.css\\#1qxe0w9{width:0px}',
  ])
})
