import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance } from '../types'
import type { VirtualSheet } from '../sheets/index'

import { virtualSheet } from '../sheets/index'
import { create, strict, theme } from '../index'
import { css, keyframes, animation } from './index'

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
  context.animation = animation.bind(context.tw)
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
    a: ({ theme }) => ({
      color: theme('colors.blue.500'),
      // .tw-xxx a:hover
      '&:hover': {
        color: theme('colors.blue.700'),
      },
    }),
  })

  assert.is(tw(styles), 'tw-1bxgl9r')

  assert.equal(sheet.target, ['.tw-1bxgl9r a:hover{color:#1d4ed8}', '.tw-1bxgl9r a{color:#3b82f6}'])
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

test('toString uses bound tw', ({ css, sheet }) => {
  const style = css({
    color: 'rebeccapurple',
  })

  assert.is(`${style}`, 'tw-1ha8m0q')
  assert.equal(sheet.target, ['.tw-1ha8m0q{color:rebeccapurple}'])
})

test('valueOf uses bound tw', ({ css, sheet }) => {
  const style = css({
    color: 'hotpink',
  })

  assert.is(style.valueOf(), 'tw-14q97zu')
  assert.equal(sheet.target, ['.tw-14q97zu{color:hotpink}'])
})

test('toString uses global tw', ({ sheet }) => {
  const style = css({
    color: 'rebeccapurple',
  })

  assert.is(`${style}`, 'tw-1ha8m0q')
  assert.equal(sheet.target, [])
})

test('valueOf uses global tw', ({ sheet }) => {
  const style = css({
    color: 'hotpink',
  })

  assert.is(style.valueOf(), 'tw-14q97zu')
  assert.equal(sheet.target, [])
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
        animation: `${bounce} 1s ease infinite`,
      }),
    ),
    'tw-15ziufb',
  )
  assert.equal(sheet.target, [
    '@keyframes tw-w4cbcw{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
    '.tw-15ziufb{animation:tw-w4cbcw 1s ease infinite}',
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

  assert.is(tw(styles), 'tw-1u18b6c')

  assert.equal(sheet.target, [
    '@keyframes tw-w4cbcw{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
    '.tw-1u18b6c{animation:1s ease infinite;animation-name:tw-w4cbcw}',
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

  assert.is(tw(bounce), 'tw-1u18b6c')
  assert.equal(sheet.target, [
    '@keyframes tw-w4cbcw{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
    '.tw-1u18b6c{animation:1s ease infinite;animation-name:tw-w4cbcw}',
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

  assert.is(tw(slidein), 'tw-t9bwf7')
  assert.equal(sheet.target, [
    '@keyframes tw-17sq2wg{from{transform:translateX(0%)}to{transform:translateX(100%)}}',
    '.tw-t9bwf7{animation:500ms cubic-bezier(0.4,0,0.2,1);animation-name:tw-17sq2wg}',
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

  assert.is(tw(bounce), 'tw-xlkmxq')
  assert.equal(sheet.target, [
    '@keyframes tw-w4cbcw{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
    '.tw-xlkmxq{animation-duration:1s;animation-timing-function:cubic-bezier(0.4,0,0.2,1);animation-iteration-count:infinite;animation-name:tw-w4cbcw}',
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

  assert.is(tw`hover:${bounce}`, 'hover:tw-1u18b6c')
  assert.equal(sheet.target, [
    '@keyframes tw-w4cbcw{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
    '.hover\\:tw-1u18b6c:hover{animation:1s ease infinite;animation-name:tw-w4cbcw}',
  ])
})

test('use :global with property callback', ({ tw, sheet }) => {
  const style = css({
    ':global': {
      html: {
        backgroundColor: ({ theme }) => theme('colors.gray.900'),
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
    backgroundColor: ({ theme }) => theme('colors.gray.500'),
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
    background-color: ${({ theme }) => theme('colors.gray.500')};
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
    animation: ${({ theme }) => theme('durations.500')}
      ${({ theme }) => theme('transitionTimingFunction.in-out')};

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

  assert.is(tw(style), 'tw-v87p2q')

  assert.equal(sheet.target, [
    '@keyframes tw-v87p2q{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}, 90%{transform:translate3d(0, -4px, 0)}}',
  ])
})

test('use :global with property callback', ({ tw, sheet }) => {
  const style = css({
    ':global': {
      html: {
        backgroundColor: ({ theme }) => theme('colors.gray.900'),
      },
    },
  })

  assert.is(tw(style), 'tw-k73ke2')

  assert.equal(sheet.target, ['html{background-color:#111827}'])
})

test.run()
