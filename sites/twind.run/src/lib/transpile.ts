import * as Comlink from 'comlink'
import type { Manifest } from '$lib/types'

import type { ImportMap } from './system'

import TranspileWorker from './transpile.worker?worker'

export interface Transpile {
  transform<Input extends Record<string, string>>(
    input: Input,
    options: {
      manifest: Manifest
      modules?: Record<string, string>
      preload?: string[]
    },
  ): Promise<Input & { importMap: ImportMap }>

  findImports(
    code: string,
    options: {
      manifest: Manifest
    },
  ): Promise<string[]>
}

export default load()

function load(): Transpile {
  if (import.meta.env.SSR) {
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

  return Comlink.wrap<Transpile>(
    import.meta.env.PROD
      ? new TranspileWorker()
      : new Worker(new URL('./transpile.worker.ts', import.meta.url), {
          type: 'module',
        }),
  ) as Transpile
}
