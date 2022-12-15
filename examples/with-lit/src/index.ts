import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import install from '@twind/with-web-components'
import config from './twind.config'

@customElement('twind-element')
@install(config)
export class TwindElement extends LitElement /* install(config)(LitElement) */ {
  override render() {
    return html`
      <main class="h-screen bg-purple-400 flex items-center justify-center">
        <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
      </main>
    `

    // Alternativly use tw function directly (required `class extends withTwind(config)(LitElement) { }`)
    // return html`
    //   <main class="${this.tw('h-screen bg-purple-400 flex items-center justify-center')}">
    //     <h1 class="${this.tw('font-bold text(center 5xl white sm:gray-800 md:pink-700')}">
    //       This is Twind!
    //     </h1>
    //   </main>
    // `
  }
}

document.body.innerHTML = '<twind-element></twind-element>'
