/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { TwindRule, Context, BaseTheme } from '../types'
import type { ParsedRule } from './parse'

import { parse } from './parse'
import { convert, Layer, moveToLayer } from './precedence'

import { resolve } from './registry'
import { serialize } from './serialize'
import { sortedInsertionIndex } from './sorted-insertion-index'
import { toClassName } from './to-class-name'
import { asArray } from '../utils'
import { merge } from './merge'

export function translate<Theme extends BaseTheme = BaseTheme>(
  rules: readonly ParsedRule[],
  context: Context<Theme>,
  precedence = Layer.u,
  conditions?: string[],
  important?: boolean,
): TwindRule[] {
  // Sorted by precedence
  const result: TwindRule[] = []

  for (const rule of rules) {
    for (const cssRule of translate$(rule, context, precedence, conditions, important)) {
      result.splice(sortedInsertionIndex(result, cssRule), 0, cssRule)
    }
  }

  return result
}

function translate$<Theme extends BaseTheme = BaseTheme>(
  rule: ParsedRule,
  context: Context<Theme>,
  precedence: number,
  conditions?: string[],
  important?: boolean,
): TwindRule[] {
  rule = { ...rule, i: rule.i || important }

  const resolved = resolve(rule, context)

  if (!resolved) {
    // propagate className as is
    return [{ c: toClassName(rule), p: 0, o: 0, r: [] }]
  }

  // a list of class names
  if (typeof resolved == 'string') {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;({ r: conditions, p: precedence } = convert(rule, context, precedence, conditions))

    return merge(translate(parse(resolved), context, precedence, conditions, rule.i), rule.n)
  }

  if (Array.isArray(resolved)) {
    return resolved.map((rule) => ({
      o: 0,
      ...rule,
      r: [...asArray(conditions), ...asArray(rule.r)],
      p: moveToLayer(precedence, rule.p ?? precedence),
    }))
  }

  return serialize(resolved, rule, context, precedence, conditions)
}

export function translateWith<Theme extends BaseTheme = BaseTheme>(
  name: string,
  layer: number,
  rules: ParsedRule[],
  context: Context<Theme>,
  precedence: number,
  conditions?: string[] | undefined,
  important?: boolean | undefined,
  useOrderOfRules?: boolean,
) {
  return merge(
    (useOrderOfRules
      ? rules.flatMap((rule) => translate([rule], context, precedence, conditions, important))
      : translate(rules, context, precedence, conditions, important)
    ).map((rule) =>
      // do not move defaults
      // move only rules with a name unless they are in the base layer
      rule.p & Layer.o && (rule.n || layer == Layer.b)
        ? { ...rule, p: moveToLayer(rule.p, layer), o: 0 }
        : rule,
    ),
    name,
  )
}
