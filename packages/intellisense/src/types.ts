import type { BaseTheme, ExtractUserTheme, ThemeFunction, TwindConfig } from '@twind/core'

import type { Numberify, RGBA } from '@ctrl/tinycolor'

export type LanguageId =
  | (
      | 'html'
      | 'javascript'
      | 'javascriptreact'
      | 'markdown'
      | 'svelte'
      | 'typescript'
      | 'typescriptreact'
      | 'vue-html'
      | 'vue'
    )
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {})

export interface Intellisense<Theme extends BaseTheme = BaseTheme> {
  readonly theme: ThemeFunction<ExtractUserTheme<Theme>>
  readonly config: TwindConfig<Theme>

  suggest(input: string, options?: SuggestAtOptions): Promise<Suggestion[]>
  suggestAt(content: string, offset: number, language: LanguageId): Promise<SuggestionAt | null>
  documentationFor(token: string, options?: DocumentationForOptions): Promise<string | null>
  documentationAt(
    content: string,
    offset: number,
    language: LanguageId,
  ): Promise<DocumentationAt | null>
  collectColors(content: string, language: LanguageId): Promise<ColorInformation[]>
  validate(content: string, language: LanguageId): Promise<Diagnostics[]>
  enumerate(): IterableIterator<Suggestion>
}

export interface DocumentationForOptions {
  format?: 'md' | 'html'
}

export interface Diagnostics {
  code: 'invalidVariant' | 'invalidClass' | 'invalidCSS'
  severity: 'hint' | 'info' | 'warning' | 'error'
  value: string
  message: string
  start: number
  end: number
  suggestions?: []
  related?: RelatedDiagnostic[]
}

export interface RelatedDiagnostic {
  resource: string
  message: string
  start: number
  end: number
}

export interface DocumentationAt {
  start: number
  end: number
  value: string
}

export interface ColorInformation {
  start: number
  end: number
  value: string
  rgba: Numberify<RGBA>
  editable?: boolean
}

export interface SuggestAtOptions {
  prefix?: string
  ignore?: string[]
}

export interface SuggestionAt {
  start: number
  end: number
  suggestions: Suggestion[]
}

export interface SuggestionCommon {
  /** The full name of the suggested value */
  name: string
  /** The value as it will be used in this context */
  value: string
  /** Short info to be displayed inline */
  description?: string
  detail?: string
  color?: string
}

export interface SuggestionVariant extends SuggestionCommon {
  type: 'variant'
}

export interface SuggestionClass extends SuggestionCommon {
  type: 'class'
}

export type Suggestion = SuggestionClass | SuggestionVariant

export interface IntellisenseOptions {
  cache?: {
    /**
    The maximum number of milliseconds an item should remain in the cache.

    @default Infinity

    By default, `maxAge` will be `Infinity`, which means that items will never expire.
    Lazy expiration upon the next write or read call.

    Individual expiration of an item can be specified by the `set(key, value, maxAge)` method.
    */
    readonly maxAge?: number

    /**
    The maximum number of items before evicting the least recently used items.

    @default 1000
    */
    readonly maxSize: number
  }

  mdnOrigin?: string
}
