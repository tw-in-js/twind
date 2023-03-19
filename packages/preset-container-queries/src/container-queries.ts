import { DEV } from 'distilt/env'
import {
  arbitrary,
  type AutocompleteProvider,
  type BaseTheme,
  parseValue,
  type Preset,
  type RuleResolver,
  type VariantResolver,
  withAutocomplete,
} from '@twind/core'

export interface ContainerQueriesTheme extends BaseTheme {
  containers: Record<string, string>
}

// indirection wrapper to remove autocomplete functions from production bundles
function withAutocomplete$<
  Resolver extends RuleResolver<ContainerQueriesTheme> | VariantResolver<ContainerQueriesTheme>,
>(resolver: Resolver, autocomplete: AutocompleteProvider<ContainerQueriesTheme> | false): Resolver {
  if (DEV) {
    return withAutocomplete(
      resolver as RuleResolver<ContainerQueriesTheme>,
      autocomplete,
    ) as Resolver
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
        withAutocomplete$(
          ({ 1: $1, $$ }, context) => {
            // eslint-disable-next-line no-sparse-arrays
            const [value = '', name] = $1 == '/' ? [, $$] : parseValue($$)

            const type = arbitrary(value, '', context) || value || 'inline-size'

            return name ? { container: `${name} / ${type}` } : { 'container-type': type }
          },
          DEV &&
            ((match) =>
              match[1] // we get called 3 times ('', '-', '/') - only answer once
                ? []
                : [
                    { prefix: '@container', suffix: '', modifiers: [] },
                    { prefix: '@container', suffix: '-normal', modifiers: [] },
                    { prefix: '@container', suffix: '-size', modifiers: [] },
                    { prefix: '@container', suffix: '-[', modifiers: [] },
                  ]),
        ),
      ],
    ],
    variants: [
      [
        '@(.+)',
        withAutocomplete$(
          (match, context) => {
            const [value, name] = parseValue(match[1])

            if (value) {
              const minWidth =
                context.theme('containers', value) || arbitrary(value, 'containers', context)

              return minWidth && `@container ${name ? name + ' ' : ''}(min-width:${minWidth})`
            }
          },
          DEV &&
            ((match, context) => [
              ...Object.entries(context.theme('containers')).map(([suffix, minWidth]) => ({
                prefix: '@',
                suffix,
                label: `@container (min-width: ${minWidth})`,
                theme: { section: 'containers', key: suffix },
                modifiers: [],
              })),
              { prefix: '@', suffix: '[', modifiers: [] },
            ]),
        ),
      ],
    ],
  }
}
