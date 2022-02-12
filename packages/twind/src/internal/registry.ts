import type { BaseTheme, Context, Falsey, RuleResult, TwindRule } from '../types'
import type { ParsedRule } from './parse'

const registry = new Map<string, RegisterCallback>()

export type RegisterCallback = (rule: ParsedRule, context: Context) => Falsey | TwindRule[]

export function register(className: string, factory: RegisterCallback): string {
  registry.set(className, factory)
  return className
}

export function resolve<Theme extends BaseTheme = BaseTheme>(
  rule: ParsedRule,
  context: Context<Theme>,
): RuleResult | TwindRule[] {
  const factory = registry.get(rule.n)

  return factory ? factory(rule, context as any) : context.r(rule.n, rule.v[0] == 'dark')
}
