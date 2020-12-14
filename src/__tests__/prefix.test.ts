import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance, VirtualInjector } from '../types'

import { create, virtualInjector, strict } from '../index'

const test = suite<{
  injector: VirtualInjector
  instance: Instance
}>('prefix')

test.before.each((context) => {
  context.injector = virtualInjector()
  context.instance = create({
    injector: context.injector,
    mode: strict,
    preflight: false,
    plugins: {
      'scroll-snap': (parts) => {
        return { 'scroll-snap-type': parts[0] }
      },
    },
  })
})

test('add prefix', ({ injector, instance }) => {
  assert.is(
    instance.tw('sticky scroll-snap-x appearance-menulist-button'),
    'sticky scroll-snap-x appearance-menulist-button',
  )
  assert.equal(injector.target, [
    '.sticky{position:-webkit-sticky, sticky}',
    '.appearance-menulist-button{appearance:menulist-button;-moz-appearance:menulist-button;-webkit-appearance:menulist-button}',
    '.scroll-snap-x{scroll-snap-type:x;-ms-scroll-snap-type:x;-webkit-scroll-snap-type:x}',
  ])
})

test.run()
