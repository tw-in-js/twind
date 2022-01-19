// @vitest-environment happy-dom

import { assert, test } from 'vitest'

import { dom, stringify } from '..'

test('uses DOM nodes', () => {
  // we need atleast one node within head
  document.head.append(document.createTextNode(''))

  assert.lengthOf(document.styleSheets, 0)

  const sheet = dom()

  // is already injected
  assert.lengthOf(document.styleSheets, 1)

  sheet.insert('*{}', 0, { r: ['*'], p: 0, o: 0 })

  assert.strictEqual(stringify(sheet.target), '*{}')
  assert.strictEqual(stringify(document.styleSheets[0]).replace(/ /g, ''), '*{}')
})
