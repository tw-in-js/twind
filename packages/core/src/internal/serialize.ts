import type { CSSObject, Falsey, Context, TwindRule, BaseTheme } from '../types'
import type { SingleParsedRule } from './parse'
import type { ConvertedRule } from './precedence'
import { Layer, moveToLayer, Shifts } from './precedence'
import { mql, hash, asArray } from '../utils'

import { atRulePrecedence, declarationPropertyPrecedence, convert } from './precedence'
import { stringify } from './stringify'
import { translate } from './translate'
import { parse } from './parse'
import { compareTwindRules } from './sorted-insertion-index'

export function serialize<Theme extends BaseTheme = BaseTheme>(
  style: CSSObject | Falsey,
  rule: Partial<SingleParsedRule>,
  context: Context<Theme>,
  precedence: number,
  conditions: string[] = [],
): TwindRule[] {
  return serialize$(style, convert(rule, context, precedence, conditions), context)
}

function serialize$<Theme extends BaseTheme = BaseTheme>(
  style: CSSObject | Falsey,
  { name, precedence, conditions = [], important }: ConvertedRule,
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
    let value = (style as Record<string, unknown>)[key]

    if (key[0] == '@') {
      if (!value) continue

      // at rules: https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
      switch (key[1]) {
        // @apply ...;
        case 'a': {
          rules.push(
            ...translate(
              // @apply rules are always merged
              [parse(value as string)],
              context,
              precedence,
              conditions,
              important,
            ).map((rule) => ({ ...rule, name })),
          )
          continue
        }

        // @layer <layer>
        case 'l': {
          rules.push(
            ...serialize$(
              value as CSSObject,
              {
                name,
                precedence: moveToLayer(precedence, Layer[key.slice(7) as 'base']),
                conditions,
                important,
              },
              context,
            ),
          )

          continue
        }

        // @import
        case 'i': {
          rules.push({
            // before all layers
            precedence: -1,
            priority: 0,
            conditions: [],
            declarations: asArray(value)
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
            precedence: Layer.defaults,
            priority: 0,
            conditions: [key],
            declarations: serialize$(value as CSSObject, { precedence: Layer.defaults }, context)
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
              rulePrecedence |= 1 << Shifts.screens
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
              name,
              precedence: rulePrecedence,
              conditions: [...conditions, key],
              important,
            },
            context,
          ),
        )
      } else {
        // global selector
        rules.push(...serialize$(value as CSSObject, { precedence, conditions: [key] }, context))
      }
    } else if (key == 'label' && value) {
      name = (value as string) + '#' + hash(JSON.stringify([precedence, important, style]))
    } else if (value || value === 0) {
      // property -> hyphenate
      key = key.replace(/[A-Z]/g, '-$&').toLowerCase()

      // Update precedence
      numberOfDeclarations += 1
      maxPropertyPrecedence = Math.max(maxPropertyPrecedence, declarationPropertyPrecedence(key))

      // support theme(...) function in values
      // calc(100vh - theme('spacing.12'))
      value = resolveThemeFunction(String(value), context) + (important ? ' !important' : '')

      declarations +=
        (declarations ? ';' : '') +
        asArray(value)
          .map((value) => context.stringify(key, value as string))
          .join(';')
    }
  }

  // We have collected all properties
  // if there have been some we need to create a css rule
  if (numberOfDeclarations) {
    if (name) {
      name = context.tag(name)
    }

    rules.push({
      name,

      precedence,

      // Declarations: 8 bits = 256
      priority:
        // 4: number of declarations (descending)
        (Math.max(0, 15 - numberOfDeclarations) << 4) |
        // 4: greatest precedence of properties
        // if there is no property precedence this is most likely a custom property only declaration
        // these have the highest precedence
        (Math.min(maxPropertyPrecedence || 15), 15),

      conditions,

      // stringified declarations
      declarations,
    })
  }

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
