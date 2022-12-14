import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { twind, cssom, observe } from '@twind/core'
import config from './twind.config'

// 1. Create separate CSSStyleSheet
const sheet = cssom(new CSSStyleSheet())

// 2. Use that to create an own twind instance
const tw = twind(config, sheet)

@customElement('twind-element')
export class TwindElement extends LitElement {
  // 3. Apply the same style to each instance of this element
  static override styles = [sheet.target]

  // 4a. Observe using "own" tw function
  override firstUpdated(): void {
    observe(tw, this.renderRoot)
  }

  override render() {
    return html`
      <main class="h-screen bg-purple-400 flex items-center justify-center">
        <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
      </main>
    `

    // 4b. Use "own" tw function directly
    // return html`
    //   <main class="${tw('h-screen bg-purple-400 flex items-center justify-center')}">
    //     <h1 class="${tw('font-bold text(center 5xl white sm:gray-800 md:pink-700')}">
    //       This is Twind!
    //     </h1>
    //   </main>
    // `
  }
}
