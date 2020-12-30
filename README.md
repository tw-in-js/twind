# Twind

> the smallest, fastest, most feature complete Tailwind-in-JS solution in existence

[![MIT License](https://badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/main/LICENSE)
[![Latest Release](https://flat.badgen.net/npm/v/twind?icon=npm&label&cache=10800)](https://www.npmjs.com/package/twind)
[![Bundle Size](https://flat.badgen.net/bundlephobia/minzip/twind?icon=packagephobia&label&color=blue&cache=10800)](https://bundlephobia.com/result?p=twind 'gzip bundle size (including dependencies)')
[![Package Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/twind/twind.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/twind.js 'brotli package size (without dependencies)')
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/twind.d.ts)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind?icon=github&label)](https://github.com/tw-in-js/twind)
[![CI](https://github.com/tw-in-js/twind/workflows/CI/badge.svg)](https://github.com/tw-in-js/twind/actions?query=workflow%3Aci)
[![Coverage Status](https://flat.badgen.net/coveralls/c/github/tw-in-js/twind/main?icon=codecov&label&cache=10800)](https://coveralls.io/github/tw-in-js/twind?branch=main)
[![PRs Welcome](https://flat.badgen.net/badge/PRs/welcome/purple)](http://makeapullrequest.com)

<details><summary>Quick Links (click to expand)</summary>

- [Quickstart](#quickstart)
- [Rationale](#rationale)
- [Why Twind?](#why-twind)
  - [Advantages](#advantages)
- [Documentation](https://github.com/tw-in-js/twind/tree/main/docs#readme)

  - Getting Started

    - [Installation](https://github.com/tw-in-js/twind/tree/main/docs/installation.md) - how to install `twind` or apply `twind/shim`
    - [Setup](https://github.com/tw-in-js/twind/tree/main/docs/setup.md) - how to use `setup`
    - [Theming](https://github.com/tw-in-js/twind/tree/main/docs/setup.md#theme) - how to apply your theme
    - [Examples](https://github.com/tw-in-js/twind/tree/main/docs/examples.md) - how to integrate with different frameworks

  - Usage

    - [`tw` Function](https://github.com/tw-in-js/twind/tree/main/docs/tw.md) - how to use `tw`
    - [Grouping](https://github.com/tw-in-js/twind/tree/main/docs/grouping.md) - how to optimize rules size
    - [Tailwind Extensions](https://github.com/tw-in-js/twind/tree/main/docs/tailwind-extensions.md) - which additional features are available
    - [CSS-in-JS](https://github.com/tw-in-js/twind/tree/main/docs/css-in-js.md) - how to apply custom css
    - [Plugins](https://github.com/tw-in-js/twind/tree/main/docs/plugins.md) - how to extend twind
    - [Testing](https://github.com/tw-in-js/twind/tree/main/docs/sheets.md) - how to verify the generated class names
    - [Static Extraction (SSR)](https://github.com/tw-in-js/twind/tree/main/docs/ssr.md) - how to extract the generated css on the server

  - Modules

    - twind - [tw](https://github.com/tw-in-js/twind/tree/main/docs/tw.md) and [setup](https://github.com/tw-in-js/twind/tree/main/docs/setup.md)
    - [twind/colors](https://github.com/tw-in-js/twind/tree/main/docs/setup.md#colors) - the Tailwind v2 [extended color palette](https://tailwindcss.com/docs/customizing-colors#color-palette-reference)
    - [twind/css](https://github.com/tw-in-js/twind/tree/main/docs/css-in-js.md) - how to apply custom css
    - [twind/observe](https://github.com/tw-in-js/twind/tree/main/docs/observe.md) - the base for [twind/shim](https://github.com/tw-in-js/twind/tree/main/docs/installation.md#twindshim) which can be used standalone
    - [twind/server](https://github.com/tw-in-js/twind/tree/main/docs/ssr.md) - how to extract the generated css on the server
    - [twind/sheets](https://github.com/tw-in-js/twind/tree/main/docs/sheets.md) - several additional sheet implementations that can be used with [setup({ sheet })](https://github.com/tw-in-js/twind/tree/main/docs/setup.md#sheet).
    - [twind/shim](https://github.com/tw-in-js/twind/tree/main/docs/installation.md#twindshim) - allows to copy-paste tailwind examples

  - Supporting Materials

    - [Tailwind Documentation](https://tailwindcss.com)
    - [Browser Support](https://github.com/tw-in-js/twind/tree/main/docs/browser-support.md)
    - [Contributing](https://github.com/tw-in-js/twind/tree/main/docs/contributing.md)
    - [Architecture](https://github.com/tw-in-js/twind/tree/main/docs/architecture.md)

- [Benchmarks](#benchmarks) - how does twind compare to other libraries
- [Inspiration](#inspiration) - who inspired us
- [Changelog](https://github.com/tw-in-js/twind/releases) - what is new

</details>

---

If you are here then the likelihood is that you using Tailwind or a CSS-in-JS solution such as styled-components, emotion or goober in order to style your web applications. These packages have proven overwhelmingly popular and revolutionized web development as we know it.

The purpose of this project is unify these two approaches; embracing the flexibility of CSS-in-JS whilst conforming to the carefully considered constraints of the Tailwind API.

We hope to create a place for likeminded people to discuss issues, share ideas and collaborate.

## Quickstart

If you would like to get started with twind right away then copy paste this code into your favorite sandbox.

```js
import { tw } from 'https://cdn.skypack.dev/twind'

document.body.innerHTML = `
  <main class="${tw`h-screen bg-purple-400 flex items-center justify-center`}">
    <h1 class="${tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}">This is Twind!</h1>
  </main>
`
```

Alternatively try the [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgdHcgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZCcKCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYAogIDxtYWluIGNsYXNzPSIke3R3YGgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJgfSI+CiAgICA8aDEgY2xhc3M9IiR7dHdgZm9udC1ib2xkIHRleHQoY2VudGVyIDV4bCB3aGl0ZSBzbTpncmF5LTgwMCBtZDpwaW5rLTcwMClgfSI+VGhpcyBpcyBUd2luZCE8L2gxPgogIDwvbWFpbj4KYA==) and take a look at the [installation guide](https://github.com/tw-in-js/twind/blob/main/docs/installation.md).

For seamless integration with existing Tailwind HTML you can use [twind/shim](https://github.com/tw-in-js/twind/blob/main/docs/installation.md#twindshim):

```html
<script type="module" src="https://cdn.skypack.dev/twind/shim"></script>

<main class="h-screen bg-purple-400 flex items-center justify-center">
  <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
</main>
```

Try `twind/shim` in the [live and interactive shim demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPG1haW4gY2xhc3M9Imgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIiPgogICAgPGgxIGNsYXNzPSJmb250LWJvbGQgdGV4dChjZW50ZXIgNXhsIHdoaXRlIHNtOmdyYXktODAwIG1kOnBpbmstNzAwKSI+CiAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICA8L2gxPgogIDwvbWFpbj4KYA==)

> 📚 For more detailed instruction on usage please [read the documentation](https://github.com/tw-in-js/twind/tree/main/docs#readme) and check out [this extended demo](https://esm.codes/#aW1wb3J0IHsgdHcsIHNldHVwIH0gZnJvbSAnaHR0cHM6Ly9jZG4uc2t5cGFjay5kZXYvdHdpbmQnCgpzZXR1cCh7CiAgdGhlbWU6IHsKICAgIC8vIEV4YW1wbGUgb2YgZXh0ZW5kaW5nIHRoZSBkZWZhdWx0IHRoZW1lCiAgICBleHRlbmQ6IHsKICAgICAgY29sb3JzOiB7IGhvdHBpbms6ICcjRkYwMEZGJyB9LAogICAgICByb3RhdGU6IHsgNTogJzVkZWcnIH0KICAgIH0KICB9Cn0pCgpjb25zdCBhcHAgPSAoKSA9PiBgCiAgICA8ZGl2IGNsYXNzPScke3N0eWxlLmNvbnRhaW5lcn0nPgogICAgICA8aDEgY2xhc3M9JyR7CiAgICAgICAgLy8gRXhhbXBsZSBvZiBhbiBpbmxpbmUgc3R5bGUKICAgICAgICB0d2AKICAgICAgICAgIHRleHQod2hpdGUgNHhsKQogICAgICAgICAgZm9udChib2xkIHNhbnMpCiAgICAgICAgICB0cmFuc2l0aW9uLXRyYW5zZm9ybQogICAgICAgICAgaG92ZXI6KAogICAgICAgICAgICByb3RhdGUtNQogICAgICAgICAgICBzY2FsZS0xNTAKICAgICAgICAgICAgY3Vyc29yLXBvaW50ZXIKICAgICAgICAgICkKICAgICAgICBgCiAgICAgIH0nPkhlbGxvIFdvcmxkPC9oMT4KICAgIDwvZGl2PgogIGA7CiAgCiAgCmNvbnN0IHN0eWxlID0gewogIC8vIEV4YW1wbGUgb2YgYWJzdHJhY3RlZCBzdHlsZQogIGNvbnRhaW5lcjogdHdgCiAgICBoLWZ1bGwKICAgIGJnLWhvdHBpbmsKICAgIGZsZXgKICAgIGl0ZW1zLWNlbnRlcgogICAganVzdGlmeS1jZW50ZXIKICBgCn0KCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYXBwKCk=)

## Rationale

This project was started by the authors of two similar libraries – [oceanwind](https://github.com/lukejacksonn/oceanwind) and [beamwind](https://github.com/kenoxa/beamwind) – who chose to collaborate rather than compete with each other in this space.

> Combining efforts has saved us time and resulted in a much more complete and production ready offering.

Furthermore we were able to agree on and coin some standards for certain aspects of the implementation based on our collective learnings; things like parsing input, [grouping syntax](https://github.com/tw-in-js/twind/blob/main/docs/grouping.md), prescedence calculation and [plugin API](https://github.com/tw-in-js/twind/blob/main/docs/plugins.md).

## Why twind?

A lot of developers ask _"Why not just use Tailwind?"_ and our answer is always that you should use Tailwind, it is an absolutely incredible API with amazing documentation!

> I've wanted to do a CSS-in-JS flavor of Tailwind for over 2 years because of all the neat benefits you get there so it's cool to see projects like this! – [@adamwathan](https://twitter.com/adamwathan/status/1320370489408225282)

However, if like us you are already building your app in JS using a framework like react, preact, vue or svelte, rather than just static HTML, then compiling Tailwind shorthand just in time (like twind does) rather than ahead of time like with Tailwind and PostCSS, comes with a lot of advantages.

### Advantages

> _Hint_ You can click on each summary to show additional details.

<details><summary>⚡️ No build step</summary>

In fact, there is no dependency on Tailwind or PostCSS at all. This makes it possible to use twind without a development server. The various ways how to start using twind are described in the [installation guide](https://github.com/tw-in-js/twind/blob/main/docs/installation.md).

```js
import { tw } from 'twind'

document.body.innerHTML = `
  <main class="${tw`h-screen bg-purple-400 flex items-center justify-center`}">
    <h1 class="${tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}">
      This is Twind!
    </h1>
  </main>
`
```

> [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgdHcgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZCcKCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYAogIDxtYWluIGNsYXNzPSIke3R3YGgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJgfSI+CiAgICA8aDEgY2xhc3M9IiR7dHdgZm9udC1ib2xkIHRleHQoY2VudGVyIDV4bCB3aGl0ZSBzbTpncmF5LTgwMCBtZDpwaW5rLTcwMClgfSI+CiAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICA8L2gxPgogIDwvbWFpbj4KYA==)

</details>

<details><summary>🧪 Use plain Tailwind HTML markup</summary>

It might not always be desirable to generate rules by invoking the compiler directly via function call. In this case you may use the [shim module](https://github.com/tw-in-js/twind/blob/main/docs/installation.md#twindshim) which finds and replaces class names within HTML, generating styles appropriately. This feature can be used together with your favorite framework without any additional setup. This is especially useful during development too; for example when editing classes in the inspector.

```html
<script type="module" src="https://cdn.skypack.dev/twind/shim"></script>

<main class="h-screen bg-purple-400 flex items-center justify-center">
  <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
</main>
```

> [live and interactive shim demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPG1haW4gY2xhc3M9Imgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIiPgogICAgPGgxIGNsYXNzPSJmb250LWJvbGQgdGV4dChjZW50ZXIgNXhsIHdoaXRlIHNtOmdyYXktODAwIG1kOnBpbmstNzAwKSI+CiAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICA8L2gxPgogIDwvbWFpbj4KYA==)

</details>

<details><summary>💸 Unlimited styles for a low fixed cost of ~11KB</summary>

By shipping the compiler (rather than the resultant output) there is a known and fixed cost associated with styling. No matter how many styles you write or how many variants you use, all your users will ever have to download is approximately 11Kb of code (which is less than styled-components or your average purged Tailwind build).

</details>

<details><summary>🎯 Extended syntax, variants and directives</summary>

> The following list is just an excerpt. Please take a look at the [Tailwind Extensions](https://github.com/tw-in-js/twind/tree/main/docs/tailwind-extensions.md) documentation page.

- Custom syntax for grouping directives and variants

  Having control over the interpreter affords us the possibility of defining terse syntax for [grouping responsive and pseudo variants](https://github.com/tw-in-js/twind/blob/main/docs/grouping.md) as well as directives with common prefixes. This massively reduces repetition and improves comprehension.

  ```js
  // Before directive grouping
  tw`border-2 border-black border-opacity-50 border-dashed`
  // After directive grouping
  tw`border(2 black opacity-50 dashed)`

  // With variants
  tw`sm:(border(2 black opacity-50 hover:dashed))`
  // => sm:border-2 sm:border-black sm:border-opacity-50 sm:hover:border-dashed

  tw`w(1/2 sm:1/3 lg:1/6) p-2`
  // => w-1/2 sm:w-1/3 lg:w-1/6 p-2
  ```

- Every variant can be applied to every directive

  Because twind is generating CSS during runtime there is no restriction to which directives variants can be applied.

- Most pseudo classes can be uses as variant or `group-*` variant

  Unknown variants (not listed in [core variants](https://github.com/tw-in-js/twind/blob/main/src/twind/variants.ts)) are assumed to be [pseudo classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes).

- `siblings`, `sibling` and `children` variants

  Allows to apply styling to different elements instead of repeating a directive on each one. This feature can be combined with other variants like `hover`.

- Using exclamation point (`!`) after a directive to override any other declarations

  Directives may end with exclamation point (`text-center!`) to be marked as [important](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity#The_!important_exception)

- Dark mode is always available

  Please see [Installation - Dark Mode](https://github.com/tw-in-js/twind/tree/main/docs//setup.md#dark-mode) for details.

</details>

<details><summary>✈️ Includes a themed Tailwind preflight stylesheet by default</summary>

The [base reset](https://tailwindcss.com/docs/preflight) provided by Tailwind is instantiated with respect to your theme (values like fonts, colors etc.) and injected in the stylesheet during setup. This guarantees more consistent cross browser results out of the box.

> It is possible to [customize or disable the preflight](https://github.com/tw-in-js/twind/blob/main/docs/setup.md#preflight).

</details>

<details><summary>🎢 Familiar and Tailwind V2 compliant theming</summary>

Theming is done exactly as [documented by the Tailwind](https://tailwindcss.com/docs/theme) meaning that you can copy paste in your themes from existing projects. The only different here is that there is no need to rebuild anything after changing you theme. Just refresh the page!

> For further details please read the [theme section](https://github.com/tw-in-js/twind/blob/main/docs/setup.md#theme) within the [installation guide](https://github.com/tw-in-js/twind/blob/main/docs/setup.md).

</details>

<details><summary>🚓 Escape hatch for writing arbitrary CSS</summary>

The compiler [accepts functions](https://github.com/tw-in-js/twind/blob/main/docs/tw.md#inline-plugins) that can return arbritary CSS-in-JS objects. A convenient a escape hatch for all those one off rules which aren't supported by tailwind. The `&` keyword allows you to write complex rules (like pseudo elements `&::before` and `&::after`) that are beyond the scope of inline styles without having to add another dependency.

> We provide a [css helper](https://github.com/tw-in-js/twind/tree/main/docs/css-in-js.md) as a convenience for this case.

</details>

<details><summary>🤖 Built in support for conditionally combining rules</summary>

Input is not limited to strings like with HTML classes. The [Twind function](https://github.com/tw-in-js/twind/tree/main/docs/tw.md) accept arrays, objects, template literals, functions, almost everything! The interpreter spec is inspired by and very similar to [clsx](https://github.com/lukeed/clsx) and offers a much more developer friendly API that handles null values gracefully.

</details>

<details><summary>🌈 Improve readability by breaking rules over multiple lines</summary>

Using template literals as input ([the recommended method](https://github.com/tw-in-js/twind/blob/main/docs/tw.md#template-literal-recommended)) or even [object syntax](https://github.com/tw-in-js/twind/blob/main/docs/tw.md#objects) allows you to break rules over multiple lines, drastically improving readability and maintainability of complex rules.

</details>

<details><summary>❄️ Optional hashing of class names ensuring no conflicts</summary>

By default no hashing is enabled to aid debugging during development. However it is possible to configure Twind to [hash class names](https://github.com/tw-in-js/twind/blob/main/docs/setup.md#hash) before injecting them into the DOM. This may be useful in production as it can reduce the down the wire size of server side rendered pages pages and eliminates any chance of class name conflicts with third party styles.

</details>

<details><summary>🚅 Faster than all popular CSS-in-JS libraries</summary>

Given the limited grammar that the compiler has to support there is a much higher chance of finding a rule and its variant in the cache, because of this along with some other specialist optimizations we are able to compile and inject CSS [faster than all the popular](#benchmarks) CSS-in-JS solutions.

</details>

<details><summary>🔌 Language extension via plugins </summary>

Extending the grammar is trivial and can be achieved by providing functions _inline_ or by generalizing inline rules and defining them during setup under [the _plugins_ key](https://github.com/tw-in-js/twind/blob/main/docs/plugins.md).

</details>

<details><summary>🎩 Remove all runtime overhead with static extraction</summary>

The compiler itself is not reliant on the DOM at all which makes it an ideal candidate for static extraction which essentially removes all runtime overhead. This is possible during [SSR](https://github.com/tw-in-js/twind/tree/main/docs/ssr.md) or build time prepass.

</details>

## Example

The following snippet demonstrates typical usage of both the `tw` and `setup` functions:

```js
import { tw, setup } from 'https://cdn.skypack.dev/twind'

setup({
  theme: {
    extend: {
      colors: { hotpink: '#FF00FF' },
      rotate: { 5: '5deg' },
    },
  },
})

document.body.innerHTML = `
  <div class='${tw`
    h-full
    flex items-center justify-center
    bg(hotpink sm:purple-500 md:green-500)
  `}'>
    <h1 class='${tw`
      text(white 4xl)
      font(bold sans)
      transition-transform
      hover:(rotate-5 scale-150 cursor-pointer)
    `}'>Hello World</h1>
  </div>
`
```

Try this example in the [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgdHcsIHNldHVwIH0gZnJvbSAnaHR0cHM6Ly9jZG4uc2t5cGFjay5kZXYvdHdpbmQnCgpzZXR1cCh7CiAgcHJlZmxpZ2h0OiB0cnVlLCAvLyBJbmNsdWRlIFRhaWx3aW5kIGJhc2UgcmVzZXQKICB0aGVtZTogewogICAgZXh0ZW5kOiB7CiAgICAgIGNvbG9yczogeyBob3RwaW5rOiAnI0ZGMDBGRicgfSwKICAgICAgcm90YXRlOiB7IDU6ICc1ZGVnJyB9LAogICAgfSwKICB9LAp9KQoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPGRpdiBjbGFzcz0nJHt0d2AKICAgIGgtZnVsbAogICAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIKICAgIGJnKGhvdHBpbmsgc206cHVycGxlLTUwMCBtZDpncmVlbi01MDApCiAgYH0nPgogICAgPGgxIGNsYXNzPScke3R3YAogICAgICB0ZXh0KHdoaXRlIDR4bCkKICAgICAgZm9udChib2xkIHNhbnMpCiAgICAgIHRyYW5zaXRpb24tdHJhbnNmb3JtCiAgICAgIGhvdmVyOihyb3RhdGUtNSBzY2FsZS0xNTAgY3Vyc29yLXBvaW50ZXIpCiAgICBgfSc+SGVsbG8gV29ybGQ8L2gxPgogIDwvZGl2PgpgCg==).

## Benchmarks

The implementation is tested for speed alongside several popular CSS-in-JS solutions that export general css functions. For those that only support a _styled component_ approach an equivalent test has been setup. Currently Twind is the fastest in both scenarios in part due to optimal caching of static parts from template literals.

### CSS Function w/ template literal

```
twind                       x 403,080 ops/sec ±1.41% (88 runs sampled)
goober@2.0.18               x 143,202 ops/sec ±0.90% (95 runs sampled)
emotion@11.0.0              x 224,368 ops/sec ±0.52% (93 runs sampled)
```

### Styled component w/ template literal

```
twind                       x 51,628 ops/sec ±0.63% (89 runs sampled)
goober@2.0.18               x 40,069 ops/sec ±0.43% (96 runs sampled)
emotion@11.0.0              x 35,349 ops/sec ±1.01% (93 runs sampled)
styled-components@5.2.1     x 38,284 ops/sec ±0.48% (93 runs sampled)
```

For a more detailed testing summary please see the [benchmarks](https://github.com/tw-in-js/twind/blob/main/benchmarks) directory.

## Inspiration

It would be untrue to suggest that the design here is totally original, other than the founders initial attempts at implementing such a module ([oceanwind](https://github.com/lukejacksonn/oceanwind) and [beamwind](https://github.com/kenoxa/beamwind)) we are truly standing on the shoulders of giants.

- [tailwind](https://tailwindcss.com/): created a wonderfully thought out API on which the compiler's grammar was defined.
- [styled-components](https://styled-components.com/): implemented and popularized the advantages of doing CSS-in-JS.
- [htm](https://github.com/developit/htm): a JSX compiler that proved there is merit in doing runtime compilation of DSLs like JSX.
- [goober](https://github.com/cristianbote/goober): an impossibly small yet efficient CSS-in-JS implementation that defines critical module features.
- [otion](https://github.com/kripod/otion): the first CSS-in-JS solution specifically oriented around handling CSS in an atomic fashion.
- [clsx](https://github.com/lukeed/clsx): a tiny utility for constructing class name strings conditionally.
- [style-vendorizer](https://github.com/kripod/style-vendorizer): essentials CSS prefixing helpers in less than 1KB of JavaScript.
- [csstype](https://github.com/frenic/csstype): providing autocompletion and type checking for CSS properties and values.

## License

[MIT](https://github.com/tw-in-js/twind/blob/main/LICENSE)
