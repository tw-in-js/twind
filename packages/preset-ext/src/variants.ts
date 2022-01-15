import type { Variant } from '@twind/core'

const variants: Variant[] = [
  ['hocus', '&:hover,&:focus-visible'],
  [
    '((group|peer)(-[^-]+)?)-hocus',
    ({ 1: $1, 2: $2 }, { e, h }) =>
      `.${e(h($1))}:is(:hover,:focus-visible)${$2[0] == 'p' ? '~' : ' '}&`,
  ],

  // - `dir-rtl` -> `:dir(rtl)`
  // - `lang-en` -> `:lang(en)`
  ['(dir|lang)-', ({ 1: $1, $$ }) => `&:${$1}(${$$})`],

  // - `not-hover` -> `:not(:hover)`
  // - `not-[lang]` -> `:not([lang])`
  ['not-([a-z-]+|\\[.+\\])', ({ 1: $1 }) => `&:not(${($1[0] == '[' ? '' : ':') + $1})`],

  // Selectors
  // - `children:underline` -> `children:underline > *`
  ['children', '&>*'],
  ['siblings', '&~*'],
  ['sibling', '&+*'],
  ['override', '&&'],

  // - `&~span:underline` -> `&~span:underline ~ span`
  // - `&+span:underline`
  // - `&>span:underline`
  // - `&>*:underline`
  ['&[&~+>*a-z]+', (match) => match.input],

  // Attribute selector
  // `[lang]:underline` -> `[lang]:underline[lang]`
  ['\\[.+]', (match) => '&' + match.input],

  // Pseudo Elements using double colon (`first-letter::underline`) as well
  ['([a-z-]+):', ({ 1: $1 }) => '&::' + $1],
]

export default variants
