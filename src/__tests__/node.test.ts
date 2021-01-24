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
  assert.is(instance.tw('group flex pt-4 text-center'), 'tw-1bk5mm5 tw-bibj42 tw-aysv3w tw-10s9vuy')
  assert.equal(sheet.target, [
    '.tw-bibj42{display:flex}',
    '.tw-aysv3w{padding-top:1rem}',
    '.tw-10s9vuy{text-align:center}',
  ])
})

test.run()
