import type { Context, CSSRules, Prefixer, Rule } from '../types'

import * as is from '../internal/is'

import { join, includes, escape, hyphenate } from '../internal/util'
import {
  responsivePrecedence,
  declarationPropertyPrecedence,
  makeVariantPresedenceCalculator,
  atRulePresedence,
} from '../internal/presedence'

export interface RuleWithPresedence {
  r: string
  p: number
}

const stringifyBlock = (body: string, selector: string): string => selector + '{' + body + '}'

export const serialize = (
  prefix: Prefixer,
  variants: Record<string, string>,
  context: Context,
): ((css: CSSRules, className?: string, rule?: Rule) => RuleWithPresedence[]) => {
  const { theme, tag } = context

  // Hash/Tag tailwind custom properties during serialization
  // used by `tagVars` below
  const tagVar = (_: string, property: string): string => '--' + tag(property)

  const tagVars = (value: string | number): string => `${value}`.replace(/--(tw-[\w-]+)\b/g, tagVar)

  // Create a css declaration with prefix and hashed custom properties
  const stringifyDeclaration = (property: string, value: string | number | string[]): string => {
    property = tagVars(property)

    // Support array fallbacks
    return Array.isArray(value)
      ? join(
          value.filter(Boolean).map((value) => prefix(property, tagVars(value))),
          ';',
        )
      : prefix(property, tagVars(value))
  }

  // List of css rule with presedence to be injected
  let rules: RuleWithPresedence[]

  // Responsible for converting the css into one or more css strings
  // which will be injected into the page
  const stringify = (
    // Upper at-rules, selctoer that should wrap each generated css block
    atRules: string[],
    // The current css selector
    selector: string,
    // The current presedence for determine the css position in the stylesheet
    presedence: number,
    // The rules object
    css: CSSRules,
  ): void => {
    // 1. Properties
    // 3. *
    // 2. @...
    // 3. :pseudo
    // 4. &

    // The generated declaration block eg body of the css rule
    let declarations = ''

    // Additional presedence values

    // this ensures that 'border-top-width' has a higer presedence than 'border-top'
    let maxPropertyPresedence = 0

    // more specfic utilities have less declarations and a higher presedence
    let numberOfDeclarations = 0

    // Walk through the object
    Object.keys(css).forEach((key) => {
      let value = css[key]

      if (is.function(value)) {
        value = value(context)
      }

      // string, number or Array => a property with a value
      if (includes('rg', (typeof value)[5]) || Array.isArray(value)) {
        // It is a Property
        const property = hyphenate(key)

        // Update presedence
        numberOfDeclarations += 1
        maxPropertyPresedence = Math.max(
          maxPropertyPresedence,
          declarationPropertyPrecedence(property),
        )

        // Add to the declaration block with prefixer applied
        declarations =
          (declarations && declarations + ';') +
          stringifyDeclaration(property, value as string | number | string[])
      } else if (value) {
        // If the value is an object this must be a nested block
        // like '@media ...', '@supports ... ', ':pseudo ...', '& > ...'
        // If this is a `@` rule
        if (key[0] === '@') {
          if (key[1] === 'f') {
            // `@font-face` is never wrapped, eg always global/root
            stringify([], key, 0, value as CSSRules)
          } else if (key[1] === 'k') {
            // @keyframes handling
            // To prevent
            // "@keyframes spin{from{transform:rotate(0deg)}}"
            // "@keyframes spin{to{transform:rotate(360deg)}}"
            // we generate waypoints without prefix and grap them from the stack
            // "from{transform:rotate(0deg)}"
            // "to{transform:rotate(360deg)}"
            // => "@keyframes name{from{transform:rotate(0deg)}from{transform:rotate(0deg)}}"
            const currentSize = rules.length

            stringify([], '', 0, value as CSSRules)

            const waypoints = rules.splice(currentSize, rules.length - currentSize)

            // Insert without wrappers
            rules.push({
              r: stringifyBlock(
                join(
                  waypoints.map((p) => p.r),
                  '',
                ),
                key,
              ),
              p: waypoints.reduce((sum, p) => sum + p.p, 0),
            })
          } else {
            // Some nested block like @media, dive into it
            stringify(
              [...atRules, key],
              selector,
              presedence | (responsivePrecedence(key) || atRulePresedence(key)),
              value as CSSRules,
            )
          }
        } else {
          // A selector block: { '&:focus': { ... } }
          // If this is a nested selector we need to
          // - replace `&` with the current selector
          // - propagate the presedence; if it is not nested we reset the presedence as it is most likely a global styles
          const hasNestedSelector = selector && includes(key, '&')

          stringify(
            atRules,
            hasNestedSelector
              ? // Go over the selector and replace the matching selectors respecting multiple selectors
                selector.replace(/([^,])+/g, (selectorPart) =>
                  // Same for the key
                  key.replace(/([^,])+/g, (keyPart) =>
                    // If the current part has a nested selector replace it
                    includes(keyPart, '&') ? keyPart.replace(/&/g, selectorPart) : keyPart,
                  ),
                )
              : key,
            hasNestedSelector ? presedence : 0,
            value as CSSRules,
          )
        }
      }
    })

    // We have collected all properties
    // if there have been some we need to create a css rule
    if (numberOfDeclarations) {
      // Inject declarations

      rules.push({
        // Wrap block with upper at-rules
        r: atRules.reduceRight(stringifyBlock, stringifyBlock(declarations, selector)),

        // Calculate precedence
        p:
          presedence *
            // Declarations: 8 bits = 256
            (1 << 8) +
          // 4: greatest precedence of properties
          // if there is no property presedence this is most likely a custom property only declaration
          // these have the highest presedence
          ((((maxPropertyPresedence || 15) & 15) << 4) |
            // 4: number of declarations (descending)
            (Math.max(0, 15 - numberOfDeclarations) & 15)),
      })
    }
  }

  const variantPresedence = makeVariantPresedenceCalculator(theme, variants)

  return (css, className, rule) => {
    rules = []

    stringify(
      [],
      className ? '.' + escape(className) : '',
      // If we have a rule, create starting presedence based on the variants
      rule ? rule.v.reduceRight(variantPresedence, 0) : 0,
      css,
    )

    return rules
  }
}
