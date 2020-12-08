import type { Instance, Injector } from '@tw-in-js/types'

import { virtualInjector, strict } from '..'

import { create } from '../instance'

import data from './api.json'

let injector: Injector<string[]>
let tw: Instance['tw']
let setup: Instance['setup']

beforeEach(() => {
  injector = virtualInjector()
  const instance = create({
    injector,
    mode: strict,
    preflight: false,
    prefix: false,
    theme: {
      extend: {
        colors: { fuchsia: 'fuchsia' },
        backgroundImage: {
          'hero-pattern': "url('/img/hero-pattern.svg')",
        },
      },
    },
  })
  tw = instance.tw
  setup = instance.setup
})

test.each(
  // "bg-#f87171": ".bg-\\#f87171{--bg-opacity:1;background-color:#f87171;background-color:rgba(248,113,113,var(--bg-opacity));--text-opacity:1}",
  // "group hover:bg-surface": [
  //   "group hover:bg-surface",
  //   [".hover\\:bg-surface:hover{background-color:#fff;color:#111}"]
  // ],
  Object.entries(data).map(([tokens, declarations]): [string, string, string[]] => {
    if (Array.isArray(declarations)) {
      // "group hover:bg-surface": [
      //   "group hover:bg-surface",
      //   [".hover\\:bg-surface:hover{background-color:#fff;color:#111}"]
      // ],
      return [tokens, declarations[0] as string, declarations[1] as string[]]
    }

    return [tokens, tokens, [declarations]]
  }),
)('tw(%j) => %s', (tokens, classNames, rules) => {
  expect(tw(tokens)).toBe(classNames)
  expect(injector.target).toStrictEqual(rules)

  // Cached access
  expect(tw(tokens)).toBe(classNames)
  expect(injector.target).toStrictEqual(rules)
})

test.each([
  [
    ['bg-white', false && 'rounded'],
    'bg-white',
    [
      '.bg-white{--tw-bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--tw-bg-opacity))}',
    ],
  ],
  [
    ['bg-white', true && 'rounded'],
    'bg-white rounded',
    [
      '.bg-white{--tw-bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--tw-bg-opacity))}',
      '.rounded{border-radius:0.25rem}',
    ],
  ],
  [
    ['bg-white', true, false, '', 'text-black', null, undefined, 0, Number.NaN],
    'bg-white text-black',
    [
      '.text-black{--tw-text-opacity:1;color:#000;color:rgba(0,0,0,var(--tw-text-opacity))}',
      '.bg-white{--tw-bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--tw-bg-opacity))}',
    ],
  ],
  [
    { 'bg-white': true, rounded: false },
    'bg-white',
    [
      '.bg-white{--tw-bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--tw-bg-opacity))}',
    ],
  ],
  [
    { 'bg-white': true, rounded: true },
    'bg-white rounded',
    [
      '.bg-white{--tw-bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--tw-bg-opacity))}',
      '.rounded{border-radius:0.25rem}',
    ],
  ],
  [
    {
      sm: ['hover:rounded', 'active:rounded-full'],
      md: { rounded: true, hover: 'bg-white' },
      lg: {
        'rounded-full': true,
        hover: 'bg-white text-black active:(underline shadow)',
      },
    },
    'sm:hover:rounded sm:active:rounded-full md:rounded md:hover:bg-white lg:rounded-full lg:hover:bg-white lg:hover:text-black lg:hover:active:underline lg:hover:active:shadow',
    [
      '@media (min-width: 640px){.sm\\:hover\\:rounded:hover{border-radius:0.25rem}}',
      '@media (min-width: 640px){.sm\\:active\\:rounded-full:active{border-radius:9999px}}',
      '@media (min-width: 768px){.md\\:rounded{border-radius:0.25rem}}',
      '@media (min-width: 768px){.md\\:hover\\:bg-white:hover{--tw-bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--tw-bg-opacity))}}',
      '@media (min-width: 1024px){.lg\\:rounded-full{border-radius:9999px}}',
      '@media (min-width: 1024px){.lg\\:hover\\:text-black:hover{--tw-text-opacity:1;color:#000;color:rgba(0,0,0,var(--tw-text-opacity))}}',
      '@media (min-width: 1024px){.lg\\:hover\\:bg-white:hover{--tw-bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--tw-bg-opacity))}}',
      '@media (min-width: 1024px){.lg\\:hover\\:active\\:shadow:hover:active{--tw-shadow:0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);box-shadow:0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);box-shadow:var(--tw-ring-offset-shadow,0 0 transparent),var(--tw-ring-shadow,0 0 transparent),var(--tw-shadow,0 0 transparent)}}',
      '@media (min-width: 1024px){.lg\\:hover\\:active\\:underline:hover:active{text-decoration:underline}}',
    ],
  ],
])('tw(%j) => %s', (tokens, classNames, rules) => {
  expect(tw(tokens)).toBe(classNames)
  expect(injector.target).toStrictEqual(rules)

  // Cached access
  expect(tw(tokens)).toBe(classNames)
  expect(injector.target).toStrictEqual(rules)
})

/* eslint-disable no-template-curly-in-string */
test('tw`bg-white ${false && "rounded"}`', () => {
  expect(tw`bg-white ${false && 'rounded'}`).toBe('bg-white')
  expect(injector.target).toStrictEqual([
    '.bg-white{--tw-bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--tw-bg-opacity))}',
  ])
})

test('tw`bg-white ${true && "rounded"}`', () => {
  expect(tw`bg-white ${true && 'rounded'}`).toBe('bg-white rounded')
  expect(injector.target).toStrictEqual([
    '.bg-white{--tw-bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--tw-bg-opacity))}',
    '.rounded{border-radius:0.25rem}',
  ])
})

test('tw`bg-white ${{rounded: true}}`', () => {
  expect(tw`bg-white ${{ rounded: true }}`).toBe('bg-white rounded')
  expect(injector.target).toStrictEqual([
    '.bg-white{--tw-bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--tw-bg-opacity))}',
    '.rounded{border-radius:0.25rem}',
  ])
})

test('tw`bg-white ${{rounded: false}}`', () => {
  expect(tw`bg-white ${{ rounded: false }}`).toBe('bg-white')
  expect(injector.target).toStrictEqual([
    '.bg-white{--tw-bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--tw-bg-opacity))}',
  ])
})

test('tw`bg-${"fuchsia"} rounded-${"xl"}`', () => {
  expect(tw`bg-${'fuchsia'} rounded-${'xl'}`).toBe('bg-fuchsia rounded-xl')
  expect(injector.target).toStrictEqual([
    '.bg-fuchsia{background-color:fuchsia}',
    '.rounded-xl{border-radius:0.75rem}',
  ])
})
/* eslint-enable no-template-curly-in-string */

test('falsy arguments', () => {
  expect(tw(true, false, '', null, undefined, 0, Number.NaN)).toBe('')
  expect(tw('')).toBe('')
})

test('empty arguments', () => {
  expect(tw('')).toBe('')
  expect(tw([])).toBe('')
  expect(tw({})).toBe('')
})

test('no arguments', () => {
  expect(tw()).toBe('')
})

test('can not call setup after config', () => {
  expect(() => {
    setup()
  }).toThrow('LATE_SETUP_CALL: {"id":"LATE_SETUP_CALL"}')
})

test('can call setup oncee', () => {
  const instance = create()
  instance.setup({
    prefix: false,
    preflight: false,
    mode: strict,
  })

  expect(() => {
    setup()
  }).toThrow('LATE_SETUP_CALL: {"id":"LATE_SETUP_CALL"}')
})
