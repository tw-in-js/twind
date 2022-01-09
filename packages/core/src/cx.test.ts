/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-sparse-arrays */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { assert, test } from 'vitest'

import { cx } from '.'

test('comments', () => {
  assert.strictEqual(
    cx`
      underline
      /* multi
        line
        comment
      */
      hover:focus:!(
        sm:(italic why)
        lg:-(px)
        -mx-1
      )
      ${false} ${undefined} ${null} ${''}
      // Position
      !top-1 !-bottom-${2} mx-${0}
      text-(xl black)
    `,
    'underline hover:focus:sm:!italic hover:focus:sm:!why hover:focus:lg:!-px hover:focus:!-mx-1 !top-1 !-bottom-2 mx-0 text-xl text-black',
  )
})

test('nothing, null, undefined', () => {
  assert.strictEqual(cx(), '')
  assert.strictEqual(cx(null), '')
  assert.strictEqual(cx(undefined), '')
  assert.strictEqual(cx([, , , null, undefined]), '')
})

test('empty objects', () => {
  assert.strictEqual(cx({}), '')
  assert.strictEqual(cx([]), '')
  assert.strictEqual(cx([{}]), '')
  assert.strictEqual(cx([{}, {}, {}]), '')
})

test('booleans', () => {
  assert.strictEqual(cx(true), '')
  assert.strictEqual(cx(false), '')
  assert.strictEqual(cx([true, false]), '')
})

test('numbers', () => {
  assert.strictEqual(cx(0), '')
  assert.strictEqual(cx([0, 1]), '1')
  assert.strictEqual(cx({ 0: true, 1: true }), '0 1')
})

test('empty strings', () => {
  assert.strictEqual(cx(''), '')
  assert.strictEqual(
    cx({
      elf: '',
      orc: '',
      gnome: '',
    }),
    '',
  )
  assert.strictEqual(cx(['', '', '']), '')
})

test('arrays of strings', () => {
  assert.strictEqual(cx(['elf', 'orc', false, 'gnome']), 'elf orc gnome')
})

test('array of arrays', () => {
  assert.strictEqual(cx(['elf', ['orc', [false, 'gnome']]]), 'elf orc gnome')
})

test('object of key:string pairs', () => {
  assert.strictEqual(
    cx({
      elf: true,
      orc: true,
      dodo: false,
      gnome: true,
    }),
    'elf orc gnome',
  )
})

test('array of objects and arrays', () => {
  assert.strictEqual(
    cx([
      'elf',
      'half-orc',
      {
        'half-elf': true,
      },
      ['gnome', 'goblin', 'dwarf'],
    ]),
    'elf half-orc half-elf gnome goblin dwarf',
  )
})

test('cx', () => {
  assert.strictEqual(typeof cx, 'function', 'exports a function')
  assert.strictEqual(typeof cx(), 'string', '~> returns string output')
})

test('strings', () => {
  assert.strictEqual(cx(''), '')
  assert.strictEqual(cx('foo'), 'foo')
  assert.strictEqual(cx(true && 'foo'), 'foo')
  assert.strictEqual(cx(false && 'foo'), '')
})

test('strings (variadic)', () => {
  assert.strictEqual(cx(''), '')
  assert.strictEqual(cx('foo', 'bar'), 'foo bar')
  assert.strictEqual(cx(true && 'foo', false && 'bar', 'baz'), 'foo baz')
  assert.strictEqual(cx(false && 'foo', 'bar', 'baz', ''), 'bar baz')
})

test('objects', () => {
  assert.strictEqual(cx({}), '')
  assert.strictEqual(cx({ foo: true }), 'foo')
  assert.strictEqual(cx({ foo: true, bar: false }), 'foo')
  assert.strictEqual(cx({ foo: 'hiya', bar: 1 }), 'foo bar')
  assert.strictEqual(cx({ foo: 1, bar: 0, baz: 1 }), 'foo baz')
  assert.strictEqual(cx({ '-foo': 1, '--bar': 1 }), '-foo --bar')
})

test('objects (variadic)', () => {
  assert.strictEqual(cx({}, {}), '')
  assert.strictEqual(cx({ foo: 1 }, { bar: 2 }), 'foo bar')
  assert.strictEqual(cx({ foo: 1 }, null, { baz: 1, bat: 0 }), 'foo baz')
  assert.strictEqual(
    cx({ foo: 1 }, {}, {}, { bar: 'a' }, { baz: null, bat: Infinity }),
    'foo bar bat',
  )
})

test('arrays', () => {
  assert.strictEqual(cx([]), '')
  assert.strictEqual(cx(['foo']), 'foo')
  assert.strictEqual(cx(['foo', 'bar']), 'foo bar')
  assert.strictEqual(cx(['foo', 0 && 'bar', 1 && 'baz']), 'foo baz')
})

test('arrays (nested)', () => {
  assert.strictEqual(cx([[[]]]), '')
  assert.strictEqual(cx([[['foo']]]), 'foo')
  assert.strictEqual(cx([true, [['foo']]]), 'foo')
  assert.strictEqual(cx(['foo', ['bar', ['', [['baz']]]]]), 'foo bar baz')
})

test('arrays (variadic)', () => {
  assert.strictEqual(cx([], []), '')
  assert.strictEqual(cx(['foo'], ['bar']), 'foo bar')
  assert.strictEqual(cx(['foo'], null, ['baz', ''], true, '', []), 'foo baz')
})

test('arrays (no `push` escape)', () => {
  assert.strictEqual(cx({ push: 1 }), 'push')
  assert.strictEqual(cx({ pop: true }), 'pop')
  assert.strictEqual(cx({ push: true }), 'push')
  assert.strictEqual(cx('hello', { world: 1, push: true }), 'hello world push')
})

test('functions', () => {
  const foo = () => {}
  assert.strictEqual(cx(foo as any, 'hello'), 'hello')
  assert.strictEqual(cx(foo as any, 'hello', cx as any), 'hello')
  assert.strictEqual(cx(foo as any, 'hello', [[cx as any], 'world']), 'hello world')
})

test('(compat) keeps object keys with truthy values', () => {
  const out = cx({ a: true, b: false, c: 0, d: null, e: undefined, f: 1 })
  assert.strictEqual(out, 'a f')
})

test('(compat) joins arrays of class names and ignore falsy values', () => {
  const out = cx('a', 0, null, undefined, true, 1, 'b')
  assert.strictEqual(out, 'a 1 b')
})

test('(compat) supports heterogenous arguments', () => {
  assert.strictEqual(cx({ a: true }, 'b', 0), 'a b')
  assert.strictEqual(cx(0, { a: true }, 'b'), 'a b')
})

test('(compat) should be trimmed', () => {
  assert.strictEqual(cx('', 'b', {}, ''), 'b')
})

test('(compat) returns an empty string for an empty configuration', () => {
  assert.strictEqual(cx({}), '')
})

test('(compat) supports an array of class names', () => {
  assert.strictEqual(cx(['a', 'b']), 'a b')
})

test('(compat) joins array arguments with string arguments', () => {
  assert.strictEqual(cx(['a', 'b'], 'c'), 'a b c')
  assert.strictEqual(cx('c', ['a', 'b']), 'c a b')
})

test('(compat) handles multiple array arguments', () => {
  assert.strictEqual(cx(['a', 'b'], ['c', 'd']), 'a b c d')
})

test('(compat) handles arrays that include falsy and true values', () => {
  assert.strictEqual(cx(['a', 0, null, undefined, false, true, 'b']), 'a b')
})

test('(compat) handles arrays that include arrays', () => {
  assert.strictEqual(cx(['a', ['b', 'c']]), 'a b c')
})

test('(compat) handles arrays that include objects', () => {
  assert.strictEqual(cx(['a', { b: true, c: false }]), 'a b')
})

test('(compat) handles deep array recursion', () => {
  assert.strictEqual(cx(['a', ['b', ['c', { d: true }]]]), 'a b c d')
})

test('(compat) handles arrays that are empty', () => {
  assert.strictEqual(cx('a', []), 'a')
})

test('(compat) handles nested arrays that have empty nested arrays', () => {
  assert.strictEqual(cx('a', [[]]), 'a')
})

test('(compat) handles all types of truthy and falsy property values as expected', () => {
  const out = cx({
    // falsy:
    null: null,
    emptyString: '',
    noNumber: NaN,
    zero: 0,
    negativeZero: -0,
    false: false,
    undefined: undefined,

    // truthy (literally anything else):
    nonEmptyString: 'foobar',
    whitespace: ' ',
    // eslint-disable-next-line @typescript-eslint/unbound-method
    function: Object.prototype.toString,
    emptyObject: {},
    nonEmptyObject: { a: 1, b: 2 },
    emptyList: [],
    nonEmptyList: [1, 2, 3],
    greaterZero: 1,
  })

  assert.strictEqual(
    out,
    'nonEmptyString whitespace function emptyObject nonEmptyObject emptyList nonEmptyList greaterZero',
  )
})
