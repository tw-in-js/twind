import type { ImportMap } from './system'
import type { Transpile } from './transpile'

import { rollup } from '@rollup/browser'
import { transform } from 'sucrase'

import { parse } from 'es-module-lexer/js'
import { Generator } from '@jspm/generator'
import { SemverRange } from 'sver'

import { toBase64, toBase64url } from './base64'
import { withVersion } from './versions'

const api: Transpile = {
  async transform(input, { manifest, modules = {}, preload = [] }) {
    const inputMap: ImportMap = { scopes: manifest.scopes }

    // console.debug({ manifest, normalizedImportMap })

    const dependencies = new Set<string>(preload)
    const staticDependencies = new Set<string>()

    const prefix = '~/'
    const inputFiles = Object.keys(input).map((name) => prefix + name)

    modules = {
      ...modules,
      ...Object.fromEntries(Object.entries(input).map(([name, value]) => [prefix + name, value])),
    }

    const buildId = Date.now().toString(36)

    const bundle = await rollup({
      input: inputFiles,
      plugins: [
        {
          name: 'virtual',
          resolveId(source) {
            if (modules.hasOwnProperty(source)) {
              return source
            }
          },
          load(id) {
            if (modules.hasOwnProperty(id)) {
              return modules[id]
            }
          },
        },
        {
          name: 'sucrase',
          transform(code, id) {
            const result = transform(code, {
              transforms: ['typescript'],
              production: false,
              jsxRuntime: 'automatic',
              filePath: id,
              sourceMapOptions: {
                compiledFilename: id,
              },
            })
            return {
              code: result.code,
              map: result.sourceMap,
            }
          },
        },
        {
          name: 'import-map-generator',
          resolveId(source, _importer, options) {
            if (options.isEntry) return null

            // only support url-like imports
            if (/^https?:\/\//.test(source)) {
              staticDependencies.add(source)
              return false
            }

            if (/^data:/.test(source)) {
              return false
            }

            // or bare imports
            if (/^[^./]/.test(source)) {
              const { found, input, output } = withVersion(source, manifest)

              if (found) {
                // check if versions satifies importMap version and use importMap resolution
                const resolved = manifest.imports?.[output.id + output.path]

                if (
                  resolved &&
                  (!input.version || SemverRange.match(input.version, output.version))
                ) {
                  source = output.id + output.path
                }
              }

              const resolved = manifest.imports?.[source]
              if (resolved) {
                ;(inputMap.imports ||= {})[source] = resolved
              }

              dependencies.add(source)

              // treat every import as external
              return { id: source, external: true }
            }

            return this.error(
              `Invalid import ${JSON.stringify(
                source,
              )}! Only 'https://', 'http://', 'data:', and bare module imports are allowed.`,
            )
          },
        },
      ],
    })

    const generator = new Generator({
      baseUrl: 'memory://',
      inputMap,
      defaultProvider: 'jspm.system',
      env: [
        'development',
        'modern',
        'esmodules',
        'es0215',
        'browser',
        'module',
        'import',
        'default',
      ],
    })

    // TODO: trace generator.logStream

    // TODO: add query identifier to https://ga.system.jspm.io/npm: request
    const [{ dynamicDeps = [], staticDeps = [] } = {}, { output }] = await Promise.all([
      generator.install([...dependencies]),
      bundle
        .generate({
          // cache busting
          footer: `\n//# ${buildId}`,
          format: 'systemjs',
          generatedCode: 'es2015',
          // manual inlining to prevent "Unsupported environment: `window.btoa` or `Buffer` should be supported."
          sourcemap: 'hidden',
          // sourcemap: false,
          compact: true,
        })
        .finally(() => bundle.close()),
    ])

    // scope all external import to the current manifest
    // this allows to have distinct dependency tree within one System registry
    const hash = import.meta.env.DEV
      ? new URL(manifest.url).hostname
      : toBase64url(
          await crypto.subtle.digest('sha-256', await new Blob([manifest.url]).arrayBuffer()),
        ).slice(0, 10)

    const scopeToManifest = (input: string) => {
      // we only need to do this for external url
      if (input.startsWith('https://ga.system.jspm.io/npm:')) {
        const url = new URL(input)
        url.searchParams.set('_', hash)
        input = url.href
      }

      return input
    }

    const scopeImports = (map: Record<string, string>) =>
      Object.fromEntries(Object.entries(map).map(([key, url]) => [key, scopeToManifest(url)]))

    const map = generator.getMap()
    if (map.imports) {
      map.imports = scopeImports(map.imports)
    }
    if (map.scopes) {
      map.scopes = Object.fromEntries(
        Object.entries(map.scopes).map(([key, scope]) => [key, scopeImports(scope)]),
      )
    }

    const importMap = {
      ...map,
      preload: [...new Set([...staticDependencies, ...staticDeps])].map(scopeToManifest),
      prefetch: dynamicDeps.map(scopeToManifest),
    }

    console.debug('importMap', importMap)
    return {
      ...Object.fromEntries(
        output
          .filter(
            // ignore all sourcemap chunks
            (chunk) =>
              !(
                chunk.type === 'asset' &&
                chunk.name === undefined &&
                chunk.fileName.endsWith('.map')
              ),
          )
          .map((chunk) => {
            if (chunk.type === 'chunk' && chunk.isEntry && input.hasOwnProperty(chunk.name)) {
              const map = chunk.map
                ? '\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,' +
                  toBase64(chunk.map.toString())
                : ''
              return [chunk.name, `data:text/javascript;base64,${toBase64(chunk.code + map)}`]
            }

            console.warn(
              { input, chunk },
              {
                "chunk.type === 'chunk'": chunk.type === 'chunk',
                'chunk.isEntry': chunk.type === 'chunk' && chunk.isEntry,
                'input.hasOwnProperty(chunk.name)': chunk.name && input.hasOwnProperty(chunk.name),
              },
            )

            throw new Error(`Invalid ${chunk.type} ${chunk.name} generated`)
          }),
      ),
      importMap,
    } as any
  },

  async findImports(source) {
    const { code } = transform(source, {
      transforms: ['typescript'],
      production: false,
      jsxRuntime: 'automatic',
    })

    // TODO: same as transform but return only dependencies
    const [imports] = await parse(code)

    return imports.map(({ s: start, e: end }) => code.slice(start, end)).filter(isBareSpecifier)
  },
}

export default api

function isBareSpecifier(id: string): boolean {
  return !/^https?:\/\/|^\./.test(id)
}
