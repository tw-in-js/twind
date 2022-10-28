import { DEV } from 'distilt/env'
import {
  AutocompleteProvider,
  BaseTheme,
  CSSObject,
  Preset,
  RuleResolver,
  withAutocomplete,
} from 'twind'

import { fromTheme } from 'twind'

export interface LineClampTheme extends BaseTheme {
  lineClamp: Record<string, string>
}

// indirection wrapper to remove autocomplete functions from production bundles
function withAutocomplete$(
  resolver: RuleResolver<LineClampTheme>,
  autocomplete: AutocompleteProvider<LineClampTheme> | false,
): RuleResolver<LineClampTheme> {
  if (DEV) {
    return withAutocomplete(resolver, autocomplete)
  }

  return resolver
}

export default function presetLineClamp(): Preset<LineClampTheme> {
  return {
    rules: [
      ['line-clamp-none', { '-webkit-line-clamp': 'unset' }],
      ['line-clamp-', fromTheme('lineClamp', ({ _ }) => lineClamp(_))],
      [
        'line-clamp-(\\d+)',
        withAutocomplete$(
          ({ 1: _ }) => lineClamp(_),
          DEV && (() => ['1', '2', '3', '4', '5', '6']),
        ),
      ],
    ],
  }
}

function lineClamp(lines: string | number): CSSObject {
  return {
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': `${lines}`,
  }
}
