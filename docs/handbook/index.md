---
title: Twind Guide
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: The official Twind guide
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

The smallest, fastest, most feature complete Tailwind-in-JS solution in existence

[![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/main/LICENSE)
[![Latest Release](https://flat.badgen.net/npm/v/twind?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/twind)
[![Bundle Size](https://flat.badgen.net/bundlephobia/minzip/twind?icon=packagephobia&label&color=blue&cache=10800)](https://bundlephobia.com/result?p=twind 'gzip bundle size (including dependencies)')
[![Package Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/twind/twind.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/twind.js 'brotli package size (without dependencies)')
[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev/docs)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind?icon=github&label)](https://github.com/tw-in-js/twind)
[![Discord](https://flat.badgen.net/badge/icon/discord?icon=discord&label)](https://discord.com/invite/2aP5NkszvD)
[![CI](https://github.com/tw-in-js/twind/workflows/CI/badge.svg)](https://github.com/tw-in-js/twind/actions?query=workflow%3Aci)
[![Coverage Status](https://flat.badgen.net/coveralls/c/github/tw-in-js/twind/main?icon=codecov&label&cache=10800)](https://coveralls.io/github/tw-in-js/twind?branch=main)

<Quote author="Adam Wathan (creator of Tailwind)">I've wanted to do a CSS-in-JS flavor of Tailwind for over 2 years because of all the neat benefits you get there so it's cool to see projects like this!</Quote>

## What is Twind?

Twind is a small compiler (~12kb) that converts Tailwind classes into actual CSS rules at runtime. If you have used Tailwind or other CSS-in-JS solutions, then most of the API should feel very familiar.

The primary purpose of this project is to unify CSS-in-JS and TailwindCSS; embracing the flexibility of CSS-in-JS whilst conforming to the carefully considered constraints of the Tailwind API.

While Twind comes with a few extra features, we've strived to maintain feature parity with Tailwind V2. In other words, if it works in Tailwind, it should work in Twind.

Despite being very flexible and powerful, it was our intention to keep the surface API as minimal as possible. We appreciate that Twind is likely to be used by developers and designers alike, so we try provide sensible defaults out of the box, with little or no need for setup.

## Quick Start

Try a [live and interactive demo 🚀 ](https://esm.codes/#aW1wb3J0IHsgdHcgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZCcKCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYAogIDxtYWluIGNsYXNzPSIke3R3YGgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJgfSI+CiAgICA8aDEgY2xhc3M9IiR7dHdgZm9udC1ib2xkIHRleHQoY2VudGVyIDV4bCB3aGl0ZSBzbTpncmF5LTgwMCBtZDpwaW5rLTcwMClgfSI+VGhpcyBpcyBUd2luZCE8L2gxPgogIDwvbWFpbj4KYA==)

If you would like to get started with Twind right away then copy paste this code into your favorite sandbox:

```js
import { tw } from 'https://cdn.skypack.dev/twind'

document.body.innerHTML = `
  <main class="${tw`h-screen bg-purple-400 flex items-center justify-center`}">
    <h1 class="${tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}">This is Twind!</h1>
  </main>
`
```

Using the exported `tw` function results in the compilation of the rules like `bg-black text-white` and `text-xl` exactly as specified in the [Tailwind documentation](https://tailwincss.com/docs). For convenience, the default [Tailwind theme](https://github.com/tailwindlabs/tailwindcss/blob/v1/stubs/defaultConfig.stub.js) is used along with the preflight [base styles](https://tailwindcss.com/docs/preflight) unless you explicitly overwrite them.

For seamless integration with existing Tailwind HTML, you can use [the Shim](/docs/guide/the-shim.md):

Try a [live and interactive demo 🚀](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPG1haW4gY2xhc3M9Imgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIiPgogICAgPGgxIGNsYXNzPSJmb250LWJvbGQgdGV4dChjZW50ZXIgNXhsIHdoaXRlIHNtOmdyYXktODAwIG1kOnBpbmstNzAwKSI+CiAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICA8L2gxPgogIDwvbWFpbj4KYA==)

```html
<script type="module" src="https://cdn.skypack.dev/twind/shim"></script>

<main class="h-screen bg-purple-400 flex items-center justify-center">
  <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
</main>
```

> 📚 For more detailed instruction on usage please [read the documentation](https://twind.dev/docs/handbook/getting-started.html) and check out [this extended demo](https://esm.codes/#aW1wb3J0IHsgdHcsIHNldHVwIH0gZnJvbSAnaHR0cHM6Ly9jZG4uc2t5cGFjay5kZXYvdHdpbmQnCgpzZXR1cCh7CiAgdGhlbWU6IHsKICAgIC8vIEV4YW1wbGUgb2YgZXh0ZW5kaW5nIHRoZSBkZWZhdWx0IHRoZW1lCiAgICBleHRlbmQ6IHsKICAgICAgY29sb3JzOiB7IGhvdHBpbms6ICcjRkYwMEZGJyB9LAogICAgICByb3RhdGU6IHsgNTogJzVkZWcnIH0KICAgIH0KICB9Cn0pCgpjb25zdCBhcHAgPSAoKSA9PiBgCiAgICA8ZGl2IGNsYXNzPScke3N0eWxlLmNvbnRhaW5lcn0nPgogICAgICA8aDEgY2xhc3M9JyR7CiAgICAgICAgLy8gRXhhbXBsZSBvZiBhbiBpbmxpbmUgc3R5bGUKICAgICAgICB0d2AKICAgICAgICAgIHRleHQod2hpdGUgNHhsKQogICAgICAgICAgZm9udChib2xkIHNhbnMpCiAgICAgICAgICB0cmFuc2l0aW9uLXRyYW5zZm9ybQogICAgICAgICAgaG92ZXI6KAogICAgICAgICAgICByb3RhdGUtNQogICAgICAgICAgICBzY2FsZS0xNTAKICAgICAgICAgICAgY3Vyc29yLXBvaW50ZXIKICAgICAgICAgICkKICAgICAgICBgCiAgICAgIH0nPkhlbGxvIFdvcmxkPC9oMT4KICAgIDwvZGl2PgogIGA7CiAgCiAgCmNvbnN0IHN0eWxlID0gewogIC8vIEV4YW1wbGUgb2YgYWJzdHJhY3RlZCBzdHlsZQogIGNvbnRhaW5lcjogdHdgCiAgICBoLWZ1bGwKICAgIGJnLWhvdHBpbmsKICAgIGZsZXgKICAgIGl0ZW1zLWNlbnRlcgogICAganVzdGlmeS1jZW50ZXIKICBgCn0KCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYXBwKCk=)

## Features

**⚡️ No build step**

Get all the benefits of Tailwind without the need for Tailwind, PostCSS, configuration, purging, or autoprefixing.

**🚀 Framework agnostic**

If your app uses HTML and JavaScript, it should work with Twind. This goes for server-rendered apps too.

**😎 One low fixed cost**

Twind ships the compiler, not the CSS. This means unlimited styles and variants for one low fixed cost of ~12kB.

**Other features include:**

:::tip
Click on each summary to show additional details.
:::

<details><summary>🚅 Faster than most CSS-in-JS libraries</summary>

Twind's advanced caching and specialist optimizations enables it to compile and inject CSS faster than most other CSS-in-JS solutions. [Check out the benchmarks](/handbook/benchmarks) to learn more.

</details>

<details><summary>🎨 Seamless integration with Tailwind</summary>

Twind provides [a shim](/handbook/the-shim), which allows for seamless integration with your existing Tailwind styles with no configuration. The shim can improve the development experience and is useful for gradual migration.

```html
<script type="module" src="https://cdn.skypack.dev/twind/shim"></script>

<main class="h-screen bg-purple-400 flex items-center justify-center">
  <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
</main>
```

[Live and interactive shim demo 🚀](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPG1haW4gY2xhc3M9Imgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIiPgogICAgPGgxIGNsYXNzPSJmb250LWJvbGQgdGV4dChjZW50ZXIgNXhsIHdoaXRlIHNtOmdyYXktODAwIG1kOnBpbmstNzAwKSI+CiAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICA8L2gxPgogIDwvbWFpbj4KYA==)

</details>

<details><summary>🎯 Extended variants, directives, and syntax</summary>

Twind provides additional variants, directives, and syntaxes to improve developer experience:

- [Grouping syntax](/handbook/grouping-syntax.md) `class="text(black uppercase md:blue-400)"`
- [Extended variants](/handbook/extended-functionality#variants) like `siblings`, `sibling`, `children`, and `override`
- [Extended utilities](/handbook/extended-functionality#utilities) like `text-underline` and `font-italic`.

</details>

<details><summary>✈️ Tailwind preflight by default</summary>

The [base reset](https://tailwindcss.com/docs/preflight) provided by Tailwind is merged with your optional theme configuration and injected in the stylesheet during setup. This guarantees more consistent cross-browser styles out of the box.

:::tip
It is possible to [customize or disable the preflight](/handbook/configuration#preflight).
:::

</details>

<details><summary>🤝 Feature parity with Tailwind</summary>

If it works in Tailwind, it should work in Twind.

Class names that are provided by Tailwind will always work with Twind. Further, Twind configuration and theming follow [Tailwind conventions](<(https://tailwindcss.com/docs/theme)>), meaning you can copy/paste your Tailwind config to the Twind `setup` function. The only difference here is that there is no need to rebuild after changing your theme. Just refresh the page!

For more information, check out the [configuration guide](/handbook/configuration).

</details>

<details><summary>🚓 Escape hatch for arbitrary CSS</summary>

The Twind compiler accepts functions that can return arbitrary CSS-in-JS objects, providing a convenient escape hatch for all those one-off rules which aren't supported by Tailwind. The `&` keyword allows you to write complex rules (like pseudo elements `&::before` and `&::after`) that are beyond the scope of inline styles without having to add another dependency.

Twind also provides a [css helper function](/handbook/css-in-twind) as a convenience for this case.

</details>

<details><summary>🤖 Built in support for conditional rule combining</summary>

Input is not limited to strings like with HTML classes. The [`tw` function](https://twind.dev/docs/handbook/getting-started/styling-with-twind.html#the-tw-function) accept arrays, objects, template literals, functions, almost everything! The interpreter spec is inspired by and is very similar to [clsx](https://github.com/lukeed/clsx) and offers a much more developer friendly API that handles null values gracefully.

</details>

<details><summary>🧐 Improved readability with multiline styles</summary>

Using template literals, objects, and even arrays allows you to break rules over multiple lines, drastically improving readability and maintainability of complex rules.

</details>

<details><summary>❄️ Optional hashing of class names ensuring no conflicts</summary>

You can optionally configure Twind to hash class names before injecting them into the document. This may be useful in production as it can reduce the down-the-wire size of server-side rendered pages and eliminates any chance of class name conflicts with third-party styles.

</details>

<details><summary>🔌 Language extension via plugins</summary>

You can effortlessly extend the Twind compiler's abilities by creating your own plugins in your Twind configuration.

[Check out the plugins guide](/handbook/plugins) for more information.

</details>

<details><summary>🎩 No runtime overhead with static extraction</summary>

The compiler is not reliant on the DOM, which makes it an ideal candidate for static extraction and removing all runtime overhead. This is possible during [SSR](/usage-guides/use-with-ssr) or build-time prepass.

</details>

## About this project

A lot of developers ask _"Why not just use Tailwind?"_ and our answer is always the same: You **should** use Tailwind. It is an absolutely incredible tool with amazing documentation!

However, if like us you are already building your app in JS using a framework like React, Preact, Vue or Svelte, rather than just static HTML, then compiling Tailwind shorthands just in time (like twind does) rather than ahead of time like with Tailwind and PostCSS, comes with a lot of advantages.

### Rationale and Inspiration

This project was started by the authors of two similar libraries – [oceanwind](https://github.com/lukejacksonn/oceanwind) and [beamwind](https://github.com/kenoxa/beamwind) – who chose to collaborate rather than compete with each other in this space.

> Combining efforts has saved us time and resulted in a much more complete and production ready offering.

Furthermore we were able to agree upon, and coin, some standards for certain aspects of the implementation based on our collective learnings; things like parsing input, grouping syntax, precedence calculation and plugin API.

Our inspirations for this project come from these fine projects:

- [Tailwind](https://tailwindcss.com/): Created a wonderfully thought out API on which the compiler's grammar was defined.
- [styled-components](https://styled-components.com/): Implemented and popularized the advantages of doing CSS-in-JS.
- [htm](https://github.com/developit/htm): A JSX compiler that proved there is merit in doing runtime compilation of DSLs like JSX.
- [goober](https://github.com/cristianbote/goober): An impossibly small yet efficient CSS-in-JS implementation that defines critical module features.
- [otion](https://github.com/kripod/otion): The first CSS-in-JS solution specifically oriented around handling CSS in an atomic fashion.
- [clsx](https://github.com/lukeed/clsx): A tiny utility for constructing class name strings conditionally.
- [style-vendorizer](https://github.com/kripod/style-vendorizer): Essential CSS prefixing helpers in less than 1KB of JavaScript.
- [CSSType](https://github.com/frenic/csstype): Providing autocompletion and type checking for CSS properties and values.

### Challenges

The core problems we are trying to solve here are as follows:

1. Parsing Input: taking input and normalizing it to create a comprehendible set of Tailwind rules
2. Compiling Rules: taking a set of Tailwind rules and translating them into appropriate CSS rules
3. Injecting Styles: taking CSS rules and generating classes that get append to a stylesheet in the DOM
4. Merging Themes: combining themes which configure and constrain the compiler
5. Custom Plugins: taking functions and using them to extend the capabilities of the compiler

This has to happen in a performant way at runtime, whilst adhering to Tailwind V2 as a language specification. All grammars that exist in Tailwind should be covered by this implementation.

### Opportunities

Simply recreating a tailwind like experience at runtime might seem like a futile exercise but we'd like to believe it opens up the doors to some exciting new possibilities. There is always going to be a tradeoff between compiling at ahead of time and compiling _just in time_, however we are confident the upsides here are significant enough to persue a runtime implementation and the results have been promising so far.

> Note it is still possible to remove all runtime overhead via a prepass either at serve or built time

The flexible nature of a runtime first approach affords us possibilities like:

- Dynamic Theming: generating new themes on the fly without the need to rebuilding anything
- Unlimited Variants: enabling every variant combination by default because unused rules are never generated
- Enhanced Syntax: taking advantage of macros within template literals to create more terse rules
- Error Handling: warning the developer about unknown directives and theme values
- Hashing Classes: reducing the overall output size and eliminating conflicts via deterministic hashing
- [Inline Plugins](https://twind.dev/docs/handbook/advanced/plugins.html#inline-plugins): extending the capabilities of the compiler with simple functions at runtime

Another big advantage we see of shipping the interpreter compiler itself (rather than pre-compiled output) is that the effective size of the CSS for your whole app is deterministic and fixed. The weight of the compiler itself along with your theme file is all that users will ever download, no matter how many styles you use.

Currently the compiler weighs around 12KB which is smaller than styled-components and the average tailwind output.

### Benchmarks

The implementation is tested for speed alongside several popular CSS-in-JS solutions that export general CSS functions. For those that only support a _styled component_ approach an equivalent test has been setup. Currently Twind comes in second place behind [goober](https://github.com/cristianbote/goober) – a less than 1KB css-in-js solution by Cristian Bote – an awesome library worth checking out.

**CSS Function w/ template literal**

| Library        | Results                                    |
| -------------- | ------------------------------------------ |
| goober@2.0.30  | x 632,419 ops/sec ±0.59% (95 runs sampled) |
| twind (tw)     | x 400,438 ops/sec ±0.35% (84 runs sampled) |
| twind (apply)  | x 342,725 ops/sec ±0.37% (96 runs sampled) |
| twind (css)    | x 270,020 ops/sec ±0.53% (95 runs sampled) |
| emotion@11.1.3 | x 229,990 ops/sec ±0.17% (99 runs sampled) |

**CSS Function w/ object**

| Library        | Results                                    |
| -------------- | ------------------------------------------ |
| goober@2.0.30  | x 842,430 ops/sec ±1.10% (88 runs sampled) |
| twind (css)    | x 203,990 ops/sec ±0.32% (94 runs sampled) |
| emotion@11.1.3 | x 162,460 ops/sec ±0.75% (90 runs sampled) |
| otion@0.6.2    | x 53,592 ops/sec ±0.85% (96 runs sampled)  |

**Styled component w/ template literal**

| Library                 | Results                                   |
| ----------------------- | ----------------------------------------- |
| twind                   | x 51,628 ops/sec ±0.63% (89 runs sampled) |
| goober@2.0.18           | x 40,069 ops/sec ±0.43% (96 runs sampled) |
| emotion@11.0.0          | x 35,349 ops/sec ±1.01% (93 runs sampled) |
| styled-components@5.2.1 | x 38,284 ops/sec ±0.48% (93 runs sampled) |

For a more detailed testing summary please see the [benchmarks](https://github.com/tw-in-js/twind/blob/main/benchmarks) directory.
