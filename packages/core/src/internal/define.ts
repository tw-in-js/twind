import type { Falsey } from '../types'
import type { ParsedRule } from '../parse'
import { convert } from './precedence'
import { register } from './registry'
import { translateWith } from './translate'

export function define(
  className: string,
  layer: number,
  rules: Falsey | ParsedRule[],
  useOrderOfRules?: boolean,
): string {
  return register(className, (rule, context) => {
    const { n: name, p: precedence, r: conditions, i: important } = convert(rule, context, layer)

    return (
      rules &&
      translateWith(
        name as string,
        layer,
        rules,
        context,
        precedence,
        conditions,
        important,
        useOrderOfRules,
      )
    )
  })
}
