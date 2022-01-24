import { assert, test } from 'vitest'

import { parse } from './parse'

test('comments', () => {
  assert.deepEqual(
    parse(`
      underline
      /* multi
        line
        comment
      */
      hover:focus:!(
        sm:(italic why)
        lg:-(px)
        -mx-1
      )
      // Position
      !top-1 !-bottom-2
      text-(xl black)
    `),
    [
      { n: 'underline', v: [], i: false },
      { n: 'italic', v: ['hover', 'focus', 'sm'], i: true },
      { n: 'why', v: ['hover', 'focus', 'sm'], i: true },
      { n: '-px', v: ['hover', 'focus', 'lg'], i: true },
      { n: '-mx-1', v: ['hover', 'focus'], i: true },
      { n: 'top-1', v: [], i: true },
      { n: '-bottom-2', v: [], i: true },
      { n: 'text-xl', v: [], i: false },
      { n: 'text-black', v: [], i: false },
    ],
  )
})

test('group with comma', () => {
  assert.deepEqual(parse(`hover:(!underline,focus:italic)`), [
    { n: 'underline', v: ['hover'], i: true },
    { n: 'italic', v: ['hover', 'focus'], i: false },
  ])
})

test('nested', () => {
  assert.deepEqual(parse(`hover:~(!underline focus:italic)`), [
    { n: '~(!underline,focus:italic)', v: ['hover'], i: false },
  ])
})

test('nested with comma', () => {
  assert.deepEqual(parse(`hover:~(!underline,focus:italic,w-[1,2,theme(x[1.2])])`), [
    { n: '~(!underline,focus:italic,w-[1,2,theme(x[1.2])])', v: ['hover'], i: false },
  ])
})

test('nested and negative', () => {
  assert.deepEqual(parse(`rotate(-3 hover:6 md:(3,hover:-6))`), [
    { n: '-rotate-3', v: [], i: false },
    { n: 'rotate-6', v: ['hover'], i: false },
    { n: 'rotate-3', v: ['md'], i: false },
    { n: '-rotate-6', v: ['md', 'hover'], i: false },
  ])
})

test('arbitray valiue', () => {
  assert.deepEqual(
    parse(
      `grid-cols-[repeat(auto-fit,minmax(150px,1fr))] background-color[#1da1f1] content["whoa"]`,
    ),
    [
      { n: 'grid-cols-[repeat(auto-fit,minmax(150px,1fr))]', v: [], i: false },
      { n: 'background-color[#1da1f1]', v: [], i: false },
      { n: 'content["whoa"]', v: [], i: false },
    ],
  )
})

test('attribute selector', () => {
  assert.deepEqual(
    parse(`
      not-[lang]:italic
      [data-reach-menu-item][data-selected]:bg-red-300
      [href^='https'][href$='.org']:hover:bg-green-400
    `),
    [
      { n: 'italic', v: ['not-[lang]'], i: false },
      {
        n: 'bg-red-300',
        v: ['[data-reach-menu-item][data-selected]'],
        i: false,
      },
      {
        n: 'bg-green-400',
        v: [`[href^='https'][href$='.org']`, 'hover'],
        i: false,
      },
    ],
  )
})

test('arbitrary properties', () => {
  assert.deepEqual(parse('![mask-type:luminance] hover:[mask-type:alpha]'), [
    { n: '[mask-type:luminance]', v: [], i: true },
    {
      n: '[mask-type:alpha]',
      v: ['hover'],
      i: false,
    },
  ])
})

test('pseudo element selector', () => {
  assert.deepEqual(parse('after::underline'), [
    {
      n: 'underline',
      v: ['after:'],
      i: false,
    },
  ])
})

test('named shortcuts', () => {
  assert.deepEqual(parse('PrimaryButton~(bg-red-500 text-white)'), [
    {
      n: 'PrimaryButton#140ikvd',
      v: [],
      i: false,
    },
  ])

  assert.deepEqual(parse('hover:PrimaryButton~(bg-red-500 text-white)'), [
    {
      n: 'PrimaryButton#140ikvd',
      v: ['hover'],
      i: false,
    },
  ])
})

test('primary-foreground-(light dark:dark)', () => {
  assert.deepEqual(parse('primary-foreground-(light dark:dark)'), [
    { n: 'primary-foreground-light', v: [], i: false },
    { n: 'primary-foreground-dark', v: ['dark'], i: false },
  ])
})
