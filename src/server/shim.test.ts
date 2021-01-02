import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { virtualSheet } from '../sheets/index'
import { create, strict } from '../index'
import { shim } from './index'

const test = suite('server/shim')

test('expand class names with preflight', () => {
  const sheet = virtualSheet()
  const { tw } = create({
    sheet,
    mode: strict,
    prefix: false,
  })

  const html = shim(
    `
    <main class="h-screen bg-purple-400 flex items-center justify-center">
      <h1 class="text(center 5xl white sm:gray-800 md:pink-700)">
        This is <span class="font-bold">Twind</span>!
      </h1>
    </main>
    `,
    tw,
  )

  assert.is(
    html,
    `
    <main class="h-screen bg-purple-400 flex items-center justify-center">
      <h1 class="text-center text-5xl text-white sm:text-gray-800 md:text-pink-700">
        This is <span class="font-bold">Twind</span>!
      </h1>
    </main>
    `,
  )
  assert.equal(sheet.target, [
    'button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;margin:0;padding:0;line-height:inherit;color:inherit}',
    'sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}',
    'html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"}',
    'table{text-indent:0;border-color:inherit;border-collapse:collapse}',
    'hr{height:0;color:inherit;border-top-width:1px}',
    '::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}',
    'button{background-color:transparent;background-image:none}',
    'body{font-family:inherit;line-height:inherit}',
    '*,::before,::after{box-sizing:border-box;border:0 solid #e5e7eb}',
    'h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}',
    'a{color:inherit;text-decoration:inherit}',
    '::-moz-focus-inner{border-style:none;padding:0}',
    '[type="search"]{-webkit-appearance:textfield;outline-offset:-2px}',
    'pre,code,kbd,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:1em}',
    'img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}',
    'img,video{max-width:100%;height:auto}',
    'body,blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre,fieldset,ol,ul{margin:0}',
    'button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}',
    'fieldset,ol,ul,legend{padding:0}',
    'textarea{resize:vertical}',
    'input::placeholder,textarea::placeholder{color:#a1a1aa}',
    'button,[role="button"]{cursor:pointer}',
    ':-moz-focusring{outline:1px dotted ButtonText}',
    '::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}',
    'summary{display:list-item}',
    ':root{tab-size:4}',
    'ol,ul{list-style:none}',
    'img{border-style:solid}',
    'button,select{text-transform:none}',
    ':-moz-ui-invalid{box-shadow:none}',
    'progress{vertical-align:baseline}',
    'abbr[title]{text-decoration:underline dotted}',
    'b,strong{font-weight:bolder}',
    'sub{bottom:-0.25em}',
    'sup{top:-0.5em}',
    'button,[type="button"],[type="reset"],[type="submit"]{-webkit-appearance:button}',
    '::-webkit-search-decoration{-webkit-appearance:none}',
    '.text-white{--tw-text-opacity:1;color:#fff;color:rgba(255,255,255,var(--tw-text-opacity))}',
    '.bg-purple-400{--tw-bg-opacity:1;background-color:#a78bfa;background-color:rgba(167,139,250,var(--tw-bg-opacity))}',
    '.text-5xl{font-size:3rem;line-height:1}',
    '.h-screen{height:100vh}',
    '.flex{display:flex}',
    '.items-center{align-items:center}',
    '.justify-center{justify-content:center}',
    '.text-center{text-align:center}',
    '.font-bold{font-weight:700}',
    '@media (min-width: 640px){.sm\\:text-gray-800{--tw-text-opacity:1;color:#1f2937;color:rgba(31,41,55,var(--tw-text-opacity))}}',
    '@media (min-width: 768px){.md\\:text-pink-700{--tw-text-opacity:1;color:#be185d;color:rgba(190,24,93,var(--tw-text-opacity))}}',
  ])
})

test('hash class names', () => {
  const sheet = virtualSheet()
  const { tw } = create({
    sheet,
    mode: strict,
    preflight: false,
    hash: true,
    prefix: false,
  })

  const html = shim(
    `
    <main class="h-screen bg-purple-400 flex items-center justify-center">
      <h1 class="text(center 5xl white sm:gray-800 md:pink-700)">
        This is <span class="font-bold">Twind</span>!
      </h1>
    </main>
    `,
    tw,
  )

  assert.is(
    html,
    `
    <main class="tw-s71qpw tw-15v4579 tw-1sv1rgs tw-6q7m7e tw-1u5qtu">
      <h1 class="tw-5693iz tw-1eqnqhy tw-1ehy2ck tw-f8j2my tw-oxtcu9">
        This is <span class="tw-b13grf">Twind</span>!
      </h1>
    </main>
    `,
  )
  assert.equal(sheet.target, [
    '.tw-1ehy2ck{--tw-dxr4o8:1;color:#fff;color:rgba(255,255,255,var(--tw-dxr4o8))}',
    '.tw-15v4579{--tw-17cwy6m:1;background-color:#a78bfa;background-color:rgba(167,139,250,var(--tw-17cwy6m))}',
    '.tw-1eqnqhy{font-size:3rem;line-height:1}',
    '.tw-s71qpw{height:100vh}',
    '.tw-1sv1rgs{display:flex}',
    '.tw-6q7m7e{align-items:center}',
    '.tw-1u5qtu{justify-content:center}',
    '.tw-5693iz{text-align:center}',
    '.tw-b13grf{font-weight:700}',
    '@media (min-width: 640px){.tw-f8j2my{--tw-dxr4o8:1;color:#1f2937;color:rgba(31,41,55,var(--tw-dxr4o8))}}',
    '@media (min-width: 768px){.tw-oxtcu9{--tw-dxr4o8:1;color:#be185d;color:rgba(190,24,93,var(--tw-dxr4o8))}}',
  ])
})

test.run()
