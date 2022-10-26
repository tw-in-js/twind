// based on https://svelte.dev/repl
import type { Twind, Sheet, BaseTheme } from 'twind'

import * as Comlink from 'comlink'

import debounce from 'just-debounce'
import { createSystem, type ImportMap } from '$lib/system'

export interface Preview {
  setup(
    options: { importMap: ImportMap; entry: string; script: string; html: string },
    notify: (output: { style: string[]; html: string }) => void,
  ): Promise<void>

  update(options: { html?: string }): Promise<void>
}

export interface Script {
  beforeUpdate?: () => Promise<void>
  afterUpdate?: () => Promise<void>
  dispose?: () => Promise<void>
}

let tw: Twind<BaseTheme, string[]> | null = null
let observer: MutationObserver | null = null
let script: Script | null = null

const api: Preview = {
  async setup({ importMap, entry: entryURL, script: scriptURL, html }, notify) {
    observer?.disconnect()
    observer = null

    // Cleanup
    await script?.dispose?.()

    // remove all preload/prefetch links
    document.head
      .querySelectorAll('link[rel=prefetch],link[rel=preload]')
      .forEach((link) => link.remove())

    // Start fresh
    self.System = createSystem(importMap, (error, id, dependencies, isErrorSource) => {
      if (error && isErrorSource) {
        console.error({ error, id, dependencies, isErrorSource })
      }

      document.head
        .querySelector(
          `link[rel=prefetch][src=${JSON.stringify(id)}],link[rel=preload][src=${JSON.stringify(
            id,
          )}]`,
        )
        ?.remove()
    })

    // staticDeps
    addLinks(importMap, 'preload')

    // dynamicDeps
    addLinks(importMap, 'prefetch')

    const onChange = debounce(() => {
      if (observer && tw) {
        notify({ style: [...tw.target], html: document.body.innerHTML })
      }
    }, 100)

    const { setup, defineConfig, virtual, cssom, config } = await System.import(entryURL)

    tw?.destroy()
    document.body.innerHTML = ''

    tw = setup(defineConfig(config), (): Sheet<string[]> => {
      const sheets = [virtual(true), cssom()]

      return {
        get target() {
          return sheets[0].target
        },

        snapshot() {
          const restores = sheets.map((sheet) => sheet.snapshot())
          return () => restores.forEach((restore) => restore())
        },

        clear() {
          sheets.forEach((sheets) => sheets.clear())
          onChange()
        },

        destroy() {
          sheets.forEach((sheets) => sheets.destroy())
          onChange()
        },

        insert(css, index, rule) {
          sheets.forEach((sheets) => sheets.insert(css, index, rule))
          onChange()
        },

        resume: sheets[0].resume,
      }
    })

    // expose twind helpers to allow <script>...</script> within html
    // TODO: Object.assign(self, { tw, cx, tx, css, style })

    script = (await System.import(scriptURL)) as Script

    await script?.beforeUpdate?.()

    document.body.innerHTML = html

    await script?.afterUpdate?.()

    observer = new MutationObserver(onChange)
    observer.observe(document.body, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })

    onChange()
  },

  async update({ html }) {
    console.debug('preview:update', { html })
    if (html != null) {
      tw?.clear()

      await script?.beforeUpdate?.()

      document.body.innerHTML = html

      await script?.afterUpdate?.()
    }
  },
}

Comlink.expose(api, Comlink.windowEndpoint(parent))

parent.postMessage('preview:ready', '*')

addEventListener('message', function catchLinks(event) {
  removeEventListener('message', catchLinks)

  const top_origin = event.origin

  document.body.addEventListener('click', (event) => {
    if (event.which !== 1) return
    if (event.metaKey || event.ctrlKey || event.shiftKey) return
    if (event.defaultPrevented) return

    // ensure target is a link
    let el = event.target
    while (el && el.nodeName !== 'A') el = el.parentNode
    if (!el || el.nodeName !== 'A') return

    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external' || el.target) return

    event.preventDefault()

    if (el.href.startsWith(top_origin)) {
      const url = new URL(el.href)
      if (url.hash[0] === '#') {
        window.location.hash = url.hash
        return
      }
    }

    window.open(el.href, '_blank')
  })
})

function addLinks(importMap: ImportMap, rel: 'preload' | 'prefetch') {
  importMap[rel]?.forEach((url) => {
    const link = document.createElement('link')

    link.rel = rel
    link.crossOrigin = 'anonymous'

    link.as = /\.[mc]?[jt]sx?$/.test(url) ? 'script' : url.endsWith('.css') ? 'style' : 'fetch'

    const integrity = importMap.integrity?.[url]
    if (integrity) {
      link.integrity = integrity
    }

    link.href = url

    document.head.appendChild(link)
  })
}
