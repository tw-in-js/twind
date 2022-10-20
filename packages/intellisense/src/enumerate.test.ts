import { test, expect } from 'vitest'

import presetTailwind from '@twind/preset-tailwind'

import { createIntellisense } from '.'

test('enumerate', () => {
  const intellisense = createIntellisense({
    presets: [presetTailwind()],
  })

  expect(Array.from(intellisense.enumerate(), ({ name }) => name)).toMatchSnapshot()
})
