import { assert, test, afterEach } from 'vitest'

import presetTailwind from '@twind/preset-tailwind'
import { setup, tw, twind, virtual, injectGlobal } from '..'

setup({
  presets: [presetTailwind({ disablePreflight: true })],
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
    "/*!0,0*/@font-face{font-family:'Patrick Hand SC';font-style:normal;font-weight:400;src:local('Patrick Hand SC'), local('PatrickHandSC-Regular'), url(https://fonts.gstatic.com/s/patrickhandsc/v4/OYFWCgfCR-7uHIovjUZXsZ71Uis0Qeb9Gqo8IZV7ckE.woff2) format('woff2');unicode-range:U+0100-024f, U+1-1eff, U+20a0-20ab, U+20ad-20cf, U+2c60-2c7f, U+A720-A7FF}",
    '/*!0,1v*/*,::before,::after{--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}',
    '/*!27wr28,y*/*{box-sizing:border-box}',
    '/*!dbgidc,u,shadow*/.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}',
    '/*!dbgidc,11,underline*/.underline{text-decoration-line:underline}',
  ])
})

test('inject global styles using custom tw', () => {
  const tw$ = twind(
    {
      presets: [presetTailwind({ disablePreflight: true })],
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
    ':root > body{border:3px solid red}',
    ':root > body{--tw-bg-opacity:1;background-color:rgba(255,255,255,var(--tw-bg-opacity))}',
    ':root > body{--tw-text-opacity:1;color:rgba(0,0,0,var(--tw-text-opacity))}',
    'html,body,#__next{font-size:14px}',
    'html,body,#__next{height:100vh;width:100vw;padding:0px;margin:0px;overflow-x:hidden;overflow-y:auto}',
    '*{scrollbar-color:#6b7280}',
    '*::-webkit-scrollbar,* scrollbar{width:1rem;height:1rem}',
    '.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}',
    '.underline{text-decoration-line:underline}',
  ])

  assert.lengthOf(tw.target as string[], 0)
})

test('layers', () => {
  injectGlobal`
    @layer components {
      .select2-dropdown {
        @apply rounded-b-lg shadow-md;
      }
      .select2-search {
        @apply border border-gray-300 rounded;
      }
      .select2-results__group {
        @apply text-lg font-bold text-gray-900;
      }
      /* ... */
    }

    /* rules with base are not sorted */
    h1 {
      @apply text-2xl;
    }
    h2 {
      @apply text-xl;
    }
    /* ... */
  `

  assert.deepEqual(tw.target, [
    '/*!0,1v*/*,::before,::after{--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}',
    '/*!27wr28,0*/h1{font-size:1.5rem;line-height:2rem}',
    '/*!27wr28,0*/h2{font-size:1.25rem;line-height:1.75rem}',
    '/*!4fti4g,0*/.select2-dropdown{border-bottom-left-radius:0.5rem;border-bottom-right-radius:0.5rem;--tw-shadow:0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);--tw-shadow-colored:0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}',
    '/*!4fti4g,0*/.select2-search{border-width:1px;--tw-border-opacity:1;border-color:rgba(209,213,219,var(--tw-border-opacity));border-radius:0.25rem}',
    '/*!4fti4g,0*/.select2-results__group{font-size:1.125rem;line-height:1.75rem;font-weight:700;--tw-text-opacity:1;color:rgba(17,24,39,var(--tw-text-opacity))}',
  ])
})

test('multiple @font-face and @import using template literal', () => {
  injectGlobal`
    @import url(//fonts.googleapis.com/css?family=Open+Sans);
    @import url(https://fonts.googleapis.com/css?family=Tangerine:400,300italic,600);

    @font-face {
      font-family: 'MyWebFont';
      src:
        url('myfont.woff2') format('woff2'),
        url('myfont.woff') format('woff'),
        url('myfont.ttf') format('truetype');
    }

    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      src:
        local('Roboto'),
        local('Roboto-Regular'),
        url(fonts/roboto-v18-latin-regular.woff2) format('woff2'),
        url(fonts/roboto-v18-latin-regular.woff) format('woff');
    }
  `

  assert.deepEqual(tw.target, [
    '/*!-1,0*/@import url(//fonts.googleapis.com/css?family=Open+Sans)',
    '/*!-1,0*/@import url(https://fonts.googleapis.com/css?family=Tangerine:400,300italic,600)',
    "/*!0,0*/@font-face{font-family:'MyWebFont';src:url('myfont.woff2') format('woff2'), url('myfont.woff') format('woff'), url('myfont.ttf') format('truetype')}",
    "/*!0,0*/@font-face{font-family:'Roboto';font-style:normal;font-weight:400;src:local('Roboto'), local('Roboto-Regular'), url(fonts/roboto-v18-latin-regular.woff2) format('woff2'), url(fonts/roboto-v18-latin-regular.woff) format('woff')}",
  ])
})

test('multiple @font-face and @import using object', () => {
  injectGlobal({
    '@import': [
      'url(//fonts.googleapis.com/css?family=Open+Sans)',
      'url(https://fonts.googleapis.com/css?family=Tangerine:400,300italic,600)',
    ],

    '@font-face': [
      {
        fontFamily: "'MyWebFont'",
        src: [
          "url('myfont.woff2') format('woff2')",
          "url('myfont.woff') format('woff')",
          "url('myfont.ttf') format('truetype')",
        ].join(','),
      },
      {
        fontFamily: "'Roboto'",
        fontStyle: 'normal',
        fontWeight: '400',
        src: [
          "local('Roboto')",
          "local('Roboto-Regular')",
          "url(fonts/roboto-v18-latin-regular.woff2) format('woff2')",
          "url(fonts/roboto-v18-latin-regular.woff) format('woff')",
        ].join(','),
      },
    ],
  })

  assert.deepEqual(tw.target, [
    '/*!-1,0*/@import url(//fonts.googleapis.com/css?family=Open+Sans)',
    '/*!-1,0*/@import url(https://fonts.googleapis.com/css?family=Tangerine:400,300italic,600)',
    "/*!0,0*/@font-face{font-family:'MyWebFont';src:url('myfont.woff2') format('woff2'),url('myfont.woff') format('woff'),url('myfont.ttf') format('truetype')}",
    "/*!0,0*/@font-face{font-family:'Roboto';font-style:normal;font-weight:400;src:local('Roboto'),local('Roboto-Regular'),url(fonts/roboto-v18-latin-regular.woff2) format('woff2'),url(fonts/roboto-v18-latin-regular.woff) format('woff')}",
  ])
})
