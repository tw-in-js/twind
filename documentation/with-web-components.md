---
section: Use With
title: Web Components
example: with-web-components
excerpt: |
  Using Twind with [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) and [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
next: ./reference.md
---

This guide shows how [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) can have their styles separated without having the side effect of polluting the root document's styles.

> **Caution**
> This example is using [Constructable Stylesheet Objects](https://wicg.github.io/construct-stylesheets/) and `DocumentOrShadowRoot.adoptedStyleSheets` which have [limited browser support](https://caniuse.com/mdn-api_document_adoptedstylesheets) at the moment (December 2022). The [Constructible style sheets polyfill](https://github.com/calebdwilliams/construct-style-sheets) offers a solution for all modern browsers and IE 11.

```js
import { twind, cssom, observe } from '@twind/core'
import config from './twind.config'

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
```
