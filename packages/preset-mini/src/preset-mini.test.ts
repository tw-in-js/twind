import { assert, test, afterEach } from 'vitest'

import { twind, virtual } from '@twind/core'

import presetMini from '.'
import data from './preset-mini.test.json'

const tw = twind(
  {
    presets: [presetMini()],
  },
  virtual(),
)

afterEach(() => tw.clear())

Object.entries(data)
  .map(([tokens, declarations]): [string, string, string[]] => {
    if (Array.isArray(declarations)) {
      return Array.isArray(declarations[1])
        ? [tokens, declarations[0] as string, declarations[1]]
        : [tokens, tokens, declarations as string[]]
    }

    return [tokens, tokens, [declarations]]
  })
  .forEach(([tokens, classNames, rules]) =>
    test.todo(`${JSON.stringify(tokens)} => ${classNames}`, () => {
      assert.strictEqual(tw.inject(tokens), classNames)
      assert.deepEqual(tw.target, rules)

      // Cached access
      assert.strictEqual(tw.inject(tokens), classNames)
      assert.deepEqual(tw.target, rules)
    }),
  )
