<script>
  import debounce from 'just-debounce'

  import { onMount } from 'svelte'
  import { get, writable } from 'svelte/store'

  import { createKeybindingsHandler } from 'tinykeys'
  import copy from 'clipboard-copy'
  import { Pane, Splitpanes } from 'svelte-splitpanes'
  import {
    Transition,
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@sastan/svelte-headlessui'

  import { base } from '$app/paths'
  import { browser } from '$app/environment'
  import { page } from '$app/stores'
  import { deserialize } from '$app/forms'

  import prettier from '$lib/prettier'
  import transpile from '$lib/transpile'
  import intellisense from '$lib/intellisense'
  import { mounted } from '$lib/stores'

  import Loader from './loader.svelte'
  import Head from '$lib/components/head.svelte'
  import Header from '$lib/components/header.svelte'
  import Icon, {
    CheckCircle16,
    CheckSolid,
    ChevronUpDownMini,
    EllipsisHorizontalMini,
    Link16,
    LoadingSpin,
    ShareAndroid24,
    Stars,
  } from '$lib/icons'
  import { getTurnstileToken } from '$lib/turnstile'

  import { cx, injectGlobal } from '$lib/twind'

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

  /** @type {import('./$types').PageData} */
  export let data

  /**
   * @param {import('./$types').PageData['workspace']} workspace
   */
  function serialize(workspace) {
    return JSON.stringify(workspace, ['version', 'html', 'script', 'config', 'path', 'value'])
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

  $: manifest =
    data.manifests.find((manifest) => manifest.version === $workspace.version) || data.manifests[0]

  /** @type {['html', 'script', 'config']} */
  const fileTabOrder = ['html', 'script', 'config']
  /** @type {any} */
  const activeFileTabParam = $page.url.searchParams.get('file')
  /** @type {'html' | 'script' | 'config'} */
  let activeFileTab = fileTabOrder.includes(activeFileTabParam) ? activeFileTabParam : 'html'

  /** @type {['preview', 'css', 'html', 'info']} */
  const resultTabOrder = ['preview', 'css', 'html', 'info']
  /** @type {any} */
  const activeResultTabParam = $page.url.searchParams.get('result')
  /** @type {'preview' | 'css' | 'html' | 'info'} */
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

  /** @type {import('./code.svelte').default | null} */
  let editor = null

  /** @type {import('./preview.svelte').default | null} */
  let preview = null

  /** @type {import('./code.svelte').default | null} */
  let result = null

  /** @type {import('svelte/store').Writable<string | null>} */
  const lastVersion = writable(null)

  /** @type {import('svelte/store').Writable<string | null>} */
  const lastConfig = writable(null)

  $: if (
    browser &&
    (get(lastVersion) !== $workspace.version || get(lastConfig) !== $workspace.config.value)
  ) {
    lastVersion.set($workspace.version)
    lastConfig.set($workspace.config.value)

    transpile
      .transform(
        {
          entry: `
          import { defineConfig } from '@twind/core'
          import { createIntellisense } from '@twind/intellisense'
          import config from '$/config'

          export default createIntellisense(defineConfig(config))
        `,
        },
        {
          manifest,
          modules: {
            '$/config': $workspace.config.value,
          },
        },
      )
      .then(({ entry, importMap }) => {
        if (
          $mounted &&
          get(lastVersion) === $workspace.version &&
          get(lastConfig) === $workspace.config.value
        ) {
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
        if ($mounted && usedHtml === output.html) {
          formatted.html = result
        }
      })
      .catch((error) => {
        console.error(`Failed to format output html`, error)
        if ($mounted && usedHtml === output.html) {
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
    onMount(() => {
      const keyHandler = createKeybindingsHandler({
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
      })

      addEventListener('keydown', keyHandler)
      return () => removeEventListener('keydown', keyHandler)
    })
  }

  /** @type {string | null} */
  let transientHTML = null

  // let saving = false
  // let forking = false
  let sharing = false

  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let copied = undefined
  /** @type {URL | null} */
  let shareLink = null

  $: if (isDirty && shareLink && !copied) {
    shareLink = null
  }

  /**
   * @param {unknown} text
   * @return {Promise<boolean>}
   */
  async function copyToClipboard(text) {
    try {
      await copy(String(text))
      clearTimeout(copied)
      copied = setTimeout(() => {
        copied = undefined
      }, 2500)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  /**
   * @param {(link: string, workspace: import('./$types').PageData['workspace'], manifest: import('./$types').PageData['manifests'][number]) => any | Promise<any>} share
   */
  async function withShareLink(share) {
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

    try {
      const token = await getTurnstileToken('share')
      if (!token) {
        console.warn('Failed to get turnstile token')
        return
      }

      const body = new FormData()
      const stringifiedWorkspace = serialize($workspace)

      body.set('version', '1')
      body.set('workspace', stringifiedWorkspace)
      body.set('cf-turnstile-response', token)

      const response = await fetch($page.url.pathname + '?/share', {
        method: 'POST',
        body: body,
        headers: {
          'x-sveltekit-action': 'true',
        },
      })
      /** @type { import('@sveltejs/kit').ActionResult} result */
      const result = deserialize(await response.text())

      if (result.type === 'success' && result.data?.key) {
        // copy to clipboard, change url and show link
        const url = new URL(`${base}/${result.data.key}`, location.href)
        url.search = location.search
        history.pushState(history.state, '', url)
        // update tracking data to detect if something has changed
        data.workspace = JSON.parse(stringifiedWorkspace)
        source = stringifiedWorkspace

        console.debug(`Saved workspace as ${result.data.key}`, result)

        try {
          await share(url.toString(), data.workspace, manifest)
        } finally {
          shareLink = url
        }
      } else {
        // TODO: handle non success response
        console.warn('Failed to get workspace id', result)
      }
    } catch (error) {
      // TODO: show error in toast
      console.error(error)
    }
  }
</script>

<Head />

<div class="w-screen h-screen flex flex-col antialiased bg-brand-1 text-brand-11">
  <Header {withShareLink}>
    <!--
    <button
      type="button"
      title="Save workspace"
      class="flex gap-2 items-center rounded-md border border-transparent px-3 py-1 text-sm font-medium text-brand-11 shadow-sm enabled:(hover:(text-brand-12 bg-brand-4) focus:(text-brand-12 bg-brand-5 bg-transparent)) disabled:opacity-70"
      disabled={saving || isDirty}
    >
      {#if saving}
        <Icon src={LoadingSpin} class="-ml-1 h-5 w-5 animate-spin" />
      {:else}
        <Icon src={Upload24} class="-ml-1 h-5 w-5" />
      {/if}
      Save
    </button>

    <button
      type="button"
      title="Fork workspace"
      class="flex gap-2 items-center rounded-md border border-transparent px-3 py-1 text-sm font-medium text-brand-11 shadow-sm enabled:(hover:(text-brand-12 bg-brand-4) focus:(text-brand-12 bg-brand-5)) disabled:opacity-70"
      disabled={forking}
    >
      {#if saving}
        <Icon src={LoadingSpin} class="-ml-1 h-5 w-5 animate-spin" />
      {:else}
        <Icon src={GitBranch24} class="-ml-1 h-5 w-5" />
      {/if}
      Fork
    </button>
    -->
    <Listbox
      class="relative group max-w-([6rem] lg:[12rem] xl:fit)"
      value={$workspace.version}
      on:change={(event) => ($workspace.version = event.detail)}
      let:open
    >
      <ListboxLabel class="sr-only">Change selected version</ListboxLabel>

      <ListboxButton
        class="relative w-full cursor-default rounded-md text-sm text-brand-11 border border-transparent px-3 py-1 pr-8 text-left hover:(text-brand-12 bg-brand-4 border-brand-8 shadow-sm) group-focus-within:(text-brand-12 bg-brand-5 border-brand-8 shadow-sm outline-none ring-1 ring-brand-7)"
      >
        <span class="flex items-center">
          <span class="block truncate">v{manifest.version}</span>
        </span>
        <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
          <Icon
            src={ChevronUpDownMini}
            class="h-5 w-5 text-neutral-11 group-focus-within:text-neutral-12"
          />
        </span>
      </ListboxButton>

      <Transition
        show={open}
        leave="transition ease-in motion-safe:duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ListboxOptions
          static
          class="absolute left-0 z-10 mt-2 w-64 origin-top-left divide-y divide-brand-6 overflow-hidden rounded-md bg-brand-3 shadow-lg ring-1 ring-brand-7 ring-opacity-5 focus:outline-none"
        >
          {#each data.manifests as manifest (manifest.version)}
            <ListboxOption
              value={manifest.version}
              class={({ active, selected }) =>
                cx(
                  'cursor-default select-none p-2 text-sm',
                  active
                    ? 'text-brand-12 bg-brand-4'
                    : selected
                    ? 'text-accent-11 bg-brand-3'
                    : 'text-brand-11 bg-brand-3',
                )}
              let:active
              let:selected
            >
              <div class="flex flex-col gap-1">
                <div class="flex justify-between">
                  <p class={selected ? 'font-semibold' : 'font-normal'}>
                    v{manifest.version}
                  </p>
                  {#if selected}
                    <Icon src={CheckSolid} class="h-5 w-5" />
                  {/if}
                </div>
                <p
                  class={cx(
                    'flex gap-1 justify-between text-xs',
                    active ? 'text-neutral-12' : 'text-neutral-11',
                  )}
                >
                  {#if manifest.pr}
                    <a
                      href={`https://github.com/tw-in-js/twind/pull/${manifest.pr}`}
                      class="underline"
                      target="_blank"
                      rel="external noopener noreferrer nofollow"
                    >
                      PR #{manifest.pr}</a
                    >
                    — still in development
                  {:else if manifest['dist-tag'] === 'latest'}
                    stable version — for most users
                  {:else if manifest['dist-tag'] === 'next'}
                    next version — for early adopters
                  {:else}
                    canary version — still in development
                  {/if}
                </p>
              </div>
            </ListboxOption>
          {/each}
        </ListboxOptions>
      </Transition>
    </Listbox>

    <button
      type="button"
      title="Create shareable link"
      class="flex gap-2 items-center rounded-md border border-transparent px-(1 md:3) py-1 text-sm font-medium text-brand-11 enabled:(hover:(text-brand-12 bg-brand-4 border-brand-8 shadow-sm) focus:(text-brand-12 bg-brand-5 border-brand-8 shadow-sm outline-none ring-1 ring-brand-7)) disabled:opacity-70"
      disabled={sharing || !isDirty}
      on:click={() => {
        sharing = true
        withShareLink(copyToClipboard).finally(() => {
          sharing = false
        })
      }}
    >
      {#if sharing}
        <Icon
          src={LoadingSpin}
          class="-ml-1 h-5 w-5 animate-spin"
          label="Creating a shareable link"
        />
      {:else}
        <Icon src={ShareAndroid24} class="-ml-1 h-5 w-5" label="Create shareable link" />
      {/if}
      <span aria-hidden="true">Share</span>
    </button>

    {#if shareLink}
      <button
        type="button"
        title="Copy link"
        class="flex gap-2 items-center px-(1 md:3) py-1 text-xs font-medium text-brand-11 hover:text-brand-12 focus:text-brand-12"
        class:!text-success-11={copied}
        on:click={() => {
          if (shareLink) {
            copyToClipboard(shareLink)
          }
        }}
      >
        {#if copied}
          <Icon src={CheckCircle16} class="-ml-1 h-4 w-4" />
          Copied!
        {:else if shareLink.pathname.length > 23}
          {shareLink.pathname.slice(0, 7)}…{shareLink.pathname.slice(-7)}
        {:else}
          {shareLink.pathname}
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
        <div class="flex-none flex items-center justify-between gap-4 pl-(5 sm:6) pr-(4 lg:6)">
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
          <div class="flex items-center gap-4 overflow-auto">
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
              class="flex items-center hover:text-brand-12 sr-only md:not-sr-only"
              title={`Command Palette (⇧ ${MOD_KEY} P)`}
              on:click={() => editor?.trigger('editor.action.quickCommand')}
            >
              <Icon src={EllipsisHorizontalMini} class="w-5 h-5" label="Format and focus editor" />
            </button>
          </div>
        </div>

        {#if browser}
          {#await import('./code.svelte') then { default: Code }}
            {#key uid}
              <Code
                bind:this={editor}
                path={$workspace[activeFileTab].path}
                defaultValue={$workspace[activeFileTab].value}
                bind:dirty={$workspace[activeFileTab].dirty}
                bind:value={$workspace[activeFileTab].value}
                updateOn={activeFileTab === 'html' ? 'input' : 'save'}
                {manifest}
                on:ready={(event) => {
                  for (const file of [$workspace.config, $workspace.script]) {
                    event.detail.monaco.loadTypeDeclarations(file.value, file.path, manifest)
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
          {/await}
        {:else}
          <Loader />
        {/if}
      </Pane>

      <Pane class="flex-auto flex flex-col">
        <div class="flex-none overflow-auto flex items-center pl-5 sm:pl-6 pr-4 lg:pr-6">
          <div class="flex space-x-5">
            {#each resultTabOrder as tab (tab)}
              <button
                type="button"
                class={'relative flex py-3 text-sm leading-6 uppercase font-semibold focus:outline-none ' +
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
                />{tab}</button
              >
            {/each}
          </div>
        </div>

        {#if browser}
          {#await import('./preview.svelte') then { default: Preview }}
            <Preview
              bind:this={preview}
              class={activeResultTab === 'preview' ? '' : 'hidden'}
              html={transientHTML || $workspace.html.value}
              script={$workspace.script.value}
              config={$workspace.config.value}
              {manifest}
              bind:output
            />
          {/await}

          {#await import('./code.svelte') then { default: Code }}
            <Code
              class={activeResultTab === 'css' || activeResultTab === 'html' ? '' : 'hidden'}
              bind:this={result}
              path={`preview://output.${activeResultTab}`}
              value={activeResultTab === 'css' || activeResultTab === 'html'
                ? formatted[activeResultTab]
                : ''}
              {manifest}
              updateOn="save"
              readonly
            />
          {/await}

          {#await import('./manifest.svelte') then { default: Manifest }}
            <Manifest class={activeResultTab === 'info' ? '' : 'hidden'} {manifest} />
          {/await}
        {:else}
          <Loader />
        {/if}
      </Pane>
    </Splitpanes>
  </main>
</div>
