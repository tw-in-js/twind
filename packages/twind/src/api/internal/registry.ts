import type { BaseTheme, Context, Falsey, RuleResult, TwindRule } from '../types'
import type { SingleParsedRule } from './parse'

const registry = new Map<string, RegisterCallback>()

export type RegisterCallback = (rule: SingleParsedRule, context: Context) => Falsey | TwindRule[]

export function register(className: string, factory: RegisterCallback): string {
  registry.set(className, factory)
  return className
}

export function resolve<Theme extends BaseTheme = BaseTheme>(
  rule: SingleParsedRule,
  context: Context<Theme>,
): RuleResult | TwindRule[] {
  const factory = registry.get(rule.n)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
  return factory ? factory(rule, context as any) : context.r(rule.n)
}
