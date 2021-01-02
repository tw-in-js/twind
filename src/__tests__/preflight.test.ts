import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { virtualSheet } from '../sheets/index'
import { create, strict } from '../index'

const test = suite('preflight')

test('add preflight styles', () => {
  const sheet = virtualSheet()

  const { tw } = create({ sheet, mode: strict })

  // Ensure utitilities are added after base styles
  assert.is(tw`text-center`, 'text-center')

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
    'a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}',
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
    ':root{-moz-tab-size:4;tab-size:4}',
    'ol,ul{list-style:none}',
    'img{border-style:solid}',
    'button,select{text-transform:none}',
    ':-moz-ui-invalid{box-shadow:none}',
    'progress{vertical-align:baseline}',
    'abbr[title]{-webkit-text-decoration:underline dotted;text-decoration:underline dotted}',
    'b,strong{font-weight:bolder}',
    'sub{bottom:-0.25em}',
    'sup{top:-0.5em}',
    'button,[type="button"],[type="reset"],[type="submit"]{-webkit-appearance:button}',
    '::-webkit-search-decoration{-webkit-appearance:none}',
    '.text-center{text-align:center}',
  ])
})

test('add preflight styles with custom theme', () => {
  const sheet = virtualSheet()
  create({
    sheet,
    theme: {
      extend: {
        fontFamily: { sans: 'ui-sans-serif', mono: 'ui-monospace' },
        borderColor: { DEFAULT: '#222' },
        placeholderColor: { DEFAULT: '#333' },
      },
    },
  })

  assert.ok(
    sheet.target.includes(
      'html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif}',
    ),
  )
  assert.ok(sheet.target.includes('*,::before,::after{box-sizing:border-box;border:0 solid #222}'))
  assert.ok(sheet.target.includes('input::placeholder,textarea::placeholder{color:#333}'))
  assert.ok(sheet.target.includes('pre,code,kbd,samp{font-family:ui-monospace;font-size:1em}'))
})

test('add preflight styles with theme missing some values', () => {
  const sheet = virtualSheet()
  create({
    sheet,
    theme: {
      fontFamily: { sans: 'ui-sans-serif', mono: 'ui-monospace' },
      borderColor: {},
      placeholderColor: {},
    },
  })

  assert.ok(
    sheet.target.includes('*,::before,::after{box-sizing:border-box;border:0 solid currentColor}'),
  )
  assert.ok(sheet.target.includes('input::placeholder,textarea::placeholder{color:#a1a1aa}'))
})

test('use custom preflight styles', () => {
  const sheet = virtualSheet()
  create({
    sheet,
    preflight: (css) => ({ html: css.html }),
  })

  assert.equal(sheet.target, [
    'html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"}',
  ])
})

test('use custom preflight with fallback to built-in', () => {
  const sheet = virtualSheet()
  create({
    sheet,
    preflight: () => {
      /* no-op */
    },
  })

  assert.is(sheet.target.length, 37)
})

test('use custom preflight JSON style', () => {
  const sheet = virtualSheet()
  create({
    sheet,
    preflight: {
      '@font-face': {
        'font-family': 'Baloo',
        src: 'url(./Baloo-Regular.ttf)',
      },
    },
  })

  assert.is(sheet.target.length, 38)
  assert.ok(sheet.target.includes('@font-face{font-family:Baloo;src:url(./Baloo-Regular.ttf)}'))
})

test.run()
