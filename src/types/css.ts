import type * as CSS from 'csstype'

export interface CSSCustomProperties {
  '--tw-rotate'?: string
  '--tw-gradient-stops'?: string
}

export interface CSSProperties
  extends CSS.PropertiesFallback<string, string>,
    CSS.PropertiesHyphenFallback<string, string>,
    CSSCustomProperties {}
