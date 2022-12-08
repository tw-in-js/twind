<div align="center">


<h1>

Nov 18, 2022: [Twind v1](https://github.com/tw-in-js/twind/tree/main#readme) is now in stable release!

</h1>

<h2>

Please check out the [Migration Guide](https://twind.style/migration#from-twind-v016) to upgrade and use the new [@twind/core](https://www.npmjs.com/package/@twind/core) package.

<h2>

</div>

----

<div align="center">

<img src="https://twind.dev/assets/twind-logo-animated.svg" height="125" width="125" />
<a href="https://twind.dev" align="center"><h1>Twind</h1></a>

<p align="center">
The smallest, fastest, most feature complete Tailwind-in-JS solution in existence
</p>

[![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/v0.16/LICENSE)
[![Latest Release](https://flat.badgen.net/npm/v/twind?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/twind)
[![Bundle Size](https://flat.badgen.net/bundlephobia/minzip/twind?icon=packagephobia&label&color=blue&cache=10800)](https://bundlephobia.com/result?p=twind 'gzip bundle size (including dependencies)')
[![Package Size](https://flat.badgen.net/badgesize/brotli/https://cdn.jsdelivr.net/npm/twind/twind.min.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/twind.js 'brotli package size (without dependencies)')
[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind?icon=github&label)](https://github.com/tw-in-js/twind)
[![Discord](https://flat.badgen.net/badge/icon/discord?icon=discord&label)](https://chat.twind.style)
[![CI](https://github.com/tw-in-js/twind/workflows/CI/badge.svg)](https://github.com/tw-in-js/twind/actions?query=workflow%3Aci)
[![Coverage Status](https://flat.badgen.net/coveralls/c/github/tw-in-js/twind/v0.16?icon=codecov&label&cache=10800)](https://coveralls.io/github/tw-in-js/twind?branch=v0.16)

</div>

Twind is a small compiler (~13kB) that converts Tailwind classes into actual CSS rules at runtime. If you have used Tailwind or other CSS-in-JS solutions, then most of the API should feel very familiar.

## [Documentation](https://twind.dev)

Frequently viewed docs:

- [Quick Reference](https://twind.dev/handbook/quick-reference.html) – fast overview
- [Getting Started](https://twind.dev/handbook/getting-started.html) – how to install `twind`
- [Shim](https://twind.dev/handbook/the-shim.html) – seamless integration with existing Tailwind HTML
- [Styling with Twind](https://twind.dev/handbook/styling-with-twind.html) – how to style with Twind
- [Grouping](https://twind.dev/handbook/grouping-syntax.html) – how to optimize rules size
- [Theming](https://twind.dev/handbook/configuration.html#theme) – how to apply your theme
- [CSS-in-JS](https://twind.dev/handbook/css-in-twind.html) – how to apply custom CSS
- [Tailwind Extensions](https://twind.dev/handbook/extended-functionality.html) – which additional features are available

## [Features](http://twind.dev/handbook/introduction.html#features)

**⚡️ No build step**

Get all the benefits of Tailwind without the need for Tailwind, PostCSS, configuration, purging, or autoprefixing.

**🚀 Framework agnostic**

If your app uses HTML and JavaScript, it should work with Twind. This goes for server-rendered apps too.

**😎 One low fixed cost**

Twind ships the compiler, not the CSS. This means unlimited styles and variants for one low fixed cost of ~13kB.

Other features include:

- 🎨 Seamless integration with Tailwind
- 🎯 Extended variants, directives, and syntax
- ✈️ Tailwind preflight by default
- 🤝 Feature parity with Tailwind
- 🚓 Escape hatch for arbitrary CSS
- 🤖 Built in support for conditional rule combining
- 🧐 Improved readability with multiline styles
- ❄️ Optional hashing of class names ensuring no conflicts
- 🔌 Language extension via plugins
- 🎩 No runtime overhead with static extraction
- 🚅 Faster than most CSS-in-JS libraries
- and more!

## ⚡️ [Quick Start](http://twind.dev/handbook/getting-started.html)

Copy and paste this code into your favorite sandbox to get started with Twind right away:

```js
import { tw } from 'https://cdn.skypack.dev/twind'

document.body.innerHTML = `
  <main class="${tw`h-screen bg-purple-400 flex items-center justify-center`}">
    <h1 class="${tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}">This is Twind!</h1>
  </main>
`
```

Alternatively try the 🚀 [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgdHcgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZCcKCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYAogIDxtYWluIGNsYXNzPSIke3R3YGgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJgfSI+CiAgICA8aDEgY2xhc3M9IiR7dHdgZm9udC1ib2xkIHRleHQoY2VudGVyIDV4bCB3aGl0ZSBzbTpncmF5LTgwMCBtZDpwaW5rLTcwMClgfSI+VGhpcyBpcyBUd2luZCE8L2gxPgogIDwvbWFpbj4KYA==) and take a look at the [installation guide](https://twind.dev/handbook/getting-started).

Twind is also available as an [NPM package](https://www.npmjs.com/package/twind):

```
npm i twind
```

For seamless integration with existing Tailwind HTML you can use [twind/shim](https://twind.dev/handbook/the-shim.html):

```html
<script type="module" src="https://cdn.skypack.dev/twind/shim"></script>

<main class="h-screen bg-purple-400 flex items-center justify-center">
  <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
</main>
```

Try `twind/shim` in the 🚀 [live and interactive shim demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPG1haW4gY2xhc3M9Imgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIiPgogICAgPGgxIGNsYXNzPSJmb250LWJvbGQgdGV4dChjZW50ZXIgNXhsIHdoaXRlIHNtOmdyYXktODAwIG1kOnBpbmstNzAwKSI+CiAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICA8L2gxPgogIDwvbWFpbj4KYA==)

This is just the beginning of all the awesome things you can do with Twind. [Check out the handbook](https://twind.dev/handbook/introduction.html) to learn more.

## 💡 Inspiration

It would be untrue to suggest that the design here is totally original. Other than the founders' initial attempts at implementing such a module ([oceanwind](https://github.com/lukejacksonn/oceanwind) and [beamwind](https://github.com/kenoxa/beamwind)) we are truly standing on the shoulders of giants.

- [Tailwind](https://tailwindcss.com/): created a wonderfully thought out API on which the compiler's grammar was defined.
- [styled-components](https://styled-components.com/): implemented and popularized the advantages of doing CSS-in-JS.
- [htm](https://github.com/developit/htm): a JSX compiler that proved there is merit in doing runtime compilation of DSLs like JSX.
- [goober](https://github.com/cristianbote/goober): an impossibly small yet efficient CSS-in-JS implementation that defines critical module features.
- [otion](https://github.com/kripod/otion): the first CSS-in-JS solution specifically oriented around handling CSS in an atomic fashion.
- [clsx](https://github.com/lukeed/clsx): a tiny utility for constructing class name strings conditionally.
- [style-vendorizer](https://github.com/kripod/style-vendorizer): essential CSS prefixing helpers in less than 1KB of JavaScript.
- [CSSType](https://github.com/frenic/csstype): providing autocompletion and type checking for CSS properties and values.

## 🙏🏾 Sponsors

Support us with a monthly donation and help us continue our activities.

[[GitHub Sponsor](https://github.com/sponsors/tw-in-js) | [Open Collective](https://opencollective.com/twind)]

<a href="https://github.com/jordwalke" target="_blank"><img style="border-radius: 50%!important" src="https://avatars.githubusercontent.com/u/977348?v=4" width="64" height="64" alt="@jordwalke"></a>
<a href="https://github.com/tylerforesthauser" target="_blank"><img style="border-radius: 50%!important" src="https://avatars.githubusercontent.com/u/1226786?v=4" width="64" height="64" alt="@tylerforesthauser"></a>
<a href="https://github.com/holic" target="_blank"><img style="border-radius: 50%!important" src="https://avatars.githubusercontent.com/u/508855?v=4" width="64" height="64" alt="@holic"></a>
<a href="https://github.com/Andrewnt219" target="_blank"><img style="border-radius: 50%!important" src="https://avatars.githubusercontent.com/u/52666982?v=4" width="64" height="64" alt="@Andrewnt219"></a>
<a href="https://opencollective.com/twind/backer/0/website" target="_blank"><img src="https://opencollective.com/twind/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/twind/backer/1/website" target="_blank"><img src="https://opencollective.com/twind/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/twind/backer/2/website" target="_blank"><img src="https://opencollective.com/twind/backer/2/avatar.svg"></a>

<a href="https://opencollective.com/twind/sponsor/0/website" target="_blank"><img src="https://opencollective.com/twind/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/twind/sponsor/1/website" target="_blank"><img src="https://opencollective.com/twind/sponsor/1/avatar.svg"></a>

## 🤝 Contributing

We are excited that you are interested in contributing to this project! We've put together a whole [contribution guide](https://github.com/tw-in-js/twind/blob/v0.16/CONTRIBUTING.md) to get you started.

## ⚖️ License

The [MIT license](https://github.com/tw-in-js/twind/blob/v0.16/LICENSE) governs your use of Twind.
