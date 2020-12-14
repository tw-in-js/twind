import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { JSDOM } from 'jsdom'

import { create, strict } from '..'

const test = suite<{
  dom: JSDOM
}>('dom')

test.before.each((context) => {
  context.dom = new JSDOM(`<!DOCTYPE html>`)
  global.window = (context.dom.window as unknown) as typeof globalThis['window']
  global.self = window
  global.document = window.document
  global.navigator = window.navigator
  global.getComputedStyle = window.getComputedStyle
})

test('injects in to a style sheet element', () => {
  const nonce = Math.random().toString(36)

  const { tw, setup } = create()

  assert.not.ok(document.querySelector('#__tw-in-js'))

  setup({ nonce, mode: strict, preflight: false })

  const style = document.querySelector('#__tw-in-js') as HTMLStyleElement

  assert.is(style.tagName, 'STYLE')
  assert.is(style.nonce, nonce)

  assert.is(tw('group flex text-center md:text-left'), 'group flex text-center md:text-left')

  assert.equal(
    [...(style.sheet?.cssRules || [])].map((rule) => rule.cssText),
    [
      '.flex {display: flex;}',
      '.text-center {text-align: center;}',
      '@media (min-width: 768px) {.md\\:text-left {text-align: left;}}',
    ],
  )

  // re-use existing stylesheet
  const { tw: tw2 } = create({ mode: strict, preflight: false })

  assert.is(tw2('group flex text-center md:text-left'), 'group flex text-center md:text-left')

  assert.is(document.querySelectorAll('#__tw-in-js').length, 1)

  assert.equal(
    [...(style.sheet?.cssRules || [])].map((rule) => rule.cssText),
    [
      '.flex {display: flex;}',
      '.text-center {text-align: center;}',
      '@media (min-width: 768px) {.md\\:text-left {text-align: left;}}',
      '.flex {display: flex;}',
      '.text-center {text-align: center;}',
      '@media (min-width: 768px) {.md\\:text-left {text-align: left;}}',
    ],
  )
})

test.run()
