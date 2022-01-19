import type { BaseTheme, CSSProperties, MaybeArray } from 'twind'

declare module 'twind' {
  export interface CustomProperties {
    '--tw-backdrop-blur'?: string
    '--tw-backdrop-brightness'?: string
    '--tw-backdrop-contrast'?: string
    '--tw-backdrop-grayscale'?: string
    '--tw-backdrop-hue-rotate'?: string
    '--tw-backdrop-invert'?: string
    '--tw-backdrop-opacity'?: string
    '--tw-backdrop-saturate'?: string
    '--tw-backdrop-sepia'?: string
    '--tw-bg-opacity'?: string | number
    '--tw-blur'?: string
    '--tw-border-opacity'?: string | number
    '--tw-brightness'?: string
    '--tw-contrast'?: string
    '--tw-divide-opacity'?: string | number
    '--tw-divide-x-reverse'?: string | number
    '--tw-divide-y-reverse'?: string | number
    '--tw-drop-shadow'?: string
    '--tw-gradient-from'?: string
    '--tw-gradient-stops'?: string
    '--tw-gradient-to'?: string
    '--tw-gradient-via'?: string
    '--tw-grayscale'?: string
    '--tw-hue-rotate'?: string
    '--tw-invert'?: string
    '--tw-numeric-figure'?: string
    '--tw-numeric-fraction'?: string
    '--tw-numeric-spacing'?: string
    '--tw-opacity'?: string | number
    '--tw-ordinal'?: string
    '--tw-placeholder-opacity'?: string
    '--tw-ring-color'?: string
    '--tw-ring-inset'?: string
    '--tw-ring-offset-color'?: string
    '--tw-ring-offset-shadow'?: string
    '--tw-ring-offset-width'?: string
    '--tw-ring-opacity'?: string | number
    '--tw-ring-shadow'?: string
    '--tw-rotate'?: string
    '--tw-saturate'?: string
    '--tw-scale-x'?: string
    '--tw-scale-y'?: string
    '--tw-sepia'?: string
    '--tw-shadow'?: string
    '--tw-shadow-color'?: string
    '--tw-shadow-colored'?: string
    '--tw-skew-x'?: string
    '--tw-skew-y'?: string
    '--tw-slashed-zero'?: string
    '--tw-scroll-snap-strictness'?: string
    '--tw-text-opacity'?: string
    '--tw-pan-x'?: string
    '--tw-pan-y'?: string
    '--tw-pinch-zoom'?: string
    '--tw-touch-action'?: string
    '--tw-transform'?: string
    '--tw-translate-x'?: string
    '--tw-translate-y'?: string
  }
}

export type FontSizeValue =
  | string
  | [size: string, lineHeight: string]
  | [size: string, options: { lineHeight?: string; letterSpacing?: string }]

export interface Container {
  screens?: BaseTheme['screens']
  center?: boolean
  padding?: string | Record<string, string>
}

export interface TailwindTheme extends BaseTheme {
  columns: Record<string, string>
  spacing: Record<string, string>
  durations: Record<string, MaybeArray<string>>

  animation: Record<string, MaybeArray<string>>
  aspectRatio: Record<string, string>
  backdropBlur: Record<string, string>
  backdropBrightness: Record<string, string>
  backdropContrast: Record<string, string>
  backdropGrayscale: Record<string, string>
  backdropHueRotate: Record<string, string>
  backdropInvert: Record<string, string>
  backdropOpacity: Record<string, string>
  backdropSaturate: Record<string, string>
  backdropSepia: Record<string, string>
  backgroundColor: BaseTheme['colors']
  backgroundImage: Record<string, MaybeArray<string>>
  backgroundOpacity: Record<string, string>
  backgroundPosition: Record<string, string>
  backgroundSize: Record<string, MaybeArray<string>>
  blur: Record<string, string>
  borderColor: BaseTheme['colors']
  borderOpacity: Record<string, string>
  borderRadius: Record<string, string>
  borderWidth: Record<string, string>
  boxShadow: Record<string, MaybeArray<string>>
  boxShadowColor: BaseTheme['colors']
  brightness: Record<string, string>
  container: Container
  contrast: Record<string, string>
  cursor: Record<string, MaybeArray<string>>
  caretColor: BaseTheme['colors']
  accentColor: BaseTheme['colors']
  content: Record<string, string>
  divideColor: BaseTheme['colors']
  divideOpacity: Record<string, string>
  divideWidth: Record<string, string>
  dropShadow: Record<string, MaybeArray<string>>
  fill: BaseTheme['colors']
  flex: Record<string, string>
  flexBasis: Record<string, string>
  flexGrow: Record<string, number | string>
  flexShrink: Record<string, number | string>
  fontFamily: Record<string, MaybeArray<string>>
  fontSize: Record<string, FontSizeValue>
  fontWeight: Record<string, string>
  gap: Record<string, string>
  gradientColorStops: BaseTheme['colors']
  grayscale: Record<string, string>
  gridAutoColumns: Record<string, string>
  gridAutoRows: Record<string, string>
  gridColumn: Record<string, string>
  gridColumnEnd: Record<string, string>
  gridColumnStart: Record<string, string>
  gridRow: Record<string, string>
  gridRowEnd: Record<string, string>
  gridRowStart: Record<string, string>
  gridTemplateColumns: Record<string, string>
  gridTemplateRows: Record<string, string>
  height: Record<string, string>
  hueRotate: Record<string, string>
  inset: Record<string, string>
  invert: Record<string, string>
  keyframes: Record<string, Record<string, CSSProperties>>
  letterSpacing: Record<string, string>
  lineHeight: Record<string, string>
  listStyleType: Record<string, string>
  margin: Record<string, string>
  maxHeight: Record<string, string>
  maxWidth: Record<string, string>
  minHeight: Record<string, string>
  minWidth: Record<string, string>
  objectPosition: Record<string, string>
  opacity: Record<string, string>
  order: Record<string, string>
  outlineColor: BaseTheme['colors']
  outlineOffset: Record<string, string>
  outlineWidth: Record<string, string>
  padding: Record<string, string>
  placeholderColor: BaseTheme['colors']
  placeholderOpacity: Record<string, string>
  ringColor: BaseTheme['colors']
  ringOffsetColor: BaseTheme['colors']
  ringOffsetWidth: Record<string, string>
  ringOpacity: Record<string, string>
  ringWidth: Record<string, string>
  rotate: Record<string, string>
  saturate: Record<string, string>
  scale: Record<string, string>
  scrollMargin: Record<string, string>
  scrollPadding: Record<string, string>
  sepia: Record<string, string>
  skew: Record<string, string>
  space: Record<string, string>
  stroke: BaseTheme['colors']
  strokeWidth: Record<string, string>
  textColor: BaseTheme['colors']
  textDecorationColor: BaseTheme['colors']
  textDecorationThickness: Record<string, string>
  textUnderlineOffset: Record<string, string>
  textIndent: Record<string, string>
  textOpacity: Record<string, string>
  transformOrigin: Record<string, string>
  transitionDelay: Record<string, MaybeArray<string>>
  transitionDuration: Record<string, MaybeArray<string>>
  transitionProperty: Record<string, MaybeArray<string>>
  transitionTimingFunction: Record<string, MaybeArray<string>>
  translate: Record<string, string>
  width: Record<string, string>
  willChange: Record<string, string>
  zIndex: Record<string, string>
}
