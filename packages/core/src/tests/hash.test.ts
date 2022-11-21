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
  assert.strictEqual(tw('flex text-center'), '#1mjcm6l #xwomwz')
  assert.deepEqual(tw.target, [
    '/*!dbgidc,v,flex*/.\\#1mjcm6l{display:flex}',
    '/*!dbgidc,y,text-center*/.\\#xwomwz{text-align:center}',
  ])
})

test('accept already hashed rules', () => {
  assert.strictEqual(tw('#1bk5mm5 #bibj42'), '#1bk5mm5 #bibj42')
  assert.deepEqual(tw.target, [])
})

test('different variant produce different hashes', () => {
  assert.strictEqual(tw('sm:text-center lg:text-center'), '#1t8l2lu #1b1gwwj')
  assert.deepEqual(tw.target, [
    '/*!eupiio,y,sm:text-center*/@media (min-width:640px){.\\#1t8l2lu{text-align:center}}',
    '/*!f277k0,y,lg:text-center*/@media (min-width:1024px){.\\#1b1gwwj{text-align:center}}',
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
    '/*!fjd9fk,v,css#1gdx1hc*/.\\#e55o0r{animation:\\#1hjufz5 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite}',
  ])
})

test('same style in different layers has different hash', () => {
  assert.strictEqual(
    tw(`w-0 ${css({ width: '0px' })} ${shortcut(`w-0`)}`),
    '#1wdxrmr #7ik80s #q8j53i',
  )
  assert.deepEqual(tw.target, [
    '/*!b3jrb4,0,~(w-0)*/.\\#1wdxrmr{width:0px}',
    '/*!dbgidc,v,w-0*/.\\#7ik80s{width:0px}',
    '/*!fjd9fk,v,css#1qxe0w9*/.\\#q8j53i{width:0px}',
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
