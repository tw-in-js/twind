import { create, virtualInjector, strict } from '..'

test('add preflight styles', () => {
  const injector = virtualInjector()
  create({ injector, mode: strict })

  expect(injector.target).toStrictEqual([
    'fieldset{margin:0;padding:0}',
    '::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}',
    'blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}',
    'button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}',
    'textarea{resize:vertical}',
    'input::placeholder,textarea::placeholder{color:#a1a1aa}',
    'button,[role="button"]{cursor:pointer}',
    ':-moz-focusring{outline:1px dotted ButtonText}',
    'legend{padding:0}',
    '::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}',
    'summary{display:list-item}',
    'button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;margin:0;padding:0;line-height:inherit;color:inherit}',
    'sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}',
    'ol,ul{list-style:none;margin:0;padding:0}',
    'html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"}',
    'body{margin:0;font-family:inherit;line-height:inherit}',
    'table{text-indent:0;border-color:inherit;border-collapse:collapse}',
    'button{background-color:transparent;background-image:none}',
    '*,::before,::after{box-sizing:border-box;border:0 solid #e5e7eb}',
    'h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}',
    'a{color:inherit;text-decoration:inherit}',
    '::-moz-focus-inner{border-style:none;padding:0}',
    '[type="search"]{-webkit-appearance:textfield;outline-offset:-2px}',
    'pre,code,kbd,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:1em}',
    'img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}',
    'img,video{max-width:100%;height:auto}',
    ':root{tab-size:4;-moz-tab-size:4}',
    'img{border-style:solid}',
    'button,select{text-transform:none}',
    ':-moz-ui-invalid{box-shadow:none}',
    'progress{vertical-align:baseline}',
    'abbr[title]{text-decoration:underline dotted}',
    'b,strong{font-weight:bolder}',
    'sub{bottom:-0.25em}',
    'sup{top:-0.5em}',
    'hr{height:0;color:inherit;border-top-width:1px}',
    'button,[type="button"],[type="reset"],[type="submit"]{-webkit-appearance:button}',
    '::-webkit-search-decoration{-webkit-appearance:none}',
  ])
})

test('add preflight styles with custom theme', () => {
  const injector = virtualInjector()
  create({
    injector,
    theme: {
      extend: {
        fontFamily: { sans: 'ui-sans-serif', mono: 'ui-monospace' },
        borderColor: { DEFAULT: '#222' },
        placeholderColor: { DEFAULT: '#333' },
      },
    },
  })

  expect(injector.target).toContain(
    'html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif}',
  )
  expect(injector.target).toContain('*,::before,::after{box-sizing:border-box;border:0 solid #222}')
  expect(injector.target).toContain('input::placeholder,textarea::placeholder{color:#333}')
  expect(injector.target).toContain('pre,code,kbd,samp{font-family:ui-monospace;font-size:1em}')
})

test('add preflight styles with theme missing some values', () => {
  const injector = virtualInjector()
  create({
    injector,
    theme: {
      fontFamily: { sans: 'ui-sans-serif', mono: 'ui-monospace' },
      borderColor: {},
      placeholderColor: {},
    },
  })

  expect(injector.target).toContain(
    '*,::before,::after{box-sizing:border-box;border:0 solid currentColor}',
  )
  expect(injector.target).toContain('input::placeholder,textarea::placeholder{color:#a1a1aa}')
})
