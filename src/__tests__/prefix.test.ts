import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance } from 'twind'
import type { VirtualSheet } from 'twind/sheets'

import { virtualSheet } from 'twind/sheets'
import { create, strict } from 'twind'

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
    '.sticky{position:-webkit-sticky;position:sticky}',
    '.appearance-menulist-button{-webkit-appearance:menulist-button;-moz-appearance:menulist-button;appearance:menulist-button}',
    '.scroll-snap-x{scroll-snap-type:x}',
  ])
})

test('add prefix with important', ({ sheet, instance }) => {
  assert.is(
    instance.tw('sticky! !scroll-snap-x appearance-menulist-button!'),
    '!sticky !scroll-snap-x !appearance-menulist-button',
  )
  assert.equal(sheet.target, [
    '.\\!sticky{position:-webkit-sticky !important;position:sticky !important}',
    '.\\!appearance-menulist-button{-webkit-appearance:menulist-button !important;-moz-appearance:menulist-button !important;appearance:menulist-button !important}',
    '.\\!scroll-snap-x{scroll-snap-type:x !important}',
  ])
})

test.run()
