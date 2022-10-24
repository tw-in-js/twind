<script context="module">
  import { browser } from '$app/environment'

  // early load of monaco editor
  if (browser) {
    import('$lib/monaco').catch(() => {})
  }

  import { injectGlobal } from 'twind'

  if (browser) {
    // Based on https://github.com/tailwindlabs/play.tailwindcss.com/blob/master/src/css/main.css
    injectGlobal`
      .monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents {
        display: block;
      }
      .monaco-editor
        .suggest-widget
        .monaco-list
        .monaco-list-row
        > .contents
        > .main
        > .left {
        flex: none !important;
      }
      .monaco-editor
        .suggest-widget
        .monaco-list
        .monaco-list-row
        > .contents
        > .main
        > .right {
        flex: auto !important;
        justify-content: flex-end !important;
        max-width: none !important;
      }
      .monaco-editor
        .suggest-widget
        .monaco-list
        .monaco-list-row
        > .contents
        > .main
        > .right
        > .details-label {
        margin-left: 2em !important;
        opacity: 1 !important;
      }
      .monaco-editor
        .suggest-widget:not(.docs-side)
        .monaco-list
        .monaco-list-row:hover
        > .contents
        > .main
        > .right.can-expand-details
        > .details-label {
        width: auto !important;
      }
      .monaco-editor
        .suggest-widget
        .details
        > .monaco-scrollable-element
        > .body
        > .docs
        .code {
        font-family: theme('fontFamily', 'mono') !important;
      }
      .monaco-editor .suggest-widget {
        border: 0 !important;
        border-radius: 8px;
        overflow: hidden;
        @apply shadow-lg ring-1 ring-neutral-10/10;
      }
      .monaco-list:not(.drop-target)
        .monaco-list-row:hover:not(.selected):not(.focused) {
        @apply bg-neutral-4/[0.05] !important;
      }
      .vs-dark
        .monaco-list:not(.drop-target)
        .monaco-list-row:hover:not(.selected):not(.focused) {
        @apply bg-neutral-4/[0.07] !important;
      }
      .monaco-editor .suggest-widget .monaco-list-rows {
        padding: 4px 0;
      }
      .monaco-editor .suggest-details {
        border-radius: 8px;
        border: 0 !important;
        @apply shadow-lg ring-1 ring-neutral-10/10;
      }
      .monaco-editor .suggest-widget .monaco-list .monaco-list-row .suggest-icon {
        margin-left: 2px !important;
        margin-right: 5px !important;
      }
      .monaco-editor .suggest-widget .monaco-list .monaco-list-row .icon.customcolor {
        margin-left: 3px !important;
        margin-right: 2px !important;
      }
      .monaco-editor
        .suggest-widget
        .monaco-list
        .monaco-list-row
        .icon.customcolor
        .colorspan {
        width:  0.8571428571em !important;
        height: 0.8571428571em !important;
      }
      .monaco-hover {
        border: 0 !important;
        border-radius: 8px;
        @apply shadow-lg ring-1 ring-brand-10/10;
      }
    `
  }
</script>

<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import { get, writable } from 'svelte/store'
  import debounce from 'just-debounce'
  import diff from 'fast-diff'

  import { cx, tw } from 'twind'

  import prettier from '$lib/prettier'
  import { colorScheme } from '$lib/components/theme-switcher.svelte'

  const dispatch = createEventDispatcher()

  /** @type {Set<import('$lib/monaco').IDisposable>} */
  const disposables = new Set()
  function dispose() {
    const pending = [...disposables]
    disposables.clear()

    for (const disposable of pending) {
      try {
        disposable.dispose()
      } catch {}
    }
  }

  onDestroy(dispose)

  /**
   * @param {string} path
   * @param {string} value
   * @param {import('$lib/monaco').editor.ITextModel} model
   * @param {import('$lib/monaco').editor.IStandaloneCodeEditor} editor
   * @param {typeof import('$lib/monaco')} monaco
   */
  function emitChange(path, value, model, editor, monaco) {
    monaco.loadModelTypeDeclarations(model, versions)
    dispatch('change', { path, value, model, editor, monaco })
  }
  /**
   * Path of the current model without a leading slash. Will be passed as the third argument to `.createModel` method - `monaco.editor.createModel(..., ..., monaco.Uri.parse(defaultPath))`
   *
   * @type {string}
   */
  export let path

  /**
   * Default value of the current model
   *
   * @type {string | undefined}
   */
  export let defaultValue = ''

  /**
   * Default language of the current model
   *
   * @type {string | undefined}
   */
  export let defaultLanguage = undefined

  /**
   * The versions to use for resolving imports.
   *
   * @type {Record<string, string>}
   */
  export let versions = {}

  /**
   * Value of the current model.
   *
   * @type {string}
   */
  export let value = defaultValue || ''

  /**
   * Language of the current model
   *
   * @type {string | undefined}
   */
  export let language = defaultLanguage

  /**
   * The theme for the monaco.
   *
   * @type {string}
   */
  export let theme = 'vs'

  /**
   * The line to jump on it
   *
   * @type {number | undefined}
   */
  export let line = undefined

  /**
   * @type {import('$lib/monaco').editor.IStandaloneEditorConstructionOptions | undefined}
   */
  export let options = undefined

  /**
   * @type {import('$lib/monaco').editor.IEditorOverrideServices | undefined}
   */
  export let overrideServices = undefined

  /** Indicator whether to save the models' view states between model changes or not */
  export let saveViewState = true

  /**
   * Indicator when to update `value` and notify changes.
   *
   * @type {'input' | 'change' | 'save'}
   */
  export let updateOn = 'input'
  export let updateDelay = 650

  export let readonly = false

  /** Class name for the editor container */
  let className = ''
  export { className as class }

  // ---------------------------
  // these are used propagate the current state: eg <Code bind:model />
  // ---------------------------

  /**
   * The current model.
   *
   * @type {import('$lib/monaco').editor.ITextModel | null}
   */
  export let model = null

  /**
   * Determines if the current path is dirty - has changes not reflected in the value
   *
   * @type {boolean}
   */
  export let dirty = false

  /** @type {import('$lib/monaco').editor.IStandaloneCodeEditor | null} */
  export let editor = null

  /** @type {typeof import('$lib/monaco') | null} */
  export let monaco = null

  /** @type {Map<string, {value: string, model: import('$lib/monaco').editor.ITextModel, state: null | import('$lib/monaco').editor.ICodeEditorViewState, dirty: boolean, updateOn: 'input' | 'change' | 'save', readonly: boolean }>} */
  const files = new Map()

  /** @type {HTMLDivElement} */
  let editorElement

  // reactive block - ORDDER IS IMPORTANT

  $: if (browser && monaco) {
    for (const moduleName of Object.keys(versions)) {
      monaco.loadModuleTypeDeclarations(moduleName, versions)
    }

    for (const file of files.values()) {
      monaco.loadModelTypeDeclarations(file.model, versions)
    }
  }

  /**
   * Used to detect model changes.
   * @type {string}
   */
  let previousPath

  // update when path changes
  $: if (browser && editor && monaco && path !== previousPath) {
    get(valueEditsDecorations)?.clear()

    const previousFile = files.get(previousPath)

    if (previousFile) {
      if (previousFile.updateOn !== 'save') {
        previousFile.dirty = previousFile.value !== previousFile.model.getValue()

        if (previousFile.model === editor.getModel()) {
          dirty = previousFile.dirty
        }

        if (previousFile.dirty) {
          previousFile.value = previousFile.model.getValue()

          if (previousFile.model === editor.getModel()) {
            value = previousFile.value
          }

          emitChange(path, previousFile.value, previousFile.model, editor, monaco)
        }
      }

      if (saveViewState) {
        previousFile.state = editor.saveViewState()
      }
    }

    // check path
    let file = files.get(path)

    if (!file) {
      const model = monaco.getOrCreateModel(path, defaultValue || value, defaultLanguage)

      files.set(
        path,
        (file = { value: model.getValue(), model, state: null, dirty: false, updateOn, readonly }),
      )

      monaco.loadModelTypeDeclarations(model, versions)

      const self = file

      disposables.add(
        model.onDidChangeDecorations(
          debounce(() => {
            if (self.model.isDisposed()) return

            if (
              monaco &&
              versions &&
              ['javascript', 'typescript'].includes(self.model.getLanguageId())
            ) {
              for (const marker of monaco.editor.getModelMarkers({
                owner: 'typescript',
                resource: self.model.uri,
              })) {
                // Cannot find module '...' or its corresponding type declarations.
                if (marker.code === '2307') {
                  const moduleName = self.model.getValueInRange(marker).slice(1, -1)

                  monaco.loadModuleTypeDeclarations(moduleName, versions)
                }
              }
            }
          }, updateDelay * 2),
        ),
      )

      disposables.add(
        model.onDidChangeContent(
          debounce(() => {
            if (self.model.isDisposed()) return

            if (editor && monaco && !self.readonly) {
              self.dirty = self.value !== self.model.getValue()

              if (self.dirty && self.updateOn === 'input') {
                self.value = self.model.getValue()
                self.dirty = false

                if (self.model === editor.getModel()) {
                  value = self.value
                }

                emitChange(path, self.value, self.model, editor, monaco)
              }

              if (self.model === editor.getModel()) {
                dirty = self.dirty
              }
            }
          }, updateDelay),
        ),
      )
    }

    editor.setModel(file.model)

    if (saveViewState) {
      editor.restoreViewState(file.state)
    }

    model = file.model
    value = file.value
    language = file.model.getLanguageId()
    dirty = file.dirty

    previousPath = path

    scheduleLayout()
  }

  /** @type {import('svelte/store').Writable<import('$lib/monaco').editor.IEditorDecorationsCollection | null>} */
  let valueEditsDecorations = writable(null)

  // update file when value changes
  $: if (browser && monaco && editor) {
    const file = files.get(path)
    get(valueEditsDecorations)?.clear()

    if (file && file.model.getValue() !== value) {
      const hadValue = file.model.getValue().trim().length

      /** @type {import('$lib/monaco').editor.IIdentifiedSingleEditOperation[]} */
      const edits = []

      /** @type {import('$lib/monaco').editor.IModelDeltaDecoration[]} */
      const decorations = []

      if (hadValue) {
        const changes = diff(file.model.getValue(), value)

        let offset = 0
        for (let index = 0; index < changes.length; index++) {
          const change = changes[index]

          if (change[0] === diff.EQUAL) {
            offset += change[1].length
          } else if (change[0] === diff.INSERT) {
            const position = file.model.getPositionAt(offset)

            edits.push({
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
              },
              text: change[1],
              forceMoveMarkers: true,
            })

            const decorationEnd = file.model.getPositionAt(offset + change[1].length)
            decorations.push({
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: decorationEnd.lineNumber,
                endColumn: decorationEnd.column,
              },
              options: {
                marginClassName: tw('bg-info-7'),
                className: tw('rounded-sm ring-1 ring-info-10'),
              },
            })
          } /* if (change[0] === diff.DELETE) */ else {
            const startPosition = file.model.getPositionAt(offset)
            offset += change[1].length
            const endPosition = file.model.getPositionAt(offset)

            const nextChange = changes[index + 1]

            if (nextChange?.[0] === diff.INSERT) {
              index += 1

              // replace
              edits.push({
                range: {
                  startLineNumber: startPosition.lineNumber,
                  startColumn: startPosition.column,
                  endLineNumber: endPosition.lineNumber,
                  endColumn: endPosition.column,
                },
                text: nextChange[1],
                forceMoveMarkers: true,
              })

              const decorationEnd = file.model.getPositionAt(
                offset - change[1].length + nextChange[1].length,
              )
              decorations.push({
                range: {
                  startLineNumber: startPosition.lineNumber,
                  startColumn: startPosition.column,
                  endLineNumber: decorationEnd.lineNumber,
                  endColumn: decorationEnd.column,
                },
                options: {
                  marginClassName: tw('bg-info-7'),
                  className: tw('rounded-sm ring-1 ring-info-10'),
                },
              })
            } else {
              // simple delete
              edits.push({
                range: {
                  startLineNumber: startPosition.lineNumber,
                  startColumn: startPosition.column,
                  endLineNumber: endPosition.lineNumber,
                  endColumn: endPosition.column,
                },
                text: null,
                forceMoveMarkers: true,
              })
            }
          }
        }
      } else {
        edits.push({
          range: file.model.getFullModelRange(),
          text: value,
          forceMoveMarkers: true,
        })
      }

      if (file.model === editor.getModel()) {
        if (file.readonly) {
          editor.updateOptions({ readOnly: false })
        }

        editor.executeEdits('', edits)

        editor.revealRangeNearTop(
          (edits.find((edit) => edit.text) || edits[0]).range,
          monaco.editor.ScrollType.Smooth,
        )

        if (hadValue && file.readonly && decorations.length) {
          valueEditsDecorations.set(editor.createDecorationsCollection(decorations))
        }

        editor.pushUndoStop()

        if (file.readonly) {
          editor.updateOptions({ readOnly: true })
        }
      } else {
        file.model.applyEdits(edits)
      }

      monaco.loadModelTypeDeclarations(file.model, versions)
    }

    scheduleLayout()
  }

  // sync readonly flag
  $: if (browser && monaco && editor) {
    const file = files.get(path)

    if (file) {
      file.readonly = readonly

      if (
        file.model === editor.getModel() &&
        editor.getOption(monaco.editor.EditorOption.readOnly) !== readonly
      ) {
        editor.updateOptions({ readOnly: readonly })
      }
    }
  }

  // sync updateOn flag
  $: {
    const file = files.get(path)

    if (file) {
      file.updateOn = updateOn
    }
  }

  // sync language
  $: if (browser && monaco && language) {
    const file = files.get(path)

    if (file) {
      monaco.editor.setModelLanguage(file.model, language)

      monaco.loadModelTypeDeclarations(file.model, versions)
    }
  }

  $: if (browser && line != null && editor) {
    editor.revealLine(line)
  }

  $: if (browser && editor && options) {
    editor.updateOptions(options)
  }

  $: if (browser && theme && monaco) {
    monaco.editor.setTheme(theme + ($colorScheme === 'dark' ? '-dark' : ''))
  }

  export function focus() {
    editor?.focus()
    scheduleLayout()
  }

  const scheduleLayout = debounce(() => requestAnimationFrame(layout), 10)

  export function layout() {
    editor?.layout()
  }

  export function format() {
    trigger('editor.action.formatDocument')
  }

  /**
   * Directly trigger a handler or an editor action.
   * @param {string} handlerId The id of the handler or the id of a contribution.
   * @param {any=} payload Extra data to be sent to the handler.
   * @param {string | null | undefined=} source The source of the call.
   */
  export function trigger(handlerId, payload, source) {
    focus()
    editor?.trigger(source, handlerId, payload)
  }

  export function reset() {
    model = null
    value = ''
    language = undefined

    if (editor) {
      get(valueEditsDecorations)?.clear()
      editor.restoreViewState(null)
      editor.setModel(null)
    }

    for (const file of files.values()) {
      try {
        if (!file.model.isDisposed()) {
          file.model.dispose()
        }
      } catch {}
    }

    files.clear()

    monaco?.cleanupWorkspace()
  }

  if (browser) {
    onMount(() => {
      const handleResize = debounce(layout, 10)

      addEventListener('resize', handleResize)
      return () => removeEventListener('resize', handleResize)
    })

    onDestroy(() => {
      try {
        editor?.dispose()
      } catch {}

      editor = null
      reset()
    })

    import('$lib/monaco')
      .then((_) => {
        monaco = _
      })
      .catch((error) => {
        console.error('Failed to load monaco editor', error)
        // TODO: fallback to https://touchifyapp.github.io/svelte-codemirror-editor/javascript
      })
  }

  $: if (browser && monaco && editorElement && !editor) {
    editor = monaco.editor.create(
      editorElement,
      {
        model: null,
        minimap: {
          enabled: false,
        },
        fontSize: 14,
        suggestFontSize: 14,
        codeLensFontSize: 14,
        fontFamily: tw.theme('fontFamily', 'mono').toString(),
        tabSize: 2,
        detectIndentation: true,
        cursorBlinking: 'smooth',
        scrollBeyondLastLine: false,
        hover: { enabled: true, delay: 300, sticky: true },
        colorDecorators: true,
        suggest: {
          filterGraceful: true,
          showWords: false,
          showStatusBar: true,
          preview: true,
          previewMode: 'subwordSmart',
        },
        inlineSuggest: { enabled: true, mode: 'subwordSmart' },
        suggestSelection: 'first',
        acceptSuggestionOnEnter: 'smart',
        definitionLinkOpensInPeek: true,
        peekWidgetDefaultFocus: 'editor',
        inlayHints: {
          fontSize: 12,
        },
        bracketPairColorization: {
          enabled: true,
          independentColorPoolPerBracketType: true,
        },
        // experimental: {
        //   stickyScroll: {
        //     enabled: true,
        //   },
        // },
        // https://microsoft.github.io/monaco-editor/playground.html#creating-the-editor-syntax-highlighting-for-html-elements
        // The colorizeElement-function will read the data-lang-attribute
        // from the element to select the correct language mode. In this
        // sample it is text/css.
        // monaco.editor.colorizeElement(document.getElementById('code'));
        // readOnly: true,
        ...options,
        theme: theme + ($colorScheme === 'dark' ? '-dark' : ''),
        readOnly: readonly,
      },
      overrideServices,
    )

    disposables.add(editor)

    // TODO: "editor.action.clipboardCopyWithSyntaxHighlightingAction"
    // console.log(editor.getSupportedActions().map((x) => x.id))
    // console.log(
    //   'editor.action.triggerSuggest',
    //   editor.getAction('editor.action.triggerSuggest'),
    // )

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP, () =>
      editor?.trigger('ctrl-shift-p', 'editor.action.quickCommand', null),
    )

    // TODO: toggle line comment
    // editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Digit7, () =>
    //   editor?.trigger('ctrl-shift-7', 'editor.action.commentLine', null),
    // )

    editor.addAction({
      id: 'editor.action.formatDocument',
      label: 'Format Document',
      keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
      // precondition: 'editorTextFocus && !editorReadonly',
      run: async () => {
        if (editor && monaco) {
          const file = files.get(path)

          if (file) {
            const source = file.model.getValue()
            const usedPath = path

            const formatted = await prettier.format(source, {
              filepath: path,
            })

            if (
              usedPath === path &&
              !file.model.isDisposed() &&
              file.model === editor.getModel() &&
              source === file.model.getValue()
            ) {
              value = formatted
            }
          }
        }
      },
    })

    // TODO: add save actions to contextMenu
    editor.addAction({
      id: 'file:save',
      label: 'File: Save',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        if (editor && monaco) {
          const file = files.get(path)

          if (file) {
            const isDirty = file.value !== file.model.getValue()

            file.value = file.model.getValue()
            file.dirty = false

            value = file.value
            dirty = file.dirty

            if (isDirty) {
              emitChange(path, file.value, file.model, editor, monaco)
            }

            dispatch('save', { path, value: file.value, model: file.model, editor, monaco })
          }
        }
      },
    })

    editor.addAction({
      id: 'file:save:all',
      label: 'File: Save All',
      keybindings: [monaco.KeyMod.Alt | monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        if (editor && monaco) {
          for (const [path, file] of files) {
            const isDirty = file.value !== file.model.getValue()

            file.value = file.model.getValue()
            file.dirty = false

            value = file.value
            dirty = file.dirty

            if (isDirty) {
              emitChange(path, file.value, file.model, editor, monaco)
            }
          }

          dispatch('saveAll', { editor, monaco })
        }
      },
    })

    editor.onDidDispose(dispose)

    // Update the preview when scrolling through the suggest list
    // Based on https://github.com/tailwindlabs/play.tailwindcss.com/blob/master/src/monaco/html.js#L178
    let findSuggestWidgetTimer = setTimeout(function findSuggestWidget() {
      let widget = editor?._contentWidgets['editor.widget.suggestWidget']?.widget?._widget
      if (widget) {
        // widget.onDetailsKeyDown((...args) => console.debug('onDetailsKeyDown', ...args))

        disposables.add(
          widget.onDidFocus(({ item: { completion } }) => {
            const model = editor?.getModel()

            if (model && completion.range?.startLineNumber != null) {
              const value = model.getValue()

              const start = model.getOffsetAt({
                lineNumber: completion.range.startLineNumber,
                column: completion.range.startColumn,
              })
              const end = model.getOffsetAt({
                lineNumber: completion.range.endLineNumber,
                column: completion.range.endColumn,
              })

              dispatch('transient', {
                path,
                value: value.slice(0, start) + completion.insertText + value.slice(end),
              })
            }
          }),
        )

        disposables.add(
          widget.onDidHide(() => {
            dispatch('transient', { path })
          }),
        )

        // widget.onDidSelect((...args) => console.debug('onDidSelect', ...args))
        // widget.onDidShow((...args) => console.debug('onDidShow', ...args))
      } else if (editor) {
        findSuggestWidgetTimer = setTimeout(findSuggestWidget, 50)
      }
    }, 15)

    disposables.add({
      dispose() {
        clearTimeout(findSuggestWidgetTimer)
      },
    })

    monaco.editor.onDidChangeMarkers((uris) => {
      if (editor && monaco) {
        const file = files.get(path)

        if (file && file.model === editor.getModel()) {
          const editorUri = file.model.uri.toString()

          const currentEditorHasMarkerChanges = uris.find((uri) => uri.toString() === editorUri)

          if (currentEditorHasMarkerChanges) {
            dispatch('validate', {
              markers: monaco.editor.getModelMarkers({ resource: file.model.uri }),
              path,
              value: file.value,
              model: file.model,
              editor,
              monaco,
            })
          }
        }
      }
    })

    dispatch('ready', { editor, monaco })
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://cdn.skypack.dev" crossOrigin="anonymous" />
</svelte:head>

<div
  class={cx('~(relative,flex,justify-center,content-center) ~([text-align:initial])', className)}
>
  {#if !editor}
    <slot name="loading">
      <div class="flex place-items-center text-neutral-11">Loading ...</div>
    </slot>
  {/if}

  <div class="relative flex-auto" hidden={!editor}>
    <div class="absolute inset-0 w-full h-full" bind:this={editorElement} />
  </div>
</div>
