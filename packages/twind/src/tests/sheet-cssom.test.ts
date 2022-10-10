// @vitest-environment happy-dom

import { assert, test } from 'vitest'

import { cssom, stringify } from '..'

test('uses CSSOM', () => {
  // we need at least one node within head
  document.head.append(document.createTextNode(''))

  assert.lengthOf(document.styleSheets, 0)

  const sheet = cssom()

  // is already injected
  assert.lengthOf(document.styleSheets, 1)

  sheet.insert('*{}', 0, { p: 0, o: 0 })

  assert.strictEqual(document.styleSheets[0], sheet.target)
  assert.strictEqual(stringify(sheet.target).replace(/ /g, ''), '*{}')
})
