// @vitest-environment happy-dom

import { assert, test } from 'vitest'

import { cssom } from '..'

test.todo('use happy-dom in this test file', () => {
  const sheet = cssom()

  // lazy injected
  assert.isNull(document.querySelector('#tw'))

  sheet.insert('*{}', 0, { r: ['*'], p: 0, o: 0 })

  assert.isDefined(sheet.target)

  console.log(document.documentElement.innerHTML)
  console.log([...sheet.target.cssRules].map((rule) => rule.cssText))
  console.log(
    [...((document.querySelector('#tw') as HTMLStyleElement).sheet?.cssRules || [])].map(
      (rule) => rule.cssText,
    ),
  )
  assert.deepEqual(
    [...((document.querySelector('#tw') as HTMLStyleElement).sheet?.cssRules || [])].map(
      (rule) => rule.cssText,
    ),
    ['*{}'],
  )
})
