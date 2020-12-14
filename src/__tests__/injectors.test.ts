import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { JSDOM } from 'jsdom'

import { noOpInjector, cssomInjector } from '..'

const test = suite<{
  dom: JSDOM
}>('injectors')

test.before.each((context) => {
  context.dom = new JSDOM(`<!DOCTYPE html>`)
  globalThis.window = (context.dom.window as unknown) as typeof globalThis['window']
  globalThis.self = (context.dom.window as unknown) as typeof globalThis['self']
  globalThis.document = window.document
})

test('noOpInjector', () => {
  const injector = noOpInjector()

  assert.is(injector.insert('', 0), undefined)
  assert.is(injector.target, null)
})

test('cssomInjector', () => {
  const injector = cssomInjector()

  assert.ok(injector.target)
  assert.is(injector.insert('html{padding:0}', 0), 0)
  assert.is(injector.insert('body{margin:0}', 1), 1)
  assert.is(injector.insert('*{margin:0}', 1), 1)

  const style = document.querySelector('#__tw-in-js') as HTMLStyleElement

  assert.is(style.tagName, 'STYLE')
  assert.is(style.nonce, '')

  assert.equal(
    [...(style.sheet?.cssRules || [])].map((rule) => rule.cssText),
    ['html {padding: 0;}', '* {margin: 0;}', 'body {margin: 0;}'],
  )
})

test.run()
