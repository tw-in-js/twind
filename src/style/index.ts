/**
 * [[include:src/styled/README.md]]
 *
 * @packageDocumentation
 * @module twind/styled
 */

// Based on https://github.com/modulz/stitches
// License MIT

import type { Context, CSSRules, Directive } from '../index'

import { apply, directive, hash } from '../index'
import { evalThunk, merge } from '../internal/util'
import type { Token } from '../types'

export * from '../index'

export type StrictMorphVariant<T> = T extends number
  ? `${T}` | T
  : T extends 'true'
  ? true | T
  : T extends 'false'
  ? false | T
  : T

export type MorphVariant<T> = T extends number
  ? `${T}` | T
  : T extends 'true'
  ? boolean | T
  : T extends 'false'
  ? boolean | T
  : T extends `${number}`
  ? number | T
  : T

export type StyleToken = string | CSSRules | Directive<CSSRules>

export type DefaultVariants<Variants> = {
  [key in keyof Variants]?:
    | StrictMorphVariant<keyof Variants[key]>
    | (Record<string, StrictMorphVariant<keyof Variants[key]>> & {
        initial?: StrictMorphVariant<keyof Variants[key]>
      })
}

export type VariantsProps<Variants> = {
  [key in keyof Variants]?:
    | MorphVariant<keyof Variants[key]>
    | (Record<string, MorphVariant<keyof Variants[key]>> & {
        initial?: MorphVariant<keyof Variants[key]>
      })
}

export type VariantMatchers<Variants> = {
  [key in keyof Variants]?: StrictMorphVariant<keyof Variants[key]>
}

// eslint-disable-next-line @typescript-eslint/ban-types
export interface StyleConfig<Variants, BaseVariants = {}> {
  base?: StyleToken
  variants?: Variants &
    { [variant in keyof BaseVariants]?: { [key in keyof BaseVariants[variant]]?: StyleToken } }
  defaults?: DefaultVariants<Variants & BaseVariants>
  matches?: (VariantMatchers<Variants & BaseVariants> & {
    use: StyleToken
  })[]
}

export interface StyleFunction {
  <Variants>(config?: StyleConfig<Variants>): Style<Variants> & string
  <Variants, BaseVariants>(
    base: Style<BaseVariants>,
    config?: StyleConfig<Variants, BaseVariants>,
  ): Style<BaseVariants & Variants> & string
}

export interface BaseStyleProps {
  tw?: Token
  css?: CSSRules
  class?: string
  className?: string
}

export type StyleProps<Variants> = VariantsProps<Variants> & BaseStyleProps

export interface Style<Variants> {
  /**
   * CSS Class associated with the current component.
   *
   * ```jsx
   * const button = style({
   *   base: {
   *     color: "DarkSlateGray"
   *   }
   * })
   *
   * <div className={tw(button())} />
   * ```
   * <br />
   */
  (props?: StyleProps<Variants>): Directive<CSSRules>

  /**
   * CSS Selector associated with the current component.
   *
   * ```js
   * const button = style({
   *   base: {
   *     color: "DarkSlateGray"
   *   }
   * })
   *
   * const article = style({
   *   base: {
   *     [button]: { boxShadow: "0 0 0 5px" }
   *   }
   * })
   * ```
   */
  toString(): string

  /**
   * CSS Class associated with the current component.
   *
   * ```js
   * const button = style({
   *   base: {
   *     color: "DarkSlateGray"
   *   }
   * })
   *
   * <div className={button.className} />
   * ```
   */
  readonly className: string

  /**
   * CSS Selector associated with the current component.
   *
   * ```js
   * const button = style({
   *   base: {
   *     color: "DarkSlateGray"
   *   }
   * })
   *
   * const Card = styled({
   *   base: {
   *     [Button.selector]: { boxShadow: "0 0 0 5px" }
   *   }
   * })
   * ```
   */
  readonly selector: string
}

const styled$ = (
  rules: (undefined | string | CSSRules | Directive<CSSRules>)[],
  context: Context,
): CSSRules =>
  rules.reduce((result: CSSRules, rule) => {
    if (typeof rule == 'string') {
      rule = apply(rule)
    }

    if (typeof rule == 'function') {
      return merge(result, evalThunk(rule, context), context)
    }

    if (rule) {
      return merge(result, rule as CSSRules, context)
    }

    return result
  }, {})

const buildMediaRule = (key: string, value: undefined | StyleToken): CSSRules => ({
  // Allow key to be an at-rule like @media
  // Fallback to a screen value
  [key[0] == '@' ? key : `@screen ${key}`]: typeof value == 'string' ? apply(value) : value,
})

const createStyle = <Variants, BaseVariants>(
  config: StyleConfig<Variants, BaseVariants> = {},
  base?: Style<BaseVariants>,
): Style<BaseVariants & Variants> & string => {
  const { base: baseStyle, variants = {}, defaults, matches = [] } = config

  const id = hash(JSON.stringify([base?.className, baseStyle, variants, defaults, matches]))
  const className = (base ? base.className + ' ' : '') + id
  const selector = (base || '') + '.' + id

  return Object.defineProperties(
    (allProps?: StyleProps<BaseVariants & Variants>): Directive<CSSRules> => {
      const { tw, css, class: localClass, className: localClassName, ...props } = {
        ...defaults,
        ...allProps,
      }

      const rules: (undefined | string | CSSRules | Directive<CSSRules>)[] = [
        base && base(props),
        {
          _:
            className +
            (localClassName ? ' ' + localClassName : '') +
            (localClass ? ' ' + localClass : ''),
        },
        baseStyle,
      ]

      // Variants directives
      Object.keys(variants).forEach((variantKey) => {
        const variant = (variants as Record<string, Record<string, StyleToken>>)[variantKey]
        const propsValue = (props as Record<string, unknown>)[variantKey]

        // propsValues: string, number, boolean, object
        if (propsValue === Object(propsValue)) {
          Object.keys(propsValue as Record<string, unknown>).forEach((key) => {
            const value = variant[(propsValue as Record<string, string>)[key]]

            // key: breakpoint like sm, or it is a at-rule like @media or @screen
            rules.push(key == 'initial' ? value : buildMediaRule(key, value))
          })
        } else {
          rules.push(variant[propsValue as string])
        }
      })

      matches.forEach((matcher) => {
        const ruleIndex = rules.push(matcher.use) - 1

        if (
          !Object.keys(matcher).every((variantKey) => {
            const propsValue = (props as Record<string, unknown>)[variantKey]
            const compoundValue = String((matcher as Record<string, string>)[variantKey])

            if (propsValue === Object(propsValue)) {
              Object.keys(propsValue as Record<string, unknown>).forEach((key) => {
                if (
                  key != 'initial' &&
                  compoundValue == String((propsValue as Record<string, unknown>)[key])
                ) {
                  // key: breakpoint like sm, or it is a at-rule like @media or @screen
                  rules.push(buildMediaRule(key, rules[ruleIndex]))
                }
              })

              return true
            }

            return variantKey == 'use' || compoundValue == String(propsValue)
          })
        ) {
          rules.length = ruleIndex
        }
      })

      rules.push(apply(tw), css)

      return directive(styled$, rules)
    },
    {
      toString: {
        value: (): string => selector,
      },
      className: {
        value: className,
      },
      selector: {
        value: selector,
      },
    },
  )
}

export const style = (<Variants, BaseVariants>(
  base: Style<BaseVariants> | StyleConfig<Variants>,
  config?: StyleConfig<Variants, BaseVariants>,
): Style<BaseVariants & Variants> & string =>
  (typeof base == 'function' ? createStyle(config, base) : createStyle(base)) as Style<
    BaseVariants & Variants
  > &
    string) as StyleFunction
