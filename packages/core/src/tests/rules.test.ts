import { assert, test, afterEach } from 'vitest'

import { twind, virtual, css } from '..'

const tw = twind(
  {
    rules: [
      [
        'bg-',
        ({ $$ }) =>
          css`
            background-color: ${$$};
          `,
      ],
    ],
  },
  virtual(),
)

afterEach(() => tw.clear())

test('css in rule', () => {
  assert.strictEqual(tw('bg-red'), 'bg-red')

  assert.deepEqual(tw.target, ['.bg-red{background-color:red}'])
})
