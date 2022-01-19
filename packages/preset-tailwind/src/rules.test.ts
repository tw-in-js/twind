import { assert, test, afterEach } from 'vitest'

import { twind, virtual } from 'twind'

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
      // Some shortcuts
      {
        // single utility alias
        red: 'text-red-100',

        // shortcuts to multiple utilities
        btn: 'py-2 px-4 font-semibold rounded-lg shadow-md',
        'btn-green': 'text-white bg-green-500 hover:bg-green-700',

        // dynamic shortcut — could be a rule as well
        'btn-': ({ $$ }) => `bg-${$$}-400 text-${$$}-100 py-2 px-4 rounded-lg`,
      },
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
