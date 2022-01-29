/* eslint-disable @typescript-eslint/no-explicit-any */
import type * as CSS from 'csstype'

export type Falsey = false | null | undefined | void | ''

export type MaybeArray<T> = T | T[]
export type MaybeThunk<T, Theme extends BaseTheme = BaseTheme> =
  | T
  | ((context: Context<Theme>) => T)

// TODO read possible screen values from theme
// TODO read possible keyframes values from theme
type TypedAtRulesKeys =
  | `@layer ${'defaults' | 'base' | 'components' | 'shortcuts' | 'utilities' | 'overrides'}`
  | `@media screen(${string})`
  | `@media ${string}`
  | `@keyframes ${string}`

export type TypedAtRules = {
  [key in TypedAtRulesKeys]?: key extends `@layer ${string}` ? MaybeArray<CSSBase> : CSSBase
}

export interface BaseProperties extends TypedAtRules {
  '@import'?: MaybeArray<string | Falsey>
  '@font-face'?: CSSFontFace
}
export interface CustomProperties {
  label?: string
  '@apply'?: string | Falsey
}

export type CSSProperties = CSS.PropertiesFallback<string | Falsey, string | Falsey> &
  CSS.PropertiesHyphenFallback<string | Falsey, string | Falsey> &
  Partial<CustomProperties>

export type CSSFontFace = CSS.AtRule.FontFaceFallback & CSS.AtRule.FontFaceHyphenFallback

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CSSNested extends Record<string, CSSProperties | CSSObject | string | Falsey> {}

export type CSSBase = BaseProperties & CSSNested

export type CSSObject = CSSProperties & CSSBase

export type CSSValue = string | number | bigint | Falsey | StringLike

export type StringLike = { toString(): string } & string

export type Preflight = CSSBase | string

export interface TwindRule {
  /** The calculated precedence taking all variants into account. */
  p: number

  /* The precedence of the properties within {@link d}. */
  o: number

  /** Additional classNames to propagate, does not include name */
  c?: string

  /** The rulesets (selectors and at-rules). expanded variants `@media ...`, `@supports ...`, `&:focus`, `.dark &` */
  r: string[]

  /** The name to use for `&` expansion in selectors. Maybe empty for at-rules like `@import`, `@font-face`, `@media`, ... */
  n?: string

  /** The stringified declarations. */
  d?: string
}

export interface Twind<Theme extends BaseTheme = BaseTheme, Target = unknown> {
  (tokens: string): string

  readonly target: Target

  theme: ThemeFunction<ExtractUserTheme<Theme>>

  /** Clears all CSS rules from the sheet. */
  clear(): void
  destroy(): void
}

export interface Context<Theme extends BaseTheme = BaseTheme> {
  /** Allows to resolve theme values. */
  theme: ThemeFunction<Theme>

  /** escapes given string for use in a CSS selector or variable */
  e: (value: string) => string

  /** create hash of given string — may be no-op eg returning the same input */
  h: (value: string) => string

  /**
   * resolves a variant
   *
   * @private
   */
  v(value: string): string

  /**
   * resolves a rule
   *
   * @private
   */
  r(value: string): RuleResult

  /**
   * stringifies a CSS property and value to a declaration
   *
   * @private
   */
  s(property: string, value: string): string
}

// Get the leaf theme value and omit nested records like for colors
export type ThemeValue<T> = T extends Record<string, infer V> ? Exclude<V, Record<string, V>> : T

export type KebabCase<S> = S extends `${infer C}${infer T}`
  ? KebabCase<T> extends infer U
    ? U extends string
      ? T extends Uncapitalize<T>
        ? `${Uncapitalize<C>}${U}`
        : `${Uncapitalize<C>}-${U}`
      : never
    : never
  : S

export interface ThemeFunction<Theme extends BaseTheme = BaseTheme> {
  (): Theme

  <Section extends keyof Theme & string>(section: Section | KebabCase<Section>): Theme[Section]

  <Section extends keyof Theme & string, Key extends keyof Theme[Section]>(
    section: Section | KebabCase<Section>,
    key: Key,
  ): ThemeValue<Theme[Section]> | undefined

  <Section extends keyof Theme & string>(section: Section | KebabCase<Section>, key: string):
    | ThemeValue<Theme[Section]>
    | undefined

  <Section extends keyof Theme & string, Key extends keyof Theme[Section]>(
    section: Section | KebabCase<Section>,
    key: Key,
    defaultValue: ThemeValue<Theme[Section]>,
  ): ThemeValue<Theme[Section]>

  <Section extends keyof Theme & string>(
    section: Section | KebabCase<Section>,
    key: string,
    defaultValue: ThemeValue<Theme[Section]>,
  ): ThemeValue<Theme[Section]>

  // TODO deep path from theme: https://github.com/ghoullier/awesome-template-literal-types#dot-notation-string-type-safe
  <Section extends keyof Theme & string>(key: `${Section}.${string}`): ThemeValue<Theme[Section]>

  <Section extends keyof Theme & string>(
    key: `${Section}.${string}`,
    defaultValue: ThemeValue<Theme[Section]>,
  ): ThemeValue<Theme[Section]>

  // (section: string): unknown | undefined
  // (section: string, key: string): unknown | string | undefined
  // <T>(section: string, key: string, defaultValue: T): T | string
  // <T>(key: string, defaultValue: T): T | string
}

export type RuleResult = string | CSSObject | Falsey | Partial<TwindRule>[]

export type RuleResolver<Theme extends BaseTheme = BaseTheme> = (
  match: MatchResult,
  context: Context<Theme>,
) => RuleResult

export type Rule<Theme extends BaseTheme = BaseTheme> =
  | string
  | RegExp
  | [pattern: MaybeArray<string | RegExp>, alias: string]
  | [pattern: MaybeArray<string | RegExp>, css: CSSObject]
  | [pattern: MaybeArray<string | RegExp>, resolve: RuleResolver<Theme>]
  | [pattern: MaybeArray<string | RegExp>, property: keyof CSSProperties]
  | [
      pattern: MaybeArray<string | RegExp>,
      property: keyof CSSProperties,
      // Default to first matched group
      convert: MatchConverter<Theme>,
    ]

export type VariantResult = string | Falsey

export type VariantResolver<Theme extends BaseTheme = BaseTheme> = (
  match: MatchResult,
  context: Context<Theme>,
) => VariantResult

export type Variant<Theme extends BaseTheme = BaseTheme> = [
  condition: MaybeArray<string | RegExp>,
  resolve: string | VariantResolver<Theme>,
]

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/n
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MatchResult = RegExpExecArray & {
  // /** The input string */
  // $_: string

  // /** The matched string */
  // $0: string

  // /** The first matched group */
  // $1: string

  // /** The second matched group */
  // $2: string

  // /** The third matched group */
  // $3: string

  // /** The fourth matched group */
  // $4: string

  // /** The fifth matched group */
  // $5: string

  // /** The sixth matched group */
  // $6: string

  // /** The seventh matched group */
  // $7: string

  // /** The eigth matched group */
  // $8: string

  // /** The nineth matched group */
  // $9: string

  /** The substring following the most recent match */
  $$: string

  /** Can be used to propagate a value like a theme value */
  // _: Value
}

export interface Sheet<Target = unknown> {
  readonly target: Target
  insert(css: string, index: number, rule: TwindRule): void
  /** Clears all CSS rules from the sheet. */
  clear(): void
  destroy(): void
}

export type StringifyDeclaration<Theme extends BaseTheme = BaseTheme> = (
  property: string,
  value: string,
  context: Context<Theme>,
) => string

export type PreflightThunk<Theme extends BaseTheme = BaseTheme> = (
  context: Context<Theme>,
) => Preflight | Falsey

export type HashFunction = (value: string, defaultHash: (value: string) => string) => string

export type DarkModeConfig = 'media' | 'class' | string | boolean | undefined

export interface TwindConfig<Theme extends BaseTheme = BaseTheme> {
  /** Allows to change how the `dark` variant is used (default: `"media"`) */
  darkMode?: DarkModeConfig

  theme: ThemeConfig<Theme>

  preflight: false | MaybeThunk<Preflight | Falsey, Theme>[]
  variants: Variant<Theme>[]
  rules: Rule<Theme>[]

  hash?: boolean | undefined | HashFunction
  stringify: StringifyDeclaration<Theme>
  ignorelist: (string | RegExp)[]
}

type ArrayType<T> = T extends (infer Item)[] ? Item : T
type ExtractTheme<T> = T extends Preset<infer Theme> ? Theme : T
type ExtractUserTheme<T> = {
  [key in keyof T]: key extends 'extend'
    ? never
    : T[key] extends ThemeSectionResolver<infer Value, T & BaseTheme>
    ? Value
    : T[key]
} & BaseTheme

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

export type ExtractThemes<Theme, Presets extends Preset<any>[]> = UnionToIntersection<
  ExtractTheme<ExtractUserTheme<Theme> | BaseTheme | ArrayType<Presets>>
>

export interface TwindPresetConfig<Theme = BaseTheme> {
  /** Allows to change how the `dark` variant is used (default: `"media"`) */
  darkMode?: DarkModeConfig

  theme?: ThemeConfig<Theme & BaseTheme>

  preflight?: false | MaybeArray<Preflight | PreflightThunk<Theme & BaseTheme>>
  variants?: Variant<Theme & BaseTheme>[]
  rules?: Rule<Theme & BaseTheme>[]

  hash?: boolean | undefined | HashFunction
  stringify?: StringifyDeclaration<Theme & BaseTheme>
  ignorelist?: (string | RegExp)[]
}

export interface TwindUserConfig<Theme = BaseTheme, Presets extends Preset<any>[] = Preset[]> {
  presets?: Presets

  /** Allows to change how the `dark` variant is used (default: `"media"`) */
  darkMode?: DarkModeConfig

  theme?: Theme | ThemeConfig<BaseTheme & ExtractThemes<Theme, Presets>>

  preflight?:
    | false
    | MaybeArray<Preflight | PreflightThunk<BaseTheme & ExtractThemes<Theme, Presets>>>
  variants?: Variant<BaseTheme & ExtractThemes<Theme, Presets>>[]
  rules?: Rule<BaseTheme & ExtractThemes<Theme, Presets>>[]

  /**
   * Enables hashing of all classes (default: `false`).
   *
   * If a function is given it can be used to hash only certain classes:
   *
   * ```js
   * {
   *   hash(className, defaultHash) {
   *     if (/^[\w-]*~\(/.test(className)) {
   *       // a shortcut like `~(...)` or `Button~(...)`
   *       return defaultHash(className)
   *     }
   *     return className
   *   }
   * }
   *```
   */
  hash?: boolean | undefined | HashFunction

  stringify?: StringifyDeclaration<BaseTheme & ExtractThemes<Theme, Presets>>
  ignorelist?: MaybeArray<string | RegExp>
}

export interface BaseTheme {
  screens: Record<string, MaybeArray<ScreenValue>>
  colors: Record<string, MaybeColorValue>
}

export type ScreenValue =
  | string
  | { raw: string }
  | { min: string; max?: string }
  | { min?: string; max: string }

export interface ColorFunctionOptions {
  opacityVariable?: string | undefined
  opacityValue?: string | undefined
}

export type ColorFunction = (options: ColorFunctionOptions) => string

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ColorRecord extends Record<string, MaybeColorValue> {
  /* empty */
}

export type ColorValue = string | ColorFunction

export type MaybeColorValue = ColorValue | ColorRecord

export interface ThemeSectionResolverContext<Theme extends BaseTheme = BaseTheme> {
  readonly colors: Theme['colors']

  readonly theme: ThemeFunction<Theme>
  /**
   * No-op function as negated values are automatically infered and do _not_ need to be in the theme.
   */
  readonly negative: (scale: Record<string, string>) => Record<string, string>
  readonly breakpoints: (screens: Record<string, MaybeArray<ScreenValue>>) => Record<string, string>
}

export interface ThemeSectionResolver<Value, Theme extends BaseTheme = BaseTheme> {
  (context: ThemeSectionResolverContext<Theme>): Value
}

export type ThemeSection<Value, Theme extends BaseTheme = BaseTheme> =
  | Value
  | ThemeSectionResolver<Value, Theme>

export type PartialTheme<Theme extends BaseTheme = BaseTheme> = {
  [Section in keyof Theme]?: ThemeSection<Theme[Section], Theme>
}

export type ThemeConfig<Theme extends BaseTheme = BaseTheme> = PartialTheme<Theme> & {
  extend?: PartialTheme<Theme>
}

export type MatchConverter<Theme extends BaseTheme = BaseTheme> = (
  match: MatchResult,
  context: Context<Theme>,
) => string

export interface PresetThunk<Theme = BaseTheme> {
  (config: TwindConfig<Theme & BaseTheme>): TwindPresetConfig<Theme>
}

export type Preset<Theme = BaseTheme> = TwindPresetConfig<Theme> | PresetThunk<Theme>

export interface ClassObject {
  [key: string]: boolean | number | unknown
}

export type Class = string | number | boolean | Falsey | ClassObject | Class[]

export type NestedFunction = (
  strings: TemplateStringsArray | Class,
  ...interpolations: Class[]
) => string

export type Nested = NestedFunction & {
  [label: string]: NestedFunction
}
