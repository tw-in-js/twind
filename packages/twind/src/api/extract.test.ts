import { assert, test } from 'vitest'

import presetTailwind from '@twind/preset-tailwind'

import { twind, virtual, extract } from '.'

test('expand class names', () => {
  const tw = twind({ presets: [presetTailwind({ enablePreflight: false })] }, virtual())

  const { html, css } = extract(
    `
    <main class='h-screen bg-purple-400 flex items-center justify-center'>
      <h1 class="font-bold text-(center 5xl white sm:gray-800 md:pink-700) after:content-['xxx']">
        This is <span class=font-(bold,sans)>Twind</span>!
      </h1>
    </main>
    `,
    tw,
  )

  assert.strictEqual(
    html,
    `
    <main class='h-screen bg-purple-400 flex items-center justify-center'>
      <h1 class="text-white text-5xl font-bold text-center after:content-['xxx'] sm:text-gray-800 md:text-pink-700">
        This is <span class="font-bold font-sans">Twind</span>!
      </h1>
    </main>
    `,
  )

  assert.strictEqual(
    css,
    [
      '.text-white{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}',
      '.flex{display:flex}',
      '.h-screen{height:100vh}',
      '.bg-purple-400{--tw-bg-opacity:1;background-color:rgba(192,132,252,var(--tw-bg-opacity))}',
      '.text-5xl{font-size:3rem;line-height:1}',
      '.font-bold{font-weight:700}',
      '.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"}',
      '.items-center{align-items:center}',
      '.justify-center{justify-content:center}',
      '.text-center{text-align:center}',
      ".after\\:content-\\[\\'xxx\\'\\]:after{--tw-content:'xxx';content:var(--tw-content)}",
      '@media (min-width:640px){.sm\\:text-gray-800{--tw-text-opacity:1;color:rgba(31,41,55,var(--tw-text-opacity))}}',
      '@media (min-width:768px){.md\\:text-pink-700{--tw-text-opacity:1;color:rgba(190,24,93,var(--tw-text-opacity))}}',
    ].join(''),
  )
})

test('hash class names', () => {
  const tw = twind({ presets: [presetTailwind({ enablePreflight: false })], hash: true }, virtual())

  const { html, css } = extract(
    `
    <main class="h-screen bg-purple-400 flex items-center justify-center">
      <h1 class="text(center 5xl white sm:gray-800 md:pink-700)">
        This is <span class="font-bold">Twind</span>!
      </h1>
    </main>
    `,
    tw,
  )

  assert.strictEqual(
    html,
    `
    <main class="#e9txhd #13zmkow #c7xh85 #tl02vf #eh6hfv">
      <h1 class="#366evo #awuz9m #1vaw68m #qvvf3j #15z8gvd">
        This is <span class="#wd565q">Twind</span>!
      </h1>
    </main>
    `,
  )

  assert.strictEqual(
    css,
    [
      '.\\#366evo{--dxr4o8:1;color:rgba(255,255,255,var(--dxr4o8))}',
      '.\\#13zmkow{height:100vh}',
      '.\\#e9txhd{display:flex}',
      '.\\#awuz9m{font-size:3rem;line-height:1}',
      '.\\#c7xh85{--17cwy6m:1;background-color:rgba(192,132,252,var(--17cwy6m))}',
      '.\\#1vaw68m{text-align:center}',
      '.\\#eh6hfv{justify-content:center}',
      '.\\#tl02vf{align-items:center}',
      '.\\#wd565q{font-weight:700}',
      '@media (min-width:640px){.\\#qvvf3j{--dxr4o8:1;color:rgba(31,41,55,var(--dxr4o8))}}',
      '@media (min-width:768px){.\\#15z8gvd{--dxr4o8:1;color:rgba(190,24,93,var(--dxr4o8))}}',
    ].join(''),
  )
})
