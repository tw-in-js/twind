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

> The smallest, fastest, most feature complete Tailwind-in-JS solution in existence

[![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/main/LICENSE)
[![Latest Release](https://flat.badgen.net/npm/v/twind?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/twind)
[![Bundle Size](https://flat.badgen.net/bundlephobia/minzip/twind?icon=packagephobia&label&color=blue&cache=10800)](https://bundlephobia.com/result?p=twind 'gzip bundle size (including dependencies)')
[![Package Size](https://flat.badgen.net/badgesize/brotli/https://cdn.jsdelivr.net/npm/twind/twind.min.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/twind.js 'brotli package size (without dependencies)')
[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind?icon=github&label)](https://github.com/tw-in-js/twind)
[![Discord](https://flat.badgen.net/badge/icon/discord?icon=discord&label)](https://discord.com/invite/2aP5NkszvD)
[![CI](https://github.com/tw-in-js/twind/workflows/CI/badge.svg)](https://github.com/tw-in-js/twind/actions?query=workflow%3Aci)
[![Coverage Status](https://flat.badgen.net/coveralls/c/github/tw-in-js/twind/main?icon=codecov&label&cache=10800)](https://coveralls.io/github/tw-in-js/twind?branch=main)

<!-- Hmmm?... -->
<!-- <Quote author="Adam Wathan (creator of Tailwind)">I've wanted to do a CSS-in-JS flavor of Tailwind for over 2 years because of all the neat benefits you get there so it's cool to see projects like this!</Quote> -->

Twind is a small compiler (~13kB) that converts Tailwind utility classes into CSS at runtime. The goal of this project is to unify the flexibility of CSS-in-JS with the carefully considered constraints of the Tailwind API.

## Features

**<Emoji symbol="⚡️"/> No build step**

Get all the benefits of Tailwind without the need for PostCSS, configuration, purging, or autoprefixing.

**<Emoji symbol="🚀"/> Framework agnostic**

If your app uses HTML and JavaScript, it should work with Twind. This goes for server-rendered apps too.

**<Emoji symbol="😎"/> One low fixed cost**

Twind ships the compiler, not the CSS. This means unlimited styles and variants for one low fixed cost of ~13kB.

![Example showing how Twind injects styles at runtime](/assets/how-twind-works.gif 'How Twind works')

**Other features include:**

:::tip
Click on each summary to show additional details.
:::

<details><summary><Emoji symbol="🚅" /> Faster than most CSS-in-JS libraries</summary>

Twind's advanced caching and specialized optimizations enable it to compile and inject CSS faster than most other CSS-in-JS solutions. [Check out the benchmarks](/handbook/benchmarks) to learn more.

</details>

<details><summary><Emoji symbol="🎨" /> Seamless integration with Tailwind</summary>

If it works in Tailwind, it should work in Twind.

Class names that are provided by Tailwind will always work with Twind. Further, Twind configuration and theming follow [Tailwind conventions](https://tailwindcss.com/docs/theme), meaning you can copy/paste your Tailwind config to the Twind `setup` function. The only difference here is that there is no need to rebuild after changing your theme. Just refresh the page! For more information, check out the [configuration guide](/handbook/configuration).

Twind also provides [a shim](/handbook/the-shim), which allows for seamless integration with your existing Tailwind styles with no configuration. The shim can improve the development experience and is useful for incremental migration.

</details>

<details><summary><Emoji symbol="🎯" /> Extended variants, directives, and syntax</summary>

Twind provides additional variants, directives, and syntaxes to give you even more ways to express your styles:

- [Grouping syntax](/handbook/grouping-syntax.md) `class="text(black uppercase md:blue-400)"`
- [Extended variants](/handbook/extended-functionality#variants) like `siblings`, `sibling`, `children`, and `override`
- [Extended utilities](/handbook/extended-functionality#utilities) like `text-underline` and `font-italic`.

</details>

<details><summary><Emoji symbol="✈️" /> Tailwind preflight by default</summary>

The [base reset](https://tailwindcss.com/docs/preflight) provided by Tailwind is merged with your optional theme configuration and injected in the stylesheet during setup. This guarantees more consistent cross-browser styles out of the box.

:::tip
It is possible to [customize or disable the preflight](/handbook/configuration#preflight).
:::

</details>

<details><summary><Emoji symbol="🚓" /> Escape hatch for arbitrary CSS</summary>

The Twind compiler accepts functions that can return arbitrary CSS-in-JS objects, providing a convenient escape hatch for all those one-off rules which aren't supported by Tailwind. The `&` keyword allows you to write complex rules (like pseudo elements `&::before` and `&::after`) that are beyond the scope of inline styles without having to add another dependency.

Twind also provides a [css helper function](/handbook/css-in-twind) as a convenience for this case.

</details>

<details><summary><Emoji symbol="🤖" /> Built in support for conditional rule combining</summary>

The [`tw` function](./styling-with-twind.md#the-tw-function) allows you to represent your styles in arrays, objects, template literals, functions, or any combination of these.The interpreter spec is inspired by and is very similar to [clsx](https://github.com/lukeed/clsx) and offers a much more developer friendly API that handles null values gracefully.

</details>

<details><summary><Emoji symbol="🧐" /> Improved readability with multiline styles</summary>

Using template literals, objects, and even arrays allows you to break rules over multiple lines, drastically improving readability and maintainability of complex rules.

</details>

<details><summary><Emoji symbol="❄️" /> Optional hashing of class names ensuring no conflicts</summary>

You can optionally configure Twind to hash class names before injecting them into the document. This may be useful in production as it can reduce the down-the-wire size of server-side rendered pages and eliminates any chance of class name conflicts with third-party styles.

</details>

<details><summary><Emoji symbol="🔌" /> Language extension via plugins</summary>

You can effortlessly extend the Twind compiler's abilities by creating your own plugins in your Twind configuration.

Check out [the plugins guide](/handbook/plugins) for more information.

</details>

<details><summary><Emoji symbol="🎩" /> No runtime overhead with static extraction</summary>

The compiler is not reliant on the DOM, which makes it an ideal candidate for static extraction and removing all runtime overhead. This is possible during [SSR](/usage-guides/ssr) or build-time prepass.

</details>

## Rationale and Inspiration

This project was started by the authors of two similar libraries – [oceanwind](https://github.com/lukejacksonn/oceanwind) and [beamwind](https://github.com/kenoxa/beamwind) – who chose to collaborate with each other in this space.

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

Recreating the Tailwind experience at runtime might seem like a futile exercise, but we'd like to believe it opens up the doors to some exciting new possibilities. There is always going to be a tradeoff between compiling at ahead of time and compiling _just in time_, however we are confident that the upsides here are significant enough to pursue a runtime implementation. [The results](/handbook/benchmarks) have been promising so far.

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

## <Emoji symbol="🙏🏾" /> Sponsors

Support us with a monthly donation and help us continue our activities.

[[GitHub Sponsor](https://github.com/sponsors/tw-in-js) | [Open Collective](https://opencollective.com/twind)]

<a href="https://github.com/jordwalke" target="_blank"><img class="avatar-user" src="https://avatars.githubusercontent.com/u/977348?v=4" width="64" height="64" alt="@jordwalke"></a>
<a href="https://github.com/tylerforesthauser" target="_blank"><img class="avatar-user" src="https://avatars.githubusercontent.com/u/1226786?v=4" width="64" height="64" alt="@tylerforesthauser"></a>
<a href="https://github.com/holic" target="_blank"><img class="avatar-user" src="https://avatars.githubusercontent.com/u/508855?v=4" width="64" height="64" alt="@holic"></a>
<a href="https://github.com/Andrewnt219" target="_blank"><img style="border-radius: 50%!important" src="https://avatars.githubusercontent.com/u/52666982?v=4" width="64" height="64" alt="@Andrewnt219"></a>
<a href="https://opencollective.com/twind/backer/0/website" target="_blank"><img src="https://opencollective.com/twind/backer/0/avatar.svg" alt=""></a>
<a href="https://opencollective.com/twind/backer/1/website" target="_blank"><img src="https://opencollective.com/twind/backer/1/avatar.svg" alt=""></a>
<a href="https://opencollective.com/twind/backer/2/website" target="_blank"><img src="https://opencollective.com/twind/backer/2/avatar.svg" alt=""></a>

<a href="https://opencollective.com/twind/sponsor/0/website" target="_blank"><img src="https://opencollective.com/twind/sponsor/0/avatar.svg" alt=""></a>
<a href="https://opencollective.com/twind/sponsor/1/website" target="_blank"><img src="https://opencollective.com/twind/sponsor/1/avatar.svg" alt=""></a>
