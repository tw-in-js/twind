import * as Comlink from 'comlink'

import type { Options, CursorOptions, CursorResult } from 'prettier'

import PrettierWorker from './prettier.worker?worker'

export interface Prettier {
  /**
   * `format` is used to format text using Prettier. [Options](https://prettier.io/docs/en/options.html) may be provided to override the defaults.
   */
  format(source: string, options?: Omit<Options, 'plugins' | 'pluginSearchDirs'>): Promise<string>

  /**
   * `formatWithCursor` both formats the code, and translates a cursor position from unformatted code to formatted code.
   * This is useful for editor integrations, to prevent the cursor from moving when code is formatted.
   *
   * The `cursorOffset` option should be provided, to specify where the cursor is. This option cannot be used with `rangeStart` and `rangeEnd`.
   */
  formatWithCursor(
    source: string,
    options?: Omit<CursorOptions, 'plugins' | 'pluginSearchDirs'>,
  ): Promise<CursorResult>

  formatPreviewCSS(rules: string[]): Promise<string>
}

export default load()

function load(): Prettier {
  if (import.meta.env.SSR) {
    return {
      async format(...args) {
        const { default: api } = await import('./prettier.api')
        return api.format(...args)
      },
      async formatWithCursor(...args) {
        const { default: api } = await import('./prettier.api')
        return api.formatWithCursor(...args)
      },
      async formatPreviewCSS(...args) {
        const { default: api } = await import('./prettier.api')
        return api.formatPreviewCSS(...args)
      },
    }
  }

  return Comlink.wrap<Prettier>(new PrettierWorker())
}
