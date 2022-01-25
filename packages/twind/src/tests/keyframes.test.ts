import { assert, test, afterEach } from 'vitest'

import presetTailwind from '@twind/preset-tailwind'
import { setup, twind, virtual, tw, keyframes, css } from '..'

setup({
  presets: [presetTailwind({ enablePreflight: false })],
})

afterEach(() => tw.clear())

test('keyframes are lazy injected', () => {
  const fadeIn = keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `

  assert.lengthOf(tw.target as string[], 0)

  assert.strictEqual(
    tw(
      css`
        animation: 1s ${fadeIn} ease-out;
      `,
    ),
    'css#crz8f0',
  )
  assert.deepEqual(tw.target, [
    '@keyframes \\#ts0qzs{0%{opacity:0}100%{opacity:1}}',
    '.css\\#crz8f0{animation:1s \\#ts0qzs ease-out}',
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

  const fadeIn = keyframes$`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `

  assert.lengthOf(tw$.target, 0)

  assert.strictEqual(
    tw$(
      css`
        animation: 1s ${fadeIn} ease-out;
      `,
    ),
    'css#crz8f0',
  )
  assert.deepEqual(tw$.target, [
    '@keyframes \\#ts0qzs{0%{opacity:0}100%{opacity:1}}',
    '.css\\#crz8f0{animation:1s \\#ts0qzs ease-out}',
  ])
  assert.lengthOf(tw.target as string[], 0)
})

test('named keyframes', () => {
  const fadeIn = keyframes.FadeIn({
    '0%': {
      opacity: '0',
    },
    '100%': {
      opacity: '1',
    },
  })

  assert.lengthOf(tw.target as string[], 0)

  assert.strictEqual(
    tw(
      css({
        animation: `1s ${fadeIn} ease-out`,
      }),
    ),
    'css#e7l0t2',
  )
  assert.deepEqual(tw.target, [
    '@keyframes FadeIn\\#37blcs{0%{opacity:0}100%{opacity:1}}',
    '.css\\#e7l0t2{animation:1s FadeIn\\#37blcs ease-out}',
  ])
})

test('bound named keyframes', () => {
  const tw$ = twind(
    {
      presets: [presetTailwind({ enablePreflight: false })],
    },
    virtual(),
  )

  const keyframes$ = keyframes.bind(tw$)

  const fadeIn = keyframes$.FadeIn`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `

  assert.lengthOf(tw$.target, 0)

  assert.strictEqual(
    tw$(
      css`
        animation: 1s ${fadeIn} ease-out;
      `,
    ),
    'css#1v9hf80',
  )
  assert.deepEqual(tw$.target, [
    '@keyframes FadeIn\\#1775q8c{0%{opacity:0}100%{opacity:1}}',
    '.css\\#1v9hf80{animation:1s FadeIn\\#1775q8c ease-out}',
  ])
  assert.lengthOf(tw.target as string[], 0)
})
