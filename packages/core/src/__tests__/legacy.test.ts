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
    'tw-1bk5mm5 tw-1sv1rgs tw-ocaj78 tw-5693iz',
  )
  expect(injector.target).toStrictEqual([
    '.tw-1sv1rgs{display:flex}',
    '.tw-ocaj78{padding-top:1rem}',
    '.tw-5693iz{text-align:center}',
  ])
})
