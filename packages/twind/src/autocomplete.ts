import type {
  BaseTheme,
  CSSProperties,
  MatchResult,
  Rule,
  RuleResolver,
  ThemeFunction,
  VariantResolver,
} from './types'
import { DEV } from 'distilt/env'
import { fromMatch } from './rules'
import { asArray } from './utils'

export type AutocompleteItem = {
  prefix?: string
  suffix: string
  theme?: { section: string; key: string }
  modifiers?: AutocompleteModifier[] | false | null | undefined
  color?: string | false | null | undefined
  label?: string
}

export type AutocompleteModifier = {
  modifier: string
  theme?: { section: string; key: string }
  color?: string | false | null | undefined
  label?: string
}

export interface AutocompleteContext<Theme extends BaseTheme = BaseTheme> {
  /** Allows to resolve theme values. */
  readonly theme: ThemeFunction<Theme>
  readonly variants: Record<string, string>
}

export type AutocompleteProvider<Theme extends BaseTheme = BaseTheme> = (
  match: MatchResult,
  context: AutocompleteContext<Theme>,
) => (string | AutocompleteItem)[]

const kAutocomplete = /* #__PURE__ */ Symbol('@twind/autocomplete')

/**
 * @experimental
 * @group Configuration
 * @param resolver
 * @param autocomplete
 */
export function withAutocomplete<Theme extends BaseTheme = BaseTheme>(
  resolver: RuleResolver<Theme>,
  autocomplete: AutocompleteProvider<Theme> | false | null | undefined,
): RuleResolver<Theme>

export function withAutocomplete<Theme extends BaseTheme = BaseTheme>(
  resolver: VariantResolver<Theme>,
  autocomplete: AutocompleteProvider<Theme> | false | null | undefined,
): VariantResolver<Theme>

export function withAutocomplete<Theme extends BaseTheme = BaseTheme>(
  rule: Rule<Theme>,
  autocomplete: AutocompleteProvider<Theme> | false | null | undefined,
): Rule<Theme>

export function withAutocomplete<Theme extends BaseTheme = BaseTheme>(
  rule: Rule<Theme> | RuleResolver<Theme> | VariantResolver<Theme>,
  autocomplete: AutocompleteProvider<Theme> | false | null | undefined,
): Rule<Theme> | RuleResolver<Theme> | VariantResolver<Theme> {
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
      Object.defineProperty(fromMatch(resolve as keyof CSSProperties, convert), kAutocomplete, {
        value: autocomplete,
        configurable: true,
      }),
    ]
  }

  return rule
}

/**
 * @internal
 * @param resolver
 * @returns
 */
export function getAutocompleteProvider<Theme extends BaseTheme = BaseTheme>(
  resolver: RuleResolver<Theme> | VariantResolver<Theme>,
): AutocompleteProvider<Theme> | undefined {
  return (resolver as { [kAutocomplete]?: AutocompleteProvider<Theme> })[kAutocomplete]
}
