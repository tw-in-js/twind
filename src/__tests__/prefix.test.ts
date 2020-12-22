import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance } from '../types'
import type { VirtualSheet } from '../sheets/index'

import { virtualSheet } from '../sheets/index'
import { create, strict } from '../index'

const test = suite<{
  sheet: VirtualSheet
  instance: Instance
}>('prefix')

test.before((context) => {
  context.sheet = virtualSheet()
  context.instance = create({
    sheet: context.sheet,
    mode: strict,
    preflight: false,
    plugins: {
      'scroll-snap': (parts) => {
        return { 'scroll-snap-type': parts[0] }
      },
    },
  })
})

test.after.each(({ sheet }) => {
  sheet.reset()
})

test('add prefix', ({ sheet, instance }) => {
  assert.is(
    instance.tw('sticky scroll-snap-x appearance-menulist-button'),
    'sticky scroll-snap-x appearance-menulist-button',
  )
  assert.equal(sheet.target, [
    '.sticky{position:-webkit-sticky, sticky}',
    '.appearance-menulist-button{appearance:menulist-button;-moz-appearance:menulist-button;-webkit-appearance:menulist-button}',
    '.scroll-snap-x{scroll-snap-type:x;-ms-scroll-snap-type:x;-webkit-scroll-snap-type:x}',
  ])
})

test('add prefix with important', ({ sheet, instance }) => {
  assert.is(
    instance.tw('sticky! scroll-snap-x! appearance-menulist-button!'),
    'sticky! scroll-snap-x! appearance-menulist-button!',
  )
  assert.equal(sheet.target, [
    '.sticky\\!{position:-webkit-sticky, sticky !important}',
    '.appearance-menulist-button\\!{appearance:menulist-button !important;-moz-appearance:menulist-button !important;-webkit-appearance:menulist-button !important}',
    '.scroll-snap-x\\!{scroll-snap-type:x !important;-ms-scroll-snap-type:x !important;-webkit-scroll-snap-type:x !important}',
  ])
})

test.run()
