import { assert, test, afterEach } from 'vitest'

import { twind, virtual, apply } from '..'

const tw = twind({}, virtual())

afterEach(() => tw.clear())

test('alias proxy passthrough - func', () => {
  assert.strictEqual(apply.func('bg-red text-white'), 'func#g069dp')
  assert.strictEqual(
    apply.func.toString().replace(/[\s]/g, ''),
    `functionnamedAlias(strings,...interpolations){returnalias$(name,strings,interpolations);}`,
  )
})

test('alias proxy passthrough - bind', () => {
  assert.strictEqual(apply.bind(apply)('bg-red text-white'), '@(bg-red,text-white)')
  assert.strictEqual(apply.bind(apply).toString().replace(/[\s]/g, ''), 'function(){[nativecode]}')
})

test('alias proxy passthrough - toString', () => {
  assert.strictEqual(apply('bg-red text-white'), '@(bg-red,text-white)')
  assert.strictEqual(apply.toString().replace(/[\s]/g, ''), 'function(){[nativecode]}')
})
