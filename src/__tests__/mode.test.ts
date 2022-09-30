import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { snoop } from 'snoop'

import { virtualSheet } from 'twind/sheets'
import { create, strict, silent, mode } from 'twind'

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

    assert.is(tw('unknown-directive'), 'unknown-directive')
    assert.is(warn.callCount, 1)
    assert.match(warn.lastCall.arguments[0], /UNKNOWN_DIRECTIVE/)

    assert.is(tw('rounded-t-xxx'), 'rounded-t-xxx')
    assert.is(warn.callCount, 3)
    assert.match(warn.calls[1].arguments[0], /UNKNOWN_THEME_VALUE/)
    assert.match(warn.calls[2].arguments[0], /UNKNOWN_DIRECTIVE/)

    assert.is(tw('gap'), 'gap')
    assert.is(warn.callCount, 5)
    assert.match(warn.calls[3].arguments[0], /UNKNOWN_THEME_VALUE/)
    assert.match(warn.calls[4].arguments[0], /UNKNOWN_DIRECTIVE/)
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

    assert.is(tw('unknown-directive'), 'unknown-directive')
    assert.is(warn.callCount, 0)

    assert.is(tw('rounded-t-xxx'), 'rounded-t-xxx')
    assert.is(warn.callCount, 0)
  } finally {
    console.warn = consoleWarn
  }
})

test('mode strict', () => {
  const instance = create({
    sheet: virtualSheet(),
    mode: strict,
  })

  assert.throws(() => instance.tw('unknown-directive'), /UNKNOWN_DIRECTIVE/)
})

test('ignore vendor specific pseudo classes errors', () => {
  const sheet = virtualSheet()
  const warn = snoop(noop)

  const calls: [string, number][] = []

  sheet.insert = (rule, index) => {
    calls.push([rule, index])

    if (rule.includes(':-moz')) {
      throw new Error(
        `Failed to execute 'insertRule' on 'CSSStyleSheet': Failed to parse the rule '${rule}'.`,
      )
    }
  }

  const instance = create({
    sheet: sheet,
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
    ['.underline{text-decoration-line:underline}', 0],
    ['.text-center{text-align:center}', 0],
  ])

  assert.is(warn.callCount, 0)
})

test('propagate other errors to warn', () => {
  const sheet = virtualSheet()
  const warn = snoop(noop)

  const calls: [string, number][] = []

  sheet.insert = (rule, index) => {
    calls.push([rule, index])

    if (rule.includes('invalid-web')) {
      throw new Error(
        `Failed to execute 'insertRule' on 'CSSStyleSheet': Failed to parse the rule '${rule}'.`,
      )
    }
  }

  const instance = create({
    sheet: sheet,
    mode: mode(warn.fn),
    preflight() {
      return { '.invalid-web': { color: 'blue' } }
    },
  })

  assert.is(instance.tw('underline'), 'underline')

  assert.equal(calls, [
    ['.invalid-web{color:blue}', 0],
    ['.underline{text-decoration-line:underline}', 0],
  ])

  assert.is(warn.callCount, 1)
  assert.match(warn.lastCall.arguments[0], /INJECT_CSS_ERROR/)
})

test.run()
