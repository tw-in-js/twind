import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { CSSProperties, Directive, Instance } from '../types'
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

  assert.is(tw(btn), 'tw-4tvvl1')
  assert.equal(sheet.target, [
    '.tw-4tvvl1{display:inline-block;--tw-17cwy6m:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-17cwy6m));font-size:1rem;line-height:1.5rem}',
  ])

  assert.is(tw`${btn} bg-red-500 text-lg`, 'tw-4tvvl1 tw-1u8yv89 tw-1ubuvjp')
  assert.equal(sheet.target, [
    '.tw-4tvvl1{display:inline-block;--tw-17cwy6m:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-17cwy6m));font-size:1rem;line-height:1.5rem}',
    '.tw-1u8yv89{--tw-17cwy6m:1;background-color:#ef4444;background-color:rgba(239,68,68,var(--tw-17cwy6m))}',
    '.tw-1ubuvjp{font-size:1.125rem;line-height:1.75rem}',
  ])
})

test('child components', ({ tw, sheet }) => {
  const btn = apply`inline-block bg-gray-500 text-base`
  const btnBlock = apply`${btn} block`

  assert.type(btnBlock, 'function')
  assert.equal(sheet.target, [], 'nothing injected yet')

  assert.is(tw(btnBlock), 'tw-4ca4gm')
  assert.equal(sheet.target, [
    '.tw-4ca4gm{display:block;--tw-17cwy6m:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-17cwy6m));font-size:1rem;line-height:1.5rem}',
  ])
})

test('with variants', ({ tw, sheet }) => {
  const btn = apply`
    py-2 px-4
    font-semibold
    rounded-lg shadow-md
    focus:(outline-none ring(2 indigo-400 opacity-75))
  `

  assert.is(tw(btn), 'tw-gj8iiy')
  assert.equal(sheet.target, [
    '*{--tw-1m9cmzd:var(--tw-rz3pvs,/*!*/ /*!*/);--tw-iljcf6:0px;--tw-1q9ryqm:#fff;--tw-g5efu5:rgba(59,130,246,var(--tw-mo52hn,0.5));--tw-1s0t3ke:0 0 transparent;--tw-zxn4nw:0 0 transparent}',
    '*{--tw-1qg7wmx:0 0 transparent}',
    '.tw-gj8iiy{padding-bottom:0.5rem;padding-top:0.5rem;padding-left:1rem;padding-right:1rem;font-weight:600;border-radius:0.5rem;--tw-1qg7wmx:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);box-shadow:var(--tw-1s0t3ke,0 0 transparent),var(--tw-zxn4nw,0 0 transparent),var(--tw-1qg7wmx)}',
    '.tw-gj8iiy:focus{outline:2px solid transparent;outline-offset:2px;--tw-1s0t3ke:var(--tw-1m9cmzd) 0 0 0 var(--tw-iljcf6) var(--tw-1q9ryqm);--tw-zxn4nw:var(--tw-1m9cmzd) 0 0 0 calc(2px + var(--tw-iljcf6)) var(--tw-g5efu5);box-shadow:var(--tw-1s0t3ke),var(--tw-zxn4nw),var(--tw-1qg7wmx,0 0 transparent);--tw-mo52hn:0.75;--tw-g5efu5:rgba(129,140,248,var(--tw-mo52hn))}',
  ])
})

test('rule order matters', ({ tw, sheet }) => {
  const blue = apply`text-red-500 text-blue-500`
  const red = apply`text-blue-500 text-red-500`

  assert.is(tw`${blue} ${red}`, 'tw-1lpdkf2 tw-30bsuq')
  assert.equal(sheet.target, [
    '.tw-1lpdkf2{--tw-dxr4o8:1;color:#3b82f6;color:rgba(59,130,246,var(--tw-dxr4o8))}',
    '.tw-30bsuq{--tw-dxr4o8:1;color:#ef4444;color:rgba(239,68,68,var(--tw-dxr4o8))}',
  ])
})

test('css can be used', ({ tw, sheet }) => {
  const btn = apply`
    py-2 px-4
    ${css({
      borderColor: 'black',
    })}
  `

  assert.is(tw`underline ${btn} px-8`, 'tw-1tbrnfj tw-1ky59p5 tw-x66wbi')
  assert.equal(sheet.target, [
    '.tw-1ky59p5{padding-bottom:0.5rem;padding-top:0.5rem;padding-left:1rem;padding-right:1rem;border-color:black}',
    '.tw-x66wbi{padding-left:2rem;padding-right:2rem}',
    '.tw-1tbrnfj{text-decoration:underline}',
  ])
})

test('with animation', ({ tw, sheet }) => {
  const motion = animation('.6s ease-in-out infinite', {
    '0%': {
      '@apply': 'scale-100',
    } as CSSProperties,
    '50%': apply`scale-125 rotate-45` as Directive<CSSProperties>,
    '100%': apply`scale-100 rotate-0` as Directive<CSSProperties>,
  })

  assert.equal(sheet.target, [])

  assert.is(tw(motion), 'tw-1q5uh1z')
  assert.equal(sheet.target, [
    '@keyframes tw-jjltxe{0%{--tw-vkgkf8:1;--tw-1lff04g:1;transform:scale(1);transform:translateX(var(--tw-1e4pbj4,0)) translateY(var(--tw-142admc,0)) rotate(var(--tw-9ouawy,0)) skewX(var(--tw-wnlb2r,0)) skewY(var(--tw-o4ir2d,0)) scaleX(var(--tw-vkgkf8,1)) scaleY(var(--tw-1lff04g,1))}50%{--tw-vkgkf8:1.25;--tw-1lff04g:1.25;transform:rotate(45deg);transform:translateX(var(--tw-1e4pbj4,0)) translateY(var(--tw-142admc,0)) rotate(var(--tw-9ouawy,0)) skewX(var(--tw-wnlb2r,0)) skewY(var(--tw-o4ir2d,0)) scaleX(var(--tw-vkgkf8,1)) scaleY(var(--tw-1lff04g,1));--tw-9ouawy:45deg}100%{--tw-vkgkf8:1;--tw-1lff04g:1;transform:rotate(0deg);transform:translateX(var(--tw-1e4pbj4,0)) translateY(var(--tw-142admc,0)) rotate(var(--tw-9ouawy,0)) skewX(var(--tw-wnlb2r,0)) skewY(var(--tw-o4ir2d,0)) scaleX(var(--tw-vkgkf8,1)) scaleY(var(--tw-1lff04g,1));--tw-9ouawy:0deg}}',
    '.tw-1q5uh1z{animation:.6s ease-in-out infinite;animation-name:tw-jjltxe}',
  ])
})

test('inline plugin using tw', ({ tw, sheet }) => {
  const btn = apply`
    py-2 px-4
    ${({ tw }) => tw`px-8`}
  `

  assert.is(tw`${btn}`, 'tw-tb6vfp')
  assert.equal(sheet.target, [
    '.tw-tb6vfp{padding-bottom:0.5rem;padding-top:0.5rem;padding-left:2rem;padding-right:2rem}',
  ])
})

test('using class which has already been injected with tw', ({ tw, sheet }) => {
  const blue = tw`text-blue-500 hover:text-blue-700`
  assert.is(blue, 'tw-t5vtoy tw-17gtnyz')

  const link = apply`block ${blue} text-center`

  assert.is(tw`${link}`, 'tw-la28d8 tw-t5vtoy tw-17gtnyz')
  assert.equal(sheet.target, [
    '.tw-la28d8{display:block;text-align:center}',
    '.tw-t5vtoy{--tw-dxr4o8:1;color:#3b82f6;color:rgba(59,130,246,var(--tw-dxr4o8))}',
    '.tw-17gtnyz:hover{--tw-dxr4o8:1;color:#1d4ed8;color:rgba(29,78,216,var(--tw-dxr4o8))}',
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

  assert.is(tw`${link} text-justify`, 'tw-1y6ogf8 tw-1bk5mm5 tw-l89jgz')
  assert.equal(sheet.target, [
    '.tw-1y6ogf8{display:block;--tw-dxr4o8:1;color:#3b82f6;color:rgba(59,130,246,var(--tw-dxr4o8));text-align:center}',
    '.tw-1y6ogf8:hover{--tw-dxr4o8:1;color:#1d4ed8;color:rgba(29,78,216,var(--tw-dxr4o8))}',
    '.tw-l89jgz{text-align:justify}',
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
    'text-center tw-16wyhrm unknown-class some-other-class',
  )
  assert.equal(sheet.target, [
    '.tw-16wyhrm{display:block;text-align:justify}',
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

  assert.is(Button(), 'tw-qolm3m')
  assert.equal(sheet.target, [
    '.tw-qolm3m{width:100%;font-size:0.875rem;line-height:1.25rem;--tw-dxr4o8:1;color:#fff;color:rgba(255,255,255,var(--tw-dxr4o8));text-transform:uppercase;padding-left:0.5rem;padding-right:0.5rem;border-style:none;transition-property:background-color,border-color,color,fill,stroke;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:300ms;--tw-17cwy6m:1;background-color:#2563eb;background-color:rgba(37,99,235,var(--tw-17cwy6m));padding-bottom:0.75rem;padding-top:0.75rem;border-radius:0.5rem}',
    '.tw-qolm3m:hover{--tw-17cwy6m:1;background-color:#1d4ed8;background-color:rgba(29,78,216,var(--tw-17cwy6m))}',
    '.tw-qolm3m:focus{--tw-17cwy6m:1;background-color:#1d4ed8;background-color:rgba(29,78,216,var(--tw-17cwy6m))}',
    '@media (min-width:768px){.tw-qolm3m{width:auto;padding-bottom:0.5rem;padding-top:0.5rem}}',
  ])

  sheet.reset()

  assert.is(
    Button({ size: 'sm', round: true, disabled: true, className: 'font-bold' }),
    'tw-12bsa7j tw-9wyrdi',
  )
  assert.equal(sheet.target, [
    '.tw-12bsa7j{width:100%;font-size:0.75rem;line-height:1rem;--tw-dxr4o8:1;color:#f3f4f6;color:rgba(243,244,246,var(--tw-dxr4o8));text-transform:uppercase;padding-left:0.5rem;padding-right:0.5rem;border-style:none;transition-property:background-color,border-color,color,fill,stroke;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:300ms;--tw-17cwy6m:1;background-color:#9ca3af;background-color:rgba(156,163,175,var(--tw-17cwy6m));padding-bottom:0.5rem;padding-top:0.5rem;border-radius:9999px;cursor:not-allowed}',
    '.tw-12bsa7j:hover{--tw-17cwy6m:1;background-color:#1d4ed8;background-color:rgba(29,78,216,var(--tw-17cwy6m))}',
    '.tw-12bsa7j:focus{--tw-17cwy6m:1;background-color:#1d4ed8;background-color:rgba(29,78,216,var(--tw-17cwy6m))}',
    '@media (min-width:768px){.tw-12bsa7j{width:auto;padding-bottom:0.25rem;padding-top:0.25rem}}',
    '.tw-9wyrdi{font-weight:700}',
  ])
})

test('use :global', ({ tw, sheet }) => {
  const style = () => ({
    ':global': {
      html: apply('bg-gray-900 text-white'),
    },
  })

  assert.is(tw(style), 'tw-9z52qd')

  assert.equal(sheet.target, [
    'html{--tw-17cwy6m:1;background-color:#111827;background-color:rgba(17,24,39,var(--tw-17cwy6m));--tw-dxr4o8:1;color:#fff;color:rgba(255,255,255,var(--tw-dxr4o8))}',
  ])
})

test('use @global', ({ tw, sheet }) => {
  const style = () => ({
    '@global': {
      html: apply('bg-gray-900 text-white'),
    },
  })

  assert.is(tw(style), 'tw-z31ttt')

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

  assert.is(tw(style), 'tw-49gfd9')

  assert.equal(sheet.target, [
    'body{--tw-17cwy6m:1;background-color:#111827;background-color:rgba(17,24,39,var(--tw-17cwy6m));--tw-dxr4o8:1;color:#fff;color:rgba(255,255,255,var(--tw-dxr4o8))}',
    '.tw-49gfd9 a:hover{--tw-dxr4o8:1;color:#1d4ed8;color:rgba(29,78,216,var(--tw-dxr4o8))}',
    '.tw-49gfd9 a{--tw-dxr4o8:1;color:#3b82f6;color:rgba(59,130,246,var(--tw-dxr4o8))}',
  ])
})

test('use @global within css', ({ tw, sheet }) => {
  const style = css({
    '@global': {
      body: apply('bg-gray-900 text-white'),
    },
    a: apply('text-blue(500 hover:700)'),
  })

  assert.is(tw(style), 'tw-efetv')

  assert.equal(sheet.target, [
    'body{--tw-17cwy6m:1;background-color:#111827;background-color:rgba(17,24,39,var(--tw-17cwy6m));--tw-dxr4o8:1;color:#fff;color:rgba(255,255,255,var(--tw-dxr4o8))}',
    '.tw-efetv a:hover{--tw-dxr4o8:1;color:#1d4ed8;color:rgba(29,78,216,var(--tw-dxr4o8))}',
    '.tw-efetv a{--tw-dxr4o8:1;color:#3b82f6;color:rgba(59,130,246,var(--tw-dxr4o8))}',
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

  assert.is(tw(btn), 'tw-4tvvl1')

  assert.equal(sheet.target, [
    '.tw-4tvvl1{display:inline-block;--tw-17cwy6m:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-17cwy6m));font-size:1rem;line-height:1.5rem}',
  ])
})

test('same directive for same data', () => {
  assert.is(apply`inline-block bg-gray-500 text-base`, apply`inline-block bg-gray-500 text-base`)
  assert.is.not(apply`inline-block`, apply`block`)

  const color = 'black'
  assert.is(
    apply`
      inline-block
      rounded
      py-2
      my-2 mx-4
      w-44
      bg-transparent
      text-white
      border(2 solid white)
      hover:text-${color}
      focus:border(2 dashed black)
      text(sm md:base lg:lg)
    `,
    apply`
      inline-block
      rounded
      py-2
      my-2 mx-4
      w-44
      bg-transparent
      text-white
      border(2 solid white)
      hover:text-${color}
      focus:border(2 dashed black)
      text(sm md:base lg:lg)
    `,
  )
})

test('variants to no leak', ({ tw, sheet }) => {
  const block = apply`block`
  assert.is(tw`sm:${block}`, 'tw-1j76vjo')
  assert.equal(sheet.target, ['@media (min-width:640px){.tw-1j76vjo{display:block}}'])
})

test('applied rules can be used alone after apply', ({ tw, sheet }) => {
  assert.equal(sheet.target, [])

  assert.is(
    tw(
      css({
        h1: apply`bg-red-500`,
      }),
    ),
    'tw-rrz49t',
  )

  assert.is(tw(`bg-red-500`), 'tw-1u8yv89')

  assert.equal(sheet.target, [
    '.tw-1u8yv89{--tw-17cwy6m:1;background-color:#ef4444;background-color:rgba(239,68,68,var(--tw-17cwy6m))}',
    '.tw-rrz49t h1{--tw-17cwy6m:1;background-color:#ef4444;background-color:rgba(239,68,68,var(--tw-17cwy6m))}',
  ])
})

test('applied rules are within component layer', ({ tw, sheet }) => {
  assert.is(tw(apply`underline`, 'bg-red-500'), 'tw-1h2u08d tw-1u8yv89')

  assert.equal(sheet.target, [
    '.tw-1h2u08d{text-decoration:underline}',
    '.tw-1u8yv89{--tw-17cwy6m:1;background-color:#ef4444;background-color:rgba(239,68,68,var(--tw-17cwy6m))}',
  ])

  // Cross check
  sheet.reset()
  assert.is(tw`underline bg-red-500`, 'tw-1tbrnfj tw-1u8yv89')

  assert.equal(sheet.target, [
    '.tw-1u8yv89{--tw-17cwy6m:1;background-color:#ef4444;background-color:rgba(239,68,68,var(--tw-17cwy6m))}',
    '.tw-1tbrnfj{text-decoration:underline}',
  ])
})

test.run()
