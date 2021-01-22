import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance, Configuration } from '../types'
import type { VirtualSheet } from '../sheets/index'

import { virtualSheet } from '../sheets/index'
import { create, strict } from '../index'

const test = suite<{
  sheet: VirtualSheet
  setup: (config?: Configuration) => Instance
}>('plugins')

test.before.each((context) => {
  context.sheet = virtualSheet()
  context.setup = (config?: Configuration): Instance =>
    create({ sheet: context.sheet, mode: strict, preflight: false, prefix: false, ...config })
})

test('value can be a token string', ({ setup, sheet }) => {
  const { tw } = setup({
    plugins: {
      card: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl',
    },
  })

  assert.is(
    tw('mx-auto card my-4'),
    'mx-auto max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl my-4',
  )
  assert.equal(sheet.target, [
    '*{--tw-shadow:0 0 transparent}',
    '.mx-auto{margin-left:auto;margin-right:auto}',
    '.bg-white{--tw-bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--tw-bg-opacity))}',
    '.shadow-md{--tw-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);box-shadow:var(--tw-ring-offset-shadow,0 0 transparent),var(--tw-ring-shadow,0 0 transparent),var(--tw-shadow)}',
    '.my-4{margin-bottom:1rem;margin-top:1rem}',
    '.overflow-hidden{overflow:hidden}',
    '.max-w-md{max-width:28rem}',
    '.rounded-xl{border-radius:0.75rem}',
    '@media (min-width:768px){.md\\:max-w-2xl{max-width:42rem}}',
  ])
})

test('plugin can return new tokens to parse using `tw`', ({ setup }) => {
  const { tw } = setup({
    plugins: {
      btn(args, { theme, tw }) {
        if (args[0]) {
          const color = theme('colors', args[0] + '-500', '')

          if (color) {
            return tw`hover:bg(${args[0] + '-500'}) underline)`
          }
        } else {
          return tw('font-bold py-2 px-4 rounded')
        }
      },
    },
  })

  assert.is(tw('btn'), 'font-bold py-2 px-4 rounded')
  assert.is(tw('btn-purple cursor-not-allowed'), 'hover:bg-purple-500 underline cursor-not-allowed')
  assert.is(
    tw('btn cursor-not-allowed btn-purple transition'),
    'font-bold py-2 px-4 rounded cursor-not-allowed hover:bg-purple-500 underline transition',
  )
  assert.is(
    tw('btn sm:focus:btn-purple transition'),
    'font-bold py-2 px-4 rounded sm:focus:hover:bg-purple-500 sm:focus:underline transition',
  )

  assert.throws(() => tw('btn-unknown-color'), /UNKNOWN_DIRECTIVE/)
})

test.run()
