/* eslint-env browser */

import { twind, cssom, observe } from '@twind/core'
import config from './twind.config'

try {
  // 1. Create separate CSSStyleSheet
  const sheet = cssom(new CSSStyleSheet())

  // 2. Use that to create an own twind instance
  const tw = twind(config, sheet)

  class TwindElement extends HTMLElement {
    constructor() {
      super()

      const shadow = this.attachShadow({ mode: 'open' })

      // 3. Apply the same style to each instance of this component
      shadow.adoptedStyleSheets = [sheet.target]

      // 4a. Observe using "own" tw function
      observe(tw, shadow)

      shadow.innerHTML = `
        <main class="h-screen bg-purple-400 flex items-center justify-center">
          <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">
            This is Twind!
          </h1>
        </main>
      `

      // 4b. Use "own" tw function directly
      // shadow.innerHTML = `
      //   <main class="${tw`h-screen bg-purple-400 flex items-center justify-center`}">
      //     <h1 class="${tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}">
      //       This is Twind!
      //     </h1>
      //   </main>
      // `
    }
  }

  customElements.define('twind-element', TwindElement)

  document.body.innerHTML = '<twind-element></twind-element>'
} catch (error) {
  document.body.innerHTML = `<p>Your browser does not support <a href="https://caniuse.com/mdn-api_document_adoptedstylesheets">Constructable Stylesheets</a>: ${error.message}</p>`
}
