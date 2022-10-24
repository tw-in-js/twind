import * as Comlink from 'comlink'
import api from './preview.api'

export type { Preview, Script } from './preview.api'

Comlink.expose(api, Comlink.windowEndpoint(self.parent))

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

parent.postMessage('preview:ready', '*')
