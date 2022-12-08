---
section: Getting Started
title: Installation
excerpt: Twind is a small compiler that converts utility classes into CSS at runtime. The goal of this project is to unify the flexibility of CSS-in-JS with the carefully considered constraints of the [Tailwind CSS](https://tailwindcss.com) API.
next: ./presets.md
---

Utility-first CSS without any build step [right in the browser](#browser-usage) or [any other environment](#local--bundler) like Node.js, deno, workers, ...

If you have used Tailwind CSS or other CSS-in-JS solutions, then most of the API should feel very familiar.

> **Important**
>
> The `@twind/core` package does **not** include any rules or variants. You need to install an [existing preset](./presets#official-presets) or bring your [own preset](./presets#create-a-new-preset) to get started.

## Local / Bundler

> **Tip**
> Twind provides [several integrations](./integrations#official-integrations) for different frameworks and environments.

1. :::cols-12{.gap-4}

   ::col-span-4
   **Install twind**

   Twind is [available on npm](https://www.npmjs.com/@twind/core).

   ::col-span-8

   ```sh
   npm install @twind/core
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
     /* options */
   })
   ```

   :::

1. :::cols-12{.gap-4}

   ::col-span-4
   **Load Twind in your application entry point.**

   `install` creates and registers a twind instance that will generate the styles. This allows third-party packages to import `tw` from the twind package and get the same instance.

   ::col-span-8

   ```js title="index.js"
   import { install } from '@twind/core'
   import config from './twind.config'

   // activate twind - must be called at least once
   install(config)
   ```

   :::

1. <details>
   <summary><strong>Optional</strong>: Install and configure the recommended presets <a href="./preset-autoprefix"><code>@twind/preset-autoprefix</code></a> and <a href="./preset-tailwind"><code>@twind/preset-tailwind</code></a>.</summary>

   :::cols-12{.gap-4}

   ::col-span-4
   **Install the presets**

   [All presets](./presets) are [available on npm](https://www.npmjs.com/search?q=keywords:twind-preset).

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
   **Start using Twind in your HTML**

   Start using Twind classes to style your content.

   ::col-span-8

   ```html
   <h1 class="text-3xl font-bold underline">Hello world!</h1>
   ```

   :::

1. <details>
   <summary><strong>Optional</strong>: Prevent <abbr title="flash of unstyled content">FOUC</abbr></summary>

   Incase you are not using static extraction to include the generated styles on the server apply the following pattern to prevent [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content):

   ```html
   <body class="!block" style="display: none">
     <!-- ... -->
   </body>
   ```

   If any element has the `autofocus` attribute, Twind will focus it after all styles are injected.

   </details>

TODO: Whats next? List and links of framework integrations. All official integrations are [available on npm](https://www.npmjs.com/search?q=keywords:twind-with) with the prefix `@twind/with-`.

## Browser Usage

Twind is available as a global browser script and can be used directly in the browser.

> **Tip**
>
> We recommend to use [Twind CDN](#twind-cdn) if you want to use Tailwind utilities.

1. :::cols-12{.gap-4}

   ::col-span-4
   **Add the Twind script to your HTML**

   Add the script tag to the `<head>` of your HTML file.

   ::col-span-8

   ```html [2]
   <head>
     <script src="https://cdn.jsdelivr.net/npm/@twind/core@1" crossorigin></script>
   </head>
   ```

   :::

1. :::cols-12{.gap-4}

   ::col-span-4
   **Create the environment**

   `install` creates a twind instance that will observe `class` attributes and generate the corresponding styles.

   ::col-span-8

   ```html [3-7]
   <head>
     <script src="https://cdn.jsdelivr.net/npm/@twind/core@1" crossorigin></script>
     <script>
       twind.install({
         /* options */
       })
     </script>
   </head>
   ```

   :::

1. <details>
   <summary><strong>Optional</strong>: Install and configure the recommended presets <a href="./preset-autoprefix"><code>@twind/preset-autoprefix</code></a> and <a href="./preset-tailwind"><code>@twind/preset-tailwind</code></a>.</summary>

   :::cols-12{.gap-4}

   ::col-span-4
   **Add the presets script to your HTML**

   [All presets](./presets) are [available on npm](https://www.npmjs.com/search?q=keywords:twind-preset).

   ::col-span-8

   ```html [2-5]
   <head>
     <script
       src="https://cdn.jsdelivr.net/combine/npm/@twind/core@1,npm/@twind/preset-autoprefix@1,npm/@twind/preset-tailwind@1"
       crossorigin
     ></script>
   </head>
   ```

   ::col-span-4
   **Configure the presets**

   Each preset must be added to the `presets` array in the configuration.

   ::col-span-8

   ```html [6-10]
   <head>
     <script
       src="https://cdn.jsdelivr.net/combine/npm/@twind/core@1,npm/@twind/preset-autoprefix@1,npm/@twind/preset-tailwind@1"
       crossorigin
     ></script>
     <script>
       twind.install({
         presets: [twind.presetAutoprefix(/* options */), twind.presetTailwind(/* options */)],
       })
     </script>
   </head>
   ```

   :::

   </details>

1. :::cols-12{.gap-4}

   ::col-span-4
   **Start using Twind in your HTML**

   Start using Twind classes to style your content.

   ::col-span-8

   ```html [2]
   <body>
     <h1 class="text-3xl font-bold underline">Hello world!</h1>
   </body>
   ```

   :::

## Twind CDN

[Twind CDN](./packages/@twind/cdn) is a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn) that is 6 times smaller (104kb vs 17kB) without any build step right in the browser.

> **Hint** > [@twind/preset-autoprefix](./preset-autoprefix) and [@twind/preset-tailwind](./preset-tailwind) are **included** out-of-the-box.

1. :::cols-12{.gap-4}

   ::col-span-4
   **Add the Twind CDN script to your HTML**

   Add the script tag to the `<head>` of your HTML file.

   ::col-span-8

   ```html [2]
   <head>
     <script src="https://cdn.twind.style" crossorigin></script>
   </head>
   ```

   :::

1. <details>
   <summary><strong>Optional</strong>: Add additional presets — <a href="./preset-autoprefix"><code>@twind/preset-autoprefix</code></a> and <a href="./preset-tailwind"><code>@twind/preset-tailwind</code></a> are already included in Twind CDN.</summary>

   To use other presets add their ids to the script `src` attribute:

   :::cols-12{.gap-4}

   ::col-span-4
   **Add the preset to Twind CDN script in your HTML**

   [All presets](./presets) are [available on npm](https://www.npmjs.com/search?q=keywords:twind-preset).

   ::col-span-8

   ```html [2-5]
   <head>
     <script src="https://cdn.twind.style/ext,line-clamp,forms,typography" crossorigin></script>
   </head>
   ```

   :::

   :::cols-12{.gap-4}

   ::col-span-4
   **Configure the presets**

   Each preset must be added to the `presets` array in the configuration.

   ::col-span-8

   ```html [5-10]
   <head>
     <script src="https://cdn.twind.style/ext,line-clamp,forms,typography" crossorigin></script>
     <script>
       twind.install({
         presets: [
           twind.presetExt(/* options */)
           twind.presetLineClamp(/* options */)
           twind.presetTailwindForms(/* options */)
           twind.presetTypography(/* options */)
        ],
       })
     </script>
   </head>
   ```

   :::

   </details>

1. :::cols-12{.gap-4}

   ::col-span-4
   **Start using Twind in your HTML**

   Start using Twind classes to style your content.

   ::col-span-8

   ```html [2]
   <body>
     <h1 class="text-3xl font-bold underline">Hello world!</h1>
   </body>
   ```

   :::

## What to read next

Get familiar with some of the core concepts that make Twind different from writing traditional CSS.

:::cols-2{.gap-x-8.gap-y-4}

::col-span-1

### Integrations

How to use Twind in different frameworks and environments.

::col-span-1

### Migration

We have collected a list of changes in [Migration › Twind v0.16](./migration#from-twind-v016). A detailed migration guide will follow.

:::
