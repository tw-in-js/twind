import type { Variant } from 'twind'
import type { TailwindTheme } from './types'

import { normalize } from 'twind'

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
    '((group|peer)(~[^-[]+)?)(-[a-z-]+|\\[.+])',
    ({ 1: $1, 4: $4 }, { e, h, v }) =>
      `:merge(.${e(h($1))})${$4[0] == '[' ? $4 : (v($4.slice(1)) as string).replace('&', '')}${
        $1[0] == 'p' ? '~' : ' '
      }&`,
  ],

  // direction variants
  ['(ltr|rtl)', ({ 1: $1 }) => `[dir="${$1}"] &`],

  // Arbitrary variants
  [/^\[(.+)]$/, ({ 1: $1 }) => /[&@]/.test($1) && normalize($1).replace(/[}]+$/, '').split('{')],
]

export default variants
