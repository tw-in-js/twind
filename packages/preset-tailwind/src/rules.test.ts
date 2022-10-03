import { assert, test, afterEach } from 'vitest'

import { apply, css, cx, style, twind, virtual } from 'twind'

import tailwind from '.'
import data from './rules.test.json'

const tw = twind(
  {
    presets: [tailwind({ disablePreflight: true })],
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
        colors: ({ theme }) => ({
          gainsboro: 'gainsboro',
          'gray-light': '#d3dce6',
          primary: 'rgb(var(--color-primary) / <alpha-value>)',
          translucent: {
            rose: 'theme(colors.rose.500 / 50%)',
            blue: 'theme(colors.blue.500 / var(--my-alpha))',
            emerald: theme('colors.emerald.500 / theme(opacity.50)'),
          },
        }),
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

      // Using css
      [
        'target-new-tab',
        css`
          target-name: new;
          target-new: tab;
        `,
      ],
      // dynamic
      [
        'target-new-(tab|window)',
        ({ 1: $1 }) => css`
          target-name: new;
          target-new: ${$1};
        `,
      ],

      // Using cx
      ['highlight(-rounded)?', ({ 1: rounded }) => cx({ 'bg-yellow-200': true, rounded })],

      // Using style
      // box?color=coral&rounded
      // box?color=purple&rounded=md
      [
        'box\\?(.+)',
        style({
          props: {
            color: {
              coral: css({
                backgroundColor: 'coral',
              }),
              purple: css`
                background-color: purple;
              `,
            },
            rounded: {
              '': 'rounded',
              md: 'rounded-md',
            },
          },
        }),
      ],
    ],
  },
  virtual(),
)

afterEach(() => tw.clear())

Object.entries(data)
  .filter(([tokens]) => !tokens.startsWith('//'))
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
    '*,::before,::after,::backdrop{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.\\@\\(blur-sm\\){--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
  ])

  tw.clear()

  assert.strictEqual(tw(apply`blur-sm`), '@(blur-sm)')
  assert.deepEqual(tw.target, [
    '*,::before,::after,::backdrop{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.\\@\\(blur-sm\\){--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
  ])

  tw.clear()

  assert.strictEqual(tw('Filter@(blur-sm)'), 'Filter#8p7q4s')
  assert.deepEqual(tw.target, [
    '*,::before,::after,::backdrop{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.Filter\\#8p7q4s{--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
  ])

  tw.clear()

  assert.strictEqual(tw(apply.Filter`blur-sm`), 'Filter#8p7q4s')
  assert.deepEqual(tw.target, [
    '*,::before,::after,::backdrop{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.Filter\\#8p7q4s{--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
  ])

  tw.clear()

  assert.strictEqual(tw('@(filter blur-sm)'), '@(filter,blur-sm)')
  assert.deepEqual(tw.target, [
    '*,::before,::after,::backdrop{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.\\@\\(filter\\,blur-sm\\){filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
  ])

  tw.clear()

  assert.strictEqual(tw('@(blur-sm filter)'), '@(blur-sm,filter)')
  assert.deepEqual(tw.target, [
    '*,::before,::after,::backdrop{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.\\@\\(blur-sm\\,filter\\){--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
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
    '.underline{text-decoration-line:underline}',
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
    '.\\@\\(opacity-50\\,underline\\,text-\\[2rem\\]\\,bg-blue-500\\,m-\\[\\.2rem\\]\\,hover\\:opacity-90\\,max-w-\\[500px\\]\\){opacity:0.5;text-decoration-line:underline;font-size:2rem;--tw-bg-opacity:1;background-color:rgba(59,130,246,var(--tw-bg-opacity));margin:.2rem}',
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
    '.Named\\#11t9suh{opacity:0.5;text-decoration-line:underline;font-size:2rem;--tw-bg-opacity:1;background-color:rgba(59,130,246,var(--tw-bg-opacity));margin:.2rem}',
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
    '.\\@\\(opacity-50\\,underline\\,text-\\[2rem\\]\\,bg-blue-500\\,m-\\[\\.2rem\\]\\,hover\\:opacity-90\\,max-w-\\[500px\\]\\){opacity:0.5;text-decoration-line:underline;font-size:2rem;--tw-bg-opacity:1;background-color:rgba(59,130,246,var(--tw-bg-opacity));margin:.2rem}',
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
    '.Named\\#11t9suh{opacity:0.5;text-decoration-line:underline;font-size:2rem;--tw-bg-opacity:1;background-color:rgba(59,130,246,var(--tw-bg-opacity));margin:.2rem}',
    '.Named\\#11t9suh{max-width:500px}',
    '.Named\\#11t9suh:hover{opacity:0.9}',
  ])
})

test('group and peer marker classes', () => {
  assert.strictEqual(tw('group'), 'group')
  assert.strictEqual(tw('group-hover:underline'), 'group-hover:underline')
  assert.deepEqual(tw.target, [
    '.group:hover .group-hover\\:underline{text-decoration-line:underline}',
  ])

  tw.clear()

  assert.strictEqual(tw('peer'), 'peer')
  assert.strictEqual(tw('peer[disabled]:underline'), 'peer[disabled]:underline')
  assert.deepEqual(tw.target, [
    '.peer[disabled]~.peer\\[disabled\\]\\:underline{text-decoration-line:underline}',
  ])

  tw.clear()

  assert.strictEqual(tw('group~name'), 'group~name')
  assert.strictEqual(tw('group~name[disabled]:underline'), 'group~name[disabled]:underline')
  assert.deepEqual(tw.target, [
    '.group\\~name[disabled] .group\\~name\\[disabled\\]\\:underline{text-decoration-line:underline}',
  ])

  tw.clear()

  assert.strictEqual(tw('peer~name'), 'peer~name')
  assert.strictEqual(tw('peer~name-focus-visible:underline'), 'peer~name-focus-visible:underline')
  assert.deepEqual(tw.target, [
    '.peer\\~name:focus-visible~.peer\\~name-focus-visible\\:underline{text-decoration-line:underline}',
  ])
})

test('group and peer hashed marker classes', () => {
  const tw = twind(
    {
      presets: [tailwind({ disablePreflight: true })],
      hash: true,
    },
    virtual(),
  )

  assert.strictEqual(tw('group'), '#1bk5mm5')
  assert.strictEqual(tw('group-hover:underline'), '#1o9546u')
  assert.deepEqual(tw.target, ['.\\#1bk5mm5:hover .\\#1o9546u{text-decoration-line:underline}'])

  tw.clear()

  assert.strictEqual(tw('peer'), '#p4d4mm')
  assert.strictEqual(tw('peer-focus:underline'), '#c809fj')
  assert.deepEqual(tw.target, ['.\\#p4d4mm:focus~.\\#c809fj{text-decoration-line:underline}'])

  tw.clear()

  assert.strictEqual(tw('group~name'), '#1uaq32w')
  assert.strictEqual(tw('group~name-focus:underline'), '#cj7dm')
  assert.deepEqual(tw.target, ['.\\#1uaq32w:focus .\\#cj7dm{text-decoration-line:underline}'])

  tw.clear()

  assert.strictEqual(tw('peer~name'), '#1krcwoi')
  assert.strictEqual(tw('peer~name[disabled]:underline'), '#1tsl4h5')
  assert.deepEqual(tw.target, ['.\\#1krcwoi[disabled]~.\\#1tsl4h5{text-decoration-line:underline}'])
})

test('arbitrary variants with @apply', () => {
  const style = css({
    '@apply': '[@media_screen{@media(hover:hover){&:hover}}]:underline',
  })

  assert.strictEqual(style, 'css#itthsz')

  assert.strictEqual(tw(style), 'css#itthsz')

  assert.deepEqual(tw.target, [
    '@media screen{@media(hover:hover){.css\\#itthsz:hover{text-decoration-line:underline}}}',
  ])
})

test('font-size utilities can include a font-weight', () => {
  const tw = twind(
    {
      presets: [tailwind({ disablePreflight: true })],
      theme: {
        fontSize: {
          sm: '12px',
          md: ['16px', { lineHeight: '24px', fontWeight: 500 }],
          lg: ['20px', { lineHeight: '28px', fontWeight: 'bold' }],
        },
      },
    },
    virtual(),
  )

  assert.strictEqual(tw('text-sm text-md text-lg'), 'text-lg text-md text-sm')
  assert.deepEqual(tw.target, [
    '.text-lg{font-size:20px;line-height:28px;font-weight:bold}',
    '.text-md{font-size:16px;line-height:24px;font-weight:500}',
    '.text-sm{font-size:12px}',
  ])
})
