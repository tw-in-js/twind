/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { TwindRule, Context, BaseTheme } from '../types'
import type { ParsedRule, SingleParsedRule } from './parse'

import { format } from './format'
import { merge } from './merge'
import { parse } from './parse'
import { convert, Layer, moveToLayer } from './precedence'

import { resolve } from './registry'
import { serialize } from './serialize'
import { sortedInsertionIndex } from './sorted-insertion-index'
import { toClassName } from './to-class-name'

export function translate<Theme extends BaseTheme = BaseTheme>(
  rules: readonly ParsedRule[],
  context: Context<Theme>,
  precedence = Layer.utilities,
  conditions?: string[],
  important?: boolean,
  name?: string,
): TwindRule[] {
  // Sorted by precedence
  const result: TwindRule[] = []

  for (const rule of rules) {
    for (const cssRule of Array.isArray(rule)
      ? merge(
          translate(
            rule,
            context,
            (precedence & Layer.overrides) == Layer.utilities
              ? moveToLayer(precedence, Layer.shortcuts)
              : precedence,
            conditions,
            important,
          ),
          name || format([rule]),
        )
      : translate$(rule, context, precedence, conditions, important)) {
      result.splice(sortedInsertionIndex(result, cssRule), 0, cssRule)
    }
  }

  return result
}

function translate$<Theme extends BaseTheme = BaseTheme>(
  rule: SingleParsedRule,
  context: Context<Theme>,
  precedence: number,
  conditions?: string[],
  important?: boolean,
): TwindRule[] {
  if (important && !rule.important) {
    rule = { ...rule, important }
  }

  const resolved = resolve(rule, context)

  if (!resolved) {
    // propagate className as is
    return [{ className: toClassName(rule), precedence: 0, priority: 0, conditions: [] }]
  }

  if (typeof resolved == 'string') {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;({ conditions, precedence } = convert(rule, context, precedence, conditions))

    return translate([parse(resolved)], context, precedence, conditions, rule.important, rule.name)
  }

  if (Array.isArray(resolved)) {
    return resolved.map((rule) => ({
      priority: 0,
      ...rule,
      conditions: [...(conditions || []), ...(rule.conditions || [])],
      precedence: moveToLayer(precedence, rule.precedence || precedence),
    }))
  }

  return serialize(resolved, rule, context, precedence, conditions)
}
