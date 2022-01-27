import { assert, test, afterEach } from 'vitest'

import presetTailwind from '@twind/preset-tailwind'
import { setup, tw, twind, virtual, injectGlobal } from '..'

setup({
  presets: [presetTailwind({ enablePreflight: false })],
})

afterEach(() => tw.clear())

test('inject global styles', () => {
  tw('underline')

  injectGlobal`
    * {
      box-sizing: border-box;
    }

    @font-face {
      font-family: 'Patrick Hand SC';
      font-style: normal;
      font-weight: 400;
      src: local('Patrick Hand SC'),
        local('PatrickHandSC-Regular'),
        url(https://fonts.gstatic.com/s/patrickhandsc/v4/OYFWCgfCR-7uHIovjUZXsZ71Uis0Qeb9Gqo8IZV7ckE.woff2)
          format('woff2');
      unicode-range: U+0100-024f, U+1-1eff,
        U+20a0-20ab, U+20ad-20cf, U+2c60-2c7f,
        U+A720-A7FF;
    }
  `

  tw('shadow')

  assert.deepEqual(tw.target, [
    "@font-face{font-family:'Patrick Hand SC';font-style:normal;font-weight:400;src:local('Patrick Hand SC'), local('PatrickHandSC-Regular'), url(https:  format('woff2');unicode-range:U+0100-024f, U+1-1eff, U+20a0-20ab, U+20ad-20cf, U+2c60-2c7f, U+A720-A7FF}",
    '*,::before,::after{--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}',
    '*{box-sizing:border-box}',
    '.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}',
    '.underline{text-decoration:underline}',
  ])
})

test('inject global styles using custom tw', () => {
  const tw$ = twind(
    {
      presets: [presetTailwind({ enablePreflight: false })],
    },
    virtual(),
  )

  tw$('underline')

  const inject = injectGlobal.bind(tw$)

  inject`
    :root > body {
      @apply bg-white;

      border: 3px solid red;

      @apply text-black;
    }

    html,
    body,
    #__next {
      @apply: h-screen w-screen p-0 m-0 overflow-x-hidden overflow-y-auto;
      font-size: 14px;
    }
    * {
      scrollbar-color: theme(colors.gray.500);

      &::-webkit-scrollbar,
      & scrollbar {
        width: 1rem;
        height: 1rem;
    }
  }
  `

  tw$('shadow')

  assert.deepEqual(tw$.target, [
    '*,::before,::after{--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}',
    ':root > body{--tw-bg-opacity:1;background-color:rgba(255,255,255,var(--tw-bg-opacity));border:3px solid red;--tw-text-opacity:1;color:rgba(0,0,0,var(--tw-text-opacity))}',
    'html,body,#__next{height:100vh;width:100vw;padding:0px;margin:0px;overflow-x:hidden;overflow-y:auto;font-size:14px}',
    '*{scrollbar-color:#6b7280}',
    '*::-webkit-scrollbar,* scrollbar{width:1rem;height:1rem}',
    '.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}',
    '.underline{text-decoration:underline}',
  ])

  assert.lengthOf(tw.target as string[], 0)
})
