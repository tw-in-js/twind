---
section: Getting Started
title: Installation
next: ./features.md
---

Twind is a small compiler that converts Tailwind utility classes into CSS at runtime. The goal of this project is to unify the flexibility of CSS-in-JS with the carefully considered constraints of the Tailwind API.

```sh
npm install twind@next
```

Utility-first CSS without any build step right in the browser or any other environment like Node.js, deno, workers, ...

Twind does **not** include any core utilities — use one or more of the existing presets:

- [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix)
- [@twind/preset-ext](https://github.com/tw-in-js/twind/tree/next/packages/preset-ext)
- [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind) — Tailwind v3
- [@twind/preset-tailwind-forms](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind-forms) — Tailwind Forms.

Here are some examples of how to write your own rules or variants:

- preset-tailwind: [rules](https://github.com/tw-in-js/twind/blob/next/packages/preset-tailwind/src/rules.ts) and [variants](https://github.com/tw-in-js/twind/blob/next/packages/preset-tailwind/src/variants.ts)
- preset-ext: [rules](https://github.com/tw-in-js/twind/blob/next/packages/preset-ext/src/rules.ts) and [variants](https://github.com/tw-in-js/twind/blob/next/packages/preset-ext/src/variants.ts)

Additionally we provides several integrations:

- [Gatsby](https://github.com/gatsbyjs/gatsby) — [gatsby-plugin-twind](https://github.com/tw-in-js/twind/tree/next/packages/gatsby-plugin-twind)
- [Next.js](https://kit.svelte.dev) — [@twind/with-next](https://github.com/tw-in-js/twind/tree/next/packages/with-next)
- [Nuxt](https://v3.nuxtjs.org) — [nuxt-twind](https://github.com/pi0/nuxt-twind)
- [Remix](https://remix.run) — [@twind/with-remix](https://github.com/tw-in-js/twind/tree/next/packages/with-remix)
- [SvelteKit](https://kit.svelte.dev) — [@twind/with-sveltekit](https://github.com/tw-in-js/twind/tree/next/packages/with-sveltekit)

To get you started, take a look at the [examples](https://github.com/tw-in-js/twind/tree/next/examples).

We have created a few [examples](https://github.com/tw-in-js/twind/tree/next/examples) to get you started:

| Example                                                                       | Try it live at                                                                                                                                                                    | Description                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Basic](https://github.com/tw-in-js/twind/tree/next/examples/basic)           | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/basic) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/basic)           | using [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix) and [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind) |
| [Playground](https://github.com/tw-in-js/twind/tree/next/examples/playground) | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/playground) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/playground) | using using all presets                                                                                                                                                                                     |

**Packages**

| Example                                                                               | Try it live at                                                                                                                                                                                        | Description                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Tailwind Forms](https://github.com/tw-in-js/twind/tree/next/examples/tailwind-forms) | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/using-tailwind-forms) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/using-tailwind-forms) | using [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix) and [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind) and [@twind/preset-tailwind-forms](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind-forms) |
| [Twind CDN](https://github.com/tw-in-js/twind/tree/next/examples/using-twind-cdn)     | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/using-twind-cdn) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/using-twind-cdn)           | using [@twind/cdn](https://github.com/tw-in-js/twind/tree/next/packages/cdn)                                                                                                                                                                                                                                               |

**Frameworks**

| Example                                                                          | Try it live at                                                                                                                                                                            | Description                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Gatsby](https://github.com/tw-in-js/twind/tree/next/examples/gatsby)            | ~~[Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/with-gatsby)~~ • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/with-gatsby)   | with [Gatsby](https://www.gatsbyjs.com) using [gatsby-plugin-twind](https://github.com/tw-in-js/twind/tree/next/packages/gatsby-plugin-twind), [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix) and [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind) |
| [Next.js](https://github.com/tw-in-js/twind/tree/next/examples/with-next)        | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/with-next) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/with-next)           | with [Next.js](https://nextjs.org) using [@twind/with-next](https://github.com/tw-in-js/twind/tree/next/packages/with-next), [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix) and [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind)                   |
| [Nuxt](https://github.com/pi0/nuxt-twind/tree/main/playground)                   | [Stackblitz](https://stackblitz.com/fork/github/pi0/nuxt-twind/tree/main/playground)                                                                                                      | with [Nuxt](https://v3.nuxtjs.org/) using [nuxt-twind](https://github.com/pi0/nuxt-twind) and [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind)                                                                                                                                                         |
| [Remix](https://github.com/tw-in-js/twind/tree/next/examples/with-remix)         | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/with-remix) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/with-remix)         | with [Remix](https://remix.run) using [@twind/with-remix](https://github.com/tw-in-js/twind/tree/next/packages/with-remix), [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix) and [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind)                    |
| [SvelteKit](https://github.com/tw-in-js/twind/tree/next/examples/with-sveltekit) | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/with-sveltekit) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/with-sveltekit) | with [SvelteKit](https://kit.svelte.dev) using [@twind/with-sveltekit](https://github.com/tw-in-js/twind/tree/next/packages/with-sveltekit), [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix) and [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind)   |
