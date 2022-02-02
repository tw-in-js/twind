import { assert, test, afterEach } from 'vitest'

import presetTailwind from '@twind/preset-tailwind'
import { setup, twind, virtual, tw, animation, keyframes } from '..'

setup({
  presets: [presetTailwind({ enablePreflight: false })],
})

afterEach(() => tw.clear())

test('animations are lazy injected', () => {
  const breath = animation(
    '1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite',
    keyframes({
      '0%': {
        transform: 'scaleY(1)',
      },
      '50%,100%': {
        transform: 'scaleY(0.5)',
      },
    }),
  )

  assert.lengthOf(tw.target as string[], 0)

  assert.strictEqual(tw(breath), 'animation#1u47gj')
  assert.deepEqual(tw.target, [
    '/*!0,0*/@keyframes \\#1hjufz5{0%{transform:scaleY(1)}50%,100%{transform:scaleY(0.5)}}',
    '/*!fjd9fk,w,animation#1u47gj*/.animation\\#1u47gj{animation:1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;animation-name:\\#1hjufz5}',
  ])
})

test('bound keyframes are lazy injected', () => {
  const tw$ = twind(
    {
      presets: [presetTailwind({ enablePreflight: false })],
    },
    virtual(),
  )

  const keyframes$ = keyframes.bind(tw$)

  const fadeIn = animation(
    { animationDuration: '5s' },
    keyframes$`
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    `,
  )

  assert.lengthOf(tw$.target, 0)

  assert.strictEqual(tw$(fadeIn), 'animation#b4mmuv')
  assert.deepEqual(tw$.target, [
    '@keyframes \\#1b0mdne{0%{opacity:0}100%{opacity:1}}',
    '.animation\\#b4mmuv{animation-duration:5s;animation-name:\\#1b0mdne}',
  ])

  assert.lengthOf(tw.target as string[], 0)
})

test('named animations', () => {
  const fadeIn = animation.FadeIn(
    '5s',
    keyframes.FadeIn`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `,
  )

  assert.lengthOf(tw.target as string[], 0)

  assert.strictEqual(tw(fadeIn), 'FadeIn#1b2nfnd')
  assert.deepEqual(tw.target, [
    '/*!0,0*/@keyframes FadeIn\\#zobdkg{0%{opacity:0}100%{opacity:1}}',
    '/*!fjd9fk,w,FadeIn#1b2nfnd*/.FadeIn\\#1b2nfnd{animation:5s;animation-name:FadeIn\\#zobdkg}',
  ])
})

test('animation proxy passthrough', () => {
  assert.strictEqual(
    animation('linear 7s', keyframes({ '0%': { opacity: 0 } })).toString(),
    'animation#ilpl5p',
  )
  assert.strictEqual(
    animation.func('linear 7s', keyframes({ '0%': { opacity: 0 } })).toString(),
    'func#1hvnq9l',
  )

  assert.strictEqual(animation.toString().replace(/[\s]/g, ''), 'function(){[nativecode]}')

  const k = keyframes.bind(tw) // (otherwise, 'active' will be undefined))

  assert.strictEqual(
    animation(
      '5s',
      k`
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      `,
    ).toString(),
    'animation#14y2azx',
  )

  assert.strictEqual(
    animation
      .func(
        '5s',
        k`
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        `,
      )
      .toString(),
    'func#1of5fce',
  )

  assert.strictEqual(k.toString().replace(/[\s]/g, ''), 'function(){[nativecode]}')
})
