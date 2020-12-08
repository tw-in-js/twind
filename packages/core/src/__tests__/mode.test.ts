import { tw, virtualInjector, strict, mode } from '..'
import { create } from '../instance'

test('mode warn (default)', () => {
  const consoleWarn = console.warn

  try {
    console.warn = jest.fn()

    expect(tw('unknown-directive')).toBe('')
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledWith(
      `UNKNOWN_DIRECTIVE: {"id":"UNKNOWN_DIRECTIVE","rule":{"variants":[],"directive":"unknown-directive","negate":false}}`,
    )

    expect(tw('rounded-t-xxx')).toBe('rounded-t-xxx')
    expect(console.warn).toHaveBeenCalledTimes(2)
    expect(console.warn).toHaveBeenLastCalledWith(
      `UNKNOWN_THEME_VALUE: {"id":"UNKNOWN_THEME_VALUE","section":"borderRadius","keypath":["t","xxx"]}`,
    )

    expect(tw('gap')).toBe('gap')
    expect(console.warn).toHaveBeenCalledTimes(3)
    expect(console.warn).toHaveBeenLastCalledWith(
      `UNKNOWN_THEME_VALUE: {"id":"UNKNOWN_THEME_VALUE","section":"gap","keypath":["DEFAULT"]}`,
    )
  } finally {
    console.warn = consoleWarn
  }
})

test('mode strict', () => {
  const instance = create({
    injector: virtualInjector(),
    mode: strict,
  })

  expect(() => instance.tw('unknown-directive')).toThrow(
    `UNKNOWN_DIRECTIVE: {"id":"UNKNOWN_DIRECTIVE","rule":{"variants":[],"directive":"unknown-directive","negate":false}}`,
  )
})

test('ignore vendor specific pseudo classes errors', () => {
  const injector = virtualInjector()
  const warn = jest.fn()

  injector.insert = jest.fn((rule) => {
    if (rule.includes(':-moz')) {
      throw new Error(
        `Failed to execute 'insertRule' on 'CSSStyleSheet': Failed to parse the rule '${rule}'.`,
      )
    }
  })

  const instance = create({
    injector,
    mode: mode(warn),
    preflight() {
      return {
        '::-moz-focus-inner': { borderStyle: 'none' },
        ':-moz-focusring': { outline: '1px dotted ButtonText' },
      }
    },
  })

  expect(instance.tw('underline text-center')).toBe('underline text-center')

  expect(injector.insert).toHaveBeenCalledTimes(4)
  expect(injector.insert).toHaveBeenNthCalledWith(1, '::-moz-focus-inner{border-style:none}', 0)
  expect(injector.insert).toHaveBeenNthCalledWith(
    2,
    ':-moz-focusring{outline:1px dotted ButtonText}',
    0,
  )
  expect(injector.insert).toHaveBeenNthCalledWith(3, '.underline{text-decoration:underline}', 0)
  expect(injector.insert).toHaveBeenNthCalledWith(4, '.text-center{text-align:center}', 1)

  expect(warn).toHaveBeenCalledTimes(0)
})

test('propagate other errors to warn', () => {
  const injector = virtualInjector()
  const warn = jest.fn()

  injector.insert = jest.fn((rule) => {
    if (rule.includes('-web')) {
      throw new Error(
        `Failed to execute 'insertRule' on 'CSSStyleSheet': Failed to parse the rule '${rule}'.`,
      )
    }
  })

  const instance = create({
    injector,
    mode: mode(warn),
    preflight() {
      return { '.invalid-web': { color: 'blue' } }
    },
  })

  expect(instance.tw('underline')).toBe('underline')

  expect(injector.insert).toHaveBeenCalledTimes(2)
  expect(injector.insert).toHaveBeenNthCalledWith(1, '.invalid-web{color:blue}', 0)
  expect(injector.insert).toHaveBeenNthCalledWith(2, '.underline{text-decoration:underline}', 0)

  expect(warn).toHaveBeenCalledTimes(1)
  expect(warn).toHaveBeenNthCalledWith(
    1,
    `INJECT_CSS_ERROR: {"id":"INJECT_CSS_ERROR","rule":".invalid-web{color:blue}","error":{}}`,
  )
})
