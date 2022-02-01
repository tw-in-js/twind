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
    '/*!0,0*/@keyframes \\#ts0qzs{0%{opacity:0}100%{opacity:1}}',
    '/*!fjd9fk,v,css#crz8f0*/.css\\#crz8f0{animation:1s \\#ts0qzs ease-out}',
  ])

  tw.clear()

  assert.strictEqual(tw(`animate-[1s_${fadeIn}_ease-out]`), 'animate-[1s_\\#ts0qzs_ease-out]')

  assert.deepEqual(tw.target, [
    '/*!0,0*/@keyframes \\#ts0qzs{0%{opacity:0}100%{opacity:1}}',
    '/*!dbgidc,v,animate-[1s_\\#ts0qzs_ease-out]*/.animate-\\[1s_\\\\\\#ts0qzs_ease-out\\]{animation:1s \\#ts0qzs ease-out}',
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
    '/*!0,0*/@keyframes FadeIn\\#37blcs{0%{opacity:0}100%{opacity:1}}',
    '/*!fjd9fk,v,css#e7l0t2*/.css\\#e7l0t2{animation:1s FadeIn\\#37blcs ease-out}',
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

test('keyframes proxy passthrough', () => {
  const str = '0% {opacity: 0;}'
  assert.strictEqual(keyframes(str).toString(), '\\#1bzmnn1')
  assert.strictEqual(keyframes.func(str).toString(), 'func\\#2vt08t')

  assert.strictEqual(keyframes.toString().replace(/[\s]/g, ''), 'function(){[nativecode]}')

  const k = keyframes.bind(tw) // (otherwise, 'active' will be undefined))

  assert.strictEqual(
    k`
0% {
opacity: 0;
}
100% {
opacity: 1;
}
`.toString(),
    '\\#ts0qzs',
  )

  assert.strictEqual(
    k.func`
0% {
opacity: 0;
}
100% {
opacity: 1;
}
`.toString(),
    'func\\#iw1k4k',
  )

  assert.strictEqual(k.toString().replace(/[\s]/g, ''), 'function(){[nativecode]}')
})
