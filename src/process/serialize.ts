import type { Context, CSSRules, Prefixer, Rule } from '../types'

import * as is from '../internal/is'

import { join, includes, escape, hyphenate } from '../internal/util'
import {
  responsivePrecedence,
  descending,
  declarationPropertyPrecedence,
  declarationValuePrecedence,
  makeVariantPresedenceCalculator,
  atRulePresedence,
} from '../internal/presedence'

import { variants } from '../tailwind/variants'

export interface RuleWithPresedence {
  r: string
  p: number
}

const stringifyBlock = (body: string, selector: string): string => selector + '{' + body + '}'

export const serialize = (
  prefix: Prefixer,
  { theme, tag }: Context,
): ((css: CSSRules, className?: string, rule?: Rule) => RuleWithPresedence[]) => {
  // Hash/Tag custom variables during serialization
  const tagVar = (_: string, property: string): string => '--' + tag(property)

  const tagVars = (value: string): string => `${value}`.replace(/--(tw-[\w-]+)\b/g, tagVar)

  const stringifyDeclaration = (property: string, value: string | string[]): string => {
    property = tagVars(property)

    return is.array(value)
      ? join(
          value.filter(Boolean).map((value) => prefix(property, tagVars(value))),
          ';',
        )
      : prefix(property, tagVars(value))
  }

  // List of css rule with presedence to be injected
  let rules: RuleWithPresedence[]

  const stringify = (
    atRules: string[],
    selector: string,
    presedence: number,
    css: CSSRules,
  ): void => {
    // 1. Properties
    // 3. *
    // 2. @...
    // 3. :pseudo
    // 4. &

    let declarations = ''
    let numberOfDeclarations = 0
    let maxPropertyPresedence = 0
    let maxValuePresedence = 0

    Object.keys(css).forEach((key) => {
      const value = css[key] as CSSRules

      if (is.object(value) && !is.array(value)) {
        // If the value is an object this must be a nested block
        // like '@media ...', '@supports ... ', ':pseudo ...', '& > ...'
        // If these are the `@` rule
        if (key[0] === '@') {
          if (key[1] === 'f') {
            // Handling the `@font-face` where the
            // block doesn't need the brackets wrapped
            stringify([], key, 0, value)
          } else if (key[1] === 'k') {
            // To prevent
            // "@keyframes spin{from{transform:rotate(0deg)}}"
            // "@keyframes spin{to{transform:rotate(360deg)}}"
            // we generate waypoint without prefix and grap them from the stack
            // "from{transform:rotate(0deg)}"
            // "to{transform:rotate(360deg)}"
            // => "@keyframes name{from{transform:rotate(0deg)}from{transform:rotate(0deg)}}"
            const currentSize = rules.length

            stringify([], '', 0, value)

            const waypoints = rules.splice(currentSize, rules.length - currentSize)

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
            stringify(
              atRules.concat(key),
              selector,
              presedence | (responsivePrecedence(key) || atRulePresedence(key)),
              value,
            )
          }
        } else {
          // Call the serialize for this block
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
            value,
          )
        }
      } else if (value) {
        // It is a Property
        const property = hyphenate(key)

        // Update presedence
        numberOfDeclarations += 1
        maxPropertyPresedence = Math.max(
          maxPropertyPresedence,
          declarationPropertyPrecedence(property),
        )
        maxValuePresedence = Math.max(maxValuePresedence, declarationValuePrecedence(String(value)))

        declarations = (declarations && declarations + ';') + stringifyDeclaration(property, value)
      }
    })

    if (numberOfDeclarations) {
      // Inject declarations

      rules.push({
        r: atRules.reduceRight(stringifyBlock, stringifyBlock(declarations, selector)),

        // Calculate precedence
        p:
          presedence *
            // Declarations: 12 bits = 4096
            (1 << 12) +
          // 4: number of declarations (descending)
          (((descending(numberOfDeclarations) & 15) << 8) |
            // 4: greatest precedence of properties
            ((maxPropertyPresedence & 15) << 4) |
            // 4: greatest precedence of values
            (maxValuePresedence & 15)),
      })
    }
  }

  const variantPresedence = makeVariantPresedenceCalculator(theme, variants)

  return (css, className, rule) => {
    rules = []

    stringify(
      [],
      className ? '.' + escape(className) : '',
      rule ? rule.variants.reduceRight(variantPresedence, 0) : 0,
      css,
    )

    return rules
  }
}
