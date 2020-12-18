import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { snoop } from 'snoop'

import { create, virtualInjector, strict, silent, mode } from '../index'

const test = suite('mode')

const noop: typeof console.warn = () => {
  /* no-op */
}

test('mode warn (default)', () => {
  const consoleWarn = console.warn

  try {
    const { tw } = create()

    const warn = snoop(noop)
    console.warn = warn.fn

    assert.is(tw('unknown-directive'), '')
    assert.is(warn.callCount, 1)
    assert.match(warn.lastCall.arguments[0], /UNKNOWN_DIRECTIVE/)

    assert.is(tw('rounded-t-xxx'), 'rounded-t-xxx')
    assert.is(warn.callCount, 2)
    assert.match(warn.lastCall.arguments[0], /UNKNOWN_THEME_VALUE/)

    assert.is(tw('gap'), 'gap')
    assert.is(warn.callCount, 3)
    assert.match(warn.lastCall.arguments[0], /UNKNOWN_THEME_VALUE/)
  } finally {
    console.warn = consoleWarn
  }
})

test('mode silent', () => {
  const consoleWarn = console.warn

  try {
    const { tw } = create({ mode: silent })

    const warn = snoop(noop)
    console.warn = warn.fn

    assert.is(tw('unknown-directive'), '')
    assert.is(warn.callCount, 0)

    assert.is(tw('rounded-t-xxx'), 'rounded-t-xxx')
    assert.is(warn.callCount, 0)
  } finally {
    console.warn = consoleWarn
  }
})

test('mode strict', () => {
  const instance = create({
    injector: virtualInjector(),
    mode: strict,
  })

  assert.throws(() => instance.tw('unknown-directive'), /UNKNOWN_DIRECTIVE/)
})

test('ignore vendor specific pseudo classes errors', () => {
  const injector = virtualInjector()
  const warn = snoop(noop)

  const calls: [string, number][] = []

  injector.insert = (rule, index) => {
    calls.push([rule, index])

    if (rule.includes(':-moz')) {
      throw new Error(
        `Failed to execute 'insertRule' on 'CSSStyleSheet': Failed to parse the rule '${rule}'.`,
      )
    }
  }

  const instance = create({
    injector,
    mode: mode(warn.fn),
    preflight() {
      return {
        '::-moz-focus-inner': { borderStyle: 'none' },
        ':-moz-focusring': { outline: '1px dotted ButtonText' },
      }
    },
  })

  assert.is(instance.tw('underline text-center'), 'underline text-center')

  assert.equal(calls, [
    ['::-moz-focus-inner{border-style:none}', 0],
    [':-moz-focusring{outline:1px dotted ButtonText}', 0],
    ['.underline{text-decoration:underline}', 0],
    ['.text-center{text-align:center}', 1],
  ])

  assert.is(warn.callCount, 0)
})

test('propagate other errors to warn', () => {
  const injector = virtualInjector()
  const warn = snoop(noop)

  const calls: [string, number][] = []

  injector.insert = (rule, index) => {
    calls.push([rule, index])

    if (rule.includes('-web')) {
      throw new Error(
        `Failed to execute 'insertRule' on 'CSSStyleSheet': Failed to parse the rule '${rule}'.`,
      )
    }
  }

  const instance = create({
    injector,
    mode: mode(warn.fn),
    preflight() {
      return { '.invalid-web': { color: 'blue' } }
    },
  })

  assert.is(instance.tw('underline'), 'underline')

  assert.equal(calls, [
    ['.invalid-web{color:blue}', 0],
    ['.underline{text-decoration:underline}', 0],
  ])

  assert.is(warn.callCount, 1)
  assert.match(warn.lastCall.arguments[0], /INJECT_CSS_ERROR/)
})

test.run()
