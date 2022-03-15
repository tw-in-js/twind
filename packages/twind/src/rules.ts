import type {
  Context,
  ColorValue,
  ColorFunction,
  BaseTheme,
  MatchResult,
  RuleResolver,
  CSSProperties,
  CSSObject,
  RuleResult,
  ThemeValue,
  KebabCase,
} from './types'

import { toColorValue } from './colors'
import { resolveThemeFunction } from './internal/serialize'

export type ThemeMatchResult<Value> = MatchResult & {
  /** The found theme value */
  _: Value
}

export type ThemeRuleResolver<Value, Theme extends BaseTheme = BaseTheme> = (
  match: ThemeMatchResult<Value>,
  context: Context<Theme>,
) => RuleResult

export type ThemeMatchConverter<Value, Theme extends BaseTheme = BaseTheme> = (
  match: ThemeMatchResult<Value>,
  context: Context<Theme>,
) => string

export function fromTheme<
  Theme extends BaseTheme = BaseTheme,
  Section extends keyof Theme & string = keyof Theme & string,
>(
  /** Theme section to use (default: `$1` — The first matched group) */
  section?: '' | Section | KebabCase<Section>,

  /** The css property (default: value of {@link section}) */
  resolve?: keyof CSSProperties | ThemeRuleResolver<ThemeValue<Theme[Section]>, Theme>,

  convert?: ThemeMatchConverter<ThemeValue<Theme[Section]>, Theme>,
): RuleResolver<Theme> {
  const factory: (
    match: ThemeMatchResult<ThemeValue<Theme[Section]>>,
    context: Context<Theme>,
    section: Section,
  ) => RuleResult = !resolve
    ? ({ 1: $1, _ }, context, section) => ({ [$1 || section]: _ } as CSSObject)
    : typeof resolve == 'string'
    ? (match, context) => ({ [resolve]: convert ? convert(match, context) : match._ } as CSSObject)
    : resolve

  return (match, context) => {
    const themeSection = camelize(section || match[1]) as Section

    const value =
      context.theme(themeSection, match.$$) ??
      /** Arbitrary lookup type */
      // https://github.com/tailwindlabs/tailwindcss/blob/875c850b37a57bc651e1fed91e3d89af11bdc79f/src/util/pluginUtils.js#L163
      // type?: 'lookup' | 'color' | 'line-width' | 'length' | 'any' | 'shadow'
      (arbitrary(match.$$, themeSection, context) as ThemeValue<Theme[Section]>)

    if (value != null) {
      ;(match as ThemeMatchResult<ThemeValue<Theme[Section]>>)._ =
        match.input[0] == '-'
          ? (`calc(${value as string} * -1)` as ThemeValue<Theme[Section]>)
          : value

      return factory(match as ThemeMatchResult<ThemeValue<Theme[Section]>>, context, themeSection)
    }
  }
}

export type FilterByThemeValue<Theme, Value> = {
  [key in keyof Theme & string]: ThemeValue<Theme[key]> extends Value ? Theme[key] : never
}

export interface ColorFromThemeValue {
  value: string
  color: ColorFunction
}

export interface ColorFromThemeOptions<
  Theme extends BaseTheme = BaseTheme,
  Section extends keyof FilterByThemeValue<Theme, ColorValue> = keyof FilterByThemeValue<
    Theme,
    ColorValue
  >,
  OpacitySection extends keyof FilterByThemeValue<Theme, string> = keyof FilterByThemeValue<
    Theme,
    string
  >,
> {
  /** Theme section to use (default: `$0.replace('-', 'Color')` — The matched string with `Color` appended) */
  section?: Section | KebabCase<Section>
  /** The css property (default: value of {@link section}) */
  property?: keyof CSSProperties
  /** `--tw-${$0}opacity` -> '--tw-text-opacity' */
  opacityVariable?: string | false
  /** `section.replace('Color', 'Opacity')` -> 'textOpacity' */
  opacitySection?: OpacitySection
  selector?: string
}

export function colorFromTheme<
  Theme extends BaseTheme = BaseTheme,
  Section extends keyof FilterByThemeValue<Theme, ColorValue> = keyof FilterByThemeValue<
    Theme,
    ColorValue
  >,
  OpacitySection extends keyof FilterByThemeValue<Theme, string> = keyof FilterByThemeValue<
    Theme,
    string
  >,
>(
  options: ColorFromThemeOptions<Theme, Section, OpacitySection> = {},
  resolve?: ThemeRuleResolver<ColorFromThemeValue, Theme>,
): RuleResolver<Theme> {
  return (match, context) => {
    // text- -> textColor
    // ring-offset(?:-|$) -> ringOffsetColor
    const { section = (camelize(match[0]).replace('-', '') + 'Color') as Section } = options

    // extract color and opacity
    // rose-500                  -> ['rose-500']
    // [hsl(0_100%_/_50%)]       -> ['[hsl(0_100%_/_50%)]']
    // indigo-500/100            -> ['indigo-500', '100']
    // [hsl(0_100%_/_50%)]/[.25] -> ['[hsl(0_100%_/_50%)]', '[.25]']
    if (!/^(\[[^\]]+]|[^/]+?)(?:\/(.+))?$/.test(match.$$)) return

    const { $1: colorMatch, $2: opacityMatch } = RegExp

    const colorValue =
      (context.theme(section, colorMatch) as ColorValue) || arbitrary(colorMatch, section, context)

    if (!colorValue) return

    const {
      // text- -> --tw-text-opacity
      // ring-offset(?:-|$) -> --tw-ring-offset-opacity
      // TODO move this default into preset-tailwind?
      opacityVariable = `--tw-${match[0].replace(/-$/, '')}-opacity`,
      opacitySection = section.replace('Color', 'Opacity') as OpacitySection,
      property = section,
      selector,
    } = options

    const opacityValue =
      (context.theme(opacitySection, opacityMatch || 'DEFAULT') as string | undefined) ||
      (opacityMatch && arbitrary(opacityMatch, opacitySection, context))

    // if (typeof color != 'string') {
    //   console.warn(`Invalid color ${colorMatch} (from ${match.input}):`, color)
    //   return
    // }

    const create =
      resolve ||
      ((match) => {
        const properties: Record<string, string> = {}

        const color = match._.value

        if (opacityVariable && color.includes(opacityVariable)) {
          properties[opacityVariable] = opacityValue || '1'
        }

        properties[property] = color

        return (selector ? { [selector]: properties } : properties) as CSSObject
      })

    ;(match as ThemeMatchResult<ColorFromThemeValue>)._ = {
      value: toColorValue(colorValue, {
        opacityVariable: opacityVariable || undefined,
        opacityValue: opacityValue || undefined,
      }),
      color: (options) => toColorValue(colorValue, options),
    }

    let properties = create(match as ThemeMatchResult<ColorFromThemeValue>, context)

    // auto support dark mode colors
    if (!match.dark) {
      const darkColorValue = context.d(section, colorMatch, colorValue)

      if (darkColorValue && darkColorValue !== colorValue) {
        ;(match as ThemeMatchResult<ColorFromThemeValue>)._ = {
          value: toColorValue(darkColorValue, {
            opacityVariable: opacityVariable || undefined,
            opacityValue: opacityValue || undefined,
          }),
          color: (options) => toColorValue(darkColorValue, options),
        }

        properties = {
          '&': properties,
          [context.v('dark')]: create(match as ThemeMatchResult<ColorFromThemeValue>, context),
        } as CSSObject
      }
    }

    return properties
  }
}

export function arbitrary<Theme extends BaseTheme = BaseTheme>(
  value: string,
  section: string,
  context: Context<Theme>,
): string | undefined {
  if (value[0] == '[' && value.slice(-1) == ']') {
    value = resolveThemeFunction(value.slice(1, -1), context)

    // TODO remove arbitrary type prefix — we do not need it but user may use it
    // https://github.com/tailwindlabs/tailwindcss/blob/master/src/util/dataTypes.js
    // url, number, percentage, length, line-width, shadow, color, image, gradient, position, family-name, lookup, any, generic-name, absolute-size, relative-size

    // If this is a color section and the value is a hex color, color function or color name
    if (/color|fill|stroke/i.test(section)) {
      // Respect color type hint from the user on ambiguous arbitrary values - https://tailwindcss.com/docs/adding-custom-styles#resolving-ambiguities
      if (value.startsWith('color:')) return value.replace(/^color:/, '')

      if (/^(#|((hsl|rgb)a?|hwb|lab|lch|color)\(|[a-z]+$)/.test(value)) {
        return value
      }
    } else if (/image/i.test(section)) {
      // url(, [a-z]-gradient(, image(, cross-fade(, image-set(
      if (/^[a-z-]+\(/.test(value)) {
        return value
      }
    } else {
      // TODO how to differentiate arbitary values for
      // - backgroundSize vs backgroundPosition
      // - fontWeight vs fontFamily

      if (value.includes('calc(')) {
        value = value.replace(
          /(-?\d*\.?\d(?!\b-.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g,
          '$1 $2 ',
        )
      }

      // Convert `_` to ` `, except for escaped underscores `\_` but not between brackets
      return value
        .replace(
          /(^|[^\\])_+(?![^(]*\))/g,
          (fullMatch, characterBefore: string) =>
            characterBefore + ' '.repeat(fullMatch.length - 1),
        )
        .replace(/\\_(?![^(]*\))/g, '_')
    }
  }
}

function camelize(value: string): string {
  return value.replace(/-./g, (x) => x[1].toUpperCase())
}
