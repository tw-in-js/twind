/**
 * [[include:packages/preset-typography/README.md]]
 *
 * @packageDocumentation
 * @module
 */

import { DEV } from 'distilt/env'
import {
  CSSNested,
  Preset,
  CustomProperties,
  CSSObject,
  Context,
  BaseTheme,
  ColorValue,
  RuleResolver,
  AutocompleteProvider,
  withAutocomplete,
} from 'twind'
import { toColorValue } from 'twind'

declare module 'twind' {
  export interface CustomProperties {
    '--tw-prose-body'?: string
    '--tw-prose-lead'?: string
    '--tw-prose-headings'?: string
    '--tw-prose-links'?: string
    '--tw-prose-bold'?: string
    '--tw-prose-counters'?: string
    '--tw-prose-bullets'?: string
    '--tw-prose-hr'?: string
    '--tw-prose-quote-borders'?: string
    '--tw-prose-captions'?: string
    '--tw-prose-code'?: string
    '--tw-prose-pre-code'?: string
    '--tw-prose-pre-bg'?: string
    '--tw-prose-th-borders'?: string
    '--tw-prose-td-borders'?: string
  }
}

export type FontSizeValue =
  | string
  | [size: string, lineHeight: string]
  | [size: string, options: { lineHeight?: string; letterSpacing?: string }]

export interface TypographyTheme extends BaseTheme {
  fontSize: Record<string, FontSizeValue>
}

export interface TypographyOptions {
  /**
   * The class name to use the typographic utilities.
   * To undo the styles to the elements, use it like
   * `not-${className}` which is by default `not-prose`.
   *
   * Note: `not` utility is only available in class.
   *
   * @defaultValue `prose`
   */
  className?: string

  /**
   * Default color to use.
   *
   * @defaultValue 'gray'
   */
  defaultColor?: string

  colors?: {
    /**
     * @defaultValue '700'
     */
    body?: string
    /**
     * @defaultValue '900'
     */
    headings?: string
    /**
     * @defaultValue '600'
     */
    lead?: string
    /**
     * @defaultValue '900'
     */
    links?: string
    /**
     * @defaultValue '900'
     */
    bold?: string
    /**
     * @defaultValue '500'
     */
    counters?: string
    /**
     * @defaultValue '300'
     */
    bullets?: string
    /**
     * @defaultValue '200'
     */
    hr?: string
    /**
     * @defaultValue '900'
     */
    quotes?: string
    /**
     * @defaultValue '200'
     */
    'quote-borders'?: string
    /**
     * @defaultValue '500'
     */
    captions?: string
    /**
     * @defaultValue '900'
     */
    code?: string
    /**
     * @defaultValue '200'
     */
    'pre-code'?: string
    /**
     * @defaultValue '800'
     */
    'pre-bg'?: string
    /**
     * @defaultValue '300'
     */
    'th-borders'?: string
    /**
     * @defaultValue '200'
     */
    'td-borders'?: string
    // invert colors (dark mode)
    dark?:
      | null
      | undefined
      | {
          /**
           * @defaultValue '300'
           */
          body?: string
          /**
           * @defaultValue '#fff'
           */
          headings?: string
          /**
           * @defaultValue '400'
           */
          lead?: string
          /**
           * @defaultValue '#fff'
           */
          links?: string
          /**
           * @defaultValue '#fff'
           */
          bold?: string
          /**
           * @defaultValue '400'
           */
          counters?: string
          /**
           * @defaultValue '600'
           */
          bullets?: string
          /**
           * @defaultValue '700'
           */
          hr?: string
          /**
           * @defaultValue '100'
           */
          quotes?: string
          /**
           * @defaultValue '700'
           */
          'quote-borders'?: string
          /**
           * @defaultValue '400'
           */
          captions?: string
          /**
           * @defaultValue '#fff'
           */
          code?: string
          /**
           * @defaultValue '300'
           */
          'pre-code'?: string
          /**
           * @defaultValue 'rgb(0 0 0 / 50%)'
           */
          'pre-bg'?: string
          /**
           * @defaultValue '600'
           */
          'th-borders'?: string
          /**
           * @defaultValue '700'
           */
          'td-borders'?: string
        }
  }

  /**
   * Extend or override CSS selectors with CSS declaration block.
   *
   * @defaultValue undefined
   */
  extend?: CSSNested
}

// indirection wrapper to remove autocomplete functions from production bundles
function withAutocomplete$(
  resolver: RuleResolver<TypographyTheme>,
  autocomplete: AutocompleteProvider<TypographyTheme> | false,
): RuleResolver<TypographyTheme> {
  if (DEV) {
    return withAutocomplete(resolver, autocomplete)
  }

  return resolver
}

/**
 * Twind Preset for Typography
 *
 * ```js
 * // twind.config.js
 * import { defineConfig } from 'twind'
 * import presetTypography from '@twind/preset-typography'
 *
 * export default defineConfig({
 *   presets: [
 *     presetTypography(),
 *   ],
 * })
 * ```
 *
 * @returns typography preset
 */
export default function presetTypography({
  className = 'prose',
  defaultColor = 'gray',
  extend = {},
  colors = {},
}: TypographyOptions = {}): Preset<TypographyTheme> {
  colors = {
    body: '700',
    headings: '900',
    lead: '600',
    links: '900',
    bold: '900',
    counters: '500',
    bullets: '300',
    hr: '200',
    quotes: '900',
    'quote-borders': '200',
    captions: '500',
    code: '900',
    'pre-code': '200',
    'pre-bg': '800',
    'th-borders': '300',
    'td-borders': '200',
    ...colors,
    // invert colors (dark mode)
    dark:
      colors.dark === null
        ? null
        : {
            body: '300',
            headings: '#fff',
            lead: '400',
            links: '#fff',
            bold: '#fff',
            counters: '400',
            bullets: '600',
            hr: '700',
            quotes: '100',
            'quote-borders': '700',
            captions: '400',
            code: '#fff',
            'pre-code': '300',
            'pre-bg': 'rgb(0 0 0 / 50%)',
            'th-borders': '600',
            'td-borders': '700',
            ...colors.dark,
          },
  }
  return {
    // for element modifiers: prose-img:rounded-xl, prose-headings
    // & :is()
    // & :is(:where(code):not(:where([class~="not-prose"] *)))

    variants: [
      ['headings', 'h1,h2,h3,h4,th'],
      ['lead', '.lead'],
      ['h1'],
      ['h2'],
      ['h3'],
      ['h4'],
      ['p'],
      ['a'],
      ['blockquote'],
      ['figure'],
      ['figcaption'],
      ['strong'],
      ['em'],
      ['code'],
      ['pre'],
      ['ol'],
      ['ul'],
      ['li'],
      ['table'],
      ['thead'],
      ['tr'],
      ['th'],
      ['td'],
      ['img'],
      ['video'],
      ['hr'],
    ].map(([name, selector = name]) => [
      `${className}-${name}`,
      (_, context) =>
        adjustSelector(
          className,
          selector[0] == '.' ? '.' + context.e(context.h(selector.slice(1))) : selector,
          context,
          (selector) => `& :is(${selector.trim()})`,
        ),
    ]),

    rules: [
      // marker classes lead and not-prose
      [`(lead|not-${className})`, ({ 1: $1 }, { h }) => [{ c: h($1) }]],

      [
        `${className}-invert`,
        {
          '@layer defaults': {
            '--tw-prose-body': 'var(--tw-prose-invert-body)',
            '--tw-prose-headings': 'var(--tw-prose-invert-headings)',
            '--tw-prose-lead': 'var(--tw-prose-invert-lead)',
            '--tw-prose-links': 'var(--tw-prose-invert-links)',
            '--tw-prose-bold': 'var(--tw-prose-invert-bold)',
            '--tw-prose-counters': 'var(--tw-prose-invert-counters)',
            '--tw-prose-bullets': 'var(--tw-prose-invert-bullets)',
            '--tw-prose-hr': 'var(--tw-prose-invert-hr)',
            '--tw-prose-quotes': 'var(--tw-prose-invert-quotes)',
            '--tw-prose-quote-borders': 'var(--tw-prose-invert-quote-borders)',
            '--tw-prose-captions': 'var(--tw-prose-invert-captions)',
            '--tw-prose-code': 'var(--tw-prose-invert-code)',
            '--tw-prose-pre-code': 'var(--tw-prose-invert-pre-code)',
            '--tw-prose-pre-bg': 'var(--tw-prose-invert-pre-bg)',
            '--tw-prose-th-borders': 'var(--tw-prose-invert-th-borders)',
            '--tw-prose-td-borders': 'var(--tw-prose-invert-td-borders)',
          },
        },
      ],

      // for type scale: prose-xl
      [
        className + '-',
        withAutocomplete$(({ $$ }, context) => {
          const css = getFontSize(context.theme('fontSize', $$))
          return css && { '@layer components': css }
        }, DEV && ((_, { theme }) => Object.keys(theme('fontSize')))),
      ],

      // for colors: prose-sky
      [
        className + '-',
        withAutocomplete$(
          ({ $$ }, context) => getColors($$, context),
          DEV &&
            ((_, { theme }) =>
              Object.keys(theme('colors')).filter(
                (key) => key && key != 'DEFAULT' && !/[.-]/.test(key),
              )),
        ),
      ],

      // prose
      [
        className,
        (_, context) =>
          ({
            // layer defaults
            ...getColors(defaultColor, context),
            '@layer base': [
              adjustSelectors(className, context, {
                a: {
                  color: 'var(--tw-prose-links)',
                  textDecorationLine: 'underline',
                  fontWeight: '500',
                },
                strong: {
                  color: 'var(--tw-prose-bold)',
                  fontWeight: '600',
                },
                ul: {
                  listStyleType: 'disc',
                },
                ol: {
                  listStyleType: 'decimal',
                },
                'ol[type="A"]': {
                  listStyleType: 'upper-alpha',
                },
                'ol[type="a"]': {
                  listStyleType: 'lower-alpha',
                },
                'ol[type="A" s]': {
                  listStyleType: 'upper-alpha',
                },
                'ol[type="a" s]': {
                  listStyleType: 'lower-alpha',
                },
                'ol[type="I"]': {
                  listStyleType: 'upper-roman',
                },
                'ol[type="i"]': {
                  listStyleType: 'lower-roman',
                },
                'ol[type="I" s]': {
                  listStyleType: 'upper-roman',
                },
                'ol[type="i" s]': {
                  listStyleType: 'lower-roman',
                },
                'ol[type="1"]': {
                  listStyleType: 'decimal',
                },
                'ol,ul': {
                  marginTop: em(20, 16),
                  marginBottom: em(20, 16),
                  paddingLeft: em(26, 16),
                },
                li: {
                  marginTop: em(8, 16),
                  marginBottom: em(8, 16),
                },
                'ol>li,ul>li': {
                  paddingLeft: em(6, 16),
                },
                '>ul>li p': {
                  marginTop: em(12, 16),
                  marginBottom: em(12, 16),
                },
                '>ul>li>*:first-child,>ol>li>*:last-child': {
                  marginTop: em(20, 16),
                },
                '>ul>li>*:last-child,>ol>li>*:last-child': {
                  marginBottom: em(20, 16),
                },
                'ol>li::marker': {
                  fontWeight: '400',
                  color: 'var(--tw-prose-counters)',
                },
                'ul>li::marker': {
                  color: 'var(--tw-prose-bullets)',
                },
                'ul ul,ul ol,ol ul,ol ol': {
                  marginTop: em(12, 16),
                  marginBottom: em(12, 16),
                },
                hr: {
                  borderColor: 'var(--tw-prose-hr)',
                  borderTopWidth: '1',
                  marginTop: em(48, 16),
                  marginBottom: em(48, 16),
                },
                blockquote: {
                  marginTop: em(32, 20),
                  marginBottom: em(32, 20),
                  paddingLeft: em(20, 20),
                  fontWeight: '500',
                  fontStyle: 'italic',
                  color: 'var(--tw-prose-quotes)',
                  borderLeftWidth: '0.25rem',
                  borderLeftColor: 'var(--tw-prose-quote-borders)',
                  quotes: '"\\201C""\\201D""\\2018""\\2019"',
                },
                'blockquote p:first-of-type::before': {
                  content: 'open-quote',
                },
                'blockquote p:last-of-type::after': {
                  content: 'close-quote',
                },
                p: {
                  marginTop: em(20, 16),
                  marginBottom: em(20, 16),
                },
                h1: {
                  color: 'var(--tw-prose-headings)',
                  fontWeight: '800',
                  fontSize: em(36, 16),
                  marginTop: '0',
                  marginBottom: em(32, 36),
                  lineHeight: 1.15,
                },
                'h1 strong': {
                  fontWeight: '900',
                },
                h2: {
                  color: 'var(--tw-prose-headings)',
                  fontWeight: '700',
                  fontSize: em(24, 16),
                  marginTop: em(48, 24),
                  marginBottom: em(24, 24),
                  lineHeight: '1.35',
                },
                'h2 strong': {
                  fontWeight: '800',
                },
                h3: {
                  color: 'var(--tw-prose-headings)',
                  fontWeight: '600',
                  fontSize: em(20, 16),
                  marginTop: em(32, 20),
                  marginBottom: em(12, 20),
                  lineHeight: '1.6',
                },
                'h3 strong': {
                  fontWeight: '700',
                },
                h4: {
                  color: 'var(--tw-prose-headings)',
                  fontWeight: '600',
                  marginTop: em(24, 16),
                  marginBottom: em(8, 16),
                  lineHeight: '1.5',
                },
                'h4 strong': {
                  fontWeight: '700',
                },
                'hr+*,h2+*,h3+*,h4+*': {
                  marginTop: '0',
                },
                'img,video,figure': {
                  marginTop: em(32, 16),
                  marginBottom: em(32, 16),
                },
                'figure>*': {
                  marginTop: '0',
                  marginBottom: '0',
                },
                figcaption: {
                  color: 'var(--tw-prose-captions)',
                  fontSize: em(14, 16),
                  lineHeight: '1.4',
                  marginTop: em(12, 14),
                },
                code: {
                  color: 'var(--tw-prose-code)',
                  fontWeight: '600',
                  fontSize: em(14, 16),
                },
                'code::before,code::after': {
                  content: '"`"',
                },
                'h2 code': {
                  fontSize: em(21, 24),
                },
                'h3 code': {
                  fontSize: em(18, 20),
                },
                'a code': {
                  color: 'var(--tw-prose-links)',
                },
                pre: {
                  color: 'var(--tw-prose-pre-code)',
                  backgroundColor: 'var(--tw-prose-pre-bg)',
                  overflowX: 'auto',
                  fontWeight: '400',
                  fontSize: em(14, 16),
                  lineHeight: '1.7',
                  marginTop: em(24, 14),
                  marginBottom: em(24, 14),
                  borderRadius: '0.375rem',
                  paddingTop: em(12, 14),
                  paddingRight: em(16, 14),
                  paddingBottom: em(12, 14),
                  paddingLeft: em(16, 14),
                },
                'pre code': {
                  backgroundColor: 'transparent',
                  borderWidth: '0',
                  borderRadius: '0',
                  padding: '0',
                  fontWeight: 'inherit',
                  color: 'inherit',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  lineHeight: 'inherit',
                },
                'pre code::before': {
                  content: 'none',
                },
                'pre code::after': {
                  content: 'none',
                },
                table: {
                  width: '100%',
                  tableLayout: 'auto',
                  textAlign: 'left',
                  marginTop: em(32, 16),
                  marginBottom: em(32, 16),
                  fontSize: em(14, 16),
                  lineHeight: '1.7',
                },
                thead: {
                  borderBottomWidth: '1px',
                  borderBottomColor: 'var(--tw-prose-th-borders)',
                },
                'thead th': {
                  color: 'var(--tw-prose-headings)',
                  fontWeight: '600',
                  verticalAlign: 'bottom',
                  paddingRight: em(8, 14),
                  paddingBottom: em(8, 14),
                  paddingLeft: em(8, 14),
                },
                'thead th:first-child': {
                  paddingLeft: '0',
                },
                'thead th:last-child': {
                  paddingRight: '0',
                },
                'tbody tr': {
                  borderBottomWidth: '1px',
                  borderBottomColor: 'var(--tw-prose-td-borders)',
                },
                'tbody tr:last-child': {
                  borderBottomWidth: '0',
                },
                'tbody td': {
                  verticalAlign: 'baseline',
                  paddingTop: em(8, 14),
                  paddingRight: em(8, 14),
                  paddingBottom: em(8, 14),
                  paddingLeft: em(8, 14),
                },
                'tbody td:first-child': {
                  paddingLeft: '0',
                },
                'tbody td:last-child': {
                  paddingRight: '0',
                },
                [`.${context.e(context.h('lead'))}`]: {
                  color: 'var(--tw-prose-lead)',
                  fontSize: em(20, 16),
                  lineHeight: '1.6',
                  marginTop: em(24, 20),
                  marginBottom: em(24, 20),
                },
                '>:first-child': {
                  marginTop: '0',
                },
                '>:last-child': {
                  marginBottom: '0',
                },
              }),
              adjustSelectors(className, context, extend),
            ],
            '@layer components': {
              ...getFontSize(context.theme('fontSize', 'base')),
              color: 'var(--tw-prose-body)',
              maxWidth: 'theme(max-w.prose, 65ch)',
            },
          } as CSSObject),
      ],
    ],
  }

  function getColors<Theme extends BaseTheme>(
    colorName: string,
    context: Context<Theme>,
  ): CSSObject | undefined {
    const properties: CustomProperties = {}
    const darkProperties: CustomProperties = {}

    const set = (key: string, shade: string, target: CustomProperties) => {
      const color = context.theme(`colors.${colorName}.${shade}`, shade) as ColorValue

      target[('--tw-prose-' + key) as keyof CustomProperties] = toColorValue(color)

      // support auto dark colors
      const darkColor =
        target != darkProperties && context.d('colors', `${colorName}.${shade}`, color)

      if (darkColor) {
        darkProperties[('--tw-prose-' + key) as keyof CustomProperties] = toColorValue(darkColor)
      }
    }

    for (const key in colors) {
      const shade = colors[key as keyof typeof colors]

      if (key != 'dark' && shade) {
        set(key, shade as string, properties)
      }
    }

    for (const key in colors.dark || {}) {
      const shade = (colors.dark as Record<string, string>)[key]

      if (shade) {
        if (colors.dark) {
          // explicit dark colors - need to use `dark:prose-invert`
          set('invert-' + key, shade, properties)
        } else {
          // auto dark colors
          set(key, shade, darkProperties)
        }
      }
    }

    return Object.keys(properties).length
      ? ({
          '@layer defaults': {
            '&': properties,
            [context.v('dark') as string]: darkProperties,
          } as CSSNested,
        } as CSSObject)
      : undefined
  }
}

function adjustSelectors<Theme extends BaseTheme>(
  className: string,
  context: Context<Theme>,
  css: CSSNested,
): CSSNested {
  const result: CSSNested = {}

  for (const selector in css) {
    result[
      adjustSelector(
        className,
        selector,
        context,
        (selector) => `.${context.e(context.h(className))}${selector}`,
      )
    ] = css[selector]
  }

  return result
}

function adjustSelector<Theme extends BaseTheme>(
  className: string,
  selector: string,
  { e, h }: Context<Theme>,
  replace: (selector: string) => string,
): string {
  // pseudo elements can't be matched
  return selector.replace(
    // 1. if there no pseudo use whole selector
    // 2. if there are pseudo replace prefix
    /^[^>:]+$|(>)?((?:[^:,]+(?::[\w-]+)?)|:[\w-]+)(::[\w-]+)?/g,
    (_, prefix = ' ', selector = _, pseudoElement = '') =>
      replace(
        `${prefix}:where(${selector}):not(:where(.${e(h('not-' + className))} *))${pseudoElement}`,
      ),
  )
}

function getFontSize(_: FontSizeValue | undefined): CSSObject | undefined {
  return _
    ? typeof _ == 'string'
      ? { fontSize: _ }
      : {
          fontSize: _[0],
          ...(typeof _[1] == 'string' ? { lineHeight: _[1] } : _[1]),
        }
    : undefined
}

function em(px: number, base: number) {
  return `${(px / base).toFixed(3).replace(/^0|\.?0+$/g, '')}em`
}
