import { assert, test } from 'vitest'

import presetTailwind from '@twind/preset-tailwind'

import { twind, virtual, setup, inject } from '.'

setup({ presets: [presetTailwind({ enablePreflight: false })] }, virtual())

test('expand class names', () => {
  const html = inject(
    `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <main class='h-screen bg-purple-400 flex items-center justify-center'>
          <h1 class="font-bold text-(center 5xl white sm:gray-800 md:pink-700) after:content-['xxx']">
            This is <span class=font-(bold,sans)>Twind</span>!
          </h1>
        </main>
      <body>
    </html>
    `,
  )

  assert.strictEqual(
    html,
    `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style data-twind>.text-white{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}.flex{display:flex}.h-screen{height:100vh}.bg-purple-400{--tw-bg-opacity:1;background-color:rgba(192,132,252,var(--tw-bg-opacity))}.text-5xl{font-size:3rem;line-height:1}.font-bold{font-weight:700}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"}.items-center{align-items:center}.justify-center{justify-content:center}.text-center{text-align:center}.after\\:content-\\[\\'xxx\\'\\]:after{--tw-content:'xxx';content:var(--tw-content)}@media (min-width:640px){.sm\\:text-gray-800{--tw-text-opacity:1;color:rgba(31,41,55,var(--tw-text-opacity))}}@media (min-width:768px){.md\\:text-pink-700{--tw-text-opacity:1;color:rgba(190,24,93,var(--tw-text-opacity))}}</style></head>
      <body>
        <main class='h-screen bg-purple-400 flex items-center justify-center'>
          <h1 class="text-white text-5xl font-bold text-center after:content-['xxx'] sm:text-gray-800 md:text-pink-700">
            This is <span class="font-bold font-sans">Twind</span>!
          </h1>
        </main>
      <body>
    </html>
    `,
  )
})
