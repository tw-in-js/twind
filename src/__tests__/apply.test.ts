import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance } from '../types'
import type { VirtualSheet } from '../sheets/index'

import { virtualSheet } from '../sheets/index'
import { create, strict, apply } from '../index'
import { animation, css } from '../css/index'

const test = suite<{
  sheet: VirtualSheet
  tw: Instance['tw']
}>('apply')

test.before((context) => {
  context.sheet = virtualSheet()
  const instance = create({
    sheet: context.sheet,
    mode: strict,
    preflight: false,
    prefix: false,
    // Using hash to prevent simply parsing the already injected class name again
    hash: true,
  })
  context.tw = instance.tw
})

test.after.each(({ sheet }) => {
  sheet.reset()
})

test('simple component', ({ tw, sheet }) => {
  const btn = apply`inline-block bg-gray-500 text-base`

  assert.type(btn, 'function')
  assert.equal(sheet.target, [], 'nothing injected yet')

  assert.is(tw(btn), 'tw-z1u1ls')
  assert.equal(sheet.target, [
    '.tw-z1u1ls{display:inline-block;--tw-17cwy6m:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-17cwy6m));font-size:1rem;line-height:1.5rem}',
  ])

  assert.is(tw`${btn} bg-red-500 text-lg`, 'tw-z1u1ls tw-f1tjd tw-1n46r4m')
  assert.equal(sheet.target, [
    '.tw-z1u1ls{display:inline-block;--tw-17cwy6m:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-17cwy6m));font-size:1rem;line-height:1.5rem}',
    '.tw-f1tjd{--tw-17cwy6m:1;background-color:#ef4444;background-color:rgba(239,68,68,var(--tw-17cwy6m))}',
    '.tw-1n46r4m{font-size:1.125rem;line-height:1.75rem}',
  ])
})

test('child components', ({ tw, sheet }) => {
  const btn = apply`inline-block bg-gray-500 text-base`
  const btnBlock = apply`${btn} block`

  assert.type(btnBlock, 'function')
  assert.equal(sheet.target, [], 'nothing injected yet')

  assert.is(tw(btnBlock), 'tw-jo609v')
  assert.equal(sheet.target, [
    '.tw-jo609v{display:block;--tw-17cwy6m:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-17cwy6m));font-size:1rem;line-height:1.5rem}',
  ])
})

test('with variants', ({ tw, sheet }) => {
  const btn = apply`
    py-2 px-4
    font-semibold
    rounded-lg shadow-md
    focus:(outline-none ring(2 indigo-400 opacity-75))
  `

  assert.is(tw(btn), 'tw-v24ifx')
  assert.equal(sheet.target, [
    '*{--tw-1m9cmzd:var(--tw-rz3pvs,/*!*/ /*!*/);--tw-iljcf6:0px;--tw-1q9ryqm:#fff;--tw-g5efu5:rgba(59,130,246,var(--tw-mo52hn,0.5));--tw-1s0t3ke:0 0 transparent;--tw-zxn4nw:0 0 transparent}',
    '*{--tw-1qg7wmx:0 0 transparent}',
    '.tw-v24ifx{padding-bottom:0.5rem;padding-top:0.5rem;padding-left:1rem;padding-right:1rem;font-weight:600;border-radius:0.5rem;--tw-1qg7wmx:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);box-shadow:var(--tw-1s0t3ke,0 0 transparent),var(--tw-zxn4nw,0 0 transparent),var(--tw-1qg7wmx)}',
    '.tw-v24ifx:focus{outline:2px solid transparent;outline-offset:2px;--tw-1s0t3ke:var(--tw-1m9cmzd) 0 0 0 var(--tw-iljcf6) var(--tw-1q9ryqm);--tw-zxn4nw:var(--tw-1m9cmzd) 0 0 0 calc(2px + var(--tw-iljcf6)) var(--tw-g5efu5);box-shadow:var(--tw-1s0t3ke),var(--tw-zxn4nw),var(--tw-1qg7wmx,0 0 transparent);--tw-mo52hn:0.75;--tw-g5efu5:rgba(129,140,248,var(--tw-mo52hn))}',
  ])
})

test('rule order matters', ({ tw, sheet }) => {
  const blue = apply`text-red-500 text-blue-500`
  const red = apply`text-blue-500 text-red-500`

  assert.is(tw`${blue} ${red}`, 'tw-z8gzwe tw-17jpxhn')
  assert.equal(sheet.target, [
    '.tw-z8gzwe{--tw-dxr4o8:1;color:#3b82f6;color:rgba(59,130,246,var(--tw-dxr4o8))}',
    '.tw-17jpxhn{--tw-dxr4o8:1;color:#ef4444;color:rgba(239,68,68,var(--tw-dxr4o8))}',
  ])
})

test('css can be used', ({ tw, sheet }) => {
  const btn = apply`
    py-2 px-4
    ${css({
      borderColor: 'black',
    })}
  `

  assert.is(tw`underline ${btn} px-8`, 'tw-rg25wp tw-196pg2c tw-817e0v')
  assert.equal(sheet.target, [
    '.tw-196pg2c{padding-bottom:0.5rem;padding-top:0.5rem;padding-left:1rem;padding-right:1rem;border-color:black}',
    '.tw-817e0v{padding-left:2rem;padding-right:2rem}',
    '.tw-rg25wp{text-decoration:underline}',
  ])
})

test('with animation', ({ tw, sheet }) => {
  const motion = animation('.6s ease-in-out infinite', {
    '0%': apply`scale-100`,
    '50%': apply`scale-125 rotate-45`,
    '100%': apply`scale-100 rotate-0`,
  })

  assert.equal(sheet.target, [])

  assert.is(tw(motion), 'tw-921wd5')
  assert.equal(sheet.target, [
    '@keyframes tw-44iuml{0%{--tw-vkgkf8:1;--tw-1lff04g:1;transform:scale(1);transform:translateX(var(--tw-1e4pbj4,0)) translateY(var(--tw-142admc,0)) rotate(var(--tw-9ouawy,0)) skewX(var(--tw-wnlb2r,0)) skewY(var(--tw-o4ir2d,0)) scaleX(var(--tw-vkgkf8,1)) scaleY(var(--tw-1lff04g,1))}50%{--tw-vkgkf8:1.25;--tw-1lff04g:1.25;transform:rotate(45deg);transform:translateX(var(--tw-1e4pbj4,0)) translateY(var(--tw-142admc,0)) rotate(var(--tw-9ouawy,0)) skewX(var(--tw-wnlb2r,0)) skewY(var(--tw-o4ir2d,0)) scaleX(var(--tw-vkgkf8,1)) scaleY(var(--tw-1lff04g,1));--tw-9ouawy:45deg}100%{--tw-vkgkf8:1;--tw-1lff04g:1;transform:rotate(0deg);transform:translateX(var(--tw-1e4pbj4,0)) translateY(var(--tw-142admc,0)) rotate(var(--tw-9ouawy,0)) skewX(var(--tw-wnlb2r,0)) skewY(var(--tw-o4ir2d,0)) scaleX(var(--tw-vkgkf8,1)) scaleY(var(--tw-1lff04g,1));--tw-9ouawy:0deg}}',
    '.tw-921wd5{animation:.6s ease-in-out infinite;animation-name:tw-44iuml}',
  ])
})

test('inline plugin using tw', ({ tw, sheet }) => {
  const btn = apply`
    py-2 px-4
    ${({ tw }) => tw`px-8`}
  `

  assert.is(tw`${btn}`, 'tw-t4qybq')
  assert.equal(sheet.target, [
    '.tw-t4qybq{padding-bottom:0.5rem;padding-top:0.5rem;padding-left:2rem;padding-right:2rem}',
  ])
})

test('using class which has already been injected with tw', ({ tw, sheet }) => {
  const blue = tw`text-blue-500 hover:text-blue-700`
  assert.is(blue, 'tw-z8gzwe tw-aecrv7')

  const link = apply`block ${blue} text-center`

  assert.is(tw`${link}`, 'tw-1psz0ut tw-z8gzwe tw-aecrv7')
  assert.equal(sheet.target, [
    '.tw-1psz0ut{display:block;text-align:center}',
    '.tw-z8gzwe{--tw-dxr4o8:1;color:#3b82f6;color:rgba(59,130,246,var(--tw-dxr4o8))}',
    '.tw-aecrv7:hover{--tw-dxr4o8:1;color:#1d4ed8;color:rgba(29,78,216,var(--tw-dxr4o8))}',
  ])
})

test('plugin with string', () => {
  const sheet = virtualSheet()

  const { tw } = create({
    sheet,
    mode: strict,
    preflight: false,
    prefix: false,
    hash: true,
    plugins: {
      blue: 'text-blue-500 hover:text-blue-700',
    },
  })

  const link = apply`group block blue text-center`

  assert.is(tw`${link} text-justify`, 'tw-la40fd tw-1bk5mm5 tw-z8gzwe tw-aecrv7 tw-1tvd98m')
  assert.equal(sheet.target, [
    '.tw-la40fd{display:block;--tw-dxr4o8:1;color:#3b82f6;color:rgba(59,130,246,var(--tw-dxr4o8));text-align:center}',
    '.tw-la40fd:hover{--tw-dxr4o8:1;color:#1d4ed8;color:rgba(29,78,216,var(--tw-dxr4o8))}',
    '.tw-1tvd98m{text-align:justify}',
  ])
})

test('pass unknown class names through', () => {
  const sheet = virtualSheet()

  const { tw } = create({
    sheet,
    mode: 'silent',
    preflight: false,
    prefix: false,
  })

  const link = apply`block unknown-class text-justify`

  assert.is(
    tw`text-center ${link} some-other-class`,
    'text-center tw-1s0yk82 unknown-class some-other-class',
  )
  assert.equal(sheet.target, [
    '.tw-1s0yk82{display:block;text-align:justify}',
    '.text-center{text-align:center}',
  ])
})

test('complex', ({ tw, sheet }) => {
  const variantMap = {
    success: 'green',
    primary: 'blue',
    warning: 'yellow',
    info: 'gray',
    danger: 'red',
  } as const

  const sizeMap = {
    sm: apply`text-xs py(2 md:1) px-2`,
    md: apply`text-sm py(3 md:2) px-2`,
    lg: apply`text-lg py-2 px-4`,
    xl: apply`text-xl py-3 px-6`,
  } as const

  const baseStyles = apply`
    w(full md:auto)
    text(sm white uppercase)
    px-4
    border-none
    transition-colors
    duration-300
  `

  function Button({
    size = 'md',
    variant = 'primary',
    round = false,
    disabled = false,
    className,
  }: {
    size?: keyof typeof sizeMap
    variant?: keyof typeof variantMap
    round?: boolean
    disabled?: boolean
    className?: string
  } = {}) {
    // Collect all styles into one class
    const instanceStyles = apply`
      ${baseStyles}
      bg-${variantMap[variant]}(600 700(hover:& focus:&)))
      ${sizeMap[size]}
      rounded-${round ? 'full' : 'lg'}
      ${disabled && 'bg-gray-400 text-gray-100 cursor-not-allowed'}
    `

    // Allow passed classNames to override instance styles
    return tw(instanceStyles, className)
  }

  assert.is(Button(), 'tw-10l2puq')
  assert.equal(sheet.target, [
    '.tw-10l2puq{width:100%;font-size:0.875rem;line-height:1.25rem;--tw-dxr4o8:1;color:#fff;color:rgba(255,255,255,var(--tw-dxr4o8));text-transform:uppercase;padding-left:0.5rem;padding-right:0.5rem;border-style:none;transition-property:background-color,border-color,color,fill,stroke;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:300ms;--tw-17cwy6m:1;background-color:#2563eb;background-color:rgba(37,99,235,var(--tw-17cwy6m));padding-bottom:0.75rem;padding-top:0.75rem;border-radius:0.5rem}',
    '.tw-10l2puq:hover{--tw-17cwy6m:1;background-color:#1d4ed8;background-color:rgba(29,78,216,var(--tw-17cwy6m))}',
    '.tw-10l2puq:focus{--tw-17cwy6m:1;background-color:#1d4ed8;background-color:rgba(29,78,216,var(--tw-17cwy6m))}',
    '@media (min-width: 768px){.tw-10l2puq{width:auto;padding-bottom:0.5rem;padding-top:0.5rem}}',
  ])

  sheet.reset()

  assert.is(
    Button({ size: 'sm', round: true, disabled: true, className: 'font-bold' }),
    'tw-rcqzz4 tw-b13grf',
  )
  assert.equal(sheet.target, [
    '.tw-rcqzz4{width:100%;font-size:0.75rem;line-height:1rem;--tw-dxr4o8:1;color:#f3f4f6;color:rgba(243,244,246,var(--tw-dxr4o8));text-transform:uppercase;padding-left:0.5rem;padding-right:0.5rem;border-style:none;transition-property:background-color,border-color,color,fill,stroke;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:300ms;--tw-17cwy6m:1;background-color:#9ca3af;background-color:rgba(156,163,175,var(--tw-17cwy6m));padding-bottom:0.5rem;padding-top:0.5rem;border-radius:9999px;cursor:not-allowed}',
    '.tw-rcqzz4:hover{--tw-17cwy6m:1;background-color:#1d4ed8;background-color:rgba(29,78,216,var(--tw-17cwy6m))}',
    '.tw-rcqzz4:focus{--tw-17cwy6m:1;background-color:#1d4ed8;background-color:rgba(29,78,216,var(--tw-17cwy6m))}',
    '@media (min-width: 768px){.tw-rcqzz4{width:auto;padding-bottom:0.25rem;padding-top:0.25rem}}',
    '.tw-b13grf{font-weight:700}',
  ])
})

test('use :global', ({ tw, sheet }) => {
  const style = () => ({
    ':global': {
      html: apply('bg-gray-900 text-white'),
    },
  })

  assert.is(tw(style), 'tw-uib79w')

  assert.equal(sheet.target, [
    'html{--tw-17cwy6m:1;background-color:#111827;background-color:rgba(17,24,39,var(--tw-17cwy6m));--tw-dxr4o8:1;color:#fff;color:rgba(255,255,255,var(--tw-dxr4o8))}',
  ])
})

test('use :global within css', ({ tw, sheet }) => {
  const style = css({
    ':global': {
      body: apply('bg-gray-900 text-white'),
    },
    a: apply('text-blue(500 hover:700)'),
  })

  assert.is(tw(style), 'tw-zxxecb')

  assert.equal(sheet.target, [
    'body{--tw-17cwy6m:1;background-color:#111827;background-color:rgba(17,24,39,var(--tw-17cwy6m));--tw-dxr4o8:1;color:#fff;color:rgba(255,255,255,var(--tw-dxr4o8))}',
    '.tw-zxxecb a:hover{--tw-dxr4o8:1;color:#1d4ed8;color:rgba(29,78,216,var(--tw-dxr4o8))}',
    '.tw-zxxecb a{--tw-dxr4o8:1;color:#3b82f6;color:rgba(59,130,246,var(--tw-dxr4o8))}',
  ])
})

test('use with preflight', () => {
  const sheet = virtualSheet()

  create({
    sheet,
    mode: strict,
    preflight: () => ({
      html: apply('bg-gray-900 text-white'),
    }),
    prefix: false,
  })

  assert.equal(sheet.target, [
    'html{--tw-bg-opacity:1;background-color:#111827;background-color:rgba(17,24,39,var(--tw-bg-opacity));--tw-text-opacity:1;color:#fff;color:rgba(255,255,255,var(--tw-text-opacity))}',
  ])
})

test('use apply with custom tw', ({ tw, sheet }) => {
  const btn = apply`inline-block bg-gray-500 text-base`

  assert.is(tw(btn), 'tw-z1u1ls')

  assert.equal(sheet.target, [
    '.tw-z1u1ls{display:inline-block;--tw-17cwy6m:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-17cwy6m));font-size:1rem;line-height:1.5rem}',
  ])
})

test('same directive for same data ', () => {
  assert.is(apply`inline-block bg-gray-500 text-base`, apply`inline-block bg-gray-500 text-base`)
  assert.is.not(apply`inline-block`, apply`block`)
})

test.run()
