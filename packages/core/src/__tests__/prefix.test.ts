import type { Instance, Injector } from '@tw-in-js/types'

import { virtualInjector, strict } from '..'
import { create } from '../instance'

let injector: Injector<string[]>
let instance: Instance

beforeEach(() => {
  injector = virtualInjector()
  instance = create({
    injector,
    mode: strict,
    preflight: false,
    plugins: {
      'scroll-snap': (parts) => {
        return { 'scroll-snap-type': parts[0] }
      },
    },
  })
})

test('add prefix', () => {
  expect(instance.tw('sticky scroll-snap-x appearance-menulist-button')).toBe(
    'sticky scroll-snap-x appearance-menulist-button',
  )
  expect(injector.target).toMatchObject([
    '.appearance-menulist-button{appearance:menulist-button;-moz-appearance:menulist-button;-webkit-appearance:menulist-button}',
    '.sticky{position:-webkit-sticky, sticky}',
    '.scroll-snap-x{scroll-snap-type:x;-ms-scroll-snap-type:x;-webkit-scroll-snap-type:x}',
  ])
})
