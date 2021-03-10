import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance } from 'twind'
import type { VirtualSheet } from 'twind/sheets'

import { virtualSheet } from 'twind/sheets'
import { create, strict } from 'twind'

const test = suite<{
  sheet: VirtualSheet
  instance: Instance
}>('dark mode')

test.before((context) => {
  context.sheet = virtualSheet()
  context.instance = create({
    sheet: context.sheet,
    mode: strict,
    preflight: false,
    theme: { extend: { colors: { '#111': '#111', '#222': '#222', '#333': '#333' } } },
  })
})

test.after.each(({ sheet }) => {
  sheet.reset()
})

test('default to dark mode media strategy', ({ instance, sheet }) => {
  assert.is(instance.tw('text-white dark:text-black'), 'text-white dark:text-black')
  assert.equal(sheet.target, [
    '.text-white{--tw-text-opacity:1;color:#fff;color:rgba(255,255,255,var(--tw-text-opacity))}',
    '@media (prefers-color-scheme:dark){.dark\\:text-black{--tw-text-opacity:1;color:#000;color:rgba(0,0,0,var(--tw-text-opacity))}}',
  ])
})

test('dark mode class strategy', ({ instance, sheet }) => {
  instance = create()

  instance.setup({
    darkMode: 'class',
    sheet: sheet,
    preflight: false,
    mode: strict,
    theme: { extend: { colors: { '#111': '#111', '#222': '#222', '#333': '#333' } } },
  })

  assert.is(instance.tw('text-white dark:text-black'), 'text-white dark:text-black')
  assert.equal(sheet.target, [
    '.text-white{--tw-text-opacity:1;color:#fff;color:rgba(255,255,255,var(--tw-text-opacity))}',
    '.dark .dark\\:text-black{--tw-text-opacity:1;color:#000;color:rgba(0,0,0,var(--tw-text-opacity))}',
  ])
})

test('stacking with screens', ({ instance, sheet }) => {
  assert.is(
    instance.tw('text-#111 dark:text-#222 lg:text-black lg:dark:text-white'),
    'text-#111 dark:text-#222 lg:text-black lg:dark:text-white',
  )
  assert.equal(sheet.target, [
    '.text-\\#111{--tw-text-opacity:1;color:#111;color:rgba(17,17,17,var(--tw-text-opacity))}',
    '@media (min-width:1024px){.lg\\:text-black{--tw-text-opacity:1;color:#000;color:rgba(0,0,0,var(--tw-text-opacity))}}',
    '@media (prefers-color-scheme:dark){.dark\\:text-\\#222{--tw-text-opacity:1;color:#222;color:rgba(34,34,34,var(--tw-text-opacity))}}',
    '@media (min-width:1024px){@media (prefers-color-scheme:dark){.lg\\:dark\\:text-white{--tw-text-opacity:1;color:#fff;color:rgba(255,255,255,var(--tw-text-opacity))}}}',
  ])
})

test('stacking with other variants', ({ instance, sheet }) => {
  assert.is(
    instance.tw('text-#111 hover:text-#222 lg:dark:text-black lg:dark:hover:text-white'),
    'text-#111 hover:text-#222 lg:dark:text-black lg:dark:hover:text-white',
  )
  assert.equal(sheet.target, [
    '.text-\\#111{--tw-text-opacity:1;color:#111;color:rgba(17,17,17,var(--tw-text-opacity))}',
    '.hover\\:text-\\#222:hover{--tw-text-opacity:1;color:#222;color:rgba(34,34,34,var(--tw-text-opacity))}',
    '@media (min-width:1024px){@media (prefers-color-scheme:dark){.lg\\:dark\\:text-black{--tw-text-opacity:1;color:#000;color:rgba(0,0,0,var(--tw-text-opacity))}}}',
    '@media (min-width:1024px){@media (prefers-color-scheme:dark){.lg\\:dark\\:hover\\:text-white:hover{--tw-text-opacity:1;color:#fff;color:rgba(255,255,255,var(--tw-text-opacity))}}}',
  ])
})

test.run()
