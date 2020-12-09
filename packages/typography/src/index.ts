import type { CSSRules, Plugin, ThemeSection } from '@tw-in-js/types'

export interface Options {
  className?: string
}

declare module '@tw-in-js/types' {
  interface Theme {
    typography?: ThemeSection<{ css?: CSSRules }>
  }
}

import { styles } from './styles'

const typography = ({ className = 'prose' }: Options = {}): Record<string, Plugin> => ({
  lead: (_, { tag }) => tag('lead'),

  [className]: (parameters, context) => {
    const color = context.theme('colors', [parameters[0], '600'], '')

    if (color) {
      return {
        '& a': { color },
        '& a code': { color },
      }
    }

    const config = styles(context)

    const { css } = config[parameters[0] || 'DEFAULT'] || {}

    if (css) {
      // TODO merge with styles from theme.typography
      const rules: CSSRules = {}

      css.forEach((css) =>
        Object.keys(css).forEach((property) => {
          const value = css[property]

          const key =
            value != null && typeof value === 'object' && !Array.isArray(value)
              ? `& ${property}`
              : property

          rules[key] = value
        }),
      )

      return rules
    }
  },
})

export default typography
