import type { Context, CSSRules, Rule, DarkMode } from '../types'

import { tail, escape } from './util'

// Wraps a CSS rule object with variant at-rules and pseudo classes
// { '.selector': {...} }
// => { '&:hover': { '.selector': {...} } }
// => { '@media (mind-width: ...)': { '&:hover': { '.selector': {...} } } }
export const decorate = (
  darkMode: DarkMode,
  variants: Record<string, string>,
  { theme, tag }: Context,
): ((translation: CSSRules, rule: Rule) => CSSRules) => {
  // Select the wrapper for a variant
  const applyVariant = (translation: CSSRules, variant: string): CSSRules => {
    // Check responsive
    const size = theme('screens', tail(variant), '')

    if (size) {
      return { [`@media (min-width: ${size})`]: translation }
    }

    // Dark mode
    if (variant === ':dark' && darkMode === 'class') {
      return { [`.dark &`]: translation }
    }

    // Groups classes like: group-focus and group-hover
    // these need to add a marker selector with the pseudo class
    // => '.group:focus .group-focus:selector'
    if (variant.slice(1, 7) === 'group-') {
      return { [`.${escape(tag('group'))}:${tail(variant, 7)} &`]: translation }
    }

    // Check other well known variants
    // and fallback to pseudo class
    return { [variants[variant] || '&' + variant]: translation }
  }

  // Apply variants depth-first
  return (translation, rule) => rule.v.reduceRight(applyVariant, translation)
}
