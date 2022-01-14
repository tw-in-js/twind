import { escape, Preset } from '@twind/core'
import { preset } from '@twind/core'

export default function presetMini(): Preset {
  return preset({
    rules: [
      // short css feature that allows any css properties to be added
      // `background-color[#1da1f1]` -> `{ background-color: #1da1f1 }`
      // TODO arbitrary values
      // TODO $ prefix for variables
      /^([-\w]+)\[(.+)]$/,
    ],
    variants: [
      ['hocus', '&:hover,&:focus-visible'],
      [
        '((group|peer)(-[^-]+)?)-hocus',
        ({ $1, $2 }, { tag }) =>
          `.${escape(tag($1))}:is(:hover,:focus-visible)${$2[0] == 'p' ? '~' : ' '}&`,
      ],

      // - `dir-rtl` -> `:dir(rtl)`
      // - `lang-en` -> `:lang(en)`
      ['(dir|lang)-', ({ $1, $$ }) => `&:${$1}(${$$})`],

      // - `not-hover` -> `:not(:hover)`
      // - `not-[lang]` -> `:not([lang])`
      ['not-([a-z-]+|\\[.+\\])', ({ $1 }) => `&:not(${($1[0] == '[' ? '' : ':') + $1})`],

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
      ['&[&~+>*a-z]+', ({ $_ }) => $_],

      // Attribute selector
      // `[lang]:underline` -> `[lang]:underline[lang]`
      ['\\[.+]', ({ $_ }) => '&' + $_],

      // Pseudo Elements using double colon (`first-letter::underline`) as well
      ['([a-z-]+):', ({ $1 }) => '&::' + $1],
    ],
  })
}
