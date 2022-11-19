import { DEV } from 'distilt/env'
import {
  arbitrary,
  AutocompleteProvider,
  BaseTheme,
  parseValue,
  Preset,
  RuleResolver,
  withAutocomplete,
} from '@twind/core'

export interface ContainerQueriesTheme extends BaseTheme {
  containers: Record<string, string>
}

// indirection wrapper to remove autocomplete functions from production bundles
function withAutocomplete$(
  resolver: RuleResolver<ContainerQueriesTheme>,
  autocomplete: AutocompleteProvider<ContainerQueriesTheme> | false,
): RuleResolver<ContainerQueriesTheme> {
  if (DEV) {
    return withAutocomplete(resolver, autocomplete)
  }

  return resolver
}

export default function presetContainerQueries(): Preset<ContainerQueriesTheme> {
  return {
    theme: {
      containers: {
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
      },
    },
    rules: [
      [
        '@container($|-|\\/)',
        ({ 1: $1, $$ }, context) => {
          // eslint-disable-next-line no-sparse-arrays
          const [type = '', name] = $1 == '/' ? [, $$] : parseValue($$)

          return {
            'container-type': arbitrary(type, '', context) || type || 'inline-size',
            'container-name': name,
          }
        },
      ],
    ],
    variants: [
      [
        '@(.+)',
        (match, context) => {
          const [value, name] = parseValue(match[1])

          if (value) {
            const minWidth =
              arbitrary(value, 'containers', context) || context.theme('containers', value)

            return minWidth && `@container ${name ? name + ' ' : ''}(min-width:${minWidth})`
          }
        },
      ],
    ],
  }
}
