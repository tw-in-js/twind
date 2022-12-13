import { assert, test } from 'vitest'

import { css, twind, virtual } from '@twind/core'

import tailwind from '.'

test('preflight on first inject', () => {
  const tw = twind(
    {
      presets: [tailwind()],
    },
    virtual(),
  )

  assert.deepEqual(tw.target, [])

  assert.strictEqual(tw('underline'), 'underline')

  assert.deepEqual(tw.target, [
    '*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}',
    "::before,::after{--tw-content:''}",
    'html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal}',
    'body{margin:0;line-height:inherit}',
    'hr{height:0;color:inherit;border-top-width:1px}',
    'abbr:where([title]){text-decoration:underline dotted}',
    'h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}',
    'a{color:inherit;text-decoration:inherit}',
    'b,strong{font-weight:bolder}',
    'code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-feature-settings:normal;font-size:1em}',
    'small{font-size:80%}',
    'sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}',
    'sub{bottom:-0.25em}',
    'sup{top:-0.5em}',
    'table{text-indent:0;border-color:inherit;border-collapse:collapse}',
    'button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:inherit;color:inherit;margin:0;padding:0}',
    'button,select{text-transform:none}',
    "button,[type='button'],[type='reset'],[type='submit']{-webkit-appearance:button;background-color:transparent;background-image:none}",
    ':-moz-focusring{outline:auto}',
    ':-moz-ui-invalid{box-shadow:none}',
    'progress{vertical-align:baseline}',
    '::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}',
    "[type='search']{-webkit-appearance:textfield;outline-offset:-2px}",
    '::-webkit-search-decoration{-webkit-appearance:none}',
    '::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}',
    'summary{display:list-item}',
    'blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}',
    'fieldset{margin:0;padding:0}',
    'legend{padding:0}',
    'ol,ul,menu{list-style:none;margin:0;padding:0}',
    'textarea{resize:vertical}',
    'input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}',
    'button,[role="button"]{cursor:pointer}',
    ':disabled{cursor:default}',
    'img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}',
    'img,video{max-width:100%;height:auto}',
    '[hidden]{display:none}',
    '.underline{text-decoration-line:underline}',
  ])
})

test('custom preflight', () => {
  const tw = twind(
    {
      presets: [tailwind()],
      preflight: css`
        html,
        body,
        #__next {
          @apply: h-screen w-screen p-0 m-0 overflow-x-hidden overflow-y-auto bg-gray-100;
          font-size: 14px;
        }
        p {
          @apply shadow;
        }
        * {
          scrollbar-color: theme(colors.gray.500);

          &::-webkit-scrollbar,
          & scrollbar {
            width: 1rem;
            height: 1rem;
          }
        }
      `,
    },
    virtual(),
  )

  assert.deepEqual(tw.target, [])

  assert.strictEqual(tw('underline'), 'underline')

  assert.deepEqual(tw.target, [
    '*,::before,::after,::backdrop{--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}',
    '*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}',
    "::before,::after{--tw-content:''}",
    'html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal}',
    'body{margin:0;line-height:inherit}',
    'hr{height:0;color:inherit;border-top-width:1px}',
    'abbr:where([title]){text-decoration:underline dotted}',
    'h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}',
    'a{color:inherit;text-decoration:inherit}',
    'b,strong{font-weight:bolder}',
    'code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-feature-settings:normal;font-size:1em}',
    'small{font-size:80%}',
    'sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}',
    'sub{bottom:-0.25em}',
    'sup{top:-0.5em}',
    'table{text-indent:0;border-color:inherit;border-collapse:collapse}',
    'button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:inherit;color:inherit;margin:0;padding:0}',
    'button,select{text-transform:none}',
    "button,[type='button'],[type='reset'],[type='submit']{-webkit-appearance:button;background-color:transparent;background-image:none}",
    ':-moz-focusring{outline:auto}',
    ':-moz-ui-invalid{box-shadow:none}',
    'progress{vertical-align:baseline}',
    '::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}',
    "[type='search']{-webkit-appearance:textfield;outline-offset:-2px}",
    '::-webkit-search-decoration{-webkit-appearance:none}',
    '::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}',
    'summary{display:list-item}',
    'blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}',
    'fieldset{margin:0;padding:0}',
    'legend{padding:0}',
    'ol,ul,menu{list-style:none;margin:0;padding:0}',
    'textarea{resize:vertical}',
    'input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}',
    'button,[role="button"]{cursor:pointer}',
    ':disabled{cursor:default}',
    'img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}',
    'img,video{max-width:100%;height:auto}',
    '[hidden]{display:none}',
    'html,body,#__next{font-size:14px}',
    'html,body,#__next{height:100vh;width:100vw;padding:0px;margin:0px;overflow-x:hidden;overflow-y:auto;--tw-bg-opacity:1;background-color:rgba(243,244,246,var(--tw-bg-opacity))}',
    'p{--tw-shadow:0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}',
    '*{scrollbar-color:#6b7280}',
    '*::-webkit-scrollbar,* scrollbar{width:1rem;height:1rem}',
    '.underline{text-decoration-line:underline}',
  ])
})

test('preflight with hashed vars', () => {
  const tw = twind(
    {
      presets: [tailwind()],
      hash: true,
    },
    virtual(),
  )

  assert.deepEqual(tw.target, [])

  assert.strictEqual(tw('underline'), '#1utjbpi')

  assert.deepEqual(tw.target, [
    '*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}',
    "::before,::after{--328t5w:''}",
    'html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal}',
    'body{margin:0;line-height:inherit}',
    'hr{height:0;color:inherit;border-top-width:1px}',
    'abbr:where([title]){text-decoration:underline dotted}',
    'h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}',
    'a{color:inherit;text-decoration:inherit}',
    'b,strong{font-weight:bolder}',
    'code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-feature-settings:normal;font-size:1em}',
    'small{font-size:80%}',
    'sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}',
    'sub{bottom:-0.25em}',
    'sup{top:-0.5em}',
    'table{text-indent:0;border-color:inherit;border-collapse:collapse}',
    'button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:inherit;color:inherit;margin:0;padding:0}',
    'button,select{text-transform:none}',
    "button,[type='button'],[type='reset'],[type='submit']{-webkit-appearance:button;background-color:transparent;background-image:none}",
    ':-moz-focusring{outline:auto}',
    ':-moz-ui-invalid{box-shadow:none}',
    'progress{vertical-align:baseline}',
    '::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}',
    "[type='search']{-webkit-appearance:textfield;outline-offset:-2px}",
    '::-webkit-search-decoration{-webkit-appearance:none}',
    '::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}',
    'summary{display:list-item}',
    'blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}',
    'fieldset{margin:0;padding:0}',
    'legend{padding:0}',
    'ol,ul,menu{list-style:none;margin:0;padding:0}',
    'textarea{resize:vertical}',
    'input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}',
    'button,[role="button"]{cursor:pointer}',
    ':disabled{cursor:default}',
    'img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}',
    'img,video{max-width:100%;height:auto}',
    '[hidden]{display:none}',
    '.\\#1utjbpi{text-decoration-line:underline}',
  ])
})
