// @vitest-environment happy-dom

import { assert, test } from 'vitest'

import { dom } from '..'

test('uses DOM nodes', () => {
  const sheet = dom()

  // lazy injected
  assert.isNull(document.querySelector('#tw'))

  sheet.insert('*{}', 0, { conditions: ['*'], precedence: 0, priority: 0 })

  assert.isDefined(sheet.target)

  assert.strictEqual(document.querySelector('#tw'), sheet.target)
  assert.property(document.querySelector('#tw'), 'innerHTML', '*{}')
})
