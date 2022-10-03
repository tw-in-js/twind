import type { Variant } from 'twind'
import type { TailwindTheme } from './types'

const variants: Variant<TailwindTheme>[] = [
  ['sticky', '@supports ((position: -webkit-sticky) or (position:sticky))'],
  ['motion-reduce', '@media (prefers-reduced-motion:reduce)'],
  ['motion-safe', '@media (prefers-reduced-motion:no-preference)'],
  ['print', '@media print'],
  ['portrait', '@media (orientation:portrait)'],
  ['landscape', '@media (orientation:landscape)'],
  ['contrast-more', '@media (prefers-contrast:more)'],
  ['contrast-less', '@media (prefers-contrast:less)'],

  ['first-letter', '&::first-letter'],
  ['first-line', '&::first-line'],

  ['marker', '& *::marker,&::marker'],
  ['selection', '& *::selection,&::selection'],
  ['file', '&::file-selector-button'],
  ['placeholder', '&::placeholder'],

  ['first', '&:first-child'],
  ['last', '&:last-child'],
  ['even', '&:nth-child(2n)'],
  ['odd', '&:nth-child(odd)'],

  ['open', '[open]'],

  // All other pseudo classes are already supported by twind

  /* Styling based on parent and peer state */
  // Groups classes like: group-focus and group-hover
  // these need to add a marker selector with the pseudo class
  // => '.group:focus .group-focus:selector'
  [
    '((group|peer)(~[^-[]+)?)(-[a-z-]+|\\[.+])',
    ({ 1: $1, 4: $4 }, { e, h }) =>
      `:merge(.${e(h($1))})${$4[0] == '[' ? $4 : ':' + $4.slice(1)}${$1[0] == 'p' ? '~' : ' '}&`,
  ],

  // direction variants
  ['(ltr|rtl)', ({ 1: $1 }) => `[dir="${$1}"] &`],
]

export default variants
