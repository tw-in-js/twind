---
section: Use With
title: SvelteKit
package: '@twind/with-sveltekit'
example: true
excerpt: |
  Setting up Twind for seamless integration in a [SvelteKit](https://kit.svelte.dev) project.
next: ./with-web-components.md
---

## 🤝 Compatibility

| @twind/with-sveltekit           | @sveltejs/kit                      |
| ------------------------------- | ---------------------------------- |
| `>=1.1.0 <1.2.0`                | `>=1.0.0 <2`                       |
| `>=1.0.0-next.38 <1.1.0`        | `>=1.0.0-next.391 <1`              |
| `>=1.0.0-next.1 <1.0.0-next.38` | `>=1.0.0-next.100 <1.0.0-next.391` |

## 📦 Installation

1. :::cols-12{.gap-4}

   ::col-span-4
   **Install from npm**

   `twind` and `@twind/with-sveltekit` are available on npm and need to be installed together.

   ::col-span-8

   ```sh
   npm install @twind/core @twind/with-sveltekit
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
     /* @twind/with-sveltekit will use hashed class names in production by default
      * If you don't want this, uncomment the next line
      */
     // hash: false,
   })
   ```

   :::

1. :::cols-12{.gap-4}

   ::col-span-4
   **Load Twind in the [root layout](https://kit.svelte.dev/docs/routing#layout-layout-js)**

   `install` creates and registers a twind instance that will generate the styles. This allows third-party packages to import `tw` from the twind package and get the same instance.

   ::col-span-8

   ```js title="src/routes/+layout.js"
   import install from '@twind/with-sveltekit'
   import config from '../../twind.config'

   install(config)

   // Optional: add a load function
   ```

   :::

1. :::cols-12{.gap-4}

   ::col-span-4

   **Enable Twind [in hooks](https://kit.svelte.dev/docs/hooks#server-hooks-handle)**

   Enable server-side rendering of all the styles that are used within the HTML and sending them to the client.

   ::col-span-8

   ```js title="src/hooks.server.js"
   import handleTwind from '@twind/with-sveltekit/hooks'

   export const handle = handleTwind()
   ```

   ::col-span-4

   If you have other handlers use the [`sequence` helper](https://kit.svelte.dev/docs/modules#sveltejs-kit-hooks):

   ::col-span-8

   ```js
   import { sequence } from '@sveltejs/kit/hooks'

   export const handle = sequence(handleTwind(), ...otherHandlers)
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

1. :::cols-12{.gap-4}

   ::col-span-4
   **Start using Twind in your svelte component**

   Start using Twind classes to style your content.

   ::col-span-8

   ```html
   <h1 class="text-3xl font-bold underline">Hello world!</h1>
   ```

   :::
