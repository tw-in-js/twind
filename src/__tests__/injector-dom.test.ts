import { create, strict } from '..'

test('injects in to a style sheet element', () => {
  const nonce = Math.random().toString(36)

  const { tw, setup } = create()

  expect(document.querySelector('#__tw-in-js')).toBeFalsy()

  setup({ nonce, mode: strict, preflight: false })

  const style = document.querySelector('#__tw-in-js') as HTMLStyleElement

  expect(style).toBeInstanceOf(HTMLStyleElement)
  expect(style.nonce).toBe(nonce)

  expect(tw('group flex text-center md:text-left')).toBe('group flex text-center md:text-left')

  expect([...(style.sheet?.cssRules || [])].map((rule) => rule.cssText)).toMatchObject([
    '.flex {display: flex;}',
    '.text-center {text-align: center;}',
    '@media (min-width: 768px) {.md\\:text-left {text-align: left;}}',
  ])
})
