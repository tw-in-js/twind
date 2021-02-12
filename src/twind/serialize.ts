import type { Context, CSSRules, Prefixer, Rule } from '../types'

import {
  join,
  includes,
  escape,
  hyphenate,
  evalThunk,
  buildMediaQuery,
  tail,
} from '../internal/util'
import {
  responsivePrecedence,
  declarationPropertyPrecedence,
  makeVariantPresedenceCalculator,
  atRulePresedence,
} from './presedence'

export interface RuleWithPresedence {
  r: string
  p: number
}

const stringifyBlock = (body: string, selector: string): string => selector + '{' + body + '}'

/**
 * Determines the default order of styles.
 *
 * For example: screens have a higher presedence (eg override) utilities
 */
const enum Layer {
  /**
   * The preflight styles and any base styles registered by plugins.
   */
  base = 0,

  /**
   * Component classes and any component classes registered by plugins.
   */
  components = 1,

  /**
   * Utility classes and any utility classes registered by plugins.
   */
  utilities = 2,

  /**
   * Inline directives
   */
  css = 3,
}

export const serialize = (
  prefix: Prefixer,
  variants: Record<string, string>,
  context: Context,
): ((css: CSSRules, className?: string, rule?: Rule, layer?: Layer) => RuleWithPresedence[]) => {
  const { theme, tag } = context

  // Hash/Tag tailwind custom properties during serialization
  // used by `tagVars` below
  const tagVar = (_: string, property: string): string => '--' + tag(property)

  const tagVars = (value: string | number): string => `${value}`.replace(/--(tw-[\w-]+)\b/g, tagVar)

  // Create a css declaration with prefix and hashed custom properties
  const stringifyDeclaration = (
    property: string,
    value: string | number | string[],
    important: boolean | undefined,
  ): string => {
    property = tagVars(property)

    // Support array fallbacks
    return Array.isArray(value)
      ? join(
          value.filter(Boolean).map((value) => prefix(property, tagVars(value), important)),
          ';',
        )
      : prefix(property, tagVars(value), important)
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
    important: boolean | undefined,
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

    if (typeof css['@apply'] == 'string') {
      css = { ...context.css(css['@apply']), ...css, '@apply': undefined }
    }

    // Walk through the object
    Object.keys(css).forEach((key) => {
      const value = evalThunk(css[key], context)

      // string, number or Array => a property with a value
      if (includes('rg', (typeof value)[5]) || Array.isArray(value)) {
        if (value !== '' && key.length > 1) {
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
            stringifyDeclaration(property, value as string | number | string[], important)
        }
      } else if (value) {
        // If the value is an object this must be a nested block
        // like '@media ...', '@supports ... ', ':pseudo ...', '& > ...'
        // If this is a `@` rule
        if (key[0] === '@') {
          if (key[1] === 'f') {
            // `@font-face` is never wrapped, eg always global/root
            stringify([], key, 0, value as CSSRules, important)
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

            stringify([], '', 0, value as CSSRules, important)

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
            if (key.slice(1, 8) == 'screen ') {
              key = buildMediaQuery(context.theme('screens', tail(key, 8).trim()) as string)
            }

            // Some nested block like @media, dive into it
            stringify(
              [...atRules, key],
              selector,
              presedence | responsivePrecedence(key) | atRulePresedence(key),
              value as CSSRules,
              important,
            )
          }
        } else if (key === ':global') {
          stringify([], '', 0, value as CSSRules, important)
        } else {
          // A selector block: { '&:focus': { ... } }
          stringify(
            atRules,
            // If this is a nested selector we need to
            // - replace `&` with the current selector
            selector
              ? // Go over the selector and replace the matching selectors respecting multiple selectors
                selector.replace(/([^,])+/g, (selectorPart) =>
                  // Same for the key
                  key.replace(/([^,])+/g, (keyPart) =>
                    // If the current part has a nested selector replace it
                    includes(keyPart, '&')
                      ? keyPart.replace(/&/g, selectorPart)
                      : (selectorPart && selectorPart + ' ') + keyPart,
                  ),
                )
              : key,
            presedence,
            value as CSSRules,
            important,
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
          // 4: number of declarations (descending)
          (((Math.max(0, 15 - numberOfDeclarations) & 15) << 4) |
            // 4: greatest precedence of properties
            // if there is no property presedence this is most likely a custom property only declaration
            // these have the highest presedence
            ((maxPropertyPresedence || 15) & 15)),
      })
    }
  }

  const variantPresedence = makeVariantPresedenceCalculator(theme, variants)

  return (css, className, rule, layer = Layer.base) => {
    // Initial presedence based on layer (base = 0, components = 1, utilities = 2, css = 3)
    layer <<= 28

    rules = []

    stringify(
      [],
      className ? '.' + escape(className) : '',
      // If we have a rule, create starting presedence based on the variants
      rule ? rule.v.reduceRight(variantPresedence, layer) : layer,
      css,
      rule && rule.i,
    )

    return rules
  }
}
