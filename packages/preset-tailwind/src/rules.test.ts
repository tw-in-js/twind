import { assert, test, afterEach } from 'vitest'

import { apply, twind, virtual } from 'twind'

import tailwind from '.'
import data from './rules.test.json'

const tw = twind(
  {
    presets: [tailwind({ enablePreflight: false })],
    variants: [['not-logged-in', 'body:not(.logged-in) &']],
    theme: {
      extend: {
        screens: {
          '<sm': { max: '399px' },
          'md>': { min: '768px' },
          standalone: { raw: '(display-mode:standalone)' },
          special: [
            // Sidebar appears at 768px, so revert to `sm:` styles between 768px
            // and 868px, after which the main content area is wide enough again to
            // apply the `md:` styles.
            { min: '668px', max: '767px' },
            { min: '868px' },
          ],
        },
        colors: {
          gainsboro: 'gainsboro',
          'gray-light': '#d3dce6',
        },
        backgroundImage: {
          'hero-pattern': "url('/img/hero-pattern.svg')",
        },
        gridTemplateColumns: {
          // Complex site-specific column configuration
          footer: '200px minmax(900px, 1fr) 100px',
        },
        gridTemplateRows: {
          // Complex site-specific row configuration
          layout: '200px minmax(900px, 1fr) 100px',
        },
        gridAutoColumns: {
          '2fr': 'minmax(0,2fr)',
          '100px-max': 'minmax(100px,max-content)',
        },
        gridAutoRows: {
          '2fr': 'minmax(0,2fr)',
        },
      },
    },
    rules: [
      // Some aliases
      // shortcut to multiple utilities
      ['card', 'py-2 px-4 font-semibold rounded-lg shadow-md'],

      // dynamic shortcut
      ['card-', ({ $$ }) => `bg-${$$}-400 text-${$$}-100 py-2 px-4 rounded-lg`],

      // single utility alias — need to use `~(...)` as it would be otherwise recognized as a CSS property
      ['red', '~(text-red-100)'],

      // apply to multiple utilities
      ['btn-green', '@(bg-green-500 hover:bg-green-700 text-white)'],

      // dynamic apply
      ['btn-', ({ $$ }) => `@(bg-${$$}-400 text-${$$}-100 py-2 px-4 rounded-lg)`],
    ],
  },
  virtual(),
)

afterEach(() => tw.clear())

Object.entries(data)
  .map(([tokens, declarations]): [string, string, string[]] => {
    if (Array.isArray(declarations)) {
      // "group hover:bg-surface": [
      //   "group hover:bg-surface",
      //   [".hover\\:bg-surface:hover{background-color:#fff;color:#111}"]
      // ],
      return Array.isArray(declarations[1])
        ? [tokens, declarations[0] as string, declarations[1]]
        : [tokens, tokens, declarations as string[]]
    }

    return [tokens, tokens, [declarations]]
  })
  .forEach(([tokens, classNames, rules]) =>
    test(`${JSON.stringify(tokens)} => ${classNames}`, () => {
      assert.strictEqual(tw(tokens), classNames)
      assert.deepEqual(tw.target, rules)

      // Cached access
      assert.strictEqual(tw(tokens), classNames)
      assert.deepEqual(tw.target, rules)
    }),
  )

test('apply with filters', () => {
  assert.strictEqual(tw('@(blur-sm)'), '@(blur-sm)')
  assert.deepEqual(tw.target, [
    '*,::before,::after{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.\\@\\(blur-sm\\){--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
  ])

  tw.clear()

  assert.strictEqual(tw(apply`blur-sm`), '@(blur-sm)')
  assert.deepEqual(tw.target, [
    '*,::before,::after{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.\\@\\(blur-sm\\){--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
  ])

  tw.clear()

  assert.strictEqual(tw('Filter@(blur-sm)'), 'Filter#8p7q4s')
  assert.deepEqual(tw.target, [
    '*,::before,::after{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.Filter\\#8p7q4s{--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
  ])

  tw.clear()

  assert.strictEqual(tw(apply.Filter`blur-sm`), 'Filter#8p7q4s')
  assert.deepEqual(tw.target, [
    '*,::before,::after{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.Filter\\#8p7q4s{--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
  ])

  tw.clear()

  assert.strictEqual(tw('@(filter blur-sm)'), '@(filter,blur-sm)')
  assert.deepEqual(tw.target, [
    '*,::before,::after{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.\\@\\(filter\\,blur-sm\\){filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
    '.\\@\\(filter\\,blur-sm\\){--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
  ])

  tw.clear()

  assert.strictEqual(tw('@(blur-sm filter)'), '@(blur-sm,filter)')
  assert.deepEqual(tw.target, [
    '*,::before,::after{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.\\@\\(blur-sm\\,filter\\){--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
    '.\\@\\(blur-sm\\,filter\\){filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
  ])
})

test('apply with dynamic values', () => {
  assert.strictEqual(
    tw('opacity-50 underline text-[2rem] bg-blue-500 m-[.2rem] hover:(opacity-90) max-w-[500px]'),
    'm-[.2rem] opacity-50 bg-blue-500 max-w-[500px] text-[2rem] underline hover:opacity-90',
  )
  assert.deepEqual(tw.target, [
    '.m-\\[\\.2rem\\]{margin:.2rem}',
    '.opacity-50{opacity:0.5}',
    '.bg-blue-500{--tw-bg-opacity:1;background-color:rgba(59,130,246,var(--tw-bg-opacity))}',
    '.max-w-\\[500px\\]{max-width:500px}',
    '.text-\\[2rem\\]{font-size:2rem}',
    '.underline{text-decoration:underline}',
    '.hover\\:opacity-90:hover{opacity:0.9}',
  ])

  tw.clear()

  assert.strictEqual(
    tw(
      '@(opacity-50 underline text-[2rem] bg-blue-500 m-[.2rem] hover:(opacity-90) max-w-[500px])',
    ),
    '@(opacity-50,underline,text-[2rem],bg-blue-500,m-[.2rem],hover:opacity-90,max-w-[500px])',
  )
  assert.deepEqual(tw.target, [
    '.\\@\\(opacity-50\\,underline\\,text-\\[2rem\\]\\,bg-blue-500\\,m-\\[\\.2rem\\]\\,hover\\:opacity-90\\,max-w-\\[500px\\]\\){opacity:0.5;text-decoration:underline;font-size:2rem;--tw-bg-opacity:1;background-color:rgba(59,130,246,var(--tw-bg-opacity));margin:.2rem}',
    '.\\@\\(opacity-50\\,underline\\,text-\\[2rem\\]\\,bg-blue-500\\,m-\\[\\.2rem\\]\\,hover\\:opacity-90\\,max-w-\\[500px\\]\\){max-width:500px}',
    '.\\@\\(opacity-50\\,underline\\,text-\\[2rem\\]\\,bg-blue-500\\,m-\\[\\.2rem\\]\\,hover\\:opacity-90\\,max-w-\\[500px\\]\\):hover{opacity:0.9}',
  ])

  tw.clear()

  assert.strictEqual(
    tw(
      'Named@(opacity-50 underline text-[2rem] bg-blue-500 m-[.2rem] hover:(opacity-90) max-w-[500px])',
    ),
    'Named#11t9suh',
  )
  assert.deepEqual(tw.target, [
    '.Named\\#11t9suh{opacity:0.5;text-decoration:underline;font-size:2rem;--tw-bg-opacity:1;background-color:rgba(59,130,246,var(--tw-bg-opacity));margin:.2rem}',
    '.Named\\#11t9suh{max-width:500px}',
    '.Named\\#11t9suh:hover{opacity:0.9}',
  ])

  tw.clear()

  assert.strictEqual(
    tw(
      apply`opacity-50 underline text-[2rem] bg-blue-500 m-[.2rem] hover:(opacity-90) max-w-[500px]`,
    ),
    '@(opacity-50,underline,text-[2rem],bg-blue-500,m-[.2rem],hover:opacity-90,max-w-[500px])',
  )
  assert.deepEqual(tw.target, [
    '.\\@\\(opacity-50\\,underline\\,text-\\[2rem\\]\\,bg-blue-500\\,m-\\[\\.2rem\\]\\,hover\\:opacity-90\\,max-w-\\[500px\\]\\){opacity:0.5;text-decoration:underline;font-size:2rem;--tw-bg-opacity:1;background-color:rgba(59,130,246,var(--tw-bg-opacity));margin:.2rem}',
    '.\\@\\(opacity-50\\,underline\\,text-\\[2rem\\]\\,bg-blue-500\\,m-\\[\\.2rem\\]\\,hover\\:opacity-90\\,max-w-\\[500px\\]\\){max-width:500px}',
    '.\\@\\(opacity-50\\,underline\\,text-\\[2rem\\]\\,bg-blue-500\\,m-\\[\\.2rem\\]\\,hover\\:opacity-90\\,max-w-\\[500px\\]\\):hover{opacity:0.9}',
  ])

  tw.clear()

  assert.strictEqual(
    tw(
      apply.Named`opacity-50 underline text-[2rem] bg-blue-500 m-[.2rem] hover:(opacity-90) max-w-[500px]`,
    ),
    'Named#11t9suh',
  )
  assert.deepEqual(tw.target, [
    '.Named\\#11t9suh{opacity:0.5;text-decoration:underline;font-size:2rem;--tw-bg-opacity:1;background-color:rgba(59,130,246,var(--tw-bg-opacity));margin:.2rem}',
    '.Named\\#11t9suh{max-width:500px}',
    '.Named\\#11t9suh:hover{opacity:0.9}',
  ])
})
