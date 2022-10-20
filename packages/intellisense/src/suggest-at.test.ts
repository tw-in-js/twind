import { test, expect, beforeAll } from 'vitest'

import presetTailwind, { TailwindTheme } from '@twind/preset-tailwind'

import { Intellisense, createIntellisense, SuggestionAt } from '.'

let intellisense: Intellisense<TailwindTheme>

beforeAll(() => {
  intellisense = createIntellisense({
    presets: [presetTailwind()],
  })
})

test('suggestAt html', async () => {
  const $ = (suggestionAt: Promise<SuggestionAt | null>) =>
    suggestionAt.then(
      (result) =>
        result && { ...result, suggestions: result.suggestions.map(({ value }) => value) },
    )

  await expect(
    $(intellisense.suggestAt(`<div class="dark:und  text-sm">`, 20, 'html')),
  ).resolves.toMatchSnapshot()

  await expect(
    $(intellisense.suggestAt(`<div class=text-2>`, 17, 'html')),
  ).resolves.toMatchSnapshot()

  await expect(
    $(intellisense.suggestAt(`<div class='sm:(text-md font-)'>`, 29, 'html')),
  ).resolves.toMatchSnapshot()

  await expect(
    $(intellisense.suggestAt(`<div class="font-(bold )">`, 23, 'html')),
  ).resolves.toMatchSnapshot()

  await expect(
    $(intellisense.suggestAt(`<div class='object-(center )'>`, 28, 'html')),
  ).resolves.toMatchSnapshot()
})
