import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance } from '../types'
import type { VirtualSheet } from '../sheets/index'

import { virtualSheet } from '../sheets/index'
import { create, strict } from '../index'
import { css, keyframes, animation, apply, theme } from './index'

const test = suite<{
  sheet: VirtualSheet
  tw: Instance['tw']
  css: typeof css
  keyframes: typeof keyframes
  animation: typeof animation
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

  context.css = css.bind(context.tw)
  context.keyframes = keyframes.bind(context.tw)
  context.animation = animation.bind(context.tw) as typeof animation
})

test.after.each(({ sheet }) => {
  sheet.reset()
})

test('create css', ({ css, tw, sheet }) => {
  const style = css({
    backgroundColor: 'hotpink',
    '&:hover': {
      color: 'darkgreen',
    },
  })

  // It is lazy
  assert.equal(sheet.target, [])

  assert.is(tw(style), 'tw-af5k28')

  assert.equal(sheet.target, [
    '.tw-af5k28:hover{color:darkgreen}',
    '.tw-af5k28{background-color:hotpink}',
  ])

  // it is cached
  assert.is(tw(style), 'tw-af5k28')

  assert.equal(sheet.target, [
    '.tw-af5k28:hover{color:darkgreen}',
    '.tw-af5k28{background-color:hotpink}',
  ])
})

test('create with global css within custom tw', ({ tw, sheet }) => {
  const style = css({
    backgroundColor: 'darkgreen',
  })

  // It is lazy
  assert.equal(sheet.target, [])

  assert.is(tw(style), 'tw-1gewvs9')

  assert.equal(sheet.target, ['.tw-1gewvs9{background-color:darkgreen}'])
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

  assert.is(tw(styles), 'tw-af4r5s')

  assert.equal(sheet.target, ['.tw-af4r5s a:hover{color:#1d4ed8}', '.tw-af4r5s a{color:#3b82f6}'])
})

test('can be used with variants', ({ tw, sheet }) => {
  const style = css({
    backgroundColor: 'hotpink',
    '&:hover': {
      color: 'darkgreen',
    },
  })

  assert.is(tw`sm:${style} focus:${style}`, 'sm:tw-af5k28 focus:tw-af5k28')

  assert.equal(sheet.target, [
    '.focus\\:tw-af5k28:focus:hover{color:darkgreen}',
    '.focus\\:tw-af5k28:focus{background-color:hotpink}',
    '@media (min-width: 640px){.sm\\:tw-af5k28:hover{color:darkgreen}}',
    '@media (min-width: 640px){.sm\\:tw-af5k28{background-color:hotpink}}',
  ])
})

test('keyframes', ({ keyframes, css, tw, sheet }) => {
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
        animation: animation(`1s ease infinite`, bounce),
      }),
    ),
    'tw-4l4ydd',
  )
  assert.equal(sheet.target, [
    '.tw-4l4ydd animation{animation:1s ease infinite;animation-name:tw-cm8eaz}',
    '@keyframes tw-cm8eaz{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
  ])
})

test('keyframes lazy', ({ keyframes, css, tw, sheet }) => {
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

  assert.is(tw(styles), 'tw-pflk76')

  assert.equal(sheet.target, [
    '@keyframes tw-cm8eaz{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
    '.tw-pflk76{animation:1s ease infinite;animation-name:tw-cm8eaz}',
  ])
})

test('animation', ({ animation, tw, sheet }) => {
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

  assert.is(tw(bounce), 'tw-pflk76')
  assert.equal(sheet.target, [
    '@keyframes tw-cm8eaz{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
    '.tw-pflk76{animation:1s ease infinite;animation-name:tw-cm8eaz}',
  ])
})

test('animation with callback', ({ animation, tw, sheet }) => {
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

  assert.is(tw(slidein), 'tw-1om6vki')
  assert.equal(sheet.target, [
    '@keyframes tw-nlnhc{from{transform:translateX(0%)}to{transform:translateX(100%)}}',
    '.tw-1om6vki{animation:500ms cubic-bezier(0.4,0,0.2,1);animation-name:tw-nlnhc}',
  ])
})

test('animation object notation', ({ animation, tw, sheet }) => {
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

  assert.is(tw(bounce), 'tw-hduhmc')
  assert.equal(sheet.target, [
    '@keyframes tw-cm8eaz{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
    '.tw-hduhmc{animation-duration:1s;animation-timing-function:cubic-bezier(0.4,0,0.2,1);animation-iteration-count:infinite;animation-name:tw-cm8eaz}',
  ])
})

test('animation with variant', ({ animation, tw, sheet }) => {
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

  assert.is(tw`hover:${bounce}`, 'hover:tw-pflk76')
  assert.equal(sheet.target, [
    '@keyframes tw-cm8eaz{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
    '.hover\\:tw-pflk76:hover{animation:1s ease infinite;animation-name:tw-cm8eaz}',
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

  assert.is(tw(style), 'tw-1qjz0n0')

  assert.equal(sheet.target, [
    '@keyframes tw-1tx88h0{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}, 90%{transform:translate3d(0, -4px, 0)}}',
    '.tw-1qjz0n0{animation:1s ease infinite;animation-name:tw-1tx88h0}',
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

  assert.is(tw(style), 'tw-mppuc2')

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

  assert.is(tw(style), 'tw-185cesv')

  assert.equal(sheet.target, [
    '.tw-185cesv{background-color:hotpink;color:red}',
    '.tw-185cesv:hover{color:darkgreen}',
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

  assert.is(tw(style), 'tw-185cesv')

  assert.equal(sheet.target, [
    '.tw-185cesv{background-color:hotpink;color:red}',
    '.tw-185cesv:hover{color:darkgreen}',
  ])
})

test('can be nested', ({ tw, sheet }) => {
  const style = css({
    backgroundColor: theme('colors.gray.500'),
    '&:hover': css({
      color: 'darkgreen',
    }),
  })

  assert.is(tw(style), 'tw-m78vn1')

  assert.equal(sheet.target, [
    '.tw-m78vn1:hover{color:darkgreen}',
    '.tw-m78vn1{background-color:#6b7280}',
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

  assert.is(tw(style), 'tw-u88iva')

  assert.equal(sheet.target, [
    '.tw-u88iva{color:rebeccapurple;background-color:#6b7280}',
    '.tw-u88iva:hover{color:darkgreen}',
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

  assert.is(tw(style), 'tw-1io884b')

  assert.equal(sheet.target, [
    '.tw-1io884b > p{text-decoration:underline}',
    '.tw-1io884b{padding:2em 1em;background:papayawhip}',
    '.tw-1io884b:hover{background:palevioletred}',
    'html.test .tw-1io884b{display:none}',
    '@media (max-width: 600px){.tw-1io884b:hover{background:yellow}}',
    '@media (max-width: 600px){.tw-1io884b{background:tomato}}',
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
    `.${className} .otherClass{margin:0}`,
    `.${className}{background:dodgerblue;color:white;border:${random}px solid white;animation:500ms cubic-bezier(0.4,0,0.2,1)}`,
    `.${className}:focus, .${className}:hover{padding:1em}`,
  ])
})

test('property fallbacks', ({ tw, sheet }) => {
  const style = css`
    color: ${['#0000', 'rgba(0, 0, 0, 0)']};
  `

  assert.is(tw(style), 'tw-11sfiw9')

  assert.equal(sheet.target, ['.tw-11sfiw9{color:#0000;color:rgba(0, 0, 0, 0)}'])
})

test('omit falsey values', ({ tw, sheet }) => {
  const style = css`
    a: ${false};
    b: ${NaN};
    c: ${''};
    d: ${null};
    e: ${undefined};
  `

  assert.is(tw(style), 'tw-1dpp5mc')

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

  assert.is(tw(style), 'tw-1dpp5mc')

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

  assert.is(tw(bounce), 'tw-1urc447')

  assert.equal(sheet.target, [
    '@keyframes tw-p4d614{from, 20%, 53%, 80%, to{--tw-translate-x:0px;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;transform:translateX(0px);transform:translateX(var(--tw-translate-x,0)) translateY(var(--tw-translate-y,0)) rotate(var(--tw-rotate,0)) skewX(var(--tw-skew-x,0)) skewY(var(--tw-skew-y,0)) scaleX(var(--tw-scale-x,1)) scaleY(var(--tw-scale-y,1))}40%, 43%{--tw-translate-x:calc(1.75rem * -1);--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;transform:translateX(calc(1.75rem * -1));transform:translateX(var(--tw-translate-x,0)) translateY(var(--tw-translate-y,0)) rotate(var(--tw-rotate,0)) skewX(var(--tw-skew-x,0)) skewY(var(--tw-skew-y,0)) scaleX(var(--tw-scale-x,1)) scaleY(var(--tw-scale-y,1))}70%{--tw-translate-x:calc(0.875rem * -1);--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;transform:translateX(calc(0.875rem * -1));transform:translateX(var(--tw-translate-x,0)) translateY(var(--tw-translate-y,0)) rotate(var(--tw-rotate,0)) skewX(var(--tw-skew-x,0)) skewY(var(--tw-skew-y,0)) scaleX(var(--tw-scale-x,1)) scaleY(var(--tw-scale-y,1))}, 90%{--tw-translate-x:calc(0.25rem * -1);--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;transform:translateX(calc(0.25rem * -1));transform:translateX(var(--tw-translate-x,0)) translateY(var(--tw-translate-y,0)) rotate(var(--tw-rotate,0)) skewX(var(--tw-skew-x,0)) skewY(var(--tw-skew-y,0)) scaleX(var(--tw-scale-x,1)) scaleY(var(--tw-scale-y,1))}}',
    '.tw-1urc447{animation:1s ease infinite;animation-name:tw-p4d614}',
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

  assert.is(tw(prose), 'tw-k2lahq')

  assert.equal(sheet.target, [
    '.tw-k2lahq h1{--tw-text-opacity:1;color:#000;color:rgba(0,0,0,var(--tw-text-opacity));font-weight:800;font-size:2.25em;margin-top:0;margin-bottom:0.8888889em;line-height:1.1111111}',
    '.tw-k2lahq h1:hover{--tw-text-opacity:1;color:#8b5cf6;color:rgba(139,92,246,var(--tw-text-opacity))}',
    '.tw-k2lahq p{margin-bottom:1.25rem;margin-top:1.25rem}',
    '@media (prefers-color-scheme:dark){.tw-k2lahq h1{--tw-text-opacity:1;color:#fff;color:rgba(255,255,255,var(--tw-text-opacity))}}',
    '.tw-k2lahq{--tw-text-opacity:1;color:#374151;color:rgba(55,65,81,var(--tw-text-opacity))}',
    '@media (prefers-color-scheme:dark){.tw-k2lahq{--tw-text-opacity:1;color:#d1d5db;color:rgba(209,213,219,var(--tw-text-opacity))}}',
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

  assert.is(tw(prose), 'tw-k2lahq')

  assert.equal(sheet.target, [
    '.tw-k2lahq h1{--tw-text-opacity:1;color:#000;color:rgba(0,0,0,var(--tw-text-opacity));font-weight:800;font-size:2.25em;margin-top:0;margin-bottom:0.8888889em;line-height:1.1111111}',
    '.tw-k2lahq h1:hover{--tw-text-opacity:1;color:#8b5cf6;color:rgba(139,92,246,var(--tw-text-opacity))}',
    '.tw-k2lahq p{margin-bottom:1.25rem;margin-top:1.25rem}',
    '@media (prefers-color-scheme:dark){.tw-k2lahq h1{--tw-text-opacity:1;color:#fff;color:rgba(255,255,255,var(--tw-text-opacity))}}',
    '.tw-k2lahq{--tw-text-opacity:1;color:#374151;color:rgba(55,65,81,var(--tw-text-opacity))}',
    '@media (prefers-color-scheme:dark){.tw-k2lahq{--tw-text-opacity:1;color:#d1d5db;color:rgba(209,213,219,var(--tw-text-opacity))}}',
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

  assert.is(tw(style), 'tw-mppuc2')

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

test.run()
