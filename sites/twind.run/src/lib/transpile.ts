import * as Comlink from 'comlink'

import type { ImportMap } from './system'

export interface Transpile {
  transform<Input extends Record<string, string>>(
    input: Input,
    options?: {
      versions?: Record<string, string>
      modules?: Record<string, string>
      preload?: string[]
    },
  ): Promise<Input & { importMap: ImportMap }>

  findImports(
    code: string,
    options?: {
      versions?: Record<string, string>
    },
  ): Promise<string[]>
}

export default load()

function load(): Transpile {
  if (import.meta.env.PROD && !import.meta.env.SSR) {
    try {
      return Comlink.wrap<Transpile>(
        new Worker(new URL('./transpile.worker.ts', import.meta.url), { type: 'module' }),
      ) as Transpile
    } catch {
      // not supported
    }
  }

  return {
    async transform(...args) {
      const { default: api } = await import('./transpile.api')
      return api.transform(...args)
    },
    async findImports(...args) {
      const { default: api } = await import('./transpile.api')
      return api.findImports(...args)
    },
  }
}
