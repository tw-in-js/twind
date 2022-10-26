import type {
  SuggestionAt,
  ColorInformation,
  LanguageId,
  DocumentationAt,
  Diagnostics,
} from '@twind/intellisense'

import * as Comlink from 'comlink'
import type { ImportMap } from './system'

import IntellisenseWorker from './intellisense.worker?worker'

export { version as INTELLISENSE_VERSION } from '@twind/intellisense/package.json'

export interface Intellisense {
  init(options: { entry: string; importMap: ImportMap }): Promise<void>

  suggestAt(source: string, offset: number, language: LanguageId): Promise<SuggestionAt | null>

  documentationFor(token: string): Promise<string | null>

  documentationAt(
    content: string,
    offset: number,
    language: LanguageId,
  ): Promise<DocumentationAt | null>

  collectColors(source: string, language: LanguageId): Promise<ColorInformation[]>

  validate(content: string, language: LanguageId): Promise<Diagnostics[]>
}

export default load()

function load(): Intellisense {
  if (import.meta.env.SSR) {
    return {
      async init(...args) {
        const { default: api } = await import('./intellisense.api')
        return api.init(...args)
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
    }
  }

  return Comlink.wrap<Intellisense>(
    import.meta.env.PROD
      ? new IntellisenseWorker()
      : new Worker(new URL('./intellisense.worker.ts', import.meta.url), {
          type: 'module',
        }),
  )
}
