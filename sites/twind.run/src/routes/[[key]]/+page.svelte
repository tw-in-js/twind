<script context="module">
  import { injectGlobal } from 'twind'

  // Based on https://github.com/tailwindlabs/play.tailwindcss.com/blob/master/src/css/main.css
  injectGlobal`
    main .splitpanes.default-theme .splitpanes__pane {
      background-color: inherit;
      overflow: visible;
    }

    main .splitpanes.default-theme {
      & .splitpanes__splitter {
        @apply bg-brand-6 border-brand-7;

        &::before,&::after {
          @apply z-30;
        }
      }

      &.splitpanes--vertical .splitpanes__splitter {
        @apply w-px;
      }

      &.splitpanes--horizontal .splitpanes__splitter {
        @apply h-px;
      }
    }
  `
</script>

<script>
  import debounce from 'just-debounce'

  import { onMount } from 'svelte'
  import { get, writable } from 'svelte/store'

  import tinykeys from 'tinykeys'
  import copy from 'clipboard-copy'
  import { Pane, Splitpanes } from 'svelte-splitpanes'
  import { cx } from 'twind'

  import { base } from '$app/paths'
  import { browser } from '$app/environment'
  import { page } from '$app/stores'

  import prettier from '$lib/prettier'
  import transpile from '$lib/transpile'
  import intellisense, {INTELLISENSE_VERSION} from '$lib/intellisense'

  import Code from './code.svelte'
  import Preview from './preview.svelte'
  import Head from '$lib/components/head.svelte'
  import Header from '$lib/components/header.svelte'
  import Icon, {
    CheckCircle16,
    EllipsisHorizontalMini,
    GitBranch24,
    Link16,
    LoadingSpin,
    ShareAndroid24,
    Stars,
    Upload24,
  } from '$lib/icons'
  import { getTurnstileToken } from '$lib/turnstile'

  /** @type {import('./$types').PageData} */
  export let data

  /**
   * @param {import('./$types').PageData['workspace']} workspace
   */
  function serialize(workspace) {
    return JSON.stringify(workspace, ['html', 'script', 'config', 'manifest', 'path', 'value'])
  }

  let source = serialize(data.workspace)

  /** @type {import('svelte/store').Writable<import('./$types').PageData['workspace']>} */
  let workspace = writable(JSON.parse(source))

  /** Used to re-create the editor when data.workspace changes */
  let uid = 1

  $: hasDirtyFiles = Object.values($workspace).some((file) => file.dirty)
  $: hasChangedFiles = source !== serialize($workspace)
  $: isDirty = hasDirtyFiles || hasChangedFiles

  $: if (browser && source !== serialize(data.workspace)) {
    source = serialize(data.workspace)
    workspace.set(JSON.parse(source))
    // The editor is keyed by the source -> it will start with a clean state
    uid += 1
  }

  /** @type {['html', 'script', 'config', 'manifest']} */
  const fileTabOrder = ['html', 'script', 'config', 'manifest']
  /** @type {any} */
  const activeFileTabParam = $page.url.searchParams.get('file')
  /** @type {'html' | 'script' | 'config' | 'manifest'} */
  let activeFileTab = fileTabOrder.includes(activeFileTabParam) ? activeFileTabParam : 'html'

  /** @type {['preview', 'css', 'html']} */
  const resultTabOrder = ['preview', 'css', 'html']
  /** @type {any} */
  const activeResultTabParam = $page.url.searchParams.get('result')
  /** @type {'preview' | 'css' | 'html'} */
  let activeResultTab = resultTabOrder.includes(activeResultTabParam)
    ? activeResultTabParam
    : 'preview'

  $: if (browser) {
    const url = new URL(location.href)

    if (activeFileTab === 'html') {
      url.searchParams.delete('file')
    } else {
      url.searchParams.set('file', activeFileTab)
    }

    if (activeResultTab === 'preview') {
      url.searchParams.delete('result')
    } else {
      url.searchParams.set('result', activeResultTab)
    }

    history.replaceState(history.state, '', url)
  }

  /** @type {Code | null} */
  let editor = null

  /** @type {Preview | null} */
  let preview = null

  /** @type {Code | null} */
  let result = null

  /** @type {Record<string, string>} */
  let versions = {}

  $: if (browser) {
    try {
      const manifest = JSON.parse($workspace.manifest.value || '{}')

      const nextVersions = {
        ...manifest.peerDependencies,
        ...manifest.devDependencies,
        ...manifest.dependencies,
        ...manifest.versions,
      }

      if (JSON.stringify(versions) !== JSON.stringify(nextVersions)) {
        versions = nextVersions
      }
    } catch (error) {
      console.error(`Failed to parse manifest`, error)
    }
  }

  /** @type {import('svelte/store').Writable<Record<string, string> | null>} */
  const lastVersions = writable(null)

  /** @type {import('svelte/store').Writable<string | null>} */
  const lastConfig = writable(null)

  $: if (
    browser &&
    (get(lastVersions) !== versions || get(lastConfig) !== $workspace.config.value)
  ) {
    lastVersions.set(versions)
    lastConfig.set($workspace.config.value)

      transpile.transform({
        entry: `
          import { defineConfig } from 'twind'
          import { createIntellisense } from '@twind/intellisense@${INTELLISENSE_VERSION}'
          import config from '$/config'

          export default createIntellisense(defineConfig(config))
        `,
      }, {
        versions,
        modules: {
          '$/config': $workspace.config.value
        }
      }).then(({entry, importMap}) => {
        if (get(lastVersions) === versions && get(lastConfig) === $workspace.config.value) {
          return intellisense.init({ entry, importMap })
        }
      })
      .catch((error) => {
        console.error(`Failed to initialized autocomplete`, error)
      })
  }

  /** @type {{ style: string[]; html: string }} */
  let output = { style: [], html: '' }

  /** @type {{ css: string; html: string }} */
  let formatted = { css: '', html: '' }

  $: if (browser) {
    const usedStyle = output.style.join('\n')
    const usedHtml = output.html

    prettier
      .formatPreviewCSS(output.style)
      .then((result) => {
        if (usedStyle === output.style.join('\n')) {
          formatted.css = result
        }
      })
      .catch((error) => {
        console.error(`Failed to format output css`, error)
        if (usedStyle === output.style.join('\n')) {
          formatted.css = usedStyle
        }
      })

    prettier
      .format(output.html, { parser: 'html' })
      .then((result) => {
        if (usedHtml === output.html) {
          formatted.html = result
        }
      })
      .catch((error) => {
        console.error(`Failed to format output html`, error)
        if (usedHtml === output.html) {
          formatted.html = usedHtml
        }
      })
  }

  if (browser) {
    onMount(() => {
      /**
       * @param {BeforeUnloadEvent} event
       */
      function confirmUnload(event) {
        if (isDirty) {
          const confirmationMessage =
            'It looks like you have been editing something. ' +
            'If you leave before saving, your changes will be lost.'

          ;(event || window.event).returnValue = confirmationMessage // Gecko + IE
          return confirmationMessage // Gecko + Webkit, Safari, Chrome etc.
        }
      }

      addEventListener('beforeunload', confirmUnload)
      return () => removeEventListener('beforeunload', confirmUnload)
    })
  }

  const MOD_KEY = browser && /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'

  if (browser) {
    onMount(() =>
      tinykeys(window, {
        '$mod+Shift+KeyP': (event) => {
          event.preventDefault()
          editor?.trigger('editor.action.quickCommand', 'ctrl-shift-p')
        },
        '$mod+KeyS': (event) => {
          event.preventDefault()
          editor?.trigger('file:save', 'ctrl-s')
        },
        '$mod+Alt+KeyS': (event) => {
          event.preventDefault()
          editor?.trigger('file:save:all', 'ctrl-alt-s')
        },
        'Shift+Alt+KeyF': (event) => {
          event.preventDefault()
          editor?.trigger('editor.action.formatDocument', 'shift-alt-f')
        },
      }),
    )
  }

  /** @type {string | null} */
  let transientHTML = null

  let saving = false
  let forking = false
  let sharing = false

  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let copied = undefined
  /** @type {URL | null} */
  let shareLink = null

  $: if (isDirty && shareLink && !copied) {
    shareLink = null
  }

  /**
   * @template T
   * @param {T} text
   * @return {Promise<boolean>}
   */
  const copyToClipboard = browser
    ? (text) => {
        return copy(String(text))
          .then(() => {
            clearTimeout(copied)
            copied = setTimeout(() => {
              copied = undefined
            }, 2500)
            return true
          })
          .catch((error) => {
            console.error(error)
            return false
          })
      }
    : () => Promise.resolve(false)
</script>

<Head />

<div class="w-screen h-screen flex flex-col">
  <Header>
    <button
      type="button"
      title="Save workspace"
      class="flex items-center rounded-md border border-transparent px-3 py-1 text-sm font-medium text-brand-11 shadow-sm enabled:(hover:(text-brand-12 bg-brand-4) focus:(text-brand-12 bg-brand-5 bg-transparent)) disabled:opacity-70"
      disabled={saving || isDirty}
    >
      {#if saving}
        <Icon src={LoadingSpin} class="-ml-1 mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
      {:else}
        <Icon src={Upload24} class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
      {/if}
      Save
    </button>

    <button
      type="button"
      title="Fork workspace"
      class="flex items-center rounded-md border border-transparent px-3 py-1 text-sm font-medium text-brand-11 shadow-sm enabled:(hover:(text-brand-12 bg-brand-4) focus:(text-brand-12 bg-brand-5)) disabled:opacity-70"
      disabled={forking}
    >
      {#if saving}
        <Icon src={LoadingSpin} class="-ml-1 mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
      {:else}
        <Icon src={GitBranch24} class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
      {/if}
      Fork
    </button>

    <button
      type="button"
      title="Create share Link"
      class="flex items-center rounded-md border border-transparent px-3 py-1 text-sm font-medium text-brand-11 shadow-sm enabled:(hover:(text-brand-12 bg-brand-4) focus:(text-brand-12 bg-brand-5)) disabled:opacity-70"
      disabled={sharing || !isDirty}
      on:click={() => {
        if (
          hasDirtyFiles &&
          !confirm(
            `It looks like you have been editing ${
              Object.values($workspace).find((file) => file.dirty)?.path || 'something'
            }. Do you want to share without including these changes?`,
          )
        ) {
          return
        }

        sharing = true
        getTurnstileToken('share')
          .then((token) => {
            if (!token) return

            const body = new FormData()

            body.set('version', '1')
            body.set('workspace', serialize($workspace))
            body.set('cf-turnstile-response', token)

            return fetch($page.url.pathname + '?/share', {
              method: 'POST',
              body: body,
              headers: {
                'x-sveltekit-action': 'true',
              },
            })
              .then((response) => response.json())
              .then(
                /** @param { import('@sveltejs/kit').ActionResult} result */
                (result) => {
                  console.debug(result)
                  if (result.type === 'success') {
                    // TODO: copy to clipboard, change url and show link
                    const url = new URL(`${base}/${result.data.key}`, location.href)
                    url.search = location.search
                    history.pushState(history.state, '', url)
                    // update tracking data to detect if something has changed
                    data.workspace = JSON.parse(serialize($workspace))
                    source = serialize($workspace)
                    return copyToClipboard(url).finally(() => {
                      shareLink = url
                    })
                  }
                  // TODO: handle non success response
                },
              )
          })
          .catch((error) => {
            console.error(error)
          })
          .finally(() => {
            sharing = false
          })
      }}
    >
      {#if sharing}
        <Icon src={LoadingSpin} class="-ml-1 mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
      {:else}
        <Icon src={ShareAndroid24} class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
      {/if}
      Share
    </button>

    {#if shareLink}
      <button
        type="button"
        title="Copy link"
        class="flex items-center -ml-2 px-3 py-1 text-xs font-medium text-brand-11 hover:text-brand-12 focus:text-brand-12"
        class:!text-success-11={copied}
        on:click={() => {
          if (shareLink) {
            copyToClipboard(shareLink)
          }
        }}
      >
        {#if copied}
          <Icon src={CheckCircle16} class="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
          Copied!
        {:else}
          <Icon src={Link16} class="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
          …{shareLink.pathname.slice(0, 7)}…
        {/if}
      </button>
    {/if}
  </Header>

  <main class="flex-auto flex relative border-t border-brand-7">
    <Splitpanes
      on:resize={debounce(() => {
        editor?.layout()
        result?.layout()
      }, 10)}
    >
      <Pane class="flex-auto flex flex-col">
        <div
          class="flex-none overflow-auto flex items-center justify-between gap-4 pl-(5 sm:6) pr-(4 lg:6)"
        >
          <div class="flex space-x-5">
            {#each fileTabOrder as file (file)}
              <button
                type="button"
                class={'relative flex py-3 text-sm leading-6 font-semibold focus:outline-none ' +
                  (activeFileTab === file
                    ? 'text-accent-11'
                    : 'text-brand-11 hover:text-brand-12 focus:text-brand-12')}
                on:click={() => {
                  activeFileTab = file
                  editor?.focus()
                }}
                ><span
                  class="absolute bottom-0 inset-x-0 bg-accent-11 h-0.5 rounded-full transition-opacity duration-150"
                  class:opacity-0={activeFileTab !== file}
                />{$workspace[file].path}{$workspace[file].dirty ? ' *' : ''}</button
              >
            {/each}
          </div>
          <div class="flex items-center gap-4">
            <button
              type="button"
              class="flex items-center hover:text-brand-12"
              title={`Format and focus editor (⇧ ⌥ F)`}
              on:click={() => editor?.format()}
            >
              <Icon src={Stars} class="w-5 h-5" label="Format and focus editor" />
            </button>
            <button
              type="button"
              class="flex items-center hover:text-brand-12"
              title={`Command Palette (⇧ ${MOD_KEY} P)`}
              on:click={() => editor?.trigger('editor.action.quickCommand')}
            >
              <Icon src={EllipsisHorizontalMini} class="w-5 h-5" label="Format and focus editor" />
            </button>
          </div>
        </div>

        {#key uid}
          <Code
            class="flex-auto"
            bind:this={editor}
            path={$workspace[activeFileTab].path}
            defaultValue={$workspace[activeFileTab].value}
            bind:dirty={$workspace[activeFileTab].dirty}
            bind:value={$workspace[activeFileTab].value}
            updateOn={activeFileTab === 'html' ? 'input' : 'save'}
            {versions}
            on:ready={(event) => {
              for (const file of [$workspace.config, $workspace.script]) {
                event.detail.monaco.loadTypeDeclarations(file.value, file.path, versions)
              }
            }}
            on:transient={(event) => {
              const { path, value } = event.detail
              if (path === 'index.html' && value != null) {
                transientHTML = value
              } else {
                transientHTML = null
              }
            }}
          />
        {/key}
      </Pane>

      <Pane class="flex-auto flex flex-col">
        <div class="flex-none overflow-auto flex items-center pl-5 sm:pl-6 pr-4 lg:pr-6">
          <div class="flex space-x-5">
            {#each resultTabOrder as tab (tab)}
              <button
                type="button"
                class={'relative flex py-3 text-sm leading-6 font-semibold focus:outline-none ' +
                  (activeResultTab === tab
                    ? 'text-accent-11'
                    : 'text-brand-11 hover:text-brand-12 focus:text-brand-12')}
                on:click={() => {
                  activeResultTab = tab
                  if (activeResultTab === 'preview') {
                    preview?.focus()
                  } else {
                    result?.focus()
                  }
                }}
                ><span
                  class="absolute bottom-0 inset-x-0 bg-accent-11 h-0.5 rounded-full transition-opacity duration-150"
                  class:opacity-0={activeResultTab !== tab}
                />{tab === 'preview' ? 'Preview' : tab.toUpperCase()}</button
              >
            {/each}
          </div>
        </div>

        <Preview
          bind:this={preview}
          class={cx('flex-auto', activeResultTab !== 'preview' && 'hidden')}
          html={transientHTML || $workspace.html.value}
          script={$workspace.script.value}
          config={$workspace.config.value}
          {versions}
          bind:output
        />

        <Code
          class={cx('flex-auto', activeResultTab === 'preview' && 'hidden')}
          bind:this={result}
          path={`preview://output.${activeResultTab}`}
          value={activeResultTab === 'preview' ? '' : formatted[activeResultTab]}
          updateOn="save"
          readonly
        />
      </Pane>
    </Splitpanes>
  </main>
</div>
