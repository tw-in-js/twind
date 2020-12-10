import { noOpInjector, cssomInjector } from '..'

test('noOpInjector', () => {
  const injector = noOpInjector()

  expect(injector.insert('', 0)).toBeUndefined()
  expect(injector.target).toBeNull()
})

test('cssomInjector', () => {
  const injector = cssomInjector()

  expect(injector.target).toBeInstanceOf(CSSStyleSheet)
  expect(injector.insert('html{padding:0}', 0)).toBe(0)
  expect(injector.insert('body{margin:0}', 1)).toBe(1)
  expect(injector.insert('*{margin:0}', 1)).toBe(1)

  const style = document.querySelector('#__tw-in-js') as HTMLStyleElement

  expect(style).toBeInstanceOf(HTMLStyleElement)
  expect(style.nonce).toBe('')

  expect([...(style.sheet?.cssRules || [])].map((rule) => rule.cssText)).toMatchObject([
    'html {padding: 0;}',
    '* {margin: 0;}',
    'body {margin: 0;}',
  ])
})
