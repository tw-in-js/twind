/**
 * @module @twind/preset-tailwind/variants
 */

import type { AutocompleteProvider, VariantResolver, Variant, AutocompleteItem } from 'twind'
import type { TailwindTheme } from './types'

import { DEV } from 'distilt/env'

import { normalize, withAutocomplete } from 'twind'

// indirection wrapper to remove autocomplete functions from production bundles
function withAutocomplete$(
  rule: VariantResolver<TailwindTheme>,
  autocomplete: AutocompleteProvider<TailwindTheme> | false,
): VariantResolver<TailwindTheme> {
  if (DEV) {
    return withAutocomplete(rule, autocomplete)
  }

  return rule
}

const variants: Variant<TailwindTheme>[] = [
  ['sticky', '@supports ((position: -webkit-sticky) or (position:sticky))'],
  ['motion-reduce', '@media (prefers-reduced-motion:reduce)'],
  ['motion-safe', '@media (prefers-reduced-motion:no-preference)'],
  ['print', '@media print'],
  ['portrait', '@media (orientation:portrait)'],
  ['landscape', '@media (orientation:landscape)'],
  ['contrast-more', '@media (prefers-contrast:more)'],
  ['contrast-less', '@media (prefers-contrast:less)'],

  ['marker', '& *::marker,&::marker'],
  ['selection', '& *::selection,&::selection'],

  // TODO: use pseudoElement helper?
  ['first-letter', '&::first-letter'],
  ['first-line', '&::first-line'],
  ['file', '&::file-selector-button'],
  ['placeholder', '&::placeholder'],
  ['backdrop', '&::backdrop'],

  ['first', '&:first-child'],
  ['last', '&:last-child'],
  ['even', '&:nth-child(2n)'],
  ['odd', '&:nth-child(odd)'],

  ['open', '&[open]'],

  // All other pseudo classes are already supported by twind

  /* Styling based on parent and peer state */
  // Groups classes like: group-focus and group-hover
  // these need to add a marker selector with the pseudo class
  // => '.group:focus .group-focus:selector'
  [
    '((group|peer)(~[^-[]+)?)(-[a-z-]+|-\\[(.+)]|\\[.+])',
    withAutocomplete$(
      ({ 1: $1, 4: $4, 5: $5 }, { e, h, v }) => {
        const selector = ($5 && normalize($5)) || ($4[0] == '[' ? $4 : (v($4.slice(1)) as string))

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return `${(selector.includes('&') ? selector : '&' + selector).replace(
          /&/g,
          `:merge(.${e(h($1))})`,
        )}${$1[0] == 'p' ? '~' : ' '}&`
      },
      DEV &&
        ((_, { variants }) =>
          [...Object.entries(variants)]
            .filter(([, selector]) => /^&(\[|:[^:])/.test(selector))
            .flatMap(([variant, selector]): AutocompleteItem[] => [
              { prefix: 'group-', suffix: variant, label: `${selector.replace('&', '.group')} &` },
              { prefix: 'peer-', suffix: variant, label: `${selector.replace('&', '.peer')} &` },
            ])),
    ),
  ],

  // direction variants
  [
    '(ltr|rtl)',
    withAutocomplete$(
      ({ 1: $1 }) => `[dir="${$1}"] &`,
      DEV && (({ 1: $1 }) => [{ prefix: $1, suffix: '', label: `[dir="${$1}"] &` }]),
    ),
  ],

  // Arbitrary variants
  [/^\[(.+)]$/, ({ 1: $1 }) => /[&@]/.test($1) && normalize($1).replace(/[}]+$/, '').split('{')],
]

export default variants
