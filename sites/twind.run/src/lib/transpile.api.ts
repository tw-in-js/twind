import type { Transpile } from './transpile'

import { rollup } from '@rollup/browser'
import { transform } from 'sucrase'

import { parse } from 'es-module-lexer'
import { Generator } from '@jspm/generator'
import { builtinVersions } from './versions'

const builtinModules =
  import.meta.env.DEV &&
  builtinVersions &&
  Object.fromEntries(
    Object.entries(
      import.meta.glob(
        [
          '../../../../packages/*/src/index.ts',
          '!../../../../packages/cdn/src/index.ts',
          '!../../../../packages/gatsby-plugin/src/index.ts',
          '!../../../../packages/with-*/src/index.ts',
        ],
        { as: 'url', eager: true },
      ),
    )
      .map(([key, url]) => [
        ('@twind/' + key.replace(/^.+\packages\/([^\/]+)\/.+$/, '$1')).replace(
          /^@twind\/twind$/,
          'twind',
        ),
        new URL(url, import.meta.url).href,
      ])
      .flatMap(([key, value]) => [
        // by bare import
        [key, value],
        // by bare import with version
        [`${key}@${builtinVersions[key]}`, value],
      ]),
  )

const api: Transpile = {
  async transform(input, { versions = {}, modules = {}, preload = [] } = {}) {
    let resolutions: Record<string, string> = Object.fromEntries(
      Object.entries(versions).filter(([id]) => !id.includes('*')),
    )

    if (!resolutions['@twind/*']) {
      resolutions = { ...builtinVersions, ...resolutions }
    } else if (!resolutions.twind) {
      resolutions.twind = builtinVersions.twind
    }

    const dependencies = new Set<string>(preload)
    const staticDependencies = new Set<string>()

    const prefix = '~/'
    const inputFiles = Object.keys(input).map((name) => prefix + name)

    modules = {
      ...modules,
      ...Object.fromEntries(Object.entries(input).map(([name, value]) => [prefix + name, value])),
    }

    const builtinPrefix = 'builtin:'
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
        builtinModules && {
          name: 'dev',
          outputOptions(options) {
            return {
              ...options,
              banner(chunk) {
                return chunk.imports
                  .filter((id) => builtinModules[id.slice(builtinPrefix.length)])
                  .flatMap((id) => [
                    `System.register('${id}', [], (exports) => {
                        return {
                          setters: [],
                          async execute() {
                            exports(await import('${
                              builtinModules[id.slice(builtinPrefix.length)]
                            }'))
                          }
                        }
                      })`,
                  ])
                  .join(';\n')
              },
            }
          },
          resolveId(source, importer, options) {
            if (options.isEntry) return null

            if (builtinModules[source]) {
              return { id: `${builtinPrefix}${source}`, external: true }
            }
          },
        },
        {
          name: 'import-map-generator',
          resolveId(source, importer, options) {
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
              const match = source.match(/^((?:@[^\s/]+\/)?[^\s/@]+)(\/[^\s/@]+)?$/)

              if (match) {
                const id = match[1]

                const version = resolutions[id] || versions[id.replace(/^(@[^\s/]+\/).+$/, '$1*')]

                if (version) {
                  // TODO: might be conflicting
                  resolutions[id] ||= version
                }
              }

              dependencies.add(source)

              // treat every import as external
              return false
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
      resolutions,
    })

    // TODO: trace generator.logStream

    const [{ dynamicDeps = [], staticDeps = [] } = {}, { output }] = await Promise.all([
      generator.install([...dependencies]),
      bundle
        .generate({
          // cache busting
          footer: `\n/*! ${buildId} */\n`,
          format: 'systemjs',
          generatedCode: 'es2015',
          sourcemap: 'inline',
          compact: true,
        })
        .finally(() => bundle.close()),
    ])

    return {
      ...Object.fromEntries(
        output.map((chunk) => {
          if (chunk.type === 'chunk' && chunk.isEntry && input.hasOwnProperty(chunk.name)) {
            return [chunk.name, `data:text/javascript;base64,${btoa(chunk.code)}`]
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
      importMap: {
        ...generator.getMap(),
        preload: [...new Set([...staticDependencies, ...staticDeps])],
        prefetch: dynamicDeps,
      },
    } as any
  },

  async findImports(source) {
    const { code } = await transform(source, {
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
