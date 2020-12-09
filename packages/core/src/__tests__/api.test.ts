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

test('variant pseudo presedence', () => {
  expect(tw`
    active:text-blue-200
    empty:text-green-500
    group-invalid:text-red-400
    checked:text-gray-500
    link:text-green-100
    disabled:text-blue-300
    even:text-gray-300
    first:text-gray-50
    focus-visible:text-blue-100
    focus-within:text-gray-800
    focus:text-blue-50
    group-focus:text-gray-700
    group-hover:text-gray-600
    hover:text-gray-900
    invalid:text-blue-600
    last:text-gray-100
    odd:text-gray-200
    optional:text-blue-800
    read-only:text-blue-700
    required:text-blue-400
    valid:text-blue-500
    visited:text-gray-400
  `).toBe(
    'active:text-blue-200 empty:text-green-500 group-invalid:text-red-400 checked:text-gray-500 link:text-green-100 disabled:text-blue-300 even:text-gray-300 first:text-gray-50 focus-visible:text-blue-100 focus-within:text-gray-800 focus:text-blue-50 group-focus:text-gray-700 group-hover:text-gray-600 hover:text-gray-900 invalid:text-blue-600 last:text-gray-100 odd:text-gray-200 optional:text-blue-800 read-only:text-blue-700 required:text-blue-400 valid:text-blue-500 visited:text-gray-400',
  )

  expect(injector.target).toStrictEqual([
    '.first\\:text-gray-50:first-child{--tw-text-opacity:1;color:#f9fafb;color:rgba(249,250,251,var(--tw-text-opacity))}',
    '.last\\:text-gray-100:last-child{--tw-text-opacity:1;color:#f3f4f6;color:rgba(243,244,246,var(--tw-text-opacity))}',
    '.even\\:text-gray-300:nth-child(2n){--tw-text-opacity:1;color:#d1d5db;color:rgba(209,213,219,var(--tw-text-opacity))}',
    '.odd\\:text-gray-200:nth-child(odd){--tw-text-opacity:1;color:#e5e7eb;color:rgba(229,231,235,var(--tw-text-opacity))}',
    ".link\\:text-green-100:link{--tw-text-opacity:1;color:#d1fae5;color:rgba(209,250,229,var(--tw-text-opacity))}",
    '.visited\\:text-gray-400:visited{--tw-text-opacity:1;color:#9ca3af;color:rgba(156,163,175,var(--tw-text-opacity))}',
    ".empty\\:text-green-500:empty{--tw-text-opacity:1;color:#10b981;color:rgba(16,185,129,var(--tw-text-opacity))}",
    '.checked\\:text-gray-500:checked{--tw-text-opacity:1;color:#6b7280;color:rgba(107,114,128,var(--tw-text-opacity))}',
    '.focus-within\\:text-gray-800:focus-within{--tw-text-opacity:1;color:#1f2937;color:rgba(31,41,55,var(--tw-text-opacity))}',
    '.group:hover .group-hover\\:text-gray-600{--tw-text-opacity:1;color:#4b5563;color:rgba(75,85,99,var(--tw-text-opacity))}',
    '.hover\\:text-gray-900:hover{--tw-text-opacity:1;color:#111827;color:rgba(17,24,39,var(--tw-text-opacity))}',
    '.focus\\:text-blue-50:focus{--tw-text-opacity:1;color:#eff6ff;color:rgba(239,246,255,var(--tw-text-opacity))}',
    '.group:focus .group-focus\\:text-gray-700{--tw-text-opacity:1;color:#374151;color:rgba(55,65,81,var(--tw-text-opacity))}',
    '.focus-visible\\:text-blue-100:focus-visible{--tw-text-opacity:1;color:#dbeafe;color:rgba(219,234,254,var(--tw-text-opacity))}',
    '.active\\:text-blue-200:active{--tw-text-opacity:1;color:#bfdbfe;color:rgba(191,219,254,var(--tw-text-opacity))}',
    '.disabled\\:text-blue-300:disabled{--tw-text-opacity:1;color:#93c5fd;color:rgba(147,197,253,var(--tw-text-opacity))}',
    '.read-only\\:text-blue-700:read-only{--tw-text-opacity:1;color:#1d4ed8;color:rgba(29,78,216,var(--tw-text-opacity))}',
    '.optional\\:text-blue-800:optional{--tw-text-opacity:1;color:#1e40af;color:rgba(30,64,175,var(--tw-text-opacity))}',
    '.required\\:text-blue-400:required{--tw-text-opacity:1;color:#60a5fa;color:rgba(96,165,250,var(--tw-text-opacity))}',
    ".group:invalid .group-invalid\\:text-red-400{--tw-text-opacity:1;color:#f87171;color:rgba(248,113,113,var(--tw-text-opacity))}",
    '.invalid\\:text-blue-600:invalid{--tw-text-opacity:1;color:#2563eb;color:rgba(37,99,235,var(--tw-text-opacity))}',
    '.valid\\:text-blue-500:valid{--tw-text-opacity:1;color:#3b82f6;color:rgba(59,130,246,var(--tw-text-opacity))}',
  ])
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

test('container center', () => {
  const { tw } = create({
    injector,
    prefix: false,
    preflight: false,
    mode: strict,
    theme: {
      extend: {
        container: {
          center: true,
        },
      },
    },
  })

  expect(tw`container`).toBe('container')
  expect(injector.target).toStrictEqual([
    '.container{width:100%;margin-right:auto;margin-left:auto}',
    '@media (min-width: 640px){.container{max-width:640px}}',
    '@media (min-width: 768px){.container{max-width:768px}}',
    '@media (min-width: 1024px){.container{max-width:1024px}}',
    '@media (min-width: 1280px){.container{max-width:1280px}}',
    '@media (min-width: 1536px){.container{max-width:1536px}}',
  ])
})

test('container padding', () => {
  const { tw } = create({
    injector,
    prefix: false,
    preflight: false,
    mode: strict,
    theme: {
      extend: {
        container: {
          padding: '2rem',
        },
      },
    },
  })

  expect(tw`container`).toBe('container')
  expect(injector.target).toStrictEqual([
    '.container{width:100%;padding-right:2rem;padding-left:2rem}',
    '@media (min-width: 640px){.container{max-width:640px;padding-right:2rem;padding-left:2rem}}',
    '@media (min-width: 768px){.container{max-width:768px;padding-right:2rem;padding-left:2rem}}',
    '@media (min-width: 1024px){.container{max-width:1024px;padding-right:2rem;padding-left:2rem}}',
    '@media (min-width: 1280px){.container{max-width:1280px;padding-right:2rem;padding-left:2rem}}',
    '@media (min-width: 1536px){.container{max-width:1536px;padding-right:2rem;padding-left:2rem}}',
  ])
})

test('container padding per screeen', () => {
  const { tw } = create({
    injector,
    prefix: false,
    preflight: false,
    mode: strict,
    theme: {
      extend: {
        container: {
          padding: {
            DEFAULT: '1rem',
            sm: '2rem',
            lg: '4rem',
            xl: '5rem',
            '2xl': '6rem',
          },
        },
      },
    },
  })

  expect(tw`container`).toBe('container')
  expect(injector.target).toStrictEqual([
    '.container{width:100%;padding-right:1rem;padding-left:1rem}',
    '@media (min-width: 640px){.container{max-width:640px;padding-right:2rem;padding-left:2rem}}',
    '@media (min-width: 768px){.container{max-width:768px;padding-right:1rem;padding-left:1rem}}',
    '@media (min-width: 1024px){.container{max-width:1024px;padding-right:4rem;padding-left:4rem}}',
    '@media (min-width: 1280px){.container{max-width:1280px;padding-right:5rem;padding-left:5rem}}',
    '@media (min-width: 1536px){.container{max-width:1536px;padding-right:6rem;padding-left:6rem}}',
  ])
})

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
