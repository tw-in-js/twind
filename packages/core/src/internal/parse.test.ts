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
      { name: 'underline', variants: [], important: false },
      { name: 'italic', variants: ['hover', 'focus', 'sm'], important: true },
      { name: 'why', variants: ['hover', 'focus', 'sm'], important: true },
      { name: '-px', variants: ['hover', 'focus', 'lg'], important: true },
      { name: '-mx-1', variants: ['hover', 'focus'], important: true },
      { name: 'top-1', variants: [], important: true },
      { name: '-bottom-2', variants: [], important: true },
      { name: 'text-xl', variants: [], important: false },
      { name: 'text-black', variants: [], important: false },
    ],
  )
})

test('group with comma', () => {
  assert.deepEqual(parse(`hover:(!underline,focus:italic)`), [
    { name: 'underline', variants: ['hover'], important: true },
    { name: 'italic', variants: ['hover', 'focus'], important: false },
  ])
})

test('nested', () => {
  assert.deepEqual(parse(`hover:~(!underline focus:italic)`), [
    [
      { name: 'underline', variants: ['hover'], important: true },
      { name: 'italic', variants: ['hover', 'focus'], important: false },
    ],
  ])
})

test('nested with comma', () => {
  assert.deepEqual(parse(`hover:~(!underline,focus:italic,w-[1,2,theme(x[1.2])])`), [
    [
      { name: 'underline', variants: ['hover'], important: true },
      { name: 'italic', variants: ['hover', 'focus'], important: false },
      { name: 'w-[1,2,theme(x[1.2])]', variants: ['hover'], important: false },
    ],
  ])
})

test('nested and negative', () => {
  assert.deepEqual(parse(`rotate(-3 hover:6 md:(3,hover:-6))`), [
    { name: '-rotate-3', variants: [], important: false },
    { name: 'rotate-6', variants: ['hover'], important: false },
    { name: 'rotate-3', variants: ['md'], important: false },
    { name: '-rotate-6', variants: ['md', 'hover'], important: false },
  ])
})

test('arbitray valiue', () => {
  assert.deepEqual(
    parse(
      `grid-cols-[repeat(auto-fit,minmax(150px,1fr))] background-color[#1da1f1] content["whoa"]`,
    ),
    [
      { name: 'grid-cols-[repeat(auto-fit,minmax(150px,1fr))]', variants: [], important: false },
      { name: 'background-color[#1da1f1]', variants: [], important: false },
      { name: 'content["whoa"]', variants: [], important: false },
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
      { name: 'italic', variants: ['not-[lang]'], important: false },
      {
        name: 'bg-red-300',
        variants: ['[data-reach-menu-item][data-selected]'],
        important: false,
      },
      {
        name: 'bg-green-400',
        variants: [`[href^='https'][href$='.org']`, 'hover'],
        important: false,
      },
    ],
  )
})

test('arbitrary properties', () => {
  assert.deepEqual(parse('![mask-type:luminance] hover:[mask-type:alpha]'), [
    { name: '[mask-type:luminance]', variants: [], important: true },
    {
      name: '[mask-type:alpha]',
      variants: ['hover'],
      important: false,
    },
  ])
})

test('pseudo element selector', () => {
  assert.deepEqual(parse('after::underline'), [
    {
      name: 'underline',
      variants: ['after:'],
      important: false,
    },
  ])
})
