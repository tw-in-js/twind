import type { CSSProperties } from './css'
import type { Context } from './twind'
import type { MaybeArray } from './util'

export interface ThemeResolver {
  <Section extends keyof Theme>(section: Section): Record<string, ThemeSectionType<Theme[Section]>>

  <Section extends keyof Theme>(keypath: `${Section}.${string}`):
    | ThemeSectionType<Theme[Section]>
    | undefined

  <Section extends keyof Theme>(
    keypath: `${Section}.${string}`,
    defaultValue: NonNullable<ThemeSectionType<Theme[Section]>>,
  ): NonNullable<ThemeSectionType<Theme[Section]>>

  <Section extends keyof Theme>(section: Section, key: string | string[]):
    | ThemeSectionType<Theme[Section]>
    | undefined

  <Section extends keyof Theme>(
    section: Section,
    key: string | string[],
    defaultValue: NonNullable<ThemeSectionType<Theme[Section]>>,
  ): NonNullable<ThemeSectionType<Theme[Section]>>
}

export interface ThemeHelper {
  <Section extends keyof Theme>(section: Section): (
    context: Context,
  ) => Record<string, ThemeSectionType<Theme[Section]>>

  <Section extends keyof Theme>(keypath: `${Section}.${string}`): (
    context: Context,
  ) => ThemeSectionType<Theme[Section]> | undefined

  <Section extends keyof Theme>(
    keypath: `${Section}.${string}`,
    defaultValue: NonNullable<ThemeSectionType<Theme[Section]>>,
  ): (context: Context) => NonNullable<ThemeSectionType<Theme[Section]>>

  <Section extends keyof Theme>(section: Section, key: string | string[]): (
    context: Context,
  ) => ThemeSectionType<Theme[Section]> | undefined

  <Section extends keyof Theme>(
    section: Section,
    key: string | string[],
    defaultValue: NonNullable<ThemeSectionType<Theme[Section]>>,
  ): (context: Context) => NonNullable<ThemeSectionType<Theme[Section]>>
}

export type Unwrap<T> = T extends string[] ? string : T extends Record<string, infer R> ? R : T

export type ThemeSectionType<T> = T extends ThemeSection<infer R>
  ? Unwrap<R>
  : Exclude<T, ThemeSectionResolver<T>>

export interface ThemeSectionResolverContext {
  /**
   * No-op function as negated values are automatically infered and do _not_ not to be in the theme.
   */
  readonly negative: (
    records: Record<string, string | undefined>,
  ) => Record<string, string | undefined>

  readonly breakpoints: (
    records: Record<string, ThemeScreen | undefined>,
  ) => Record<string, string | undefined>
}

export type ThemeSectionRecord<T = string> = Record<string, T | undefined>

export type ThemeSectionResolver<T = string> = (
  theme: ThemeResolver,
  context: ThemeSectionResolverContext,
) => ThemeSectionRecord<T>

export type ThemeSection<T = string> = ThemeSectionRecord<T> | ThemeSectionResolver<T>

export interface ThemeContainer {
  screens?: Record<string, string | undefined>
  center?: boolean
  padding?: string | Record<string, string | undefined>
}

export type ThemeScreenValue =
  | string
  | { raw: string }
  | { min: string; max?: string }
  | { min?: string; max: string }

export type ThemeScreen = MaybeArray<ThemeScreenValue>

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ThemeColorObject extends Record<string, ThemeColor> {
  /* empty */
}

export type ThemeColor = string | ThemeColorObject

export type ThemeFontSize =
  | string
  | [size: string, lineHeight: string]
  | [size: string, options: { lineHeight?: string; letterSpacing?: string }]

export type ThemeOutline = [outline: string, offset: string] | string[]

export interface Theme {
  colors: ThemeSection<ThemeColor>
  spacing: ThemeSection
  durations: ThemeSection<string | string[]>

  screens: ThemeSection<ThemeScreen>

  animation: ThemeSection<string | string[]>
  backdropBlur: ThemeSection
  backdropBrightness: ThemeSection
  backdropContrast: ThemeSection
  backdropGrayscale: ThemeSection
  backdropHueRotate: ThemeSection
  backdropInvert: ThemeSection
  backdropOpacity: ThemeSection
  backdropSaturate: ThemeSection
  backdropSepia: ThemeSection
  backgroundColor: ThemeSection<ThemeColor>
  backgroundImage: ThemeSection<string | string[]>
  backgroundOpacity: ThemeSection
  backgroundPosition: ThemeSection
  backgroundSize: ThemeSection
  blur: ThemeSection
  borderColor: ThemeSection<ThemeColor>
  borderOpacity: ThemeSection
  borderRadius: ThemeSection
  borderWidth: ThemeSection
  boxShadow: ThemeSection<string | string[]>
  brightness: ThemeSection
  container: ThemeContainer | ThemeSectionResolver<ThemeContainer>
  contrast: ThemeSection
  cursor: ThemeSection
  divideColor: ThemeSection<ThemeColor>
  divideOpacity: ThemeSection
  divideWidth: ThemeSection
  dropShadow: ThemeSection<string | string[]>
  fill: ThemeSection<ThemeColor>
  flex: ThemeSection
  flexGrow: ThemeSection<number>
  flexShrink: ThemeSection<number>
  fontFamily: ThemeSection<string | string[]>
  fontSize: ThemeSection<ThemeFontSize>
  fontWeight: ThemeSection
  gap: ThemeSection
  gradientColorStops: ThemeSection<ThemeColor>
  grayscale: ThemeSection
  gridAutoColumns: ThemeSection
  gridAutoRows: ThemeSection
  gridColumn: ThemeSection
  gridColumnEnd: ThemeSection
  gridColumnStart: ThemeSection
  gridRow: ThemeSection
  gridRowEnd: ThemeSection
  gridRowStart: ThemeSection
  gridTemplateColumns: ThemeSection
  gridTemplateRows: ThemeSection
  height: ThemeSection
  hueRotate: ThemeSection
  inset: ThemeSection
  invert: ThemeSection
  keyframes: ThemeSection<Record<string, CSSProperties>>
  letterSpacing: ThemeSection
  lineHeight: ThemeSection
  listStyleType: ThemeSection
  margin: ThemeSection
  maxHeight: ThemeSection
  maxWidth: ThemeSection
  minHeight: ThemeSection
  minWidth: ThemeSection
  objectPosition: ThemeSection
  opacity: ThemeSection
  order: ThemeSection
  outline: ThemeSection<ThemeOutline>
  padding: ThemeSection
  placeholderColor: ThemeSection<ThemeColor>
  placeholderOpacity: ThemeSection
  ringColor: ThemeSection<ThemeColor>
  ringOffsetColor: ThemeSection<ThemeColor>
  ringOffsetWidth: ThemeSection
  ringOpacity: ThemeSection
  ringWidth: ThemeSection
  rotate: ThemeSection
  saturate: ThemeSection
  scale: ThemeSection
  sepia: ThemeSection
  skew: ThemeSection
  space: ThemeSection
  stroke: ThemeSection<ThemeColor>
  strokeWidth: ThemeSection
  textColor: ThemeSection<ThemeColor>
  textOpacity: ThemeSection
  transformOrigin: ThemeSection
  transitionDelay: ThemeSection<string | string[]>
  transitionDuration: ThemeSection<string | string[]>
  transitionProperty: ThemeSection<string | string[]>
  transitionTimingFunction: ThemeSection<string | string[]>
  translate: ThemeSection
  width: ThemeSection
  zIndex: ThemeSection
}
