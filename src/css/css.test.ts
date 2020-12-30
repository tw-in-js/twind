import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance } from '../types'
import type { VirtualSheet } from '../sheets/index'

import { virtualSheet } from '../sheets/index'
import { create, strict } from '../index'
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

  assert.is(tw(style), 'tw-5fqnnd')

  assert.equal(sheet.target, [
    '.tw-5fqnnd:hover{color:darkgreen}',
    '.tw-5fqnnd{background-color:hotpink}',
  ])

  // it is cached
  assert.is(tw(style), 'tw-5fqnnd')

  assert.equal(sheet.target, [
    '.tw-5fqnnd:hover{color:darkgreen}',
    '.tw-5fqnnd{background-color:hotpink}',
  ])
})

test('create with global css within custom tw', ({ tw, sheet }) => {
  const style = css({
    backgroundColor: 'darkgreen',
  })

  // It is lazy
  assert.equal(sheet.target, [])

  assert.is(tw(style), 'tw-1yoxc1q')

  assert.equal(sheet.target, ['.tw-1yoxc1q{background-color:darkgreen}'])
})

test('create with global css and call with tw', ({ tw, sheet }) => {
  const style = css({
    backgroundColor: 'darkgreen',
  })

  // It is lazy
  assert.equal(sheet.target, [])

  assert.is(style({ tw }), 'tw-1yoxc1q')

  assert.equal(sheet.target, ['.tw-1yoxc1q{background-color:darkgreen}'])
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

  assert.is(tw(styles), 'tw-af4r5s')

  assert.equal(sheet.target, ['.tw-af4r5s a:hover{color:#1d4ed8}', '.tw-af4r5s a{color:#3b82f6}'])
})
test('cached by its JSON representation', ({ css, sheet }) => {
  const style = css({
    backgroundColor: 'hotpink',
    '&:hover': {
      color: 'darkgreen',
    },
  })

  assert.is(
    css({
      backgroundColor: 'hotpink',
      '&:hover': {
        color: 'darkgreen',
      },
    }),
    style,
  )

  assert.equal(sheet.target, [])
})

test('can be used with variants', ({ tw, sheet }) => {
  const style = css({
    backgroundColor: 'hotpink',
    '&:hover': {
      color: 'darkgreen',
    },
  })

  assert.is(tw`sm:${style} focus:${style}`, 'sm:tw-5fqnnd focus:tw-5fqnnd')

  assert.equal(sheet.target, [
    '.focus\\:tw-5fqnnd:focus:hover{color:darkgreen}',
    '.focus\\:tw-5fqnnd:focus{background-color:hotpink}',
    '@media (min-width: 640px){.sm\\:tw-5fqnnd:hover{color:darkgreen}}',
    '@media (min-width: 640px){.sm\\:tw-5fqnnd{background-color:hotpink}}',
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
    'tw-1v80189',
  )
  assert.equal(sheet.target, [
    '.tw-1v80189{animation:tw-cm8eaz 1s ease infinite}',
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

  assert.is(tw(styles), 'tw-14tbawn')

  assert.equal(sheet.target, [
    '.tw-14tbawn{animation:1s ease infinite;animation-name:tw-cm8eaz}',
    '@keyframes tw-cm8eaz{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
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

  assert.is(tw(bounce), 'tw-14tbawn')
  assert.equal(sheet.target, [
    '.tw-14tbawn{animation:1s ease infinite;animation-name:tw-cm8eaz}',
    '@keyframes tw-cm8eaz{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
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

  assert.is(tw(slidein), 'tw-tchezo')
  assert.equal(sheet.target, [
    '.tw-tchezo{animation:500ms cubic-bezier(0.4,0,0.2,1);animation-name:tw-nlnhc}',
    '@keyframes tw-nlnhc{from{transform:translateX(0%)}to{transform:translateX(100%)}}',
  ])
})

test('animation object notation', ({ animation, tw, sheet }) => {
  const bounce = animation(
    {
      animationDuration: '1s',
      animationTimingFunction: ({ theme }) => theme('transitionTimingFunction', 'in-out'),
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

  assert.is(tw(bounce), 'tw-1e66f79')
  assert.equal(sheet.target, [
    '.tw-1e66f79{animation-duration:1s;animation-timing-function:cubic-bezier(0.4,0,0.2,1);animation-iteration-count:infinite;animation-name:tw-cm8eaz}',
    '@keyframes tw-cm8eaz{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
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

  assert.is(tw`hover:${bounce}`, 'hover:tw-14tbawn')
  assert.equal(sheet.target, [
    '@keyframes tw-cm8eaz{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0)}40%, 43%{transform:translate3d(0, -30px, 0)}70%{transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}',
    '.hover\\:tw-14tbawn:hover{animation:1s ease infinite;animation-name:tw-cm8eaz}',
  ])
})

test.run()
