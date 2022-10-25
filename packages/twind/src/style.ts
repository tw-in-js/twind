// Based on https://github.com/modulz/stitches
// License MIT

import type { Falsey, MatchResult } from './types'
import { parse } from './parse'
import { Layer } from './internal/precedence'

import { escape, hash } from './utils'
import { define } from './internal/define'

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

export type StyleTokenValue = string | Falsey

// No support for thunks yet — these may use props that are not in the generated class name
// and may therefore override each other
export type StyleToken = StyleTokenValue

/**
 * Allows to extract the supported properties of a style function.
 *
 * Here is an example for `react`
 * ```js
 * import { HTMLAttributes } from "react";
 * import { style, PropsOf } from "twind";
 * const button = style({ ... })
 * type ButtonProps = PropsOf<typeof button>
 * export const Button = (props: ButtonProps & HTMLAttributes<HTMLButtonElement>) => {
 *   return <button className={style(props)} {...rest} />
 * }
 * ```
 */
export type PropsOf<T> = T extends Style<infer Variants>
  ? {
      [key in keyof Variants]: MorphVariant<keyof Variants[key]>
    }
  : never

export type DefaultVariants<Variants> = {
  [key in keyof Variants]?:
    | StrictMorphVariant<keyof Variants[key]>
    | (Record<string, StrictMorphVariant<keyof Variants[key]>> & {
        /** initial breakpoint */
        _?: StrictMorphVariant<keyof Variants[key]>
      })
}

export type VariantsProps<Variants> = {
  [key in keyof Variants]?:
    | MorphVariant<keyof Variants[key]>
    // TODO possible breakpoint from theme
    | (Record<string, MorphVariant<keyof Variants[key]>> & {
        /** initial breakpoint */
        _?: MorphVariant<keyof Variants[key]>
      })
}

export type When<Variants> = {
  [key in keyof Variants]?: StrictMorphVariant<keyof Variants[key]>
}

// eslint-disable-next-line @typescript-eslint/ban-types
export interface StyleConfig<Variants, BaseVariants = {}> {
  /** Used as prefix */
  label?: string
  base?: StyleToken
  props?: Variants & {
    [variant in keyof BaseVariants]?: {
      [key in keyof BaseVariants[variant]]?: StyleToken
    }
  }
  defaults?: DefaultVariants<Variants & BaseVariants>
  when?: [match: When<Variants & BaseVariants>, then: StyleToken][]
}
export interface StyleFunction {
  <Variants>(config?: StyleConfig<Variants>): Style<Variants>
  <Variants, BaseVariants>(
    base: Style<BaseVariants>,
    config?: StyleConfig<Variants, BaseVariants>,
  ): Style<Variants & BaseVariants>
}

export type StyleProps<Variants> = VariantsProps<Variants>

export interface Style<Variants> {
  /**
   * CSS Class associated with the current component.
   *
   * ```jsx
   * const button = style({
   *   base: css({
   *     color: "DarkSlateGray"
   *   })
   * })
   *
   * <div className={button()} />
   * ```
   * <br />
   */
  (props?: StyleProps<Variants>): string

  /**
   * To be used as resolve within config.rules:
   *
   * ```js
   * {
   *   rules: [
   *     // label?prop=value&other=propValue
   *     // if the style has base eg no prop is required
   *     ['label(\\?.+)?', style( /* ... *\/ )],
   *
   *     // if the style requires at least one prop
   *     ['label\\?(.+)', style( /* ... *\/ )],
   *   ]
   * }
   * ```
   *
   * The first group is used to extract the props using {@link URLSearchParams}.
   */
  (match: MatchResult): string

  readonly defaults: StyleProps<Variants>

  /**
   * CSS Class associated with the current component.
   *
   * ```js
   * const button = style({
   *   base: css`
   *     color: "DarkSlateGray"
   *   `
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
   *   base: css({
   *     color: "DarkSlateGray"
   *   })
   * })
   *
   * const Card = styled({
   *   base: css`
   *     & ${button.selector} {
   *       boxShadow: "0 0 0 5px"
   *     }
   *   `
   * })
   * ```
   */
  readonly selector: string
}

export const style = (<Variants, BaseVariants>(
  base: Style<BaseVariants> | StyleConfig<Variants>,
  config?: StyleConfig<Variants, BaseVariants>,
): Style<Variants & BaseVariants> =>
  (typeof base == 'function' ? createStyle(config, base) : createStyle(base)) as Style<
    Variants & BaseVariants
  > &
    string) as StyleFunction

function createStyle<Variants, BaseVariants>(
  config: StyleConfig<Variants, BaseVariants> = {},
  parent?: Style<BaseVariants>,
): Style<Variants & BaseVariants> {
  const { label = 'style', base, props: variants = {}, defaults: localDefaults, when = [] } = config

  const defaults = { ...parent?.defaults, ...localDefaults }

  const id = hash(JSON.stringify([label, parent?.className, base, variants, defaults, when]))

  // Layers:
  // component: 0b010
  // props: 0b011
  // when: 0b100

  const className = register('', base || '', Layer.c)

  function register(mq: string, token: string, layer: number): string {
    return define(
      // `<name>#<id>` or `<parent>~<name>#<id>`
      ((parent ? parent.className.replace(/#.+$/, '~') : '') + label + mq + id).replace(
        /[: ,()[\]]/,
        '',
      ),
      layer,
      token && parse(token),
    )
  }

  return Object.defineProperties(
    function style(allProps) {
      let isWithinRuleDeclaration

      if (Array.isArray(allProps)) {
        isWithinRuleDeclaration = true
        allProps = Object.fromEntries(new URLSearchParams(allProps[1]).entries()) as VariantsProps<
          Variants & BaseVariants
        >
      }

      const props = { ...defaults, ...allProps }

      // If this style is used within config.rules we do NOT include the marker classes
      let classNames = isWithinRuleDeclaration
        ? ''
        : (parent ? parent(props) + ' ' : '') + className

      let token: StyleToken

      for (const variantKey in variants) {
        const variant = (variants as Record<string, Record<string, StyleToken>>)[variantKey]
        const propsValue = (props as Record<string, unknown>)[variantKey]

        if (propsValue === Object(propsValue)) {
          // inline responsive breakpoints
          let mq = ''
          token = ''

          for (const breakpoint in propsValue as Record<string, string>) {
            const breakpointToken = variant[(propsValue as Record<string, string>)[breakpoint]]

            if (breakpointToken) {
              mq += '@' + breakpoint + '-' + (propsValue as Record<string, string>)[breakpoint]

              token +=
                (token && ' ') +
                (breakpoint == '_' ? breakpointToken : breakpoint + ':(' + breakpointToken + ')')
            }
          }

          if (token) {
            classNames +=
              ' ' + register('--' + variantKey + '-' + mq, token, 0b011 << 27 /* Shifts.layer */)
          }
        } else if ((token = variant[propsValue as string])) {
          classNames +=
            ' ' +
            register(
              '--' + variantKey + '-' + (propsValue as string),
              token,
              0b011 << 27 /* Shifts.layer */,
            )
        }
      }

      when.forEach((match, index) => {
        let mq = ''

        for (const variantKey in match[0]) {
          const propsValue = (props as Record<string, unknown>)[variantKey]

          // TODO we ignore inline responsive breakpoints for now — what be the result??
          if (
            propsValue !== Object(propsValue) &&
            '' + propsValue == '' + (match[0] as Record<string, string>)[variantKey]
          ) {
            mq += (mq && '_') + variantKey + '-' + (propsValue as string)
          } else {
            mq = ''
            break
          }
        }

        if (mq && (token = match[1])) {
          classNames +=
            ' ' + register('-' + index + '--' + mq, token, 0b100 << 27 /* Shifts.layer */)
        }
      })

      return classNames
    } as Style<Variants & BaseVariants>,
    Object.getOwnPropertyDescriptors({
      className,
      defaults,
      selector: '.' + escape(className),
    }),
  )
}
