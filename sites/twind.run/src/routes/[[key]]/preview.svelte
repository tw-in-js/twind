<script>
  import { onMount } from 'svelte'
  import * as Comlink from 'comlink'
  import { cx } from '$lib/twind'

  import { browser, dev } from '$app/environment'

  import transpile from '$lib/transpile'
  import { mounted } from '$lib/stores'

  import srcdoc from './preview.html?raw'
  import scriptSrc from './preview'
  import Loader from './loader.svelte'

  /** The HTMl to render */
  export let html = ''

  /** The source JS module to import */
  export let script = ''

  /** The source of twind config module */
  export let config = 'export default {}'

  /**
   * The versions to use for resolving imports.
   *
   * @type {import('$lib/types').Manifest}
   */
  export let manifest

  export let title = 'Preview'
  export let sandbox =
    'allow-same-origin allow-top-navigation allow-top-navigation-to-custom-protocols allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts allow-forms allow-pointer-lock'

  /** Class name for the preview container */
  let className = ''
  export { className as class }

  /**
   * The generated output.
   *
   * @type {{ style: string[]; html: string }}
   */
  export let output = { style: [], html: '' }

  export function focus() {
    iframeElement?.focus()
  }

  /**
   * The current status.
   *
   * @type {string}
   */
  // TODO: display status overlay
  let status = ''

  /** @type {HTMLIFrameElement} */
  let iframeElement

  let isReady = false

  /** @type {(state: {preview: import('./preview').Preview, html?: string, script?: string, config?: string, manifest?: string }) => void} */
  let ready

  /** @type {Promise<{preview: import('./preview').Preview, html?: string, script?: string, config?: string, manifest?: string }>} */
  let pendingOperation = new Promise((resolve) => {
    ready = resolve
  })

  /** @param {[html: string, script: string, config: string, manifest: import('$lib/types').Manifest]} _ */
  function update(..._) {
    pendingOperation = pendingOperation.then(async (state) => {
      if (!$mounted) return state

      try {
        const currentHTML = html
        const currentScript = script
        const currentConfig = config
        const currentManifest = manifest.url

        if (
          state.config !== currentConfig ||
          state.script !== currentScript ||
          state.manifest !== currentManifest
        ) {
          // full update
          status = 'Transpiling files ...'

          const { entry, script, importMap } = await transpile.transform(
            {
              entry: `
                export * from 'twind'
                export { default as config } from '$/config'
              `,
              script: currentScript,
            },
            {
              manifest,
              modules: {
                '$/config': currentConfig,
              },
            },
          )

          status = 'Updating preview ...'

          state.preview.setup(
            {
              importMap,
              entry,
              script,
              html: currentHTML,
            },
            /** @type {(result: { style: string[]; html: string }) => void}*/
            Comlink.proxy((result) => {
              if (output.html !== result.html) {
                output.html = result.html
              }

              if (output.style.join('\n') !== result.style.join('\n')) {
                output.style = result.style
              }
            }),
          )
        } else if (state.html !== currentHTML) {
          status = 'Updating preview html ...'

          await state.preview.update({ html: currentHTML })
        }

        return {
          ...state,
          html: currentHTML,
          script: currentScript,
          config: currentConfig,
          manifest: currentManifest,
        }
      } catch (error) {
        console.error(`Failed to update the preview`, error)
        return state
      } finally {
        status = ''
      }
    })
  }

  $: if (browser) {
    update(html, script, config, manifest)
  }

  if (browser) {
    onMount(() => {
      /**
       * @param {MessageEvent} event
       */
      function waitForIframe(event) {
        if (event.data === 'preview:ready') {
          if (dev && isReady) {
            pendingOperation = pendingOperation.then((state) => ({
              ...state,
              preview: Comlink.wrap(Comlink.windowEndpoint(iframeElement.contentWindow)),
            }))
          } else {
            removeEventListener('message', waitForIframe)
            isReady = true
            ready({ preview: Comlink.wrap(Comlink.windowEndpoint(iframeElement.contentWindow)) })
          }
        }
      }

      addEventListener('message', waitForIframe, false)
      return () => removeEventListener('message', waitForIframe)
    })
  }

  /** @type {string}*/
  let srcUrl
  onMount(() => {
    srcUrl = URL.createObjectURL(
      new Blob([srcdoc.replace(/%script.src%/g, scriptSrc)], { type: 'text/html' }),
    )
    return () => URL.revokeObjectURL(srcUrl)
  })
</script>

<Loader {isReady} class={className}>
  <iframe
    bind:this={iframeElement}
    src={srcUrl}
    class={cx('w-full h-full', status && ' grayscale blur-sm')}
    hidden={!isReady}
    {title}
    {sandbox}
    allow="fullscreen"
  />
</Loader>
