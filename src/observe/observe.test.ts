import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import * as DOM from '../__fixtures__/dom-env'

import { virtualSheet } from 'twind/sheets'
import { create, strict, observe } from 'twind/observe'

const test = DOM.configure(suite('twind/observe'))

test('injects in to a style sheet element', () => {
  const sheet = virtualSheet()
  const { tw } = create({
    sheet,
    mode: strict,
    preflight: false,
    prefix: false,
  })

  document.body.innerHTML = `
    <main class="h-screen bg-purple-400 flex items-center justify-center">
      <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
    </main>
  `

  const h1 = document.querySelector('h1') as HTMLHeadingElement
  assert.ok(h1)

  assert.is(h1.className, 'font-bold text(center 5xl white sm:gray-800 md:pink-700)')

  const observer = observe(h1, { tw })

  assert.is(
    h1.className,
    'font-bold text-center text-5xl text-white sm:text-gray-800 md:text-pink-700',
  )

  assert.is(sheet.target.length, 6)

  // TODO extends API

  observer.disconnect()
})

test.run()
