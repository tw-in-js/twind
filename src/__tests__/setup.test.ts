import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { virtualSheet } from 'twind/sheets'

import { create, strict } from 'twind'
import { apply, css } from 'twind/css'

const test = suite('setup')

test('theme extend section callback', () => {
  const sheet = virtualSheet()
  const { tw } = create({
    sheet,
    mode: strict,
    preflight: false,
    prefix: false,
    theme: {
      extend: {
        backgroundImage: (theme) => ({
          // Use a own gradient
          'gradient-radial': `radial-gradient(${theme('colors.blue.500')}, ${theme(
            'colors.red.500',
          )});`,
          // Integrate with gradient colors stops (from-*, via-*, to-*)
          'gradient-15':
            'linear-gradient(.15turn, var(--tw-gradient-stops,var(--tw-gradient-from,transparent),var(--tw-gradient-to,transparent)))',
        }),
      },
    },
  })

  assert.is(tw`bg-gradient-radial`, 'bg-gradient-radial')
  assert.equal(sheet.target, [
    '.bg-gradient-radial{background-image:radial-gradient(#3b82f6, #ef4444);}',
  ])
  sheet.reset()

  assert.is(
    tw`bg-gradient-15 from-green-400 to-blue-500`,
    'bg-gradient-15 from-green-400 to-blue-500',
  )
  assert.equal(sheet.target, [
    '.from-green-400{--tw-gradient-from:#34d399;--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to,rgba(52,211,153,0))}',
    '.bg-gradient-15{background-image:linear-gradient(.15turn, var(--tw-gradient-stops,var(--tw-gradient-from,transparent),var(--tw-gradient-to,transparent)))}',
    '.to-blue-500{--tw-gradient-to:#3b82f6}',
  ])
  sheet.reset()
})

test('theme extend value callback', () => {
  const sheet = virtualSheet()
  const { tw } = create({
    sheet,
    mode: strict,
    preflight: false,
    prefix: false,
    theme: {
      fill: (theme) => theme('colors'),
    },
  })

  assert.is(tw`fill-red-500`, 'fill-red-500')
  assert.equal(sheet.target, ['.fill-red-500{fill:#ef4444}'])
})

test('important', () => {
  const sheet = virtualSheet()
  const { tw } = create({
    sheet,
    mode: strict,
    preflight: false,
    prefix: false,
    important: true,
  })

  assert.is(
    tw`underline ${apply(`text-xl`)} ${css({ color: '#ef4444' })}`,
    'underline tw-nziaos tw-yinfv4',
  )
  assert.equal(sheet.target, [
    '.tw-nziaos{font-size:1.25rem !important;line-height:1.75rem !important}',
    '.underline{text-decoration:underline !important}',
    '.tw-yinfv4{color:#ef4444 !important}',
  ])
})

test.run()
