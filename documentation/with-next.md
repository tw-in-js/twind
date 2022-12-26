---
section: Use With
title: Next.js
package: '@twind/with-next'
example: true
excerpt: |
  Setting up Twind for seamless integration in a [Next.js](https://nextjs.org) project.
next: ./with-react.md
---

## 🤝 Compatibility

| @twind/with-next | next           |
| ---------------- | -------------- |
| `>=1.0.0 <2`     | `12.x`, `13.x` |

> **Caution** > [Next 13 app directory](https://beta.nextjs.org/docs/getting-started) is currently not supported. Please use the [legacy app directory](https://nextjs.org/docs/advanced-features/custom-app) for now.

## 📦 Installation

1. :::cols-12{.gap-4}

   ::col-span-4
   **Install from npm**

   `@twind/core` and `@twind/with-next` are available on npm and need to be installed together.

   ::col-span-8

   ```sh
   npm install @twind/core @twind/with-next
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
     /* @twind/with-next will use hashed class names in production by default
      * If you don't want this, uncomment the next line
      */
     // hash: false,
   })
   ```

   :::

1. :::cols-12{.gap-4}

   ::col-span-4
   **Load Twind in the [App component](https://nextjs.org/docs/advanced-features/custom-app)**

   `install` creates and registers a twind instance that will generate the styles. This allows third-party packages to import `tw` from the twind package and get the same instance.

   ::col-span-8

   ```js title="pages/_app.js"
   import install from '@twind/with-next/app'
   import config from '../twind.config'

   export default install(config)
   ```

   ::col-span-4
   If you are using a custom App component you need to pass the it to `install`.

   ::col-span-8

   ```diff title="pages/_app.js"
   + import install from '@twind/with-next/app'
   + import config from '../twind.config'
   function MyApp({ Component, pageProps }) {
     /* ... */
   }
   - export default MyApp
   + export default install(config, MyApp)
   ```

   :::

1. :::cols-12{.gap-4}

   ::col-span-4

   **Enable Twind [in Document component](https://nextjs.org/docs/advanced-features/custom-document)**

   Enable server-side rendering of all the styles that are used within the HTML and sending them to the client.

   ::col-span-8

   ```js title="pages/_document.js"
   export { default } from '@twind/with-next/document'
   ```

   ::col-span-4
   If you are using a custom Document component you need to pass the it to `install`.

   ::col-span-8

   ```diff title="pages/_document.js"
   import Document, { Html, Head, Main, NextScript } from 'next/document'
   + import install from '@twind/with-next/document'
   class MyDocument extends Document {
     /* ... */
   }
   + export default install(MyDocument)
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
   **Start using Twind in your components**

   Start using Twind classes to style your content.

   ::col-span-8

   ```jsx title="pages/index.js"
   export default function Hello() {
     return <h1 className="text-3xl font-bold underline">Hello world!</h1>
   }
   ```

   :::
