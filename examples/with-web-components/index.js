/* eslint-env browser */

import install from '@twind/with-web-components'
import config from './twind.config'

customElements.define(
  'twind-element',
  class TwindElement extends install(config)(HTMLElement) {
    constructor() {
      super()

      const shadow = this.attachShadow({ mode: 'open' })

      shadow.innerHTML = `
        <main class="h-screen bg-purple-400 flex items-center justify-center">
          <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">
            This is Twind!
          </h1>
        </main>
      `

      // shadow.innerHTML = `
      //   <main class="${this.tw('h-screen bg-purple-400 flex items-center justify-center')}">
      //     <h1 class="${this.tw('font-bold text(center 5xl white sm:gray-800 md:pink-700)')}">
      //       This is Twind!
      //     </h1>
      //   </main>
      // `
    }
  },
)

document.body.innerHTML = '<twind-element></twind-element>'
