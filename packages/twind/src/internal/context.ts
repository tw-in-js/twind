import type {
  BaseTheme,
  Context,
  RuleResult,
  TwindConfig,
  CSSProperties,
  MatchResult,
  MaybeArray,
  RuleResolver,
  MatchConverter,
  Rule,
  CSSObject,
  Variant,
  VariantResult,
  VariantResolver,
  Falsey,
} from '../types'

import { makeThemeFunction } from './theme'
import { asArray, escape, hash as defaultHash, identity } from '../utils'

type ResolveFunction<Theme extends BaseTheme = BaseTheme> = (
  className: string,
  context: Context<Theme>,
) => RuleResult

type VariantFunction<Theme extends BaseTheme = BaseTheme> = (
  variant: string,
  context: Context<Theme>,
) => VariantResult

export function createContext<Theme extends BaseTheme = BaseTheme>({
  theme,
  darkMode,
  variants,
  rules,
  hash,
  stringify,
  ignorelist,
}: TwindConfig<Theme>): Context<Theme> {
  // Used to cache resolved rule values
  const variantCache = new Map<string, string>()

  // lazy created resolve functions
  const variantResolvers = new Map<Variant<Theme>, VariantFunction<Theme>>()

  // Used to cache resolved rule values
  const ruleCache = new Map<string, RuleResult>()

  // lazy created resolve functions
  const ruleResolvers = new Map<Rule<Theme>, ResolveFunction<Theme>>()

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const ignored = createRegExpExecutor(ignorelist, (value, condition) => condition.test(value))

  // add dark as last variant to allow user to override it
  // we can modify variants as it has been passed through defineConfig which already made a copy
  variants.push([
    'dark',
    darkMode == 'class'
      ? '.dark &'
      : typeof darkMode === 'string' && darkMode != 'media'
      ? darkMode // a custom selector
      : '@media (prefers-color-scheme:dark)',
  ])

  return {
    theme: makeThemeFunction(theme),

    e: escape,

    h:
      typeof hash == 'function'
        ? (value) => hash(value, defaultHash)
        : hash
        ? defaultHash
        : identity,

    s(property, value) {
      return stringify(property, value, this)
    },

    v(value) {
      if (!variantCache.has(value)) {
        variantCache.set(
          value,
          find(value, variants, variantResolvers, getVariantResolver, this) || '&:' + value,
        )
      }

      return variantCache.get(value) as string
    },

    r(value) {
      if (!ruleCache.has(value)) {
        ruleCache.set(
          value,
          // TODO console.warn(`[twind] unknown rule "${value}"`),
          !ignored(value, this) && find(value, rules, ruleResolvers, getRuleResolver, this),
        )
      }

      return ruleCache.get(value)
    },
  }
}

function find<Value, Config, Result, Theme extends BaseTheme = BaseTheme>(
  value: Value,
  list: Config[],
  cache: Map<Config, (value: Value, context: Context<Theme>) => Result>,
  getResolver: (item: Config) => (value: Value, context: Context<Theme>) => Result,
  context: Context<Theme>,
) {
  for (const item of list) {
    let resolver = cache.get(item)

    if (!resolver) {
      cache.set(item, (resolver = getResolver(item)))
    }

    const resolved = resolver(value, context)

    if (resolved) return resolved
  }
}

function getVariantResolver<Theme extends BaseTheme = BaseTheme>(
  variant: Variant<Theme>,
): VariantFunction<Theme> {
  return createVariantFunction(variant[0], variant[1])
}

function getRuleResolver<Theme extends BaseTheme = BaseTheme>(
  rule: Rule<Theme>,
): ResolveFunction<Theme> {
  if (Array.isArray(rule)) {
    return createResolveFunction(rule[0], rule[1], rule[2])
  }

  return createResolveFunction(rule)
}

function createVariantFunction<Theme extends BaseTheme = BaseTheme>(
  patterns: MaybeArray<string | RegExp>,

  resolve: string | VariantResolver<Theme>,
): VariantFunction<Theme> {
  return createResolve(patterns, typeof resolve == 'function' ? resolve : () => resolve)
}

function createResolveFunction<Theme extends BaseTheme = BaseTheme>(
  patterns: MaybeArray<string | RegExp>,

  resolve?: keyof CSSProperties | string | CSSObject | RuleResolver<Theme>,

  convert?: MatchConverter<Theme>,
): ResolveFunction<Theme> {
  return createResolve(
    patterns,
    !resolve
      ? (match) =>
          ({
            [match[1]]: maybeNegate(
              match.input,
              match.slice(2).find(Boolean) || match.$$ || match.input,
            ),
          } as CSSObject)
      : typeof resolve == 'function'
      ? resolve
      : typeof resolve == 'string' && /^[\w-]+$/.test(resolve) // a CSS property alias
      ? (match, context) =>
          ({
            [resolve]: convert
              ? convert(match, context)
              : maybeNegate(match.input, match.slice(1).find(Boolean) || match.$$ || match.input),
          } as CSSObject)
      : // CSSObject, shortcut or apply
        () => resolve,
  )
}

function maybeNegate($_: string, value: string): string {
  return $_[0] == '-' ? `calc(${value} * -1)` : value
}

function createResolve<Result, Theme extends BaseTheme = BaseTheme>(
  patterns: MaybeArray<string | RegExp>,
  resolve: (match: MatchResult, context: Context<Theme>) => Result,
): (value: string, context: Context<Theme>) => Result | undefined {
  return createRegExpExecutor(patterns, (value, condition, context) => {
    const match = condition.exec(value) as MatchResult | Falsey

    if (match) {
      // MATCH.$_ = value
      match.$$ = value.slice(match[0].length)

      return resolve(match, context)
    }
  })
}

function createRegExpExecutor<Result, Theme extends BaseTheme = BaseTheme>(
  patterns: MaybeArray<string | RegExp>,
  run: (value: string, condition: RegExp, context: Context<Theme>) => Result,
): (value: string, context: Context<Theme>) => Result | undefined {
  const conditions = asArray(patterns).map(toCondition)

  return (value, context) => {
    for (const condition of conditions) {
      const result = run(value, condition, context)

      if (result) return result
    }
  }
}

/**
 * Executes a search on a string using a regular expression pattern, and returns an array containing the results of that search.
 * @param string The String object or string literal on which to perform the search.
 */
// type Condition = (string: string) => RegExpExecArray | Falsey

function toCondition(value: string | RegExp): RegExp {
  // "visible" -> /^visible$/
  // "(float)-(left|right|none)" -> /^(float)-(left|right|none)$/
  // "auto-rows-" -> /^auto-rows-/
  // "gap(-|$)" -> /^gap(-|$)/

  // PERF: try to detect if we can skip the regex execution
  // if (typeof value == 'string') {
  // const prefix = /^[\w-#~@]+(?!\?)/.exec(value)?.[0]
  // value = new RegExp('^' + value + (value.includes('$') || value.slice(-1) == '-' ? '' : '$'))
  // if (prefix) {
  //   return (string) => string.startsWith(prefix) && (value as RegExp).exec(string)
  // }
  // }
  // return (string) => (value as RegExp).exec(string)

  return typeof value == 'string'
    ? new RegExp('^' + value + (value.includes('$') || value.slice(-1) == '-' ? '' : '$'))
    : value
}
