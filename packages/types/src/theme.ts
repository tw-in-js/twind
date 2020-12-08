import type { CSSAtKeyframes } from './css'

export interface ThemeResolver {
  <Section extends keyof Theme>(section: Section): Record<string, ThemeSectionType<Theme[Section]>>

  <Section extends keyof Theme>(section: Section, key: string | string[]):
    | ThemeSectionType<Theme[Section]>
    | undefined

  <Section extends keyof Theme>(
    section: Section,
    key: string | string[],
    defaultValue: NonNullable<ThemeSectionType<Theme[Section]>>,
  ): NonNullable<ThemeSectionType<Theme[Section]>>
}

export type Unwrap<T> = T extends string[] ? string : T extends Record<string, infer R> ? R : T

export type ThemeSectionType<T> = T extends ThemeSection<infer R> ? Unwrap<R> : never

export interface ThemeSectionResolverContext {
  readonly breakpoints: (
    records: Record<string, string | undefined>,
  ) => Record<string, string | undefined>
}

export type ThemeSectionRecord<T = string> = Record<string, T | undefined>

export type ThemeSectionResolver<T = string> = (
  theme: <T>(keypath: string, defaultValue?: T) => T,
  context: ThemeSectionResolverContext,
) => ThemeSectionRecord<T>

export type ThemeSection<T = string> = ThemeSectionRecord<T> | ThemeSectionResolver<T>

export type ThemeColor = string | Record<string, string>

export type ThemeFontSize =
  | string
  | [size: string, lineHeight: string]
  | [size: string, options: { lineHeight?: string; letterSpacing?: string }]

export type ThemeOutline = [outline: string, offset: string]

export interface Theme {
  colors: ThemeSection<ThemeColor>
  spacing: ThemeSection
  durations: ThemeSection<string | string[]>

  screens: ThemeSection

  animation: ThemeSection<string | string[]>
  backgroundColor: ThemeSection<ThemeColor>
  backgroundImage: ThemeSection<string | string[]>
  backgroundOpacity: ThemeSection
  borderColor: ThemeSection<ThemeColor>
  borderOpacity: ThemeSection
  borderRadius: ThemeSection
  borderWidth: ThemeSection
  boxShadow: ThemeSection<string | string[]>
  divideColor: ThemeSection<ThemeColor>
  divideOpacity: ThemeSection
  divideWidth: ThemeSection
  fill: ThemeSection<ThemeColor>
  flex: ThemeSection
  fontFamily: ThemeSection<string | string[]>
  fontSize: ThemeSection<ThemeFontSize>
  fontWeight: ThemeSection
  gap: ThemeSection
  gradientColorStops: ThemeSection<ThemeColor>
  height: ThemeSection
  inset: ThemeSection
  keyframes: ThemeSection<CSSAtKeyframes>
  letterSpacing: ThemeSection
  lineHeight: ThemeSection
  margin: ThemeSection
  maxHeight: ThemeSection
  maxWidth: ThemeSection
  minHeight: ThemeSection
  minWidth: ThemeSection
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
  scale: ThemeSection
  skew: ThemeSection
  space: ThemeSection
  stroke: ThemeSection<ThemeColor>
  strokeWidth: ThemeSection
  textColor: ThemeSection<ThemeColor>
  textOpacity: ThemeSection
  transitionDelay: ThemeSection<string | string[]>
  transitionDuration: ThemeSection<string | string[]>
  transitionProperty: ThemeSection<string | string[]>
  transitionTimingFunction: ThemeSection<string | string[]>
  translate: ThemeSection
  width: ThemeSection
  zIndex: ThemeSection
}
