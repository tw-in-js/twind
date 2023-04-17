// @vitest-environment happy-dom

import { assert, test } from 'vitest'
import presetTailwind from '@twind/preset-tailwind'
import { getSheet, inline, observe, twind, virtual } from '..'

test('observe in browser', () => {
  document.documentElement.innerHTML = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body class="!block" style="display: none">
        <main class="h-screen bg-purple-400 flex items-center justify-center">
          <h1 class="font-bold /* you can even use inline comments */ text-(center 5xl white sm:gray-800 md:pink-700)">
            This is Twind!
          </h1>
        </main>
      </body>
    </html>
    `

  const tw = observe(twind({ presets: [presetTailwind({ disablePreflight: true })] }, virtual()))

  assert.deepEqual(tw.target, [
    '.text-white{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}',
    '.\\!block{display:block !important}',
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

  assert.strictEqual(
    document.body.innerHTML.trim(),
    `
        <main class="h-screen bg-purple-400 flex items-center justify-center">
          <h1 class="text-white text-5xl font-bold text-center sm:text-gray-800 md:text-pink-700">
            This is Twind!
          </h1>
        </main>
    `.trim(),
  )

  tw.clear()

  // ensure tw is callable
  assert.strictEqual(tw('underline'), 'underline')
  assert.deepEqual(tw.target, ['.underline{text-decoration-line:underline}'])

  // ensure the observer is disconnected on destroy
  tw.destroy()
  // the stylesheet is emptied
  assert.lengthOf(tw.target, 0) // attributes are no longer modified
  ;(document.querySelector('main') as Element).className = '~(text-3xl bg-gray-100)'
  // the stylesheet is emptied
  assert.lengthOf(tw.target, 0)
  assert.strictEqual(document.querySelector('main')?.className, '~(text-3xl bg-gray-100)')

  // TODO these do not work right now - bug in happy-dom?
  // TODO Update attribute

  // Update childList
  // ;(document.querySelector('main') as HTMLElement).innerHTML = `
  //     <h1 class="font-bold text-(center 5xl white sm:gray-800 md:pink-700) after:content-['xxx']">
  //       This is <span class=font-(bold,sans)>Twind</span>!
  //     </h1>
  //   `

  // assert.strictEqual(
  //   document.body.innerHTML.trim(),
  //   `
  //   <main class="h-screen bg-purple-400 flex items-center justify-center">
  //     <h1 class="text-white text-5xl font-bold text-center after:content-[&#x27;xxx&#x27;] sm:text-gray-800 md:text-pink-700">
  //       This is <span class="font-bold font-sans">Twind</span>!
  //     </h1>
  //   </main>
  //   `.trim(),
  // )

  // assert.deepEqual(tw.target, [
  //   '.text-white{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}',
  //   '.\\!block{display:block !important}',
  //   '.flex{display:flex}',
  //   '.h-screen{height:100vh}',
  //   '.bg-purple-400{--tw-bg-opacity:1;background-color:rgba(192,132,252,var(--tw-bg-opacity))}',
  //   '.text-5xl{font-size:3rem;line-height:1}',
  //   '.font-bold{font-weight:700}',
  //   '.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"}',
  //   '.items-center{align-items:center}',
  //   '.justify-center{justify-content:center}',
  //   '.text-center{text-align:center}',
  //   ".after\\:content-\\[\\'xxx\\'\\]:after{--tw-content:'xxx';content:var(--tw-content)}",
  //   '@media (min-width:640px){.sm\\:text-gray-800{--tw-text-opacity:1;color:rgba(31,41,55,var(--tw-text-opacity))}}',
  //   '@media (min-width:768px){.md\\:text-pink-700{--tw-text-opacity:1;color:rgba(190,24,93,var(--tw-text-opacity))}}',
  // ])
})

test('hydratable from SSR sheet', () => {
  // render SSR sheet
  document.documentElement.innerHTML = inline(
    `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body class="!block" style="display: none">
          <main class="h-screen bg-purple-400 flex items-center justify-center">
            <h1 class="font-bold /* you can even use inline comments */ text-(center 5xl white sm:gray-800 md:pink-700)">
              This is Twind!
            </h1>
          </main>
        </body>
      </html>
  `,
    {
      tw: twind(
        { presets: [presetTailwind({ disablePreflight: true })] },
        virtual(true /* includeHydrationInfos */),
      ),
    },
  )

  assert.include(
    document.documentElement.innerHTML,
    '<style data-twind="">/*!dbgidc,t,text-white*/.text-white{',
  )

  // test resumeable sheets
  const tw = observe(
    twind(
      { presets: [presetTailwind({ disablePreflight: true })] },
      getSheet(true /* useDOMSheet */),
    ),
  )

  // Make sure the sheet hydrated correctly, i.e. and calling the same tokens does not change the sheet
  tw('h-screen bg-purple-400 flex items-center justify-center')
  tw(
    'font-bold /* you can even use inline comments */ text-(center 5xl white sm:gray-800 md:pink-700)',
  )

  console.debug(Array.from((tw.target as HTMLStyleElement).childNodes, (node) => node.textContent))

  assert.deepEqual(
    Array.from((tw.target as HTMLStyleElement).childNodes, (node) => node.textContent),
    [
      '/*!dbgidc,t,text-white*/.text-white{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}/*!dbgidc,v,!block*/.\\!block{display:block !important}/*!dbgidc,v,flex*/.flex{display:flex}/*!dbgidc,v,h-screen*/.h-screen{height:100vh}/*!dbgidc,w,bg-purple-400*/.bg-purple-400{--tw-bg-opacity:1;background-color:rgba(192,132,252,var(--tw-bg-opacity))}/*!dbgidc,w,text-5xl*/.text-5xl{font-size:3rem;line-height:1}/*!dbgidc,y,font-bold*/.font-bold{font-weight:700}/*!dbgidc,y,items-center*/.items-center{align-items:center}/*!dbgidc,y,justify-center*/.justify-center{justify-content:center}/*!dbgidc,y,text-center*/.text-center{text-align:center}/*!eupiio,t,sm:text-gray-800*/@media (min-width:640px){.sm\\:text-gray-800{--tw-text-opacity:1;color:rgba(31,41,55,var(--tw-text-opacity))}}/*!ex7ev4,t,md:text-pink-700*/@media (min-width:768px){.md\\:text-pink-700{--tw-text-opacity:1;color:rgba(190,24,93,var(--tw-text-opacity))}}',
    ],
  )
})
