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
import { fromMatch } from '../rules'

type ResolveFunction<Theme extends BaseTheme = BaseTheme> = (
  className: string,
  context: Context<Theme>,
  isDark?: boolean,
) => RuleResult

type VariantFunction<Theme extends BaseTheme = BaseTheme> = (
  variant: string,
  context: Context<Theme>,
) => VariantResult

export function createContext<Theme extends BaseTheme = BaseTheme>({
  theme,
  darkMode,
  darkColor,
  variants,
  rules,
  hash,
  stringify,
  ignorelist,
}: TwindConfig<Theme>): Context<Theme> {
  // Used to cache resolved rule values
  const variantCache = new Map<string, MaybeArray<string>>()

  // lazy created resolve functions
  const variantResolvers = new Map<Variant<Theme>, VariantFunction<Theme>>()

  // Used to cache resolved rule values
  const ruleCache = new Map<string, RuleResult>()

  // lazy created resolve functions
  const ruleResolvers = new Map<Rule<Theme>, ResolveFunction<Theme>>()

  const ignored = createRegExpExecutor(ignorelist, (value, condition) => condition.test(value))

  // add dark as last variant to allow user to override it
  // we can modify variants as it has been passed through defineConfig which already made a copy
  variants.push([
    'dark',
    Array.isArray(darkMode) || darkMode == 'class'
      ? `${asArray(darkMode)[1] || '.dark'} &`
      : typeof darkMode == 'string' && darkMode != 'media'
      ? darkMode // a custom selector
      : '@media (prefers-color-scheme:dark)',
  ])

  const h =
    typeof hash == 'function'
      ? (value: string) => hash(value, defaultHash)
      : hash
      ? defaultHash
      : identity

  return {
    theme: makeThemeFunction(theme),

    e: escape,

    h,

    s(property, value) {
      // Hash/Tag tailwind custom properties during serialization
      return stringify(hashVars(property, h), hashVars(value, h), this)
    },

    d(section, key, color) {
      return darkColor?.(section, key, this, color)
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

    r(className, isDark) {
      const key = JSON.stringify([className, isDark])
      if (!ruleCache.has(key)) {
        ruleCache.set(
          key,
          // TODO console.warn(`[twind] unknown rule "${value}"`),
          !ignored(className, this) &&
            find(className, rules, ruleResolvers, getRuleResolver, this, isDark),
        )
      }

      return ruleCache.get(key)
    },
  }
}

function find<Value, Config, Result, Theme extends BaseTheme = BaseTheme>(
  value: Value,
  list: Config[],
  cache: Map<Config, (value: Value, context: Context<Theme>, isDark?: boolean) => Result>,
  getResolver: (
    item: Config,
  ) => (value: Value, context: Context<Theme>, isDark?: boolean) => Result,
  context: Context<Theme>,
  isDark?: boolean,
) {
  for (const item of list) {
    let resolver = cache.get(item)

    if (!resolver) {
      cache.set(item, (resolver = getResolver(item)))
    }

    const resolved = resolver(value, context, isDark)

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
    typeof resolve == 'function' ? resolve : fromMatch(resolve as keyof CSSProperties, convert),
  )
}

export function maybeNegate<T>($_: string, value: T): T | string {
  return $_[0] == '-' ? `calc(${value} * -1)` : value
}

function createResolve<Result, Theme extends BaseTheme = BaseTheme>(
  patterns: MaybeArray<string | RegExp>,
  resolve: (match: MatchResult, context: Context<Theme>) => Result,
): (value: string, context: Context<Theme>, isDark?: boolean) => Result | undefined {
  return createRegExpExecutor(patterns, (value, condition, context, isDark?: boolean) => {
    const match = condition.exec(value) as MatchResult | Falsey

    if (match) {
      // MATCH.$_ = value
      match.$$ = value.slice(match[0].length)
      match.dark = isDark

      return resolve(match, context)
    }
  })
}

function createRegExpExecutor<Result, Theme extends BaseTheme = any>(
  patterns: MaybeArray<string | RegExp>,
  run: (value: string, condition: RegExp, context: Context<Theme>, isDark?: boolean) => Result,
): (value: string, context: Context<Theme>, isDark?: boolean) => Result | undefined {
  const conditions = asArray(patterns).map(toCondition)

  return (value, context, isDark) => {
    for (const condition of conditions) {
      const result = run(value, condition, context, isDark)

      if (result) return result
    }
  }
}

function toCondition(value: string | RegExp): RegExp {
  // "visible" -> /^visible$/
  // "(float)-(left|right|none)" -> /^(float)-(left|right|none)$/
  // "auto-rows-" -> /^auto-rows-/
  // "gap(-|$)" -> /^gap(-|$)/
  return typeof value == 'string'
    ? new RegExp('^' + value + (value.includes('$') || value.slice(-1) == '-' ? '' : '$'))
    : value
}

function hashVars(value: string, h: Context['h']): string {
  // PERF: check for --tw before running the regexp
  // if (value.includes('--tw')) {
  return value.replace(
    /--(tw(?:-[\w-]+)?)\b/g,
    (_: string, property: string) => '--' + h(property).replace('#', ''),
  )
  // }

  // return value
}
