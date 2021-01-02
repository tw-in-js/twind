import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import * as DOM from '../__fixtures__/dom-env'

import { create, strict } from '../index'
import { domSheet } from './index'

const test = DOM.configure(suite('domSheet'))

test('injects in to a style sheet element', () => {
  const nonce = Math.random().toString(36)

  const { tw, setup } = create()

  assert.not.ok(document.querySelector('#__twind'))

  setup({ sheet: domSheet({ nonce }), mode: strict, preflight: false })

  const style = document.querySelector('#__twind') as HTMLStyleElement

  assert.is(style.tagName, 'STYLE')
  assert.is(style.nonce, nonce)

  assert.is(tw('group flex text-center md:text-left'), 'group flex text-center md:text-left')

  assert.is(
    style.textContent,
    [
      '.flex{display:flex}',
      '.text-center{text-align:center}',
      '@media (min-width: 768px){.md\\:text-left{text-align:left}}',
    ].join(''),
  )

  // re-use existing stylesheet
  const { tw: tw2 } = create({ sheet: domSheet({ nonce }), mode: strict, preflight: false })

  assert.is(tw2('font-bold'), 'font-bold')

  assert.is(document.querySelectorAll('#__twind').length, 1)

  assert.is(
    style.textContent,
    [
      '.flex{display:flex}',
      '.text-center{text-align:center}',
      '@media (min-width: 768px){.md\\:text-left{text-align:left}}',
      '.font-bold{font-weight:700}',
    ].join(''),
  )
})

test.run()
