import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { ThemeResolver, TW } from 'twind'
import { virtualSheet } from 'twind/sheets'

import { create, strict } from 'twind'
import * as colors from 'twind/colors'

const test = suite('twind/colors')

test('new colors are available', () => {
  const sheet = virtualSheet()
  const { tw } = create({
    sheet,
    mode: strict,
    preflight: false,
    prefix: false,
    theme: { extend: { colors } },
  })

  assert.is(tw('text-sky-200'), 'text-sky-200')
  assert.is(tw('text-rose-200'), 'text-rose-200')
  assert.equal(sheet.target, [
    '.text-rose-200{--tw-text-opacity:1;color:#fecdd3;color:rgba(254,205,211,var(--tw-text-opacity))}',
  ])
})

test('select some colors', () => {
  const sheet = virtualSheet()
  const { tw } = create({
    sheet,
    mode: strict,
    preflight: false,
    prefix: false,
    theme: {
      extend: {
        colors: {
          gray: colors.blueGray,
          blue: colors.lightBlue,
        },
      },
    },
  })

  assert.is(tw('bg-gray-100 text-blue-600'), 'bg-gray-100 text-blue-600')
  assert.equal(sheet.target, [
    '.text-blue-600{--tw-text-opacity:1;color:#0284c7;color:rgba(2,132,199,var(--tw-text-opacity))}',
    '.bg-gray-100{--tw-bg-opacity:1;background-color:#f1f5f9;background-color:rgba(241,245,249,var(--tw-bg-opacity))}',
  ])
})

const getTheme = (tw: TW): ThemeResolver => {
  let theme: ThemeResolver

  tw((context) => {
    theme = context.theme
    return ''
  })

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return theme!
}

test('default theme colors match tailwind v2 config', () => {
  const { tw } = create({ mode: strict, prefix: false })

  const theme = getTheme(tw)

  assert.equal(
    {
      // https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js#L19
      black: colors.black,
      white: colors.white,
      gray: colors.coolGray,
      red: colors.red,
      yellow: colors.amber,
      green: colors.emerald,
      blue: colors.blue,
      indigo: colors.indigo,
      purple: colors.violet,
      pink: colors.pink,
    },
    {
      black: theme('colors', 'black'),
      white: theme('colors', 'white'),
      gray: theme('colors', 'gray'),
      red: theme('colors', 'red'),
      yellow: theme('colors', 'yellow'),
      green: theme('colors', 'green'),
      blue: theme('colors', 'blue'),
      indigo: theme('colors', 'indigo'),
      purple: theme('colors', 'purple'),
      pink: theme('colors', 'pink'),
    },
  )
})

test.run()
