import type { BaseTheme, Context, CSSProperties, MatchResult, Rule, RuleResolver } from './types'
import { DEV } from 'distilt/env'
import { fromMatch } from './rules'
import { asArray } from './utils'

export type Autocomplete = {
  suffix: string
  extras?: Autocomplete[]
  color?: string | false | null | undefined
}

export type AutocompleteProvider<Theme extends BaseTheme = BaseTheme> = (
  match: MatchResult,
  context: Context<Theme>,
) => (string | Autocomplete)[]

const kAutocomplete = /* #__PURE__ */ Symbol('@twind/autocomplete')

export function withAutocomplete<Theme extends BaseTheme = BaseTheme>(
  resolver: RuleResolver<Theme>,
  autocomplete: AutocompleteProvider<Theme> | false | null | undefined,
): RuleResolver<Theme>

export function withAutocomplete<Theme extends BaseTheme = BaseTheme>(
  rule: Rule<Theme>,
  autocomplete: AutocompleteProvider<Theme> | false | null | undefined,
): Rule<Theme>

export function withAutocomplete<Theme extends BaseTheme = BaseTheme>(
  rule: Rule<Theme> | RuleResolver<Theme>,
  autocomplete: AutocompleteProvider<Theme> | false | null | undefined,
): Rule<Theme> | RuleResolver<Theme> {
  if (DEV && autocomplete) {
    if (typeof rule == 'function') {
      return Object.defineProperty(rule, kAutocomplete, {
        value: autocomplete,
        configurable: true,
      })
    }

    const [pattern, resolve, convert] = asArray(rule) as Exclude<Rule<Theme>, string | RegExp>

    // [
    //   patterns: MaybeArray<string | RegExp>,
    //   resolve?: keyof CSSProperties | string | CSSObject | RuleResolver<Theme>,
    //   convert?: MatchConverter<Theme>,
    // ]

    return [
      pattern,
      Object.defineProperty(
        typeof resolve == 'function' ? resolve : fromMatch(resolve as keyof CSSProperties, convert),
        kAutocomplete,
        {
          value: autocomplete,
          configurable: true,
        },
      ),
    ]
  }

  return rule
}

export function getAutocompleteProvider<Theme extends BaseTheme = BaseTheme>(
  resolver: RuleResolver<Theme>,
): AutocompleteProvider<Theme> | undefined {
  return (resolver as { [kAutocomplete]?: AutocompleteProvider<Theme> })[kAutocomplete]
}
