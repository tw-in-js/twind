import { assert, test, afterEach } from 'vitest'

import { twind, virtual } from 'twind'

import presetTailwind from '@twind/preset-tailwind'
import presetExt from '.'
import data from './preset-ext.test.json'

const tw = twind(
  {
    presets: [presetExt(), presetTailwind({ enablePreflight: false })],
    variants: [['not-logged-in', 'body:not(.logged-in) &']],
  },
  virtual(),
)

afterEach(() => tw.clear())

Object.entries(data)
  .filter(([tokens]) => !tokens.startsWith('//'))
  .map(([tokens, declarations]): [string, string, string[]] => {
    if (Array.isArray(declarations)) {
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

test('dark class using peer', () => {
  const tw = twind(
    {
      presets: [presetExt(), presetTailwind({ enablePreflight: false })],
      darkMode: 'class',
    },
    virtual(),
  )

  assert.strictEqual(tw('dark:group-hocus:underline'), 'dark:group-hocus:underline')
  assert.deepEqual(tw.target, [
    '.dark .group:is(:hover,:focus-visible) .dark\\:group-hocus\\:underline{text-decoration:underline}',
  ])
})
