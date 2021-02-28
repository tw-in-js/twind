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

export type Style = string | CSSRules | Directive<CSSRules>

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

export type CompoundVariants<Variants> = {
  [key in keyof Variants]?: StrictMorphVariant<keyof Variants[key]>
}

// eslint-disable-next-line @typescript-eslint/ban-types
export interface StyledConfig<Variants, BaseVariants = {}> {
  style?: Style
  variants?: Variants &
    { [variant in keyof BaseVariants]?: { [key in keyof BaseVariants[variant]]?: Style } }
  defaults?: DefaultVariants<Variants & BaseVariants>
  compounds?: (CompoundVariants<Variants & BaseVariants> & {
    style: Style
  })[]
}

// TODO different name like
// define declare
// atom partial design motif
export interface StyledFactory {
  <Variants>(config?: StyledConfig<Variants>): Styled<Variants> & string
  <Variants, BaseVariants>(
    base: Styled<BaseVariants>,
    config?: StyledConfig<Variants, BaseVariants>,
  ): Styled<BaseVariants & Variants> & string
}

export interface BaseStyledProps {
  tw?: Token
  css?: CSSRules
  class?: string
  className?: string
}

export type StyledProps<Variants> = VariantsProps<Variants> & BaseStyledProps

export interface Styled<Variants> {
  /**
   * CSS Class associated with the current component.
   *
   * ```jsx
   * const button = styled({ color: "DarkSlateGray" })
   *
   * <div className={tw(button())} />
   * ```
   * <br />
   */
  (props?: StyledProps<Variants>): Directive<CSSRules>

  /**
   * CSS Selector associated with the current component.
   *
   * ```js
   * const button = styled({ color: "DarkSlateGray" })
   *
   * const article = styled({
   *   [button]: { boxShadow: "0 0 0 5px" }
   * })
   * ```
   */
  toString(): string

  /**
   * CSS Class associated with the current component.
   *
   * ```js
   * const Button = styled({ color: "DarkSlateGray" })
   *
   * <div className={Button.className} />
   * ```
   */
  readonly className: string

  /**
   * CSS Selector associated with the current component.
   *
   * ```js
   * const Button = styled({ color: "DarkSlateGray" })
   *
   * const Card = styled({
   *   [Button.selector]: { boxShadow: "0 0 0 5px" }
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

const createStyled = <Variants, BaseVariants>(
  config: StyledConfig<Variants, BaseVariants> = {},
  base?: Styled<BaseVariants>,
): Styled<BaseVariants & Variants> & string => {
  const { style, variants = {}, defaults, compounds = [] } = config

  const id = hash(JSON.stringify({ style, variants, defaults, compounds }))
  const className = (base ? base.className + ' ' : '') + id
  const selector = (base || '') + '.' + id

  return Object.defineProperties(
    (allProps?: StyledProps<BaseVariants & Variants>): Directive<CSSRules> => {
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
        style,
      ]

      // Variants directives
      Object.keys(variants).forEach((variantKey) => {
        const variant = (variants as Record<string, Record<string, Style>>)[variantKey]
        const propsValue = (props as Record<string, unknown>)[variantKey]

        // propsValues: string, number, boolean, object
        if (propsValue === Object(propsValue)) {
          Object.keys(propsValue as Record<string, unknown>).forEach((key) => {
            const value = variant[(propsValue as Record<string, string>)[key]]

            // key: breakpoint like sm, or it is a at-rule like @media or @screen
            rules.push(
              key == 'initial'
                ? value
                : {
                    // Allow key to be an at-rule like @media
                    // Fallback to a screen value
                    [key[0] == '@' ? key : `@screen ${key}`]:
                      typeof value == 'string' ? apply(value) : value,
                  },
            )
          })
        } else {
          rules.push(variant[propsValue as string])
        }
      })

      compounds.forEach(({ style, ...compounds }) => {
        const compoundRules: (undefined | string | CSSRules | Directive<CSSRules>)[] = [style]

        const matched = Object.keys(compounds).every((variantKey) => {
          const propsValue = (props as Record<string, unknown>)[variantKey]
          const compoundValue = String((compounds as Record<string, string>)[variantKey])

          if (propsValue === Object(propsValue)) {
            Object.keys(propsValue as Record<string, unknown>).forEach((key) => {
              if (
                key != 'initial' &&
                compoundValue == String((propsValue as Record<string, unknown>)[key])
              ) {
                // key: breakpoint like sm, or it is a at-rule like @media or @screen
                compoundRules.push({
                  [key[0] == '@' ? key : `@screen ${key}`]:
                    typeof style == 'string' ? apply(style) : style,
                })
              }
            })

            return true
          }

          return compoundValue == String(propsValue)
        })

        if (matched) {
          rules.push(...compoundRules)
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

export const styled = (<Variants, BaseVariants>(
  base: Styled<BaseVariants> | StyledConfig<Variants>,
  config?: StyledConfig<Variants, BaseVariants>,
): Styled<BaseVariants & Variants> & string =>
  (typeof base == 'function' ? createStyled(config, base) : createStyled(base)) as Styled<
    BaseVariants & Variants
  > &
    string) as StyledFactory
