// @vitest-environment happy-dom

import { assert, test } from 'vitest'

import { cssom } from '..'

test.todo('until https://github.com/capricorn86/happy-dom/pull/333', () => {
  const sheet = cssom()

  // lazy injected
  assert.isNull(document.querySelector('#tw'))

  sheet.insert('*{}', 0, { r: ['*'], p: 0, o: 0 })

  assert.isDefined(sheet.target)

  assert.strictEqual(document.styleSheets[0], sheet.target)
  assert.strictEqual((document.querySelector('#tw') as HTMLStyleElement).sheet, sheet.target)

  assert.deepEqual(
    [...(document.styleSheets[0]?.cssRules || [])].map((rule) => rule.cssText),
    ['*{}'],
  )
})
