import type { CSSObject, Falsey, Context, TwindRule, BaseTheme, MaybeArray } from '../types'
import type { ParsedRule } from './parse'
import type { ConvertedRule } from './precedence'
import { Layer, moveToLayer } from './precedence'
import { mql, hash, asArray } from '../utils'

import { atRulePrecedence, declarationPropertyPrecedence, convert } from './precedence'
import { stringify } from './stringify'
import { translate, translateWith } from './translate'
import { parse } from './parse'
import { compareTwindRules } from './sorted-insertion-index'
import { merge } from './merge'
import { define } from './define'

export function serialize<Theme extends BaseTheme = BaseTheme>(
  style: CSSObject | Falsey,
  rule: Partial<ParsedRule>,
  context: Context<Theme>,
  precedence: number,
  conditions: string[] = [],
): TwindRule[] {
  return serialize$(style, convert(rule, context, precedence, conditions), context)
}

function serialize$<Theme extends BaseTheme = BaseTheme>(
  style: CSSObject | Falsey,
  { n: name, p: precedence, r: conditions = [], i: important }: ConvertedRule,
  context: Context<Theme>,
): TwindRule[] {
  const rules: TwindRule[] = []

  // The generated declaration block eg body of the css rule
  let declarations = ''

  // This ensures that 'border-top-width' has a higher precedence than 'border-top'
  let maxPropertyPrecedence = 0

  // More specific utilities have less declarations and a higher precedence
  let numberOfDeclarations = 0

  for (let key in style || {}) {
    const value = (style as Record<string, unknown>)[key]

    if (key[0] == '@') {
      if (!value) continue

      // at rules: https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
      switch (key[1]) {
        // @apply ...;
        case 'a': {
          rules.push(
            ...translateWith(
              name as string,
              precedence,
              parse(value as string),
              context,
              precedence,
              conditions,
              important,
              true /* useOrderOfRules */,
            ),
          )
          continue
        }

        // @layer <layer>
        case 'l': {
          for (const css of asArray(value as MaybeArray<CSSObject>)) {
            rules.push(
              ...serialize$(
                css,
                {
                  n: name,
                  p: moveToLayer(precedence, Layer[key[7] as 'b']),
                  r: conditions,
                  i: important,
                },
                context,
              ),
            )
          }

          continue
        }

        // @import
        case 'i': {
          rules.push({
            // before all layers
            p: -1,
            o: 0,
            r: [],
            d: asArray(value)
              .filter(Boolean)
              .map((value) => key + ' ' + (value as string))
              .join(';'),
          })
          continue
        }

        // @keyframes
        // @font-face
        // TODO @font-feature-values
        case 'k':
        case 'f': {
          // Use base layer
          rules.push({
            p: Layer.d,
            o: 0,
            r: [key],
            d: serialize$(value as CSSObject, { p: Layer.d }, context)
              .map(stringify)
              .join(''),
          })
          continue
        }
        // -> All other are handled below; same as selector
      }
    }

    // @media
    // @supports
    // selector
    if (typeof value == 'object' && !Array.isArray(value)) {
      // at-rule or non-global selector
      if (key[0] == '@' || key.includes('&')) {
        let rulePrecedence = precedence
        if (key[0] == '@') {
          // Handle `@media screen(sm)` and `@media (screen(sm) or ...)`
          key = key.replace(/\bscreen\(([^)]+)\)/g, (_, screenKey) => {
            const screen = context.theme('screens', screenKey)

            if (screen) {
              rulePrecedence |= 1 << 26 /* Shifts.screens */
              return mql(screen, '')
            }

            return _
          })

          rulePrecedence |= atRulePrecedence(key)
        }

        rules.push(
          ...serialize$(
            value as CSSObject,
            {
              n: name,
              p: rulePrecedence,
              r: [...conditions, key],
              i: important,
            },
            context,
          ),
        )
      } else {
        // global selector
        rules.push(...serialize$(value as CSSObject, { p: precedence, r: [key] }, context))
      }
    } else if (key == 'label' && value) {
      name = (value as string) + hash(JSON.stringify([precedence, important, style]))
    } else if (value || value === 0) {
      // property -> hyphenate
      key = key.replace(/[A-Z]/g, '-$&').toLowerCase()

      // Update precedence
      numberOfDeclarations += 1
      maxPropertyPrecedence = Math.max(maxPropertyPrecedence, declarationPropertyPrecedence(key))

      declarations +=
        (declarations ? ';' : '') +
        asArray(value)
          .map((value) =>
            context.s(
              key,
              // support theme(...) function in values
              // calc(100vh - theme('spacing.12'))
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              resolveThemeFunction('' + value, context) + (important ? ' !important' : ''),
            ),
          )
          .join(';')
    }
  }

  rules.unshift({
    n: name && context.h(name),

    p: precedence,

    o:
      // number of declarations (descending)
      Math.max(0, 15 - numberOfDeclarations) +
      // greatest precedence of properties
      // if there is no property precedence this is most likely a custom property only declaration
      // these have the highest precedence
      Math.min(maxPropertyPrecedence || 15, 15) * 1.5,

    r: conditions,

    // stringified declarations
    d: declarations,
  })

  // only keep layer bits for merging
  return rules.sort(compareTwindRules)
}

export function resolveThemeFunction<Theme extends BaseTheme = BaseTheme>(
  value: string,
  context: Context<Theme>,
): string {
  // support theme(...) function in values
  // calc(100vh - theme('spacing.12'))
  // theme('borderColor.DEFAULT', 'currentColor')
  return value.replace(
    /theme\((["'`])?(.+?)\1(?:\s*,\s*(["'`])?(.+?)\3)?\)/g,
    (_, __, key, ___, value) => context.theme(key, value) as string,
  )
}
