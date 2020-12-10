import type { Context, CSSRules, Rule, DarkMode } from '../types'

import { tail, escape } from '../internal/util'
import { variants } from '../tailwind/variants'

export const decorate = (
  darkMode: DarkMode,
  { theme, tag }: Context,
): ((translation: CSSRules, rule: Rule) => CSSRules) => {
  const applyVariant = (translation: CSSRules, variant: string): CSSRules => {
    const size = theme('screens', tail(variant), '')

    if (size) {
      return { [`@media (min-width: ${size})`]: translation }
    }

    if (variant === ':dark' && darkMode === 'class') {
      return { [`.dark &`]: translation }
    }

    if (variant.slice(1, 7) === 'group-') {
      return { [`.${escape(tag('group'))}:${tail(variant, 7)} &`]: translation }
    }

    return { [variants[variant] || '&' + variant]: translation }
  }

  return (translation, rule) => rule.variants.reduceRight(applyVariant, translation)
}
