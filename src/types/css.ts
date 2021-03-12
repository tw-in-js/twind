import type * as CSS from 'csstype'

export interface CSSCustomProperties {
  '--tw-bg-opacity'?: string
  '--tw-text-opacity'?: string
  '--tw-border-opacity'?: string
  '--tw-divide-opacity'?: string
  '--tw-placeholder-opacity'?: string
  '--tw-shadow'?: string
  '--tw-ring-inset'?: string
  '--tw-ring-color'?: string
  '--tw-ring-opacity'?: string
  '--tw-ring-shadow'?: string
  '--tw-ring-offset-color'?: string
  '--tw-ring-offset-shadow'?: string
  '--tw-ring-offset-width'?: string
  '--tw-gradient-from'?: string
  '--tw-gradient-to'?: string
  '--tw-gradient-stops'?: string
  '--tw-divide-y-reverse'?: string
  '--tw-divide-x-reverse'?: string
  '--tw-space-y-reverse'?: string
  '--tw-space-x-reverse'?: string
  '--tw-translate-x'?: string
  '--tw-translate-y'?: string
  '--tw-rotate'?: string
  '--tw-skew-x'?: string
  '--tw-skew-y'?: string
  '--tw-scale-x'?: string
  '--tw-scale-y'?: string
  '--tw-ordinal'?: string
  '--tw-slashed-zero'?: string
  '--tw-numeric-figure'?: string
  '--tw-numeric-spacing'?: string
  '--tw-numeric-fraction'?: string
}

export interface CSSProperties
  extends CSS.PropertiesFallback<string, string>,
    CSS.PropertiesHyphenFallback<string, string>,
    CSSCustomProperties {}

export interface FontFace
  extends CSS.AtRule.FontFaceFallback<string, string>,
    CSS.AtRule.FontFaceHyphenFallback<string, string> {}

export interface CounterStyle
  extends CSS.AtRule.CounterStyleFallback<string, string>,
    CSS.AtRule.CounterStyleHyphenFallback<string, string> {}
