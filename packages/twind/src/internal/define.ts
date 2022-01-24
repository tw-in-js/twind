import type { Falsey } from '../types'
import type { ParsedRule } from './parse'
import { merge } from './merge'
import { convert, moveToLayer } from './precedence'
import { register } from './registry'
import { translate } from './translate'

export function define(className: string, layer: number, rules: Falsey | ParsedRule[]): string {
  return register(className, (rule, context) => {
    const { n: name, p: precedence, r: conditions, i: important } = convert(rule, context, layer)

    return (
      rules &&
      merge(
        translate(rules, context, precedence, conditions, important).map((rule) =>
          rule.n ? { ...rule, p: moveToLayer(rule.p, layer), o: 0 } : rule,
        ),
        name as string,
      )
    )
  })
}
