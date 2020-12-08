import type { Instance, Injector } from '@tw-in-js/types'

let injector: Injector<string[]>
let instance: Instance

beforeEach(async () => {
  await import('../__fixtures__/legacy-reset.mjs')

  const { virtualInjector, noprefix, strict } = await import('..')
  const { create } = await import('../instance')

  injector = virtualInjector()
  instance = create({ injector, mode: strict, prefix: noprefix, hash: true, preflight: false })
})

test('class names are hashed', () => {
  expect(instance.tw('group flex pt-4 text-center')).toBe(
    'tw-1bk5mm5 tw-1r10iar tw-1rt79r9 tw-1utukjz',
  )
  expect(injector.target).toStrictEqual([
    '.tw-1r10iar{display:flex}',
    '.tw-1rt79r9{padding-top:1rem}',
    '.tw-1utukjz{text-align:center}',
  ])
})
