---
section: Use With
title: Remix
package: '@twind/with-remix'
example: true
excerpt: |
  Setting up Twind for seamless integration in a [Remix](https://remix.run) project.
next: ./with-sveltekit.md
---

## 🤝 Compatibility

| @twind/with-remix   | remix |
| ------------------- | ----- |
| `>=1.0.0-next.1 <1` | `1.x` |

## 📦 Installation

1. :::cols-12{.gap-4}

   ::col-span-4
   **Install from npm**

   `@twind/core` and `@twind/with-remix` are available on npm and need to be installed together.

   ::col-span-8

   ```sh
   npm install @twind/core @twind/with-remix
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
     /* @twind/with-remix will use hashed class names in production by default
      * If you don't want this, uncomment the next line
      */
     // hash: false,
   })
   ```

   :::

1. :::cols-12{.gap-4}

   ::col-span-4
   **Load Twind in the [root route](https://remix.run/docs/en/v1/guides/routing#rendering-route-layout-hierarchies)**

   `install` creates and registers a twind instance that will generate the styles. This allows third-party packages to import `tw` from the twind package and get the same instance.

   ::col-span-8

   ```diff title="app/root.jsx"
   import { Outlet } from "@remix-run/react";

   + import install from '@twind/with-remix'
   + import config from '../twind.config'
   + install(config)

   export default function Root() {
   ```

   :::

1. :::cols-12{.gap-4}

   ::col-span-4

   **Enable Twind [in the server entry](https://remix.run/docs/en/v1/guides/migrating-react-router-app#creating-server-and-browser-entrypoints)**

   Enable server-side rendering of all the styles that are used within the HTML and sending them to the client.

   ::col-span-8

   ```diff title="app/entry.server.jsx"
   import { renderToString } from 'react-dom/server'
   import { RemixServer } from 'remix'

   + import inline from '@twind/with-remix/server'

   export default function handleRequest(
     request,
     responseStatusCode,
     responseHeaders,
     remixContext,
   ) {
     let markup = renderToString(<RemixServer context={remixContext} url={request.url} />)

   +  // Add twind styles to the markup
   +  markup = inline(markup)

     responseHeaders.set('Content-Type', 'text/html')
     return new Response('<!DOCTYPE html>' + markup, {
       status: responseStatusCode,
       headers: responseHeaders,
     })
   }
   ```

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
   **Start using Twind in your remix components**

   Start using Twind classes to style your content.

   ::col-span-8

   ```jsx title="app/routes/index.jsx"
   export default function Hello() {
     return <h1 className="text-3xl font-bold underline">Hello world!</h1>
   }
   ```

   :::
