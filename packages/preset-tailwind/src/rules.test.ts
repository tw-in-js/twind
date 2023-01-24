import { assert, test, afterEach } from 'vitest'

import { apply, css, cx, style, twind, virtual } from '@twind/core'

import tailwind from '.'
import data from './rules.test.json'

const tw = twind(
  {
    presets: [tailwind({ disablePreflight: true })],
    variants: [['not-logged-in', 'body:not(.logged-in) &']],
    theme: {
      supports: {
        grid: 'display: grid',
      },
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
        aria: {
          asc: 'sort="ascending"',
          desc: 'sort="descending"',
        },
        data: {
          checked: 'ui~="checked"',
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
        margin: {
          min: 'min(100vmin, 3rem)',
          max: 'max(100vmax, 3rem)',
          clamp: 'clamp(1rem, 100vh, 3rem)',
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
    '*,::before,::after{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '::backdrop{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.\\@\\(blur-sm\\){--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
  ])

  tw.clear()

  assert.strictEqual(tw(apply`blur-sm`), '@(blur-sm)')
  assert.deepEqual(tw.target, [
    '*,::before,::after{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '::backdrop{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.\\@\\(blur-sm\\){--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
  ])

  tw.clear()

  assert.strictEqual(tw('Filter@(blur-sm)'), 'Filter#8p7q4s')
  assert.deepEqual(tw.target, [
    '*,::before,::after{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '::backdrop{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.Filter\\#8p7q4s{--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
  ])

  tw.clear()

  assert.strictEqual(tw(apply.Filter`blur-sm`), 'Filter#8p7q4s')
  assert.deepEqual(tw.target, [
    '*,::before,::after{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '::backdrop{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.Filter\\#8p7q4s{--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
  ])

  tw.clear()

  assert.strictEqual(tw('@(filter blur-sm)'), '@(filter,blur-sm)')
  assert.deepEqual(tw.target, [
    '*,::before,::after{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '::backdrop{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '.\\@\\(filter\\,blur-sm\\){filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);--tw-blur:blur(4px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
  ])

  tw.clear()

  assert.strictEqual(tw('@(blur-sm filter)'), '@(blur-sm,filter)')
  assert.deepEqual(tw.target, [
    '*,::before,::after{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '::backdrop{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
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

  tw.clear()

  assert.strictEqual(tw('group/label'), 'group/label')
  assert.strictEqual(tw('group[disabled]/label:underline'), 'group[disabled]/label:underline')
  assert.deepEqual(tw.target, [
    '.group\\/label[disabled] .group\\[disabled\\]\\/label\\:underline{text-decoration-line:underline}',
  ])

  tw.clear()

  assert.strictEqual(tw('peer/label'), 'peer/label')
  assert.strictEqual(tw('peer-focus-visible/label:underline'), 'peer-focus-visible/label:underline')
  assert.deepEqual(tw.target, [
    '.peer\\/label:focus-visible~.peer-focus-visible\\/label\\:underline{text-decoration-line:underline}',
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

  tw.clear()

  assert.strictEqual(tw('group/label'), '#ooal8')
  assert.strictEqual(tw('group[disabled]/label:underline'), '#v0jdie')
  assert.deepEqual(tw.target, ['.\\#ooal8[disabled] .\\#v0jdie{text-decoration-line:underline}'])

  tw.clear()

  assert.strictEqual(tw('peer/label'), '#1wrxcbs')
  assert.strictEqual(tw('peer-focus-visible/label:underline'), '#skcvd2')
  assert.deepEqual(tw.target, [
    '.\\#1wrxcbs:focus-visible~.\\#skcvd2{text-decoration-line:underline}',
  ])
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

test('after and before content hashed', () => {
  const tw = twind(
    {
      presets: [tailwind({ disablePreflight: true })],
      hash: true,
    },
    virtual(),
  )

  assert.strictEqual(tw('before:block'), '#1r4qyix')
  assert.strictEqual(tw('after:block'), '#qwvwoi')
  assert.deepEqual(tw.target, [
    '.\\#qwvwoi::after{content:var(--328t5w);display:block}',
    '.\\#1r4qyix::before{content:var(--328t5w);display:block}',
  ])
})

test('hashed supports', () => {
  const tw = twind(
    {
      presets: [tailwind({ disablePreflight: true })],
      hash: true,
    },
    virtual(),
  )

  assert.strictEqual(tw('supports-[grid]:underline'), '#13gfo47')
  assert.deepEqual(tw.target, [
    '@supports (grid:var(--tw)){.\\#13gfo47{text-decoration-line:underline}}',
  ])
})

test('hashed animate', () => {
  const tw = twind(
    {
      presets: [tailwind({ disablePreflight: true })],
      hash: true,
    },
    virtual(),
  )

  assert.strictEqual(tw('animate-spin'), '#1gsib12')
  assert.deepEqual(tw.target, [
    '@keyframes \\#1mm0hdv{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
    '.\\#1gsib12{animation:\\#1mm0hdv 1s linear infinite}',
  ])
})

test('font-family utilities can be defined as a string', () => {
  const tw = twind(
    {
      presets: [tailwind({ disablePreflight: true })],
      theme: {
        fontFamily: {
          sans: 'Helvetica, Arial, sans-serif',
        },
      },
    },
    virtual(),
  )

  assert.strictEqual(tw('font-sans'), 'font-sans')
  assert.deepEqual(tw.target, ['.font-sans{font-family:Helvetica, Arial, sans-serif}'])
})

test('font-family utilities can be defined as an array', () => {
  const tw = twind(
    {
      presets: [tailwind({ disablePreflight: true })],
      theme: {
        fontFamily: {
          sans: ['Helvetica', 'Arial', 'sans-serif'],
        },
      },
    },
    virtual(),
  )

  assert.strictEqual(tw('font-sans'), 'font-sans')
  assert.deepEqual(tw.target, ['.font-sans{font-family:Helvetica,Arial,sans-serif}'])
})

test('font-family values are not automatically escaped', () => {
  const tw = twind(
    {
      presets: [tailwind({ disablePreflight: true })],
      theme: {
        fontFamily: {
          sans: ["'Exo 2'", 'sans-serif'],
        },
      },
    },
    virtual(),
  )

  assert.strictEqual(tw('font-sans'), 'font-sans')
  assert.deepEqual(tw.target, [".font-sans{font-family:'Exo 2',sans-serif}"])
})

test('font-feature-settings can be provided when families are defined as a string', () => {
  const tw = twind(
    {
      presets: [tailwind({ disablePreflight: true })],
      theme: {
        fontFamily: {
          sans: ['Helvetica, Arial, sans-serif', { fontFeatureSettings: '"cv11", "ss01"' }],
        },
      },
    },
    virtual(),
  )

  assert.strictEqual(tw('font-sans'), 'font-sans')
  assert.deepEqual(tw.target, [
    `.font-sans{font-family:Helvetica, Arial, sans-serif;font-feature-settings:"cv11", "ss01"}`,
  ])
})

test('font-feature-settings can be provided when families are defined as an array', () => {
  const tw = twind(
    {
      presets: [tailwind({ disablePreflight: true })],
      theme: {
        fontFamily: {
          sans: [['Helvetica', 'Arial', 'sans-serif'], { fontFeatureSettings: '"cv11", "ss01"' }],
        },
      },
    },
    virtual(),
  )

  assert.strictEqual(tw('font-sans'), 'font-sans')
  assert.deepEqual(tw.target, [
    `.font-sans{font-family:Helvetica,Arial,sans-serif;font-feature-settings:"cv11", "ss01"}`,
  ])
})

test('font-feature-settings values can be retrieved', () => {
  const tw = twind(
    {
      presets: [tailwind({ disablePreflight: true })],
      theme: {
        fontFamily: {
          sans: ['Inter', { fontFeatureSettings: "'cv11'" }],
        },
      },
    },
    virtual(),
  )

  assert.strictEqual(
    tw(css`
      font-family: theme(fontFamily.sans);
      font-feature-settings: theme(fontFamily.sans[1].fontFeatureSettings, normal);
    `),
    'css#13n96aj',
  )
  assert.deepEqual(tw.target, [`.css\\#13n96aj{font-family:Inter;font-feature-settings:'cv11'}`])
})

test('auto content is only added to the "real" declaration', () => {
  const tw = twind(
    {
      presets: [tailwind()],
    },
    virtual(),
  )

  tw(`
    // without pseudo-element to ensure defaults are not added twice
    after:blur
    after:ordinal
    after:ring
    after:shadow
    after:snap-x
    after:touch-pan-x
    after:transform

    // these would add auto content to the defaults
    after:blur
    after:ordinal
    after:ring
    after:shadow
    after:snap-x
    after:touch-pan-x
    after:transform
  `)

  assert.deepEqual(tw.target, [
    '*,::before,::after{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '::backdrop{--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/)}',
    '*,::before,::after{--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-transform:translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}',
    '::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-transform:translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}',
    '*,::before,::after{--tw-ordinal:var(--tw-empty,/*!*/ /*!*/);--tw-slashed-zero:var(--tw-empty,/*!*/ /*!*/);--tw-numeric-figure:var(--tw-empty,/*!*/ /*!*/);--tw-numeric-spacing:var(--tw-empty,/*!*/ /*!*/);--tw-numeric-fraction:var(--tw-empty,/*!*/ /*!*/)}',
    '::backdrop{--tw-ordinal:var(--tw-empty,/*!*/ /*!*/);--tw-slashed-zero:var(--tw-empty,/*!*/ /*!*/);--tw-numeric-figure:var(--tw-empty,/*!*/ /*!*/);--tw-numeric-spacing:var(--tw-empty,/*!*/ /*!*/);--tw-numeric-fraction:var(--tw-empty,/*!*/ /*!*/)}',
    '*,::before,::after{--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0px;--tw-ring-offset-color:rgba(255,255,255,1);--tw-ring-color:rgba(59,130,246,var(--tw-ring-opacity));--tw-ring-opacity:0.5}',
    '::backdrop{--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0px;--tw-ring-offset-color:rgba(255,255,255,1);--tw-ring-color:rgba(59,130,246,var(--tw-ring-opacity));--tw-ring-opacity:0.5}',
    '*,::before,::after{--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}',
    '::backdrop{--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}',
    '*,::before,::after{--tw-pan-x:var(--tw-empty,/*!*/ /*!*/);--tw-pan-y:var(--tw-empty,/*!*/ /*!*/);--tw-pinch-zoom:var(--tw-empty,/*!*/ /*!*/);--tw-touch-action:var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)}',
    '::backdrop{--tw-pan-x:var(--tw-empty,/*!*/ /*!*/);--tw-pan-y:var(--tw-empty,/*!*/ /*!*/);--tw-pinch-zoom:var(--tw-empty,/*!*/ /*!*/);--tw-touch-action:var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)}',
    '*,::before,::after{--tw-scroll-snap-strictness:proximity}',
    '::backdrop{--tw-scroll-snap-strictness:proximity}',
    '*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}',
    "::before,::after{--tw-content:''}",
    'html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal}',
    'body{margin:0;line-height:inherit}',
    'hr{height:0;color:inherit;border-top-width:1px}',
    'abbr:where([title]){text-decoration:underline dotted}',
    'h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}',
    'a{color:inherit;text-decoration:inherit}',
    'b,strong{font-weight:bolder}',
    'code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-feature-settings:normal;font-size:1em}',
    'small{font-size:80%}',
    'sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}',
    'sub{bottom:-0.25em}',
    'sup{top:-0.5em}',
    'table{text-indent:0;border-color:inherit;border-collapse:collapse}',
    'button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:inherit;color:inherit;margin:0;padding:0}',
    'button,select{text-transform:none}',
    "button,[type='button'],[type='reset'],[type='submit']{-webkit-appearance:button;background-color:transparent;background-image:none}",
    ':-moz-focusring{outline:auto}',
    ':-moz-ui-invalid{box-shadow:none}',
    'progress{vertical-align:baseline}',
    '::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}',
    "[type='search']{-webkit-appearance:textfield;outline-offset:-2px}",
    '::-webkit-search-decoration{-webkit-appearance:none}',
    '::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}',
    'summary{display:list-item}',
    'blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}',
    'fieldset{margin:0;padding:0}',
    'legend{padding:0}',
    'ol,ul,menu{list-style:none;margin:0;padding:0}',
    'textarea{resize:vertical}',
    'input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}',
    'button,[role="button"]{cursor:pointer}',
    ':disabled{cursor:default}',
    'img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}',
    'img,video{max-width:100%;height:auto}',
    '[hidden]{display:none}',
    '.after\\:blur::after{content:var(--tw-content);--tw-blur:blur(8px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}',
    '.after\\:ring::after{content:var(--tw-content);--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}',
    '.after\\:shadow::after{content:var(--tw-content);--tw-shadow:0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}',
    '.after\\:transform::after{content:var(--tw-content);transform:var(--tw-transform)}',
    '.after\\:touch-pan-x::after{content:var(--tw-content);--tw-pan-x:pan-x;touch-action:var(--tw-touch-action)}',
    '.after\\:ordinal::after{content:var(--tw-content);--tw-ordinal:ordinal;font-variant-numeric:var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)}',
    '.after\\:snap-x::after{content:var(--tw-content);scroll-snap-type:x var(--tw-scroll-snap-strictness)}',
  ])
})
