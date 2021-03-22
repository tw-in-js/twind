---
title: Getting Started
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: How to get started using Twind
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

## ES Module (CDN)

Twind is available as an ES Module on [skypack](https://skypack.dev/). Be sure to check [browsers support](https://caniuse.com/es6-module) if your users may not be using modern browsers.

For seamless integration with existing Tailwind HTML, you can use [the Shim](/docs/guide/the-shim.md):

```html
<script type="module" src="https://cdn.skypack.dev/twind/shim"></script>

<main class="h-screen bg-purple-400 flex items-center justify-center">
  <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
</main>
```

<DemoLink
  href="https://www.flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgCsEAaEAYwHs0AXGWvCLAB0oCcaACYTmgd04BfTmDaUsnAOQALGjWZxEAeiXkAJmnxwA1gE9mGctvxqYANyX8IaNZIA6aB2srkArjlr4ARpTW781mgwbAASACoAsgAynAC8nAAGDpycADxYGNac5FAYcHCxdiAAJMD8CdIAtHDkbDD0nF4A5pXMrmzMsJUALAAMvSKwAB6cEHRYcJXk9HRsnISucDQQYLpTM8EJgkUAfMkpadIAjNm5+YUlZXwJYNQ0lT5QarwwQzQAFNO0wZwArENQTh8aRjGCcOBYRBNNgYNYADn6nCwakQzGs2kqAHZ+gBKLa7fYHThhEFwUZksJ8axqACEhLSSmOezQKVSSgy1mZCRAZDgMFg5GW1AQiBAcMQRxAggAumQoOiRagQJgcHgrDYeSB2lA8LJ5IoVK40MxtE18FQsJYqTYAAK9fBHX74bpW6n4dxqIikEA0fS4UU1NgQZg0KXSwRAA"
/>

For advanced use cases the `tw` function is the right choice:

```html
<script type="module">
  import { tw } from 'https://cdn.skypack.dev/twind'
</script>
```

If you would like to get started with Twind right away, you can copy/paste this code into your favorite sandbox (CodeSandbox, CodePen, etc.):

```js
import { tw } from 'https://cdn.skypack.dev/twind'

document.body.innerHTML = `
  <main class="${tw`h-screen bg-purple-400 flex items-center justify-center`}">
    <h1 class="${tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}">This is Twind!</h1>
  </main>
`
```

Using the exported `tw` function results in the compilation of the rules like `bg-black text-white` and `text-xl` exactly as specified in the [Tailwind documentation](https://tailwincss.com/docs). For convenience, the default [Tailwind theme](https://github.com/tailwindlabs/tailwindcss/blob/v1/stubs/defaultConfig.stub.js) is used along with the preflight [base styles](https://tailwindcss.com/docs/preflight) unless you explicitly overwrite them.

Twind is designed to be used in almost any environment and exposes several different bundles from ESM to UMD. The ESM bundles should be preferred for it's smaller size and faster performance.

:::tip
Although Twind is compatible with traditional bundlers, there is no build step required to use Twind.
:::

## Local Module (NPM)

Twind is available as an NPM module.

```shell
npm i twind
```

## Supporting legacy browsers

A UMD build is available for legacy browsers.

```html
<script src="https://unpkg.com/twind/twind.umd.js"></script>
<script>
  var tw = twind.tw
</script>
```

#### Supporting IE11 and obsolete platforms

The library will currently run in [all browsers](https://browserslist.dev/?q=PjAlLCBub3QgQ2hyb21lIDwzNiwgbm90IEVkZ2UgPDEyLCBub3QgRmlyZWZveCA8MjAsIG5vdCBPcGVyYSA8MjUsIG5vdCBTYWZhcmkgPDgsIG5vdCBpT1MgPDgsIG5vdCBPcGVyYU1vYmlsZSA8PSAxMi4xLCBub3QgaWUgPD0gMTEsIG5vdCBJRV9Nb2IgPD0gMTE%3D) that support [Math.imul](https://caniuse.com/mdn-javascript_builtins_math_imul), [Map](https://caniuse.com/mdn-javascript_builtins_map), [Set](https://caniuse.com/mdn-javascript_builtins_set) and [WeakMap](https://caniuse.com/mdn-javascript_builtins_weakmap) (eg Chrome >=36, Edge >=12, Firefox >=20, Opera >=25, Safari >=8, iOS >=8). Additionally all LTS versions of Node.js are supported.

This library uses features like destructuring assignment and const/let declarations and doesn't ship with ES5 transpiled sources. If you aim to support browsers like IE11 and below → make sure you configure your transpiler/bundler to include your `node_modules`.

Additionally you need to provide a [polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul#Polyfill) for `Math.imul`. IE 11 already supports `Map`, `Set` and `WeakMap` - no polyfills needed for these.

Some new tailwind features use [CSS Variables (Custom Properties)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) which are [**not** available in legacy browsers](https://caniuse.com/css-variables) (Chrome <49, IE, Edge <16, Firefox <31, Opera <36, Safari <9.1, iOS <9.3). For IE 11 you can try the [CSS Variables Polyfill](https://github.com/nuxodin/ie11CustomProperties).

We included fallbacks for the following directives which mimic [Tailwind v1](https://v1.tailwindcss.com/) behavior:

- Color Opacity
  - [border-opacity-\*](https://tailwindcss.com/docs/border-opacity)
  - [bg-opacity-\*](https://tailwindcss.com/docs/background-opacity)
  - [text-opacity-\*](https://tailwindcss.com/docs/text-opacity)
  - [placeholder-opacity-\*](https://tailwindcss.com/docs/placeholder-opacity)
- Reversing Children Order
  - [divide-\*-reverse](https://tailwindcss.com/docs/divide-width#reversing-children-order)
  - [space-\*-reverse](https://tailwindcss.com/docs/space#reversing-children-order)
- `rotate`, `scale` , `skew` and `translate` can only be used alone

  > `rotate-45` works but when using `rotate-45 scale-150` only one of both is applied. In that case you must use `transform`: `transform rotate-45 scale-150`

Some directive only work with CSS Variables and are not supported in legacy browsers:

- [Ring](https://tailwindcss.com/docs/ring-width)
