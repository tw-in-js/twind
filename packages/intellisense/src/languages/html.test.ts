import { test, expect } from 'vitest'
import { extractBoundary } from './html'

test.each([
  [
    `<div class="dark:und  text-sm">`,
    20,
    {
      content: 'dark:und',
      end: 20,
      start: 12,
    },
  ],
  [
    `<div class=text-2>`,
    17,
    {
      content: 'text-2',
      end: 17,
      start: 11,
    },
  ],
  [
    `<div class="sm:(text-md font-)">`,
    29,
    {
      content: 'sm:(text-md font-',
      end: 29,
      start: 12,
    },
  ],
  [
    `<div class="font-(bold )">`,
    23,
    {
      content: 'font-(bold ',
      end: 23,
      start: 12,
    },
  ],
  [
    `<div class='object-(center )'>`,
    28,
    {
      content: 'object-(center )',
      end: 28,
      start: 12,
    },
  ],
  // not within a class attribute
  [`<button class="text-bold" name="submit">`, 36, null],

  // svelte class toggle
  [
    `<button class:text-={active}>`,
    19,
    {
      content: 'text-',
      end: 19,
      start: 14,
    },
  ],
])('extractBoundary(%j, %i) -> %j', (content, position, expected) => {
  expect(extractBoundary(content, position)).toEqual(expected)
})
