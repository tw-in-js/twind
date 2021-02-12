import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance } from '../types'
import type { VirtualSheet } from '../sheets/index'

import { virtualSheet } from '../sheets/index'
import { create, strict } from '../index'
import { css, keyframes, animation, apply, theme, screen } from './index'

const test = suite<{
  sheet: VirtualSheet
  tw: Instance['tw']
}>('css')

test.before((context) => {
  context.sheet = virtualSheet()
  const instance = create({
    sheet: context.sheet,
    mode: strict,
    preflight: false,
    prefix: false,
  })
  context.tw = instance.tw
})

test.after.each(({ sheet }) => {
  sheet.reset()
})

test('create css', ({ tw, sheet }) => {
  const style = css({
    backgroundColor: 'hotpink',
    '&:hover': {
      color: 'darkgreen',
    },
  })

  // It is lazy
  assert.equal(sheet.target, [])

  assert.is(tw(style), 'tw-9qn0v0')

  assert.equal(sheet.target, [
    '.tw-9qn0v0:hover{color:darkgreen}',
    '.tw-9qn0v0{background-color:hotpink}',
  ])

  // it is cached
  assert.is(tw(style), 'tw-9qn0v0')

  assert.equal(sheet.target, [
    '.tw-9qn0v0:hover{color:darkgreen}',
    '.tw-9qn0v0{background-color:hotpink}',
  ])
})

test('create with global css within custom tw', ({ tw, sheet }) => {
  const style = css({
    backgroundColor: 'darkgreen',
  })

  assert.is(
    style,
    css({
      backgroundColor: 'darkgreen',
    }),
  )

  // It is lazy
  assert.equal(sheet.target, [])

  assert.is(tw(style), 'tw-16fciia')

  assert.equal(sheet.target, ['.tw-16fciia{background-color:darkgreen}'])
})

test('nested selectors', ({ tw, sheet }) => {
  const styles = css({
    // .tw-xxx a
    a: {
      color: theme('colors.blue.500'),
      // .tw-xxx a:hover
      '&:hover': {
        color: theme('colors.blue.700'),
      },
    },
  })

  assert.is(tw(styles), 'tw-i6imwz')

  assert.equal(sheet.target, ['.tw-i6imwz a:hover{color:#1d4ed8}', '.tw-i6imwz a{color:#3b82f6}'])
})

test('can be used with variants', ({ tw, sheet }) => {
  const style = css({
    backgroundColor: 'hotpink',
    '&:hover': {
      color: 'darkgreen',
    },
  })

  assert.is(tw`sm:${style} focus:${style}`, 'tw-v12wc9 tw-13v6x9r')

  assert.equal(sheet.target, [
    '.tw-13v6x9r:focus:hover{color:darkgreen}',
    '.tw-13v6x9r:focus{background-color:hotpink}',
    '@media (min-width:640px){.tw-v12wc9:hover{color:darkgreen}}',
    '@media (min-width:640px){.tw-v12wc9{background-color:hotpink}}',
  ])
})

test('keyframes', ({ tw, sheet }) => {
  const bounce = keyframes({
    'from, 20%, 53%, 80%, to': {
      transform: 'translate3d(0,0,0)',
    },
    '40%, 43%': {
      transform: 'translate3d(0, -30px, 0)',
    },
    '70%': {
      transform: 'translate3d(0, -15px, 0)',
    },
    '90%': {
      transform: 'translate3d(0, -4px, 0)',
    },
  })

  // Nothing applied yet
  assert.equal(sheet.target, [])

  assert.is(
    tw(
      css({
        '&': animation(`1s ease infinite`, bounce),
      }),
    ),
    'tw-154rieb',
  )
  assert.equal(sheet.target, [
    '@keyframes tw-cm8eaz{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
    '.tw-154rieb{animation:1s ease infinite;animation-name:tw-cm8eaz}',
  ])
})

test('keyframes lazy', ({ tw, sheet }) => {
  const bounce = keyframes({
    'from, 20%, 53%, 80%, to': {
      transform: 'translate3d(0,0,0)',
    },
    '40%, 43%': {
      transform: 'translate3d(0, -30px, 0)',
    },
    '70%': {
      transform: 'translate3d(0, -15px, 0)',
    },
    '90%': {
      transform: 'translate3d(0, -4px, 0)',
    },
  })

  const styles = css({
    animation: '1s ease infinite',
    animationName: bounce,
  })

  // Nothing applied yet
  assert.equal(sheet.target, [])

  assert.is(tw(styles), 'tw-1w0nah9')

  assert.equal(sheet.target, [
    '@keyframes tw-cm8eaz{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
    '.tw-1w0nah9{animation:1s ease infinite;animation-name:tw-cm8eaz}',
  ])
})

test('animation', ({ tw, sheet }) => {
  const bounce = animation('1s ease infinite', {
    'from, 20%, 53%, 80%, to': {
      transform: 'translate3d(0,0,0)',
    },
    '40%, 43%': {
      transform: 'translate3d(0, -30px, 0)',
    },
    '70%': {
      transform: 'translate3d(0, -15px, 0)',
    },
    '90%': {
      transform: 'translate3d(0, -4px, 0)',
    },
  })

  // Nothing applied yet
  assert.equal(sheet.target, [])

  assert.is(tw(bounce), 'tw-1w0nah9')
  assert.equal(sheet.target, [
    '@keyframes tw-cm8eaz{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
    '.tw-1w0nah9{animation:1s ease infinite;animation-name:tw-cm8eaz}',
  ])
})

test('animation with callback', ({ tw, sheet }) => {
  const slidein = animation(
    ({ theme }) => `${theme('durations', '500')} ${theme('transitionTimingFunction', 'in-out')}`,
    {
      from: {
        transform: 'translateX(0%)',
      },
      to: {
        transform: 'translateX(100%)',
      },
    },
  )

  // Nothing applied yet
  assert.equal(sheet.target, [])

  assert.is(tw(slidein), 'tw-1jnb31o')
  assert.equal(sheet.target, [
    '@keyframes tw-nlnhc{from{transform:translateX(0%)}to{transform:translateX(100%)}}',
    '.tw-1jnb31o{animation:500ms cubic-bezier(0.4,0,0.2,1);animation-name:tw-nlnhc}',
  ])
})

test('animation object notation', ({ tw, sheet }) => {
  const bounce = animation(
    {
      animationDuration: '1s',
      animationTimingFunction: theme('transitionTimingFunction', 'in-out'),
      animationIterationCount: 'infinite',
    },
    {
      'from, 20%, 53%, 80%, to': {
        transform: 'translate3d(0,0,0)',
      },
      '40%, 43%': {
        transform: 'translate3d(0, -30px, 0)',
      },
      '70%': {
        transform: 'translate3d(0, -15px, 0)',
      },
      '90%': {
        transform: 'translate3d(0, -4px, 0)',
      },
    },
  )

  // Nothing applied yet
  assert.equal(sheet.target, [])

  assert.is(tw(bounce), 'tw-1dn509u')
  assert.equal(sheet.target, [
    '@keyframes tw-cm8eaz{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
    '.tw-1dn509u{animation-duration:1s;animation-timing-function:cubic-bezier(0.4,0,0.2,1);animation-iteration-count:infinite;animation-name:tw-cm8eaz}',
  ])
})

test('animation with variant', ({ tw, sheet }) => {
  const bounce = animation('1s ease infinite', {
    'from, 20%, 53%, 80%, to': {
      transform: 'translate3d(0,0,0)',
    },
    '40%, 43%': {
      transform: 'translate3d(0, -30px, 0)',
    },
    '70%': {
      transform: 'translate3d(0, -15px, 0)',
    },
    '90%': {
      transform: 'translate3d(0, -4px, 0)',
    },
  })

  // Nothing applied yet
  assert.equal(sheet.target, [])

  assert.is(tw`hover:${bounce}`, 'tw-k3rs7h')
  assert.equal(sheet.target, [
    '@keyframes tw-cm8eaz{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
    '.tw-k3rs7h:hover{animation:1s ease infinite;animation-name:tw-cm8eaz}',
  ])
})

test('animation with template literal', ({ tw, sheet }) => {
  const style = animation('1s ease infinite')`
    from, 20%, 53%, 80%, to {
      transform: translate3d(0,0,0);
    }
    40%, 43% {
      transform: translate3d(0, -30px, 0);
    }
    70% {
      transform: translate3d(0, -15px, 0);
    },
    90% {
      transform: translate3d(0, -4px, 0);
    }
  `

  assert.is(tw(style), 'tw-1imlmm3')

  assert.equal(sheet.target, [
    '@keyframes tw-1tx88h0{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}, 90%{transform:translate3d(0, -4px, 0)}}',
    '.tw-1imlmm3{animation:1s ease infinite;animation-name:tw-1tx88h0}',
  ])
})

test('use :global with property callback', ({ tw, sheet }) => {
  const style = css({
    ':global': {
      html: {
        backgroundColor: theme('colors.gray.900'),
      },
    },
  })

  assert.is(tw(style), 'tw-m9gc8h')

  assert.equal(sheet.target, ['html{background-color:#111827}'])
})

test('accepts arrays', ({ tw, sheet }) => {
  const style = css([
    {
      backgroundColor: 'hotpink',
      '&:hover': {
        color: 'darkgreen',
      },
    },
    null,
    {
      color: 'red',
    },
  ])

  assert.is(tw(style), 'tw-6csdir')

  assert.equal(sheet.target, [
    '.tw-6csdir{background-color:hotpink;color:red}',
    '.tw-6csdir:hover{color:darkgreen}',
  ])
})

test('is variadic', ({ tw, sheet }) => {
  const style = css(
    {
      backgroundColor: 'hotpink',
      '&:hover': {
        color: 'darkgreen',
      },
    },
    0,
    {
      color: 'red',
    },
  )

  assert.is(tw(style), 'tw-6csdir')

  assert.equal(sheet.target, [
    '.tw-6csdir{background-color:hotpink;color:red}',
    '.tw-6csdir:hover{color:darkgreen}',
  ])
})

test('can be nested', ({ tw, sheet }) => {
  const style = css({
    backgroundColor: theme('colors.gray.500'),
    '&:hover': css({
      color: 'darkgreen',
    }),
  })

  assert.is(tw(style), 'tw-lbhbyt')

  assert.equal(sheet.target, [
    '.tw-lbhbyt:hover{color:darkgreen}',
    '.tw-lbhbyt{background-color:#6b7280}',
  ])
})

test('basic template literal', ({ tw, sheet }) => {
  const style = css`
    color: rebeccapurple;
    background-color: ${theme('colors.gray.500')};
    &:hover {
      ${css`
        color: darkgreen;
      `}
    }
  `

  assert.is(tw(style), 'tw-nn3mfj')

  assert.equal(sheet.target, [
    '.tw-nn3mfj{color:rebeccapurple;background-color:#6b7280}',
    '.tw-nn3mfj:hover{color:darkgreen}',
  ])
})

test('nesting in template literal', ({ tw, sheet }) => {
  const style = css`
    /* all declarations will be prefixed */
    padding: 2em 1em;
    background: papayawhip;

    /* pseudo selectors work as well */
    &:hover {
      background: palevioletred;
    }

    /* media queries are no problem */
    @media (max-width: 600px) {
      background: tomato;

      /* nested rules work as expected */
      &:hover {
        background: yellow;
      }
    }

    > p {
      /* descendant-selectors work as well, but are more of an escape hatch */
      text-decoration: underline;
    }

    /* Contextual selectors work as well */
    html.test & {
      display: none;
    }
  `

  assert.is(tw(style), 'tw-1ealgxm')

  assert.equal(sheet.target, [
    '.tw-1ealgxm{padding:2em 1em;background:papayawhip}',
    '.tw-1ealgxm:hover{background:palevioletred}',
    'html.test .tw-1ealgxm{display:none}',
    '.tw-1ealgxm > p{text-decoration:underline}',
    '@media (max-width: 600px){.tw-1ealgxm:hover{background:yellow}}',
    '@media (max-width: 600px){.tw-1ealgxm{background:tomato}}',
  ])
})

test('interpolation values', ({ tw, sheet }) => {
  const random = Math.random()

  const style = css`
    background: dodgerblue;
    color: white;
    border: ${random}px solid white;
    animation: ${theme('durations.500')} ${theme('transitionTimingFunction.in-out')};

    &:focus,
    &:hover {
      padding: 1em;
    }

    .otherClass {
      margin: 0;
    }

    :global {
      body {
        ${css`
          color: darkgreen;
        `}
      }
    }
  `

  // No assert because of random
  const className = tw(style)

  assert.equal(sheet.target, [
    'body{color:darkgreen}',
    `.${className}{background:dodgerblue;color:white;border:${random}px solid white;animation:500ms cubic-bezier(0.4,0,0.2,1)}`,
    `.${className}:focus, .${className}:hover{padding:1em}`,
    `.${className} .otherClass{margin:0}`,
  ])
})

test('property fallbacks', ({ tw, sheet }) => {
  const style = css`
    color: ${['#0000', 'rgba(0, 0, 0, 0)']};
  `

  assert.is(tw(style), 'tw-1y6n6fa')

  assert.equal(sheet.target, ['.tw-1y6n6fa{color:#0000;color:rgba(0, 0, 0, 0)}'])
})

test('omit falsey values', ({ tw, sheet }) => {
  const style = css`
    a: ${false};
    b: ${NaN};
    c: ${''};
    d: ${null};
    e: ${undefined};
  `

  assert.is(tw(style), 'tw-yviiib')

  assert.equal(sheet.target, [])
})

test('omit falsey rules', ({ tw, sheet }) => {
  const style = css`
    a {
      ${false}
    }
    b {
      ${NaN}
    }
    c {
      ${''}
    }
    d {
      ${null}
    }
    e {
      ${undefined}
    }
  `

  assert.is(tw(style), 'tw-yviiib')

  assert.equal(sheet.target, [])
})

test('keyframes template literal', ({ tw, sheet }) => {
  const style = keyframes`
    from, 20%, 53%, 80%, to {
      transform: translate3d(0,0,0);
    }
    40%, 43% {
      transform: translate3d(0, -30px, 0);
    }
    70% {
      transform: translate3d(0, -15px, 0);
    },
    90% {
      transform: translate3d(0, -4px, 0);
    }
  `

  assert.is(tw(style), 'tw-1tx88h0')

  assert.equal(sheet.target, [
    '@keyframes tw-1tx88h0{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}, 90%{transform:translate3d(0, -4px, 0)}}',
  ])
})

test('keyframes with apply', ({ tw, sheet }) => {
  const bounce = animation(
    '1s ease infinite',
    keyframes`
      from, 20%, 53%, 80%, to {
        ${apply`transform-gpu translate-x-0`}
      }
      40%, 43% {
        ${apply`transform-gpu -translate-x-7`}
      }
      70% {
        ${apply`transform-gpu -translate-x-3.5`}
      },
      90% {
        ${apply`transform-gpu -translate-x-1`}
      }
    `,
  )

  assert.is(tw(bounce), 'tw-1pb2it5')

  assert.equal(sheet.target, [
    '@keyframes tw-p4d614{from, 20%, 53%, 80%, to{--tw-translate-x:0px;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;transform:translateX(0px);transform:translateX(var(--tw-translate-x,0)) translateY(var(--tw-translate-y,0)) rotate(var(--tw-rotate,0)) skewX(var(--tw-skew-x,0)) skewY(var(--tw-skew-y,0)) scaleX(var(--tw-scale-x,1)) scaleY(var(--tw-scale-y,1))}40%, 43%{--tw-translate-x:calc(1.75rem * -1);--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;transform:translateX(calc(1.75rem * -1));transform:translateX(var(--tw-translate-x,0)) translateY(var(--tw-translate-y,0)) rotate(var(--tw-rotate,0)) skewX(var(--tw-skew-x,0)) skewY(var(--tw-skew-y,0)) scaleX(var(--tw-scale-x,1)) scaleY(var(--tw-scale-y,1))}70%{--tw-translate-x:calc(0.875rem * -1);--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;transform:translateX(calc(0.875rem * -1));transform:translateX(var(--tw-translate-x,0)) translateY(var(--tw-translate-y,0)) rotate(var(--tw-rotate,0)) skewX(var(--tw-skew-x,0)) skewY(var(--tw-skew-y,0)) scaleX(var(--tw-scale-x,1)) scaleY(var(--tw-scale-y,1))}, 90%{--tw-translate-x:calc(0.25rem * -1);--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;transform:translateX(calc(0.25rem * -1));transform:translateX(var(--tw-translate-x,0)) translateY(var(--tw-translate-y,0)) rotate(var(--tw-rotate,0)) skewX(var(--tw-skew-x,0)) skewY(var(--tw-skew-y,0)) scaleX(var(--tw-scale-x,1)) scaleY(var(--tw-scale-y,1))}}',
    '.tw-1pb2it5{animation:1s ease infinite;animation-name:tw-p4d614}',
  ])
})

test('prose with tw-apply using variadic', ({ tw, sheet }) => {
  const prose = css(
    apply`text-gray(700 dark:300)`,
    {
      p: apply`my-5`,
      h1: apply`text(black dark:white hover:purple-500)`,
    },
    {
      h1: {
        fontWeight: '800',
        fontSize: '2.25em',
        marginTop: '0',
        marginBottom: '0.8888889em',
        lineHeight: '1.1111111',
      },
    },
  )

  assert.is(tw(prose), 'tw-dsp9ob')

  assert.equal(sheet.target, [
    '.tw-dsp9ob h1{--tw-text-opacity:1;color:#000;color:rgba(0,0,0,var(--tw-text-opacity));font-weight:800;font-size:2.25em;margin-top:0;margin-bottom:0.8888889em;line-height:1.1111111}',
    '.tw-dsp9ob h1:hover{--tw-text-opacity:1;color:#8b5cf6;color:rgba(139,92,246,var(--tw-text-opacity))}',
    '.tw-dsp9ob{--tw-text-opacity:1;color:#374151;color:rgba(55,65,81,var(--tw-text-opacity))}',
    '.tw-dsp9ob p{margin-bottom:1.25rem;margin-top:1.25rem}',
    '@media (prefers-color-scheme:dark){.tw-dsp9ob{--tw-text-opacity:1;color:#d1d5db;color:rgba(209,213,219,var(--tw-text-opacity))}}',
    '@media (prefers-color-scheme:dark){.tw-dsp9ob h1{--tw-text-opacity:1;color:#fff;color:rgba(255,255,255,var(--tw-text-opacity))}}',
  ])
})

test('prose with apply using template literal', ({ tw, sheet }) => {
  const prose = css`
    ${apply`text-gray(700 dark:300)`}

    p {
      ${apply('my-5')}
    }

    h1 {
      ${apply`text(black dark:white hover:purple-500)`}
      font-weight: 800;
      font-size: 2.25em;
      margin-top: 0;
      margin-bottom: 0.8888889em;
      line-height: 1.1111111;
    }
  `

  assert.is(tw(prose), 'tw-dsp9ob')

  assert.equal(sheet.target, [
    '.tw-dsp9ob h1{--tw-text-opacity:1;color:#000;color:rgba(0,0,0,var(--tw-text-opacity));font-weight:800;font-size:2.25em;margin-top:0;margin-bottom:0.8888889em;line-height:1.1111111}',
    '.tw-dsp9ob h1:hover{--tw-text-opacity:1;color:#8b5cf6;color:rgba(139,92,246,var(--tw-text-opacity))}',
    '.tw-dsp9ob{--tw-text-opacity:1;color:#374151;color:rgba(55,65,81,var(--tw-text-opacity))}',
    '.tw-dsp9ob p{margin-bottom:1.25rem;margin-top:1.25rem}',
    '@media (prefers-color-scheme:dark){.tw-dsp9ob{--tw-text-opacity:1;color:#d1d5db;color:rgba(209,213,219,var(--tw-text-opacity))}}',
    '@media (prefers-color-scheme:dark){.tw-dsp9ob h1{--tw-text-opacity:1;color:#fff;color:rgba(255,255,255,var(--tw-text-opacity))}}',
  ])
})

test('use :global with property callback', ({ tw, sheet }) => {
  const style = css({
    ':global': {
      html: {
        backgroundColor: theme('colors.gray.900'),
      },
    },
  })

  assert.is(tw(style), 'tw-m9gc8h')

  assert.equal(sheet.target, ['html{background-color:#111827}'])
})

test('extending preflight styles', () => {
  const sheet = virtualSheet()

  create({
    sheet,
    mode: strict,
    preflight: (preflight) =>
      css(
        preflight,
        {
          body: {
            backgroundColor: theme('colors.gray.900'),
          },
        },
        { body: apply`text-gray-100` },
      ),
    prefix: false,
  })

  assert.equal(
    sheet.target.filter((x) => x.startsWith('body{')),
    [
      'body{font-family:inherit;line-height:inherit;background-color:#111827;--tw-text-opacity:1;color:#f3f4f6;color:rgba(243,244,246,var(--tw-text-opacity))}',
    ],
  )
})

test('screen directive (template literal)', ({ tw, sheet }) => {
  const style = css`
    ${screen('sm')} {
      match: sm;
    }
    ${screen(
      'md',
      css`
        match: md;
      `,
    )}
    ${screen('lg', css({ match: 'md' }))}
    ${screen('xl', { match: 'xl' })}
    ${screen('2xl', apply`underline`)}
  `

  assert.equal(sheet.target, [])

  assert.is(tw(style), 'tw-1wbpegp')
  assert.equal(sheet.target, [
    '@media (min-width:640px){.tw-1wbpegp{match:sm}}',
    '@media (min-width:768px){.tw-1wbpegp{match:md}}',
    '@media (min-width:1024px){.tw-1wbpegp{match:md}}',
    '@media (min-width:1280px){.tw-1wbpegp{match:xl}}',
    '@media (min-width:1536px){.tw-1wbpegp{text-decoration:underline}}',
  ])
})

test('screen directive (object notation)', ({ tw, sheet }) => {
  const style = css(
    screen(
      'md',
      css`
        match: md;
      `,
    ),
    screen('lg', css({ match: 'md' })),
    screen('xl', { match: 'xl' }),
    screen('2xl', apply`underline`),
  )

  assert.equal(sheet.target, [])

  assert.is(tw(style), 'tw-1ee73e9')
  assert.equal(sheet.target, [
    '@media (min-width:768px){.tw-1ee73e9{match:md}}',
    '@media (min-width:1024px){.tw-1ee73e9{match:md}}',
    '@media (min-width:1280px){.tw-1ee73e9{match:xl}}',
    '@media (min-width:1536px){.tw-1ee73e9{text-decoration:underline}}',
  ])
})

test('@screen (template literal)', ({ tw, sheet }) => {
  const style = css`
    @screen sm {
      match: sm;
    }
    @screen 2xl {
      @apply underline;
    }
  `

  assert.equal(sheet.target, [])

  assert.is(tw(style), 'tw-svjqbe')
  assert.equal(sheet.target, [
    '@media (min-width:640px){.tw-svjqbe{match:sm}}',
    '@media (min-width:1536px){.tw-svjqbe{text-decoration:underline}}',
  ])
})

test('@apply (template literal)', ({ tw, sheet }) => {
  const style = css`
    @apply font-bold py-2 px-4 underline;
    color: fuchsia;
    transform: translateY(-1px);
  `

  assert.equal(sheet.target, [])

  assert.is(tw(style), 'tw-1dlm15h')
  assert.equal(sheet.target, [
    '.tw-1dlm15h{font-weight:700;padding-bottom:0.5rem;padding-top:0.5rem;padding-left:1rem;padding-right:1rem;text-decoration:underline;color:fuchsia;transform:translateY(-1px)}',
  ])
})

test.run()
