import type {
  SuggestionAt,
  ColorInformation,
  LanguageId,
  DocumentationAt,
  Diagnostics,
  SuggestAtOptions,
  Suggestion,
  DocumentationForOptions,
} from '@twind/intellisense'

import * as Comlink from 'comlink'
import type { ImportMap } from './system'

import IntellisenseWorker from './intellisense.worker?worker'

export interface Intellisense {
  init(options: { entry: string; importMap: ImportMap }): Promise<void>

  suggest(input: string, options?: SuggestAtOptions): Promise<Suggestion[]>
  suggestAt(source: string, offset: number, language: LanguageId): Promise<SuggestionAt | null>

  documentationFor(token: string, options?: DocumentationForOptions): Promise<string | null>

  documentationAt(
    content: string,
    offset: number,
    language: LanguageId,
  ): Promise<DocumentationAt | null>

  collectColors(source: string, language: LanguageId): Promise<ColorInformation[]>

  validate(content: string, language: LanguageId): Promise<Diagnostics[]>

  getColors(): Promise<Record<string, Record<string, string>>>
}

export default load()

function load(): Intellisense {
  if (import.meta.env.SSR) {
    return {
      async init(...args) {
        const { default: api } = await import('./intellisense.api')
        return api.init(...args)
      },
      async suggest(...args) {
        const { default: api } = await import('./intellisense.api')
        return api.suggest(...args)
      },
      async suggestAt(...args) {
        const { default: api } = await import('./intellisense.api')
        return api.suggestAt(...args)
      },
      async documentationFor(...args) {
        const { default: api } = await import('./intellisense.api')
        return api.documentationFor(...args)
      },
      async documentationAt(...args) {
        const { default: api } = await import('./intellisense.api')
        return api.documentationAt(...args)
      },
      async collectColors(...args) {
        const { default: api } = await import('./intellisense.api')
        return api.collectColors(...args)
      },
      async validate(...args) {
        const { default: api } = await import('./intellisense.api')
        return api.validate(...args)
      },
      async getColors(...args) {
        const { default: api } = await import('./intellisense.api')
        return api.getColors(...args)
      },
    }
  }

  return Comlink.wrap<Intellisense>(new IntellisenseWorker())
}
