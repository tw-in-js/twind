import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { renderToStaticMarkup } from 'react-dom/server'
import { html } from 'htm/react'

import type { Instance } from '../../types'
import type { VirtualSheet } from '../../sheets/index'
import type { Styled } from './index'

import * as DOM from '../../__fixtures__/dom-env'
import { create, strict } from '../../index'
import { virtualSheet } from '../../sheets/index'
import { styled } from './index'

const test = DOM.configure(
  suite<{
    sheet: VirtualSheet
    tw: Instance['tw']
    styled: Styled
  }>('styled/react'),
)

test.before.each((context) => {
  context.sheet = virtualSheet()
  const instance = create({
    sheet: context.sheet,
    mode: strict,
    preflight: false,
    hash: false,
    prefix: false,
  })
  context.tw = instance.tw
  context.styled = styled.bind(instance.tw)
})

test('tag with template literal', ({ styled, sheet }) => {
  const H1 = styled.h1`text-5xl font-bold`

  // Nothing injected yet
  assert.equal(sheet.target, [])

  const markup = renderToStaticMarkup(html`<${H1} class="hero" id="hello">Hello!<//>`)

  assert.is(markup, '<h1 id="hello" class="hero tw-g83ynq text-5xl font-bold">Hello!</h1>')
  assert.equal(sheet.target, [
    '.text-5xl{font-size:3rem;line-height:1}',
    '.font-bold{font-weight:700}',
  ])
})

test.run()
