import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance, Configuration } from '../types'
import type { VirtualSheet } from '../sheets/index'

import { virtualSheet } from '../sheets/index'
import { create, strict } from '../index'

const test = suite<{
  sheet: VirtualSheet
  setup: (config?: Configuration) => Instance
}>('variants')

test.before.each((context) => {
  context.sheet = virtualSheet()
  context.setup = (config?: Configuration): Instance =>
    create({ sheet: context.sheet, mode: strict, preflight: false, prefix: false, ...config })
})

test('custom variants', ({ setup, sheet }) => {
  const { tw } = setup({
    variants: {
      hocus: '&:hover,&:focus',
    },
  })

  assert.is(tw`text-blue(500 hocus:700)`, 'text-blue-500 hocus:text-blue-700')
  assert.equal(sheet.target, [
    '.text-blue-500{--tw-text-opacity:1;color:#3b82f6;color:rgba(59,130,246,var(--tw-text-opacity))}',
    '.hocus\\:text-blue-700:hover,.hocus\\:text-blue-700:focus{--tw-text-opacity:1;color:#1d4ed8;color:rgba(29,78,216,var(--tw-text-opacity))}',
  ])
})

test.run()
