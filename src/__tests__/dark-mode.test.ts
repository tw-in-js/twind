import type { Instance, Injector } from '../types'

import { create, virtualInjector, strict } from '..'

let injector: Injector<string[]>
let instance: Instance

beforeEach(() => {
  injector = virtualInjector()
  instance = create({
    injector,
    mode: strict,
    preflight: false,
    theme: { extend: { colors: { '#111': '#111', '#222': '#222', '#333': '#333' } } },
  })
})

test('default to dark mode media strategy', () => {
  expect(instance.tw('text-white dark:text-black')).toBe('text-white dark:text-black')
  expect(injector.target).toStrictEqual([
    '.text-white{--tw-text-opacity:1;color:#fff;color:rgba(255,255,255,var(--tw-text-opacity))}',
    '@media (prefers-color-scheme:dark){.dark\\:text-black{--tw-text-opacity:1;color:#000;color:rgba(0,0,0,var(--tw-text-opacity))}}',
  ])
})

test('dark mode class strategy', () => {
  instance = create()

  instance.setup({
    darkMode: 'class',
    injector,
    preflight: false,
    mode: strict,
    theme: { extend: { colors: { '#111': '#111', '#222': '#222', '#333': '#333' } } },
  })

  expect(instance.tw('text-white dark:text-black')).toBe('text-white dark:text-black')
  expect(injector.target).toStrictEqual([
    '.text-white{--tw-text-opacity:1;color:#fff;color:rgba(255,255,255,var(--tw-text-opacity))}',
    '.dark .dark\\:text-black{--tw-text-opacity:1;color:#000;color:rgba(0,0,0,var(--tw-text-opacity))}',
  ])
})

test('stacking with screens', () => {
  expect(instance.tw('text-#111 dark:text-#222 lg:text-black lg:dark:text-white')).toBe(
    'text-#111 dark:text-#222 lg:text-black lg:dark:text-white',
  )
  expect(injector.target).toStrictEqual([
    '.text-\\#111{--tw-text-opacity:1;color:#111;color:rgba(17,17,17,var(--tw-text-opacity))}',
    '@media (prefers-color-scheme:dark){.dark\\:text-\\#222{--tw-text-opacity:1;color:#222;color:rgba(34,34,34,var(--tw-text-opacity))}}',
    '@media (min-width: 1024px){.lg\\:text-black{--tw-text-opacity:1;color:#000;color:rgba(0,0,0,var(--tw-text-opacity))}}',
    '@media (min-width: 1024px){@media (prefers-color-scheme:dark){.lg\\:dark\\:text-white{--tw-text-opacity:1;color:#fff;color:rgba(255,255,255,var(--tw-text-opacity))}}}',
  ])
})

test('stacking with other variants', () => {
  expect(instance.tw('text-#111 hover:text-#222 lg:dark:text-black lg:dark:hover:text-white')).toBe(
    'text-#111 hover:text-#222 lg:dark:text-black lg:dark:hover:text-white',
  )
  expect(injector.target).toStrictEqual([
    '.text-\\#111{--tw-text-opacity:1;color:#111;color:rgba(17,17,17,var(--tw-text-opacity))}',
    '.hover\\:text-\\#222:hover{--tw-text-opacity:1;color:#222;color:rgba(34,34,34,var(--tw-text-opacity))}',
    '@media (min-width: 1024px){@media (prefers-color-scheme:dark){.lg\\:dark\\:text-black{--tw-text-opacity:1;color:#000;color:rgba(0,0,0,var(--tw-text-opacity))}}}',
    '@media (min-width: 1024px){@media (prefers-color-scheme:dark){.lg\\:dark\\:hover\\:text-white:hover{--tw-text-opacity:1;color:#fff;color:rgba(255,255,255,var(--tw-text-opacity))}}}',
  ])
})
