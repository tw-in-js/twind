# Examples

Twind is built to work without a framework - eg framework agnostic - but can be used with every framework. This page shows how integrate twind with some well known libraries. Most examples will use the `tw` function. Please read its [documentation](./tw.md) if it is unfamiliar.

- [Vanilla](#vanilla) - plain js; no framework
- [twind/shim](#twindshim) - plain Tailwind HTML with [twind/shim](./installation.md#twindshim)
- [React](#react) - using with [React](https://reactjs.org/)
- [React w/ htm](#htmreact) - using [React](https://reactjs.org/) with [htm](https://github.com/developit/htm)
- [Preact](#preact) - using with [Preact](https://preactjs.com/)
- [Preact w/ htm](#htmpreact) - using [Preact](https://preactjs.com/) with [htm](https://github.com/developit/htm)
- [Svelte](#svelte) - using with [Svelte](https://svelte.dev/)

> If you need to support Server Side Rendering (SSR) aka Static Extraction please read [this guide](./ssr.md) for more details how to implement it.

## Vanilla

> [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgdHcgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZCcKCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYAogIDxtYWluIGNsYXNzPSIke3R3YGgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJgfSI+CiAgICA8aDEgY2xhc3M9IiR7dHdgZm9udC1ib2xkIHRleHQoY2VudGVyIDV4bCB3aGl0ZSBzbTpncmF5LTgwMCBtZDpwaW5rLTcwMClgfSI+VGhpcyBpcyBUd2luZCE8L2gxPgogIDwvbWFpbj4KYA==)

```js
import { tw } from 'https://cdn.skypack.dev/twind'

document.body.innerHTML = `
  <main class="${tw`h-screen bg-purple-400 flex items-center justify-center`}">
    <h1 class="${tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}">This is Twind!</h1>
  </main>
`
```

## twind/shim

[live and interactive shim demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPG1haW4gY2xhc3M9Imgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIiPgogICAgPGgxIGNsYXNzPSJmb250LWJvbGQgdGV4dChjZW50ZXIgNXhsIHdoaXRlIHNtOmdyYXktODAwIG1kOnBpbmstNzAwKSI+VGhpcyBpcyBUd2luZCE8L2gxPgogIDwvbWFpbj4KYA==)

```html
<script type="module" src="https://cdn.skypack.dev/twind/shim"></script>

<main class="h-screen bg-purple-400 flex items-center justify-center">
  <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
</main>
```

> `twind/shim` can be used together with `tw` and every framework as it detects `class` changes.

## React

```jsx
import ReactDOM from 'react-dom'
import * as React from 'react'

import { tw } from 'twind'

ReactDOM.render(
  <main className={tw`h-screen bg-purple-400 flex items-center justify-center`}>
    <h1 className={tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}>This is Twind!</h1>
  </main>,
  document.body,
)
```

## htm/react

```js
import ReactDOM from 'react-dom'
import { html } from 'htm/react'

import { tw } from 'twind'

ReactDOM.render(
  html`
    <main className="${tw`h-screen bg-purple-400 flex items-center justify-center`}">
      <h1 className="${tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}">
        This is Twind!
      </h1>
    </main>
  `,
  document.body,
)
```

## Preact

```jsx
import { h, render } from 'preact'

import { tw } from 'twind'

render(
  <main className={tw`h-screen bg-purple-400 flex items-center justify-center`}>
    <h1 className={tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}>This is Twind!</h1>
  </main>,
  document.body,
)
```

## htm/preact

```js
import { render } from 'preact'
import { html } from 'htm/preact'

import { tw } from 'twind'

render(
  html`
    <main className="${tw`h-screen bg-purple-400 flex items-center justify-center`}">
      <h1 className="${tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}">
        This is Twind!
      </h1>
    </main>
  `,
  document.body,
)
```

## Svelte

```html
<script>
  import { tw } from 'twind'
</script>

<main class="{tw`h-screen" bg-purple-400 flex items-center justify-center`}>
  <h1 class="{tw`font-bold" text(center 5xl white sm:gray-800 md:pink-700)`}>This is Twind!</h1>
</main>
```

<hr/>

Continue to [`tw` function](./tw.md)
