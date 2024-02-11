/**
 * @module @twind/preset-tailwind/variants
 */

import {
  type AutocompleteProvider,
  type VariantResolver,
  type Variant,
  type AutocompleteItem,
  arbitrary,
} from '@twind/core'
import type { TailwindTheme } from './types'

import { DEV } from 'distilt/env'

import { normalize, withAutocomplete } from '@twind/core'

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
  ['(portrait|landscape)', ({ 1: $1 }) => `@media (orientation:${$1})`],
  ['contrast-(more|less)', ({ 1: $1 }) => `@media (prefers-contrast:${$1})`],

  ['(first-(letter|line)|placeholder|backdrop|before|after)', ({ 1: $1 }) => `&::${$1}`],
  ['(marker|selection)', ({ 1: $1 }) => `& *::${$1},&::${$1}`],
  ['file', '&::file-selector-button'],

  ['(first|last|only)', ({ 1: $1 }) => `&:${$1}-child`],
  ['even', '&:nth-child(2n)'],
  ['odd', '&:nth-child(odd)'],

  ['open', '&[open]'],

  // All other pseudo classes are already supported by twind

  [
    '(aria|data)-',
    withAutocomplete$(
      ({ 1: $1 /* aria or data */, $$ /* everything after the dash */ }, context) =>
        $$ &&
        `&[${$1}-${
          // aria-asc or data-checked -> from theme
          context.theme($1, $$) ||
          // aria-[...] or data-[...]
          arbitrary($$, '', context) ||
          // default handling
          `${$$}="true"`
        }]`,
      DEV &&
        (({ 1: $1 }, { theme }) =>
          [
            ...new Set([
              ...($1 == 'aria'
                ? [
                    'checked',
                    'disabled',
                    'expanded',
                    'hidden',
                    'pressed',
                    'readonly',
                    'required',
                    'selected',
                  ]
                : []),
              ...Object.keys(theme($1 as 'aria' | 'data') || {}),
            ]),
          ]
            .map(
              (key): AutocompleteItem => ({
                suffix: key,
                label: `&[${$1}-${theme($1, key) || `${key}="true"`}]`,
                theme: { section: $1, key },
              }),
            )
            .concat([{ suffix: '[', label: `&[${$1}-…]` }])),
    ),
  ],

  /* Styling based on parent and peer state */
  // Groups classes like: group-focus and group-hover
  // these need to add a marker selector with the pseudo class
  // => '.group:focus .group-focus:selector'
  [
    '((group|peer)(~[^-[]+)?)(-\\[(.+)]|[-[].+?)(\\/.+)?',
    withAutocomplete$(
      ({ 2: type, 3: name = '', 4: $4, 5: $5 = '', 6: label = name }, { e, h, v }) => {
        const selector = normalize($5) || ($4[0] == '[' ? $4 : (v($4.slice(1)) as string))

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return `${(selector.includes('&') ? selector : '&' + selector).replace(
          /&/g,
          `:merge(.${e(h(type + label))})`,
        )}${type[0] == 'p' ? '~' : ' '}&`
      },
      DEV &&
        ((_, { variants }) =>
          Object.entries(variants)
            .filter(([, selector]) => /^&(\[|:[^:])/.test(selector))
            .flatMap(([variant, selector]): AutocompleteItem[] => [
              {
                prefix: 'group-',
                suffix: variant,
                label: `${selector.replace('&', '.group')} &`,
                modifiers: [],
              },
              {
                prefix: 'peer-',
                suffix: variant,
                label: `${selector.replace('&', '.peer')} &`,
                modifiers: [],
              },
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

  [
    'supports-',
    withAutocomplete$(
      ({ $$ /* everything after the dash */ }, context) => {
        $$ &&= (context.theme('supports', $$) || arbitrary($$, '', context)) as string

        if ($$) {
          if (!$$.includes(':')) {
            $$ += ':var(--tw)'
          }

          if (!/^\w*\s*\(/.test($$)) {
            $$ = `(${$$})`
          }

          // Chrome has a bug where `(condtion1)or(condition2)` is not valid
          // But `(condition1) or (condition2)` is supported.
          return `@supports ${$$.replace(/\b(and|or|not)\b/g, ' $1 ').trim()}`
        }
      },
      DEV &&
        ((_, { theme }) =>
          Object.keys(theme('supports') || {})
            .map(
              (key): AutocompleteItem => ({
                suffix: key,
                theme: { section: 'supports', key },
              }),
            )
            .concat([{ suffix: '[', label: `@supports …` }])),
    ),
  ],

  [
    'max-',
    withAutocomplete$(
      ({ $$ }, context) => {
        $$ &&= (context.theme('screens', $$) || arbitrary($$, '', context)) as string
        if (typeof $$ == 'string') {
          return `@media not all and (min-width:${$$})`
        }
      },
      DEV &&
        ((_, { theme }) =>
          Object.entries(theme('screens') || {})
            .filter(([, value]) => typeof value == 'string')
            .map(
              ([key, value]): AutocompleteItem => ({
                suffix: key,
                label: `@media not all and (min-width:${value})`,
                theme: { section: 'screens', key },
              }),
            )
            .concat([{ suffix: '[', label: `@media not all and (min-width: …)` }])),
    ),
  ],

  [
    'min-',
    withAutocomplete$(({ $$ }, context) => {
      $$ &&= arbitrary($$, '', context) as string
      return $$ && `@media (min-width:${$$})`
    }, DEV && (() => [{ suffix: '[', label: `@media (min-width: …)` }])),
  ],

  // Arbitrary variants
  [/^\[(.+)]$/, ({ 1: $1 }) => /[&@]/.test($1) && normalize($1).replace(/[}]+$/, '').split('{')],
]

export default variants
