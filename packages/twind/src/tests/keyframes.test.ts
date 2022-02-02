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
    'css#1h96eou',
  )
  assert.deepEqual(tw.target, [
    '/*!0,0*/@keyframes \\#1b0mdne{0%{opacity:0}100%{opacity:1}}',
    '/*!fjd9fk,v,css#1h96eou*/.css\\#1h96eou{animation:1s \\#1b0mdne ease-out}',
  ])

  tw.clear()

  assert.strictEqual(tw(`animate-[1s_${fadeIn}_ease-out]`), 'animate-[1s_\\#1b0mdne_ease-out]')

  assert.deepEqual(tw.target, [
    '/*!0,0*/@keyframes \\#1b0mdne{0%{opacity:0}100%{opacity:1}}',
    '/*!dbgidc,v,animate-[1s_\\#1b0mdne_ease-out]*/.animate-\\[1s_\\\\\\#1b0mdne_ease-out\\]{animation:1s \\#1b0mdne ease-out}',
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
    'css#1h96eou',
  )
  assert.deepEqual(tw$.target, [
    '@keyframes \\#1b0mdne{0%{opacity:0}100%{opacity:1}}',
    '.css\\#1h96eou{animation:1s \\#1b0mdne ease-out}',
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
    'css#exvsdi',
  )
  assert.deepEqual(tw$.target, [
    '@keyframes FadeIn\\#zobdkg{0%{opacity:0}100%{opacity:1}}',
    '.css\\#exvsdi{animation:1s FadeIn\\#zobdkg ease-out}',
  ])
  assert.lengthOf(tw.target as string[], 0)
})

test('keyframes proxy passthrough', () => {
  const str = '0% {opacity: 0;}'
  assert.strictEqual(keyframes(str).toString(), '\\#66k1rx')
  assert.strictEqual(keyframes.func(str).toString(), 'func\\#3ais1h')

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
    '\\#1b0mdne',
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
    'func\\#ydo9qy',
  )

  assert.strictEqual(k.toString().replace(/[\s]/g, ''), 'function(){[nativecode]}')
})
