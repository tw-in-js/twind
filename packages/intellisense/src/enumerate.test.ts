import { test, expect } from 'vitest'

import presetTailwind from '@twind/preset-tailwind'

import { createIntellisense } from '.'

test('enumerate', () => {
  const intellisense = createIntellisense({
    presets: [presetTailwind()],
    theme: {
      data: {
        checked: 'ui~="checked"',
      },
      supports: {
        grid: 'display: grid',
      },
      extend: {
        aria: {
          asc: 'sort="ascending"',
          desc: 'sort="descending"',
        },
      },
    },
  })

  expect(Array.from(intellisense.enumerate(), ({ name }) => name)).toMatchSnapshot()
})
