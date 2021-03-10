import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import * as DOM from '../__fixtures__/dom-env'

import { voidSheet, cssomSheet } from 'twind'

const test = DOM.configure(suite('sheets'))

test('voidSheet', () => {
  const sheet = voidSheet()

  assert.is(sheet.insert('', 0), undefined)
})

test('cssomSheet', () => {
  const sheet = cssomSheet()

  assert.is(sheet.insert('html{padding:0}', 0), 0)
  assert.is(sheet.insert('body{margin:0}', 1), 1)
  assert.is(sheet.insert('*{margin:0}', 1), 1)

  const style = document.querySelector('#__twind') as HTMLStyleElement

  assert.is(style.tagName, 'STYLE')
  assert.is(style.nonce, '')

  assert.equal(
    [...(style.sheet?.cssRules || [])].map((rule) => rule.cssText),
    ['html {padding: 0;}', '* {margin: 0;}', 'body {margin: 0;}'],
  )
})

test.run()
