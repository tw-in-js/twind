import * as monaco from 'monaco-editor'
import { names as namedColors, fromRatio } from '@ctrl/tinycolor'

export * from 'monaco-editor'

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

import debounce from 'just-debounce'

import { injectGlobal } from 'twind'

import transpile from './transpile'
import intellisense from './intellisense'
import { withVersion } from './versions'
import type { Manifest } from './types'

self.MonacoEnvironment = {
  getWorker: function (_, label) {
    switch (label) {
      case 'json':
        return new jsonWorker()
      case 'css':
      case 'scss':
      case 'less':
        return new cssWorker()
      case 'html':
      case 'handlebars':
      case 'razor':
        return new htmlWorker()
      case 'typescript':
      case 'javascript':
        return new tsWorker()
      default:
        return new editorWorker()
    }
  },
}

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
  module: monaco.languages.typescript.ModuleKind.ESNext,
  target: monaco.languages.typescript.ScriptTarget.ESNext,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  isolatedModules: true,
  allowJs: true,
  strict: true,
  skipLibCheck: true,
})

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSuggestionDiagnostics: true,
})

if (import.meta.hot) {
  const disposables = (import.meta.hot.data.disposables ??= new Set())

  for (const disposable of disposables) {
    disposable.dispose()
  }

  disposables.clear()
}

function track(disposable: monaco.IDisposable) {
  if (import.meta.hot) {
    import.meta.hot.data.disposables.add(disposable)
  }
}

// Provide collapsable range for @layer comments of output.css -> /* @layer base */
track(
  monaco.languages.registerFoldingRangeProvider('css', {
    provideFoldingRanges(model) {
      const ranges: monaco.languages.FoldingRange[] = []

      let start = -1
      for (const { range } of model.findMatches('/* @layer ', false, false, false, null, false)) {
        if (start !== -1) {
          ranges.push({
            start,
            end: range.startLineNumber - 1,
            kind: monaco.languages.FoldingRangeKind.Region,
          })
        }

        start = range.startLineNumber
      }

      if (start !== -1) {
        ranges.push({
          start,
          end: model.getLineCount(),
          kind: monaco.languages.FoldingRangeKind.Region,
        })
      }

      return ranges
    },
  }),
)

// Provide autocompletion
track(
  monaco.languages.registerCompletionItemProvider('html', {
    triggerCharacters: [' ', '"', ':', '!', '/', '-', '('],
    async provideCompletionItems(model, position) {
      const suggestionAt = await intellisense.suggestAt(
        model.getValue(),
        model.getOffsetAt(position),
        model.getLanguageId(),
      )

      if (!suggestionAt) {
        return {
          suggestions: [],
          incomplete: false,
        }
      }

      const { lineNumber: startLineNumber, column: startColumn } = model.getPositionAt(
        suggestionAt.start,
      )
      const { lineNumber: endLineNumber, column: endColumn } = model.getPositionAt(suggestionAt.end)
      const range = { startLineNumber, startColumn, endLineNumber, endColumn }

      return {
        suggestions: suggestionAt.suggestions.map((suggestion, index) => {
          if (suggestion.type === 'variant') {
            return {
              label: {
                label: suggestion.value,
                detail:
                  suggestion.detail ||
                  (suggestion.value.endsWith('[')
                    ? '…]'
                    : suggestion.value.endsWith('/')
                    ? '…'
                    : undefined),
                description: suggestion.description,
              },
              detail: suggestion.color || suggestion.detail,
              kind: suggestion.color
                ? monaco.languages.CompletionItemKind.Color
                : monaco.languages.CompletionItemKind.Module,
              sortText: index.toString().padStart(8, '0'),
              filterText: suggestion.name,
              insertText: suggestion.value,
              range,
              command: {
                id: 'editor.action.triggerSuggest',
                title: '',
              },
            }
          }

          return {
            label: {
              label: suggestion.value,
              detail:
                suggestion.detail ||
                (suggestion.value.endsWith('[')
                  ? '…]'
                  : suggestion.value.endsWith('/')
                  ? '…'
                  : undefined),
              description: suggestion.description,
            },
            detail: suggestion.color || suggestion.detail,
            kind: suggestion.color
              ? monaco.languages.CompletionItemKind.Color
              : suggestion.value.endsWith('[')
              ? monaco.languages.CompletionItemKind.Variable
              : suggestion.value.endsWith('/')
              ? monaco.languages.CompletionItemKind.Class // TypeParameter
              : monaco.languages.CompletionItemKind.Constant,
            sortText: index.toString().padStart(8, '0'),
            filterText: suggestion.name,
            insertText: suggestion.value,
            range,
            command: suggestion.value.endsWith('/')
              ? {
                  id: 'editor.action.triggerSuggest',
                  title: '',
                }
              : undefined,
          }
        }),
        incomplete: true, // So that autocompletion request is sent on every char
      }
    },
    async resolveCompletionItem(item) {
      const documentation = await intellisense.documentationFor(item.filterText || item.insertText)

      if (documentation) {
        item.documentation = {
          value: documentation,
          isTrusted: true,
          supportHtml: true,
          supportThemeIcons: true,
        }
      }

      return item
    },
  }),
)

// Provide inline colors
{
  // Based on https://github.com/tailwindlabs/play.tailwindcss.com/blob/master/src/monaco/html.js#L99
  const colorNames = Object.keys(namedColors)
  const editabelColorRe = new RegExp(
    `-\\[(${colorNames.join('|')}|(?:(?:#|(?:(?:hsl|rgb)a?|hwb|lab|lch|color)\\())[^]\\(]+)\\]$`,
    'i',
  )
  const oldDecorationsMap = new WeakMap<monaco.editor.ITextModel, string[]>()

  track(
    monaco.languages.registerColorProvider('html', {
      async provideDocumentColors(model) {
        const colors = await intellisense.collectColors(model.getValue(), model.getLanguageId())

        oldDecorationsMap.set(
          model,
          model.deltaDecorations(
            oldDecorationsMap.get(model) || [],
            colors
              .filter((color) => !color.editable)
              .map(({ start, end, rgba }) => {
                // We must use injectGlobal because the class names are "sanitized" in some way by monaco-editor
                const className = `_${rgba.r}_${rgba.g}_${rgba.b}_${rgba.a}`
                injectGlobal({
                  '._monaco-color-decoration': {
                    '&::before': {
                      content: "' '",
                      boxSizing: 'border-box',
                      display: 'inline-block',
                      width: '0.8em',
                      height: '0.8em',
                      margin: '0.1em 0.2em 0',
                      border: '0.1em solid black',
                      '.vs-dark &': {
                        borderColor: 'rgb(238,238,238)',
                      },
                    },
                    [`&.${className}::before`]: {
                      backgroundColor: `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`,
                    },
                  },
                })

                const { lineNumber: startLineNumber, column: startColumn } =
                  model.getPositionAt(start)
                const { lineNumber: endLineNumber, column: endColumn } = model.getPositionAt(end)

                return {
                  range: {
                    startLineNumber,
                    startColumn,
                    endLineNumber,
                    endColumn,
                  },
                  options: {
                    beforeContentClassName: `_monaco-color-decoration ${className}`,
                  },
                }
              }),
          ),
        )

        return colors
          .filter((color) => color.editable)
          .map(({ start, end, rgba }) => {
            const { r: red, g: green, b: blue, a: alpha } = rgba

            const { lineNumber: startLineNumber, column: startColumn } = model.getPositionAt(start)
            const { lineNumber: endLineNumber, column: endColumn } = model.getPositionAt(end)

            return {
              range: {
                startLineNumber,
                startColumn,
                endLineNumber,
                endColumn,
              },
              color: { red, green, blue, alpha },
            }
          })
      },
      provideColorPresentations(model, colorInfo) {
        const className = model.getValueInRange(colorInfo.range)

        const match = className.match(editabelColorRe)

        if (match === null) return []

        const currentColor = match[1]

        const isNamedColor = colorNames.includes(currentColor)
        const color = fromRatio({
          r: colorInfo.color.red,
          g: colorInfo.color.green,
          b: colorInfo.color.blue,
          a: colorInfo.color.alpha,
        })

        let hexValue = color.toHex8String(
          !isNamedColor && (currentColor.length === 4 || currentColor.length === 5),
        )
        if (hexValue.length === 5) {
          hexValue = hexValue.replace(/f$/, '')
        } else if (hexValue.length === 9) {
          hexValue = hexValue.replace(/ff$/, '')
        }

        const prefix = className.substr(0, match.index)

        return [
          hexValue,
          color.toRgbString().replace(/ /g, ''),
          color.toHslString().replace(/ /g, ''),
        ].map((value) => ({ label: `${prefix}-[${value}]` }))
      },
    }),
  )
}

// Provide hovers
track(
  monaco.languages.registerHoverProvider('html', {
    async provideHover(model, position) {
      const documentationAt = await intellisense.documentationAt(
        model.getValue(),
        model.getOffsetAt(position),
        model.getLanguageId(),
      )

      if (documentationAt) {
        const { lineNumber: startLineNumber, column: startColumn } = model.getPositionAt(
          documentationAt.start,
        )
        const { lineNumber: endLineNumber, column: endColumn } = model.getPositionAt(
          documentationAt.end,
        )

        return {
          contents: [
            {
              value: documentationAt.value,
              isTrusted: true,
              supportHtml: true,
              supportThemeIcons: true,
            },
          ],
          range: { startLineNumber, startColumn, endLineNumber, endColumn },
        }
      }
    },
  }),
)

// Provide diagnostics
track(
  monaco.editor.onDidCreateModel((model) => {
    const updateDecorations = debounce(() => {
      if (model.isDisposed()) return
      if (!model.isAttachedToEditor()) return

      const value = model.getValue()
      const language = model.getLanguageId()

      intellisense
        .validate(value, language)
        .then((diagnostics) => {
          if (model.isDisposed()) return
          if (!model.isAttachedToEditor()) return
          if (value !== model.getValue() || language !== model.getLanguageId()) return

          monaco.editor.setModelMarkers(
            model,
            'twind',
            diagnostics.map((diagnostic) => {
              const { lineNumber: startLineNumber, column: startColumn } = model.getPositionAt(
                diagnostic.start,
              )
              const { lineNumber: endLineNumber, column: endColumn } = model.getPositionAt(
                diagnostic.end,
              )

              // TODO: diagnostic.suggestions for quick fixes
              return {
                code: diagnostic.code,
                message: diagnostic.message,
                severity:
                  diagnostic.severity === 'hint'
                    ? monaco.MarkerSeverity.Hint
                    : diagnostic.severity === 'info'
                    ? monaco.MarkerSeverity.Info
                    : diagnostic.severity === 'warning'
                    ? monaco.MarkerSeverity.Warning
                    : monaco.MarkerSeverity.Error,
                startLineNumber,
                startColumn,
                endLineNumber,
                endColumn,
                relatedInformation: diagnostic.related?.map((related) => {
                  const { lineNumber: startLineNumber, column: startColumn } = model.getPositionAt(
                    diagnostic.start,
                  )
                  const { lineNumber: endLineNumber, column: endColumn } = model.getPositionAt(
                    diagnostic.end,
                  )

                  return {
                    resource: monaco.Uri.parse(related.resource),
                    message: related.message,
                    startLineNumber,
                    startColumn,
                    endLineNumber,
                    endColumn,
                  }
                }),
              }
            }),
          )
        })
        .catch((error) => {
          console.error(`Failed to update markers for ${model.uri.toString(true)}`, error)
        })
    }, 750)

    const didChangeContent = model.onDidChangeContent(updateDecorations)
    const didChangeLanguage = model.onDidChangeLanguage(updateDecorations)
    const didChangeAttached = model.onDidChangeAttached(updateDecorations)

    track(
      model.onWillDispose(() => {
        didChangeContent.dispose()
        didChangeLanguage.dispose()
        didChangeAttached.dispose()
      }),
    )

    track({
      dispose() {
        monaco.editor.removeAllMarkers('twind')
      },
    })

    updateDecorations()
  }),
)

const cdn = 'https://cdn.skypack.dev'
const fetchedURLs = new Set<string>()

const workspacePrefix = 'file:///'

// files within /node_modules
const extraLibs = new Map<string, monaco.editor.ITextModel>()

// const nodeModulesPrefix = workspacePrefix + 'node_modules/'

// const LOCAL_STORAGE_PREFIX = 'monaco.languages.typescript.extraLibs:'

// if (browser) {
//   try {
//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i)
//       if (key?.startsWith(LOCAL_STORAGE_PREFIX)) {
//         const content = localStorage.getItem(key)
//         if (content) {
//           const filePath = key.slice(LOCAL_STORAGE_PREFIX.length)
//           fetchedURLs.add(`${cdn}/-/${filePath}`)

//           addExtraLib(content, filePath)
//         }
//       }
//     }
//   } catch (error) {
//     // ignore
//     console.error(error)
//   }

//   console.debug(monaco.languages.typescript.typescriptDefaults.getExtraLibs())
// }

export function getOrCreateModel(path: string, defaultValue = '', defaultLanguage?: string) {
  const uri = monaco.Uri.parse(new URL(path, workspacePrefix).href)

  return (
    monaco.editor.getModel(uri) ||
    monaco.editor.createModel(defaultValue, defaultLanguage || detectLanguage(path), uri)
  )
}

function detectLanguage(path: string) {
  const ext = path.replace(/^.+\.([^.]+)$/, '$1')

  switch (ext) {
    case 'ts':
    case 'tsx':
    case 'mts':
    case 'cts':
      return 'typescript'

    case 'js':
    case 'jsx':
    case 'mjs':
    case 'cjs':
      return 'javascript'

    default:
      return ext
  }
}

export function cleanupWorkspace() {
  const extraLibs = monaco.languages.typescript.typescriptDefaults.getExtraLibs()

  for (const model of monaco.editor.getModels()) {
    const uri = model.uri.toString(true)

    if (!model.isDisposed() && uri.startsWith(workspacePrefix) && !extraLibs[uri]) {
      try {
        model.dispose()
      } catch {}
    }
  }
}

export function loadTypeDeclarations(value: string, path: string, manifest: Manifest) {
  transpile
    .findImports(value, { manifest })
    .then((imports) =>
      imports.map((moduleName) => loadModuleTypeDeclarations(moduleName, manifest)),
    )
    .catch((error) => {
      console.error(`Failed to fetch types for '${path}'`, error)
    })
}

export function loadModelTypeDeclarations(
  model: monaco.editor.ITextModel | null,
  manifest: Manifest,
) {
  if (!model) return
  if (model.isDisposed()) return

  if (!['javascript', 'typescript'].includes(model.getLanguageId())) return

  loadTypeDeclarations(model.getValue(), model.uri.toString(true), manifest)
}

export function loadModuleTypeDeclarations(moduleName: string, manifest: Manifest): void {
  fetchModuleTypeDeclarations(moduleName, manifest).catch((error) => {
    console.error(`Failed to fetch type declarations for ${moduleName}`, error)
  })
}

async function fetchModuleTypeDeclarations(moduleName: string, manifest: Manifest): Promise<void> {
  // validate moduleName
  if (/[*\s]/.test(moduleName)) {
    return
  }

  const { specifier: id } = withVersion(moduleName, manifest)

  const url = `${cdn}/${id}?dts`

  if (fetchedURLs.has(url)) return
  fetchedURLs.add(url)

  console.debug(`Fetching type declarations for ${moduleName} from ${url}`)
  let response = await fetch(url, {
    method: 'HEAD',
    redirect: 'follow',
  })
    .then((response) => {
      if (
        response.ok &&
        response.status === 200 &&
        response.headers.get('x-import-status') !== 'SUCCESS'
      ) {
        return fetch(url, {
          method: 'HEAD',
          redirect: 'follow',
        })
      }

      return response
    })
    .catch((error) => {
      // do not try to load this url again for 5 minutes
      setTimeout(() => {
        fetchedURLs.delete(url)
      }, 5 * 60 * 1000)
      throw error
    })

  // do not try to load this url again for 3 minutes
  setTimeout(() => {
    fetchedURLs.delete(url)
  }, 3 * 60 * 1000)

  if (!(response.ok && response.status === 200)) {
    return
  }

  if (response.redirected && fetchedURLs.has(response.url)) return
  fetchedURLs.add(response.url)

  const pathname = response.headers.get('x-typescript-types')

  if (pathname) {
    const url = new URL(pathname, response.url).href

    const dts = await fetchDTS(url)

    if (dts) {
      await saveExtraLib(dts, url)

      // not adding to cache as it depends on current workspace manifest
      const importFrom = JSON.stringify(new URL(url).pathname.replace(/^\/-\/|\.d\.ts$/g, ''))

      const model = getOrCreateModel(`node_modules/${moduleName}.d.ts`)

      model.setValue(
        [`export * from ${importFrom};`, `export { default } from ${importFrom};`].join('\n'),
      )

      console.debug(
        `Installed type declarations facade for ${id} from ${model.uri.toString(
          true,
        )} to ${importFrom}`,
      )
    }
  }
}

async function saveExtraLib(dts: string, url: string): Promise<void> {
  addExtraLib(
    dts.replace(/((?:import|from)\s+)(["'])\/-\/([^\s"']+)\.d\.ts\2/g, '$1$2$3$2'),
    new URL(url).pathname.replace('/-/', ''),
  )

  const re =
    /\b(?:import|export)\s[\s\S]+?\sfrom\s+(["'])(.+?)\1|\bimport\s+(["'])(.+?)\3|\bimport\((["'])(.+?)\5\)|\/+\s*<reference\s+path=["'](.+?)\7\s*\/>/g
  let match
  const imports = []
  while ((match = re.exec(dts))) {
    const pathname = match[2] || match[4] || match[6] || match[8]
    if (pathname.endsWith('.d.ts')) {
      imports.push(pathname)
    }
  }

  await Promise.all(
    imports.map(async (pathname) => {
      const importUrl = new URL(pathname, url).href
      try {
        const dts = await fetchDTS(importUrl)

        if (dts) {
          await saveExtraLib(dts, importUrl)
        }
      } catch (error) {
        console.error(`Failed to fetch dts from ${importUrl}:`, error)
      }
    }),
  )
}

function addExtraLib(content: string, filePath: string): void {
  const path = `node_modules/${filePath}`

  const model = getOrCreateModel(path)
  model.setValue(content)

  const uri = model.uri.toString(true)

  monaco.languages.typescript.typescriptDefaults.addExtraLib(content, uri)

  extraLibs.set(filePath, model)

  console.debug(`Added extra lib "${uri}"`)

  // if (browser) {
  //   try {
  //     localStorage.setItem(LOCAL_STORAGE_PREFIX + filePath, content)
  //   } catch {
  //     // ignore
  //   }
  // }
}

async function fetchDTS(url: string): Promise<string | undefined> {
  if (fetchedURLs.has(url)) return
  fetchedURLs.add(url)

  const response = await fetch(url, { redirect: 'follow' }).catch((error) => {
    // do not try to load this url again for 5 minutes
    setTimeout(() => {
      fetchedURLs.delete(url)
    }, 5 * 60 * 1000)
    throw error
  })

  if (!(response.ok && response.status === 200)) {
    // do not try to load this url again for 5 minutes
    setTimeout(() => {
      fetchedURLs.delete(url)
    }, 5 * 60 * 1000)

    return
  }

  if (response.redirected && fetchedURLs.has(response.url)) return
  fetchedURLs.add(response.url)

  const dts = await response.text().catch((error) => {
    // do not try to load this url again for 5 minutes
    setTimeout(() => {
      fetchedURLs.delete(url)
      fetchedURLs.delete(response.url)
    }, 5 * 60 * 1000)

    throw error
  })

  return dts
}
