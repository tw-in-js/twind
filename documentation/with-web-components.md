---
section: Use With
title: Web Components
package: '@twind/with-web-components'
example: true
excerpt: |
  Using Twind with [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) and [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
next: ./reference.md
---

This guide shows how [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) can have their styles separated without having the side effect of polluting the root document's styles.

> **Note**
> In [modern browsers](https://caniuse.com/mdn-api_document_adoptedstylesheets) this integration uses [Constructable Stylesheet Objects](https://wicg.github.io/construct-stylesheets/) and [`adoptedStyleSheets`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/adoptedStyleSheets) for optimal performance. In legacy browsers, it falls back to using separate style elements (one per element instance) that are all kept in sync.

1. :::cols-12{.gap-4}

   ::col-span-4
   **Install from npm**

   `@twind/core` and `@twind/with-web-components` are available on npm and need to be installed together.

   ::col-span-8

   ```sh
   npm install @twind/core @twind/with-web-components
   ```

   :::

1. :::cols-12{.gap-4}

   ::col-span-4
   **Define the configuration**

   Using an extra file, `twind.config.js`, allows some tools like [IntelliSense](./installation) to find your configuration.

   ::col-span-8

   ```js title="twind.config.js"
   import { defineConfig } from '@twind/core'

   export default defineConfig({
     /* @twind/with-web-components will use
      * hashed class names in production by default
      * If you don't want this, uncomment the next line
      */
     // hash: false,
   })
   ```

   :::

1. :::cols-12{.gap-4}

   ::col-span-4
   **Create a Custom Element**

   `install` creates a mixin that can be used to enhance elements with a shared stylesheet, generates styles for all used CSS classes and adds `this.tw` (the twind instance) to the element instance.

   The mixin function can be used with several elements — they all will share the same twind instance.

   ::col-span-8

   ```js
   import install from '@twind/with-web-components'
   import config from './twind.config'

   const withTwind = install(config)

   class TwindElement extends withTwind(HTMLElement) {
     constructor() {
       super()

       const shadow = this.attachShadow({ mode: 'open' })

       shadow.innerHTML = `<h1 class="text-3xl font-bold underline">Hello world!</h1>`
     }
   }

   customElements.define('twind-element', TwindElement)
   ```

   :::

1. <details>
   <summary><strong>Optional</strong>: Install and configure the recommended presets <a href="./preset-autoprefix"><code>@twind/preset-autoprefix</code></a> and <a href="./preset-tailwind"><code>@twind/preset-tailwind</code></a>.</summary>

   :::cols-12{.gap-4}

   ::col-span-4
   **Install the presets**

   All presets are [available on npm](https://www.npmjs.com/search?q=keywords:twind-preset).

   ::col-span-8

   ```sh
   npm install @twind/preset-autoprefix @twind/preset-tailwind
   ```

   :::

   :::cols-12{.gap-4}

   ::col-span-4
   **Configure the presets**

   Each preset must be added to the `presets` array in the configuration.

   ::col-span-8

   ```js title="twind.config.js" [2-3,6]
   import { defineConfig } from '@twind/core'
   import presetAutoprefix from '@twind/preset-autoprefix'
   import presetTailwind from '@twind/preset-tailwind'

   export default defineConfig({
     presets: [presetAutoprefix(), presetTailwind()],
   })
   ```

   :::

   </details>
