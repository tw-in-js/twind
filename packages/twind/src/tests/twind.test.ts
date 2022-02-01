import { assert, test, afterEach } from 'vitest'

import { twind, virtual } from '..'

const tw = twind(
  {
    rules: [['bg-', 'background']],
  },
  virtual(),
)

afterEach(() => tw.clear())

test('the config can accessed', () => {
  assert.isFunction(tw.config.stringify)
  assert.deepEqual(tw.config, {
    preflight: [],
    darkMode: undefined,
    theme: { extend: {} },
    variants: [['dark', '@media (prefers-color-scheme:dark)']],
    rules: [['bg-', 'background']],
    ignorelist: [],
    hash: undefined,
    stringify: tw.config.stringify,
  })
})
