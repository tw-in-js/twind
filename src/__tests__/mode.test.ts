import { tw, create, virtualInjector, strict, mode } from '..'

test('mode warn (default)', () => {
  const consoleWarn = console.warn

  try {
    const warn = jest.fn()
    console.warn = warn

    expect(tw('unknown-directive')).toBe('')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toMatch(/UNKNOWN_DIRECTIVE/)

    expect(tw('rounded-t-xxx')).toBe('rounded-t-xxx')
    expect(warn).toHaveBeenCalledTimes(2)
    expect(warn.mock.calls[1][0]).toMatch(/UNKNOWN_THEME_VALUE/)

    expect(tw('gap')).toBe('gap')
    expect(warn).toHaveBeenCalledTimes(3)
    expect(warn.mock.calls[2][0]).toMatch(/UNKNOWN_THEME_VALUE/)
  } finally {
    console.warn = consoleWarn
  }
})

test('mode strict', () => {
  const instance = create({
    injector: virtualInjector(),
    mode: strict,
  })

  expect(() => instance.tw('unknown-directive')).toThrow(/UNKNOWN_DIRECTIVE/)
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
  expect(warn.mock.calls[0][0]).toMatch(/INJECT_CSS_ERROR/)
})
