import type { Instance, Injector, Configuration } from '../types'

import { create, virtualInjector, strict } from '..'

let injector: Injector<string[]>
const setup = (config?: Configuration): Instance =>
  create({ injector, mode: strict, preflight: false, prefix: false, ...config })

beforeEach(() => {
  injector = virtualInjector()
})

test('value can be a token string', () => {
  const { tw } = setup({
    plugins: {
      card: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl',
    },
  })

  expect(tw('mx-auto card my-4')).toBe(
    'mx-auto max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl my-4',
  )
  expect(injector.target).toStrictEqual([
    '.shadow-md{--tw-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);box-shadow:var(--tw-ring-offset-shadow,0 0 transparent),var(--tw-ring-shadow,0 0 transparent),var(--tw-shadow,0 0 transparent)}',
    '.mx-auto{margin-left:auto;margin-right:auto}',
    '.bg-white{--tw-bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--tw-bg-opacity))}',
    '.my-4{margin-bottom:1rem;margin-top:1rem}',
    '.overflow-hidden{overflow:hidden}',
    '.max-w-md{max-width:28rem}',
    '.rounded-xl{border-radius:0.75rem}',
    '@media (min-width: 768px){.md\\:max-w-2xl{max-width:42rem}}',
  ])
})

test('plugin can return new tokens to parse using `tw`', () => {
  const { tw } = setup({
    plugins: {
      btn(args, { theme, tw }) {
        if (args[0]) {
          const color = theme('colors', args[0] + '-500', '')

          if (color) {
            return tw`hover:bg-${args[0]}-500 underline)`
          }
        } else {
          return tw('font-bold py-2 px-4 rounded')
        }
      },
    },
  })

  expect(tw('btn')).toBe('font-bold py-2 px-4 rounded')
  expect(tw('btn-purple cursor-not-allowed')).toBe(
    'hover:bg-purple-500 underline cursor-not-allowed',
  )
  expect(tw('btn cursor-not-allowed btn-purple transition')).toBe(
    'font-bold py-2 px-4 rounded cursor-not-allowed hover:bg-purple-500 underline transition',
  )
  expect(tw('btn sm:focus:btn-purple transition')).toBe(
    'font-bold py-2 px-4 rounded sm:focus:hover:bg-purple-500 sm:focus:underline transition',
  )

  expect(() => tw('btn-unknown-color')).toThrow(/UNKNOWN_DIRECTIVE/)
})
