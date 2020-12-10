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

  // re-use existing stylesheet
  const { tw: tw2 } = create({ mode: strict, preflight: false })

  expect(tw2('group flex text-center md:text-left')).toBe('group flex text-center md:text-left')

  expect(document.querySelectorAll('#__tw-in-js')).toHaveLength(1)

  expect([...(style.sheet?.cssRules || [])].map((rule) => rule.cssText)).toMatchObject([
    '.flex {display: flex;}',
    '.text-center {text-align: center;}',
    '@media (min-width: 768px) {.md\\:text-left {text-align: left;}}',
    '.flex {display: flex;}',
    '.text-center {text-align: center;}',
    '@media (min-width: 768px) {.md\\:text-left {text-align: left;}}',
  ])
})
