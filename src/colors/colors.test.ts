import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance } from '../types'
import type { VirtualSheet } from '../sheets/index'

import { virtualSheet } from '../sheets/index'

import { create, strict } from '../index'
import * as colors from './index'

const test = suite<{
  sheet: VirtualSheet
  instance: Instance
  tw: Instance['tw']
}>('twind/colors')

test.before((context) => {
  context.sheet = virtualSheet()
  context.instance = create({
    sheet: context.sheet,
    mode: strict,
    preflight: false,
    prefix: false,
    theme: { extend: { colors } },
  })
  context.tw = context.instance.tw
})

test.after.each(({ sheet }) => {
  sheet.reset()
})

test('new colors are available', ({ tw, sheet }) => {
  assert.is(tw('text-rose-200'), 'text-rose-200')
  assert.equal(sheet.target, [
    '.text-rose-200{--tw-text-opacity:1;color:#fecdd3;color:rgba(254,205,211,var(--tw-text-opacity))}',
  ])
})

test.run()
