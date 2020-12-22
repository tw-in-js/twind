import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance } from '..'
import type { VirtualSheet } from '../sheets/index'

import { virtualSheet } from '../sheets/index'
import { create, noprefix, strict } from '..'

const test = suite<{
  sheet: VirtualSheet
  instance: Instance
}>('node')

test.before.each((context) => {
  context.sheet = virtualSheet()
  context.instance = create({
    sheet: context.sheet,
    mode: strict,
    prefix: noprefix,
    hash: true,
    preflight: false,
  })
})

test.after.each(({ sheet }) => {
  sheet.reset()
})

test('class names are hashed', ({ instance, sheet }) => {
  assert.is(instance.tw('group flex pt-4 text-center'), 'tw-1bk5mm5 tw-1sv1rgs tw-ocaj78 tw-5693iz')
  assert.equal(sheet.target, [
    '.tw-1sv1rgs{display:flex}',
    '.tw-ocaj78{padding-top:1rem}',
    '.tw-5693iz{text-align:center}',
  ])
})

test.run()
