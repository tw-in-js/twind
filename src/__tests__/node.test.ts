import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance, Injector } from '..'

import { create, virtualInjector, noprefix, strict } from '..'

const test = suite<{
  injector: Injector<string[]>
  instance: Instance
}>('node')

test.before.each((context) => {
  context.injector = virtualInjector()
  context.instance = create({
    injector: context.injector,
    mode: strict,
    prefix: noprefix,
    hash: true,
    preflight: false,
  })
})

test('class names are hashed', ({ instance, injector }) => {
  assert.is(instance.tw('group flex pt-4 text-center'), 'tw-1bk5mm5 tw-1sv1rgs tw-ocaj78 tw-5693iz')
  assert.equal(injector.target, [
    '.tw-1sv1rgs{display:flex}',
    '.tw-ocaj78{padding-top:1rem}',
    '.tw-5693iz{text-align:center}',
  ])
})

test.run()
