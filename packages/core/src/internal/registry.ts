import type { BaseTheme, Context, RuleResult, SingleParsedRule, TwindRule } from '../types'

const registry = new Map<string, RegisterCallback>()

export type RegisterCallback = (rule: SingleParsedRule, context: Context) => TwindRule[]

export function register(className: string, factory: RegisterCallback): string {
  registry.set(className, factory)
  return className
}

export function resolve<Theme extends BaseTheme = BaseTheme>(
  rule: SingleParsedRule,
  context: Context<Theme>,
): RuleResult | TwindRule[] {
  const factory = registry.get(rule.name)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
  return factory ? factory(rule, context as any) : context.rule(rule.name)
}
