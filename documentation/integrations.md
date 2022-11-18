---
section: Getting Started
title: Integrations
excerpt: How to use Twind in different frameworks and environments.
next: ./examples.md
---

Twind is designed to be used in almost any environment and exposes several different bundles from ESM to UMD. The ESM bundles should be preferred for it's smaller size after tree-shaking and faster performance.

> **Hint/No Build Step**
> Although Twind is compatible with traditional bundlers, there is no build step required to use Twind.

## Using Integrations

An integration usually has two parts:

1. :::cols-12{.gap-4}

   ::col-span-4
   **Activate Twind**

   `install` creates and registers a twind instance that will generate the styles. This allows third-party packages to import `tw` from the twind package and get the same instance.

   ::col-span-8

   ```js
   import { install } from 'twind'
   import config from './twind.config'

   // activate twind
   install(config)
   ```

   :::

1. :::cols-12{.gap-4}

   ::col-span-4
   **Static Extraction**

   Extract the styles from the HTML eg server-side rendering.

   _pseudo code_ - depends on the used framework or environment

   ::col-span-8

   ```js
   import { inline } from 'twind'

   function render() {
     const html = renderApp()

     // inject a style element with the CSS as last element into the head
     return inline(html)
   }
   ```

   :::

## Official Integrations

All official integrations are [available on npm](https://www.npmjs.com/search?q=keywords:twind-with):

- [gatsby-plugin-twind](./with-gatsby) — [Gatsby](https://gatsbyjs.com)
- [@twind/with-next](./with-next) — [Next.js](https://nextjs.org)
- [@twind/with-remix](./with-remix) — [Remix](https://remix.run)
- [@twind/with-sveltekit](./with-sveltekit) — [SvelteKit](https://kit.svelte.dev)

## Community Integrations

> **Tip**
> To find community integrations [search for the keyword `twind-with`](https://www.npmjs.com/search?q=keywords:twind-with) on npm.

## Create A New Integration

TODO: Add documentation for creating a new integration.

Here are some examples of how to write your own integration:

- [gatsby-plugin-twind](https://github.com/tw-in-js/twind/blob/main/packages/with-gatsby/src)
- [@twind/with-next/src](https://github.com/tw-in-js/twind/blob/main/packages/with-next/src)
- [@twind/with-remix/src](https://github.com/tw-in-js/twind/blob/main/packages/with-remix/src)
- [@twind/with-sveltekit/src](https://github.com/tw-in-js/twind/blob/main/packages/with-sveltekit/src)
