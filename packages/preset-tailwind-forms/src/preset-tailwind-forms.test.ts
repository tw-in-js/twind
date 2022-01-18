import { assert, test } from 'vitest'

import { twind, virtual } from '@twind/core'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from './preset-tailwind-forms'

test('using default strategy (base)', () => {
  const tw = twind(
    { presets: [presetTailwind({ preflight: false }), presetTailwindForms()] },
    virtual(),
  )

  // trigger inject
  tw('underline')

  assert.deepEqual(tw.target, [
    "[type='text'],[type='email'],[type='url'],[type='password'],[type='number'],[type='date'],[type='datetime-local'],[type='month'],[type='search'],[type='tel'],[type='time'],[type='week'],[multiple],textarea,select{appearance:none;background-color:#fff;border-color:#6b7280;border-width:1px;border-radius:0px;padding-top:0.5rem;padding-right:0.75rem;padding-bottom:0.5rem;padding-left:0.75rem;font-size:1rem;line-height:1.5rem;--tw-shadow:0 0 #0000}",
    "[type='text']:focus,[type='email']:focus,[type='url']:focus,[type='password']:focus,[type='number']:focus,[type='date']:focus,[type='datetime-local']:focus,[type='month']:focus,[type='search']:focus,[type='tel']:focus,[type='time']:focus,[type='week']:focus,[multiple]:focus,textarea:focus,select:focus{outline:2px solid transparent;outline-offset:2px;--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#2563eb;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);border-color:#2563eb}",
    'input::placeholder,textarea::placeholder{color:#6b7280;opacity:1}',
    '::-webkit-datetime-edit-fields-wrapper{padding:0}',
    '::-webkit-date-and-time-value{min-height:1.5em}',
    `select{background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");background-position:right 0.5rem center;background-repeat:no-repeat;background-size:1.5em 1.5em;padding-right:2.5rem;color-adjust:exact}`,
    '[multiple]{background-image:initial;background-position:initial;background-repeat:unset;background-size:initial;padding-right:0.75rem;color-adjust:unset}',
    "[type='checkbox'],[type='radio']{appearance:none;padding:0;color-adjust:exact;display:inline-block;vertical-align:middle;background-origin:border-box;user-select:none;flex-shrink:0;height:1rem;width:1rem;color:#2563eb;background-color:#fff;border-color:#6b7280;border-width:1px;--tw-shadow:0 0 #0000}",
    "[type='checkbox']:focus,[type='radio']:focus{outline:2px solid transparent;outline-offset:2px;--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:2px;--tw-ring-offset-color:#fff;--tw-ring-color:#2563eb;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}",
    "[type='checkbox']:checked,[type='radio']:checked{border-color:transparent;background-color:currentColor;background-size:100% 100%;background-position:center;background-repeat:no-repeat}",
    "[type='checkbox']:checked:hover,[type='checkbox']:checked:focus,[type='radio']:checked:hover,[type='radio']:checked:focus{border-color:transparent;background-color:currentColor}",
    "[type='checkbox']{border-radius:0px}",
    `[type='checkbox']:checked{background-image:url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")}`,
    `[type='checkbox']:indeterminate{background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");border-color:transparent;background-color:currentColor;background-size:100% 100%;background-position:center;background-repeat:no-repeat}`,
    "[type='checkbox']:indeterminate:hover,[type='checkbox']:indeterminate:focus{border-color:transparent;background-color:currentColor}",
    "[type='radio']{border-radius:100%}",
    `[type='radio']:checked{background-image:url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e")}`,
    "[type='file']{background:unset;border-color:inherit;border-width:0;border-radius:0;padding:0;font-size:unset;line-height:inherit}",
    "[type='file']:focus{outline:1px solid ButtonText;outline:1px auto -webkit-focus-ring-color}",
    '.underline{text-decoration:underline}',
  ])
})

test('using default strategy (base) and tailwind preflight', () => {
  const tw = twind(
    {
      presets: [presetTailwind(), presetTailwindForms()],
      preflight: { body: { color: 'theme(colors.gray.100)' } },
    },
    virtual(),
  )

  // trigger inject
  tw('underline')

  assert.deepEqual(tw.target, [
    '*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:currentColor}',
    "::before,::after{--tw-content:''}",
    'html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"}',
    'body{margin:0;line-height:inherit}',
    'hr{height:0;color:inherit;border-top-width:1px}',
    'abbr:where([title]){text-decoration:underline dotted}',
    'h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}',
    'a{color:inherit;text-decoration:inherit}',
    'b,strong{font-weight:bolder}',
    'code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:1em}',
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
    "[type='text'],[type='email'],[type='url'],[type='password'],[type='number'],[type='date'],[type='datetime-local'],[type='month'],[type='search'],[type='tel'],[type='time'],[type='week'],[multiple],textarea,select{appearance:none;background-color:#fff;border-color:#6b7280;border-width:1px;border-radius:0px;padding-top:0.5rem;padding-right:0.75rem;padding-bottom:0.5rem;padding-left:0.75rem;font-size:1rem;line-height:1.5rem;--tw-shadow:0 0 #0000}",
    "[type='text']:focus,[type='email']:focus,[type='url']:focus,[type='password']:focus,[type='number']:focus,[type='date']:focus,[type='datetime-local']:focus,[type='month']:focus,[type='search']:focus,[type='tel']:focus,[type='time']:focus,[type='week']:focus,[multiple]:focus,textarea:focus,select:focus{outline:2px solid transparent;outline-offset:2px;--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#2563eb;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);border-color:#2563eb}",
    'input::placeholder,textarea::placeholder{color:#6b7280;opacity:1}',
    '::-webkit-datetime-edit-fields-wrapper{padding:0}',
    '::-webkit-date-and-time-value{min-height:1.5em}',
    `select{background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");background-position:right 0.5rem center;background-repeat:no-repeat;background-size:1.5em 1.5em;padding-right:2.5rem;color-adjust:exact}`,
    '[multiple]{background-image:initial;background-position:initial;background-repeat:unset;background-size:initial;padding-right:0.75rem;color-adjust:unset}',
    "[type='checkbox'],[type='radio']{appearance:none;padding:0;color-adjust:exact;display:inline-block;vertical-align:middle;background-origin:border-box;user-select:none;flex-shrink:0;height:1rem;width:1rem;color:#2563eb;background-color:#fff;border-color:#6b7280;border-width:1px;--tw-shadow:0 0 #0000}",
    "[type='checkbox']:focus,[type='radio']:focus{outline:2px solid transparent;outline-offset:2px;--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:2px;--tw-ring-offset-color:#fff;--tw-ring-color:#2563eb;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}",
    "[type='checkbox']:checked,[type='radio']:checked{border-color:transparent;background-color:currentColor;background-size:100% 100%;background-position:center;background-repeat:no-repeat}",
    "[type='checkbox']:checked:hover,[type='checkbox']:checked:focus,[type='radio']:checked:hover,[type='radio']:checked:focus{border-color:transparent;background-color:currentColor}",
    "[type='checkbox']{border-radius:0px}",
    `[type='checkbox']:checked{background-image:url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")}`,
    `[type='checkbox']:indeterminate{background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");border-color:transparent;background-color:currentColor;background-size:100% 100%;background-position:center;background-repeat:no-repeat}`,
    "[type='checkbox']:indeterminate:hover,[type='checkbox']:indeterminate:focus{border-color:transparent;background-color:currentColor}",
    "[type='radio']{border-radius:100%}",
    `[type='radio']:checked{background-image:url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e")}`,
    "[type='file']{background:unset;border-color:inherit;border-width:0;border-radius:0;padding:0;font-size:unset;line-height:inherit}",
    "[type='file']:focus{outline:1px solid ButtonText;outline:1px auto -webkit-focus-ring-color}",
    'body{color:#f3f4f6}',
    '.underline{text-decoration:underline}',
  ])
})

test('using class strategy', () => {
  const tw = twind(
    { presets: [presetTailwind({ preflight: false }), presetTailwindForms({ strategy: 'class' })] },
    virtual(),
  )

  // trigger inject
  assert.strictEqual(tw('form-input px-4 py-3 rounded-full'), 'form-input px-4 py-3 rounded-full')

  assert.deepEqual(tw.target, [
    '.form-input,.form-textarea,.form-select,.form-multiselect{appearance:none;background-color:#fff;border-color:#6b7280;border-width:1px;border-radius:0px;padding-top:0.5rem;padding-right:0.75rem;padding-bottom:0.5rem;padding-left:0.75rem;font-size:1rem;line-height:1.5rem;--tw-shadow:0 0 #0000}',
    '.form-input:focus,.form-textarea:focus,.form-select:focus,.form-multiselect:focus{outline:2px solid transparent;outline-offset:2px;--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#2563eb;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);border-color:#2563eb}',
    '.form-input::placeholder,.form-textarea::placeholder{color:#6b7280;opacity:1}',
    '.form-input::-webkit-datetime-edit-fields-wrapper{padding:0}',
    '.form-input::-webkit-date-and-time-value{min-height:1.5em}',
    '.px-4{padding-left:1rem;padding-right:1rem}',
    '.py-3{padding-top:0.75rem;padding-bottom:0.75rem}',
    '.rounded-full{border-radius:9999px}',
  ])
})

test('using class strategy with hash', () => {
  const tw = twind(
    {
      presets: [presetTailwind({ preflight: false }), presetTailwindForms({ strategy: 'class' })],
      hash: true,
    },
    virtual(),
  )

  // trigger inject
  assert.strictEqual(tw('form-input px-4 py-3 rounded-full'), '#jqts61 #icr44k #m9qv18 #105ip96')

  assert.deepEqual(tw.target, [
    '.\\#1mevk01,.\\#l9u32f,.\\#1ankjuu,.\\#14uuokj{appearance:none;background-color:#fff;border-color:#6b7280;border-width:1px;border-radius:0px;padding-top:0.5rem;padding-right:0.75rem;padding-bottom:0.5rem;padding-left:0.75rem;font-size:1rem;line-height:1.5rem;--1qg7wmx:0 0 #0000}',
    '.\\#1mevk01:focus,.\\#l9u32f:focus,.\\#1ankjuu:focus,.\\#14uuokj:focus{outline:2px solid transparent;outline-offset:2px;--1m9cmzd:var(--rz3pvs,/*!*/ /*!*/);--iljcf6:0px;--1q9ryqm:#fff;--g5efu5:#2563eb;--1s0t3ke:var(--1m9cmzd) 0 0 0 var(--iljcf6) var(--1q9ryqm);--zxn4nw:var(--1m9cmzd) 0 0 0 calc(1px + var(--iljcf6)) var(--g5efu5);box-shadow:var(--1s0t3ke), var(--zxn4nw), var(--1qg7wmx);border-color:#2563eb}',
    '.\\#1mevk01::placeholder,.\\#l9u32f::placeholder{color:#6b7280;opacity:1}',
    '.\\#1mevk01::-webkit-datetime-edit-fields-wrapper{padding:0}',
    '.\\#1mevk01::-webkit-date-and-time-value{min-height:1.5em}',
    '.\\#icr44k{padding-left:1rem;padding-right:1rem}',
    '.\\#m9qv18{padding-top:0.75rem;padding-bottom:0.75rem}',
    '.\\#105ip96{border-radius:9999px}',
  ])
})
