---
section: Use With
title: Gatbsy
package: 'gatsby-plugin-twind'
example: 'with-gatsby'
excerpt: |
  Setting up Twind for seamless integration in a [Gatsby](https://gatsbyjs.com) project.
next: ./with-lit.md
---

## 🤝 Compatibility

| gatsby-plugin-twind  | gatsby   |
| -------------------- | -------- |
| `>=1.0.0-next.38 <1` | `>=2 <5` |

## 📦 Installation

1. :::cols-12{.gap-4}

   ::col-span-4
   **Install from npm**

   `twind` and `gatsby-plugin-twind` are available on npm and need to be installed together.

   ::col-span-8

   ```sh
   npm install @twind/core gatsby-plugin-twind
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
   **[Configure the plugin](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/using-a-plugin-in-your-site/)**

   Add the plugin using its name to the `plugins` array.

   ::col-span-8

   ```js title="gatsby-config.js"
   module.exports = {
     plugins: [
       `gatsby-plugin-twind`,
       // This plugin assumes a `twind.config.js` file in the root of your project.
       // You can use the `config` option to specify a different path to a twind config file:
       // {
       //   resolve: `gatsby-plugin-twind`,
       //   options: {
       //     config: `./path/to/twind.config`
       //   }
       // },
     ],
   }
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
   **Start using Twind in your pages and component**

   Start using Twind classes to style your content.

   ::col-span-8

   ```jsx title="src/pages/index.js"
   export default function Hello() {
     return <h1 className="text-3xl font-bold underline">Hello world!</h1>
   }
   ```

   :::
