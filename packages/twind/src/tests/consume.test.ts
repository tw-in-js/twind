import { assert, test } from 'vitest'

import presetTailwind from '@twind/preset-tailwind'

import { twind, virtual, consume } from '..'

test('expand class names', () => {
  const tw = twind({ presets: [presetTailwind({ disablePreflight: true })] }, virtual())

  const html = consume(
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

  assert.deepEqual(tw.target, [
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
  ])
})

test('hash class names', () => {
  const tw = twind({ presets: [presetTailwind({ disablePreflight: true })], hash: true }, virtual())

  const html = consume(
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
    <main class="#1mjcm6l #19akslq #9athnx #8gfukc #vlgikd">
      <h1 class="#s4i0jm #1khack9 #xwomwz #vdqslz #1ke7mwv">
        This is <span class="#wf2app">Twind</span>!
      </h1>
    </main>
    `,
  )
  assert.deepEqual(tw.target, [
    '.\\#s4i0jm{--dxr4o8:1;color:rgba(255,255,255,var(--dxr4o8))}',
    '.\\#1mjcm6l{display:flex}',
    '.\\#19akslq{height:100vh}',
    '.\\#9athnx{--17cwy6m:1;background-color:rgba(192,132,252,var(--17cwy6m))}',
    '.\\#1khack9{font-size:3rem;line-height:1}',
    '.\\#wf2app{font-weight:700}',
    '.\\#8gfukc{align-items:center}',
    '.\\#vlgikd{justify-content:center}',
    '.\\#xwomwz{text-align:center}',
    '@media (min-width:640px){.\\#vdqslz{--dxr4o8:1;color:rgba(31,41,55,var(--dxr4o8))}}',
    '@media (min-width:768px){.\\#1ke7mwv{--dxr4o8:1;color:rgba(190,24,93,var(--dxr4o8))}}',
  ])
})

test('will preserve html comments', () => {
  const tw = twind({ presets: [presetTailwind({ disablePreflight: true })] }, virtual())

  const html = consume(
    `
    <!-- HTML Comment class="bg-gray-400" -->
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
    <!-- HTML Comment class="bg-gray-400" -->
    <main class="h-screen bg-purple-400 flex items-center justify-center">
      <h1 class="text-white text-5xl text-center sm:text-gray-800 md:text-pink-700">
        This is <span class="font-bold">Twind</span>!
      </h1>
    </main>
    `,
  )
  assert.deepEqual(tw.target, [
    '.text-white{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}',
    '.flex{display:flex}',
    '.h-screen{height:100vh}',
    '.bg-purple-400{--tw-bg-opacity:1;background-color:rgba(192,132,252,var(--tw-bg-opacity))}',
    '.text-5xl{font-size:3rem;line-height:1}',
    '.font-bold{font-weight:700}',
    '.items-center{align-items:center}',
    '.justify-center{justify-content:center}',
    '.text-center{text-align:center}',
    '@media (min-width:640px){.sm\\:text-gray-800{--tw-text-opacity:1;color:rgba(31,41,55,var(--tw-text-opacity))}}',
    '@media (min-width:768px){.md\\:text-pink-700{--tw-text-opacity:1;color:rgba(190,24,93,var(--tw-text-opacity))}}',
  ])
})

test('handles escaped chars by react', () => {
  const tw = twind({ presets: [presetTailwind({ disablePreflight: true })] }, virtual())

  const html = consume(
    `
    <main class="flex(&amp; col) before:content-[&#x27;x&#x27;]">
      <h1 class='before:content-[&quot;y&quot;]'>
        This is Twind!
      </h1>
    </main>
    `,
    tw,
  )

  assert.strictEqual(
    html,
    `
    <main class="flex flex-col before:content-['x']">
      <h1 class='before:content-["y"]'>
        This is Twind!
      </h1>
    </main>
    `,
  )
  assert.deepEqual(tw.target, [
    '.flex{display:flex}',
    '.flex-col{flex-direction:column}',
    ".before\\:content-\\[\\'x\\'\\]:before{--tw-content:'x';content:var(--tw-content)}",
    '.before\\:content-\\[\\"y\\"\\]:before{--tw-content:"y";content:var(--tw-content)}',
  ])
})
