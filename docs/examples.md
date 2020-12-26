# Examples

Twind is built to work without a framework - eg framework agnostic - but can be used with every framework. This page shows how integrate twind with some well known libraries.

> Most examples will use the `tw` function. Please read its [documentation](./tw.md) if it is unfamiliar.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Vanilla - plain js; no framework](#vanilla---plain-js-no-framework)
- [twind/shim - plain Tailwind HTML](#twindshim---plain-tailwind-html)
- [React](#react)
- [htm/react - React with htm](#htmreact---react-with-htm)
- [Preact](#preact)
- [htm/preact - Preact with htm](#htmpreact---preact-with-htm)
- [Svelte](#svelte)
- [Web Components - Custom Elements and Shadow DOM](#web-components---custom-elements-and-shadow-dom)
- [LitElement](#litelement)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

> If you need to support Server Side Rendering (SSR) aka Static Extraction please read [this guide](./ssr.md) for more details how to implement it.

## Vanilla - plain js; no framework

```js
import { tw } from 'twind'

document.body.innerHTML = `
  <main class="${tw`h-screen bg-purple-400 flex items-center justify-center`}">
    <h1 class="${tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}">This is Twind!</h1>
  </main>
`
```

> [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgdHcgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZCcKCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYAogIDxtYWluIGNsYXNzPSIke3R3YGgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJgfSI+CiAgICA8aDEgY2xhc3M9IiR7dHdgZm9udC1ib2xkIHRleHQoY2VudGVyIDV4bCB3aGl0ZSBzbTpncmF5LTgwMCBtZDpwaW5rLTcwMClgfSI+VGhpcyBpcyBUd2luZCE8L2gxPgogIDwvbWFpbj4KYA==)

## [twind/shim](./installation.md#twindshim) - plain Tailwind HTML

> `twind/shim` can be used together with `tw` and every framework as it detects `class` changes.

```html
<script type="module" src="https://cdn.skypack.dev/twind/shim"></script>

<main class="h-screen bg-purple-400 flex items-center justify-center">
  <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
</main>
```

> [live and interactive shim demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPG1haW4gY2xhc3M9Imgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIiPgogICAgPGgxIGNsYXNzPSJmb250LWJvbGQgdGV4dChjZW50ZXIgNXhsIHdoaXRlIHNtOmdyYXktODAwIG1kOnBpbmstNzAwKSI+VGhpcyBpcyBUd2luZCE8L2gxPgogIDwvbWFpbj4KYA==)

## [React](https://reactjs.org/)

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

## htm/react - [React](https://reactjs.org/) with [htm](https://github.com/developit/htm)

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

> [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAnaHR0cHM6Ly9jZG4uc2t5cGFjay5kZXYvcmVhY3QtZG9tJwppbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi9yZWFjdCcKaW1wb3J0IGh0bSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi9odG0nCgppbXBvcnQgeyB0dyB9IGZyb20gJ2h0dHBzOi8vY2RuLnNreXBhY2suZGV2L3R3aW5kJwoKY29uc3QgaHRtbCA9IGh0bS5iaW5kKFJlYWN0LmNyZWF0ZUVsZW1lbnQpCgpyZW5kZXIoCiAgaHRtbGAKICAgIDxtYWluIGNsYXNzTmFtZT0iJHt0d2BoLXNjcmVlbiBiZy1wdXJwbGUtNDAwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyYH0iPgogICAgICA8aDEgY2xhc3NOYW1lPSIke3R3YGZvbnQtYm9sZCB0ZXh0KGNlbnRlciA1eGwgd2hpdGUgc206Z3JheS04MDAgbWQ6cGluay03MDApYH0iPgogICAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICAgIDwvaDE+CiAgICA8L21haW4+CiAgYCwKICBkb2N1bWVudC5ib2R5LAopCg==)

## [Preact](https://preactjs.com/)

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

## htm/preact - [Preact](https://preactjs.com/) with [htm](https://github.com/developit/htm)

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

> [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAnaHR0cHM6Ly9jZG4uc2t5cGFjay5kZXYvcHJlYWN0JwppbXBvcnQgaHRtIGZyb20gJ2h0dHBzOi8vY2RuLnNreXBhY2suZGV2L2h0bScKCmltcG9ydCB7IHR3IH0gZnJvbSAnaHR0cHM6Ly9jZG4uc2t5cGFjay5kZXYvdHdpbmQnCgpjb25zdCBodG1sID0gaHRtLmJpbmQoaCkKCnJlbmRlcigKICBodG1sYAogICAgPG1haW4gY2xhc3NOYW1lPSIke3R3YGgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJgfSI+CiAgICAgIDxoMSBjbGFzc05hbWU9IiR7dHdgZm9udC1ib2xkIHRleHQoY2VudGVyIDV4bCB3aGl0ZSBzbTpncmF5LTgwMCBtZDpwaW5rLTcwMClgfSI+CiAgICAgICAgVGhpcyBpcyBUd2luZCEKICAgICAgPC9oMT4KICAgIDwvbWFpbj4KICBgLAogIGRvY3VtZW50LmJvZHksCikK)

## [Svelte](https://svelte.dev/)

```html
<script>
  import { tw } from 'twind'
</script>

<main class="{tw`h-screen bg-purple-400 flex items-center justify-center`}">
  <h1 class="{tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}">This is Twind!</h1>
</main>
```

> [live and interactive demo](https://svelte.dev/repl/f0026dd2e9a44beaa14839d65117b852?version=3)

## Web Components - [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) and [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)

This example shows how Custom Element can have its styles separated without having the side effect of polluting the root document's styles.

> This example is using [Constructable Stylesheet Objects](https://wicg.github.io/construct-stylesheets/) and `DocumentOrShadowRoot.adoptedStyleSheets` which have [limited browser support](https://caniuse.com/mdn-api_documentorshadowroot_adoptedstylesheets) at the moment (December 2020).

```js
import { create, cssomSheet } from 'twind'

// 1. Create separate CSSStyleSheet
const sheet = cssomSheet({ target: new CSSStyleSheet() })

// 2. Use that to create an own twind instance
const { tw } = create({ sheet })

class TwindElement extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })

    // 3. Apply the same style to each instance of this component
    shadow.adoptedStyleSheets = [sheet.target]

    // 4. Use "own" tw function
    shadow.innerHTML = `
      <main class="${tw`h-screen bg-purple-400 flex items-center justify-center`}">
        <h1 class="${tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}">
          This is Twind!
        </h1>
      </main>
    `
  }
}

customElements.define('twind-element', TwindElement)

document.body.innerHTML = '<twind-element></twind-element>'
```

> [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgY3JlYXRlLCBjc3NvbVNoZWV0IH0gZnJvbSAnaHR0cHM6Ly9jZG4uc2t5cGFjay5kZXYvdHdpbmQnCgpjb25zdCBzaGVldCA9IGNzc29tU2hlZXQoeyB0YXJnZXQ6IG5ldyBDU1NTdHlsZVNoZWV0KCkgfSkKCmNvbnN0IHsgdHcgfSA9IGNyZWF0ZSh7IHNoZWV0IH0pCgpjbGFzcyBUd2luZEVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7CiAgY29uc3RydWN0b3IoKSB7CiAgICBzdXBlcigpCgogICAgY29uc3Qgc2hhZG93ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSkKCiAgICBzaGFkb3cuYWRvcHRlZFN0eWxlU2hlZXRzID0gW3NoZWV0LnRhcmdldF0KCiAgICBzaGFkb3cuaW5uZXJIVE1MID0gYAogICAgICA8bWFpbiBjbGFzcz0iJHt0d2BoLXNjcmVlbiBiZy1wdXJwbGUtNDAwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyYH0iPgogICAgICAgIDxoMSBjbGFzcz0iJHt0d2Bmb250LWJvbGQgdGV4dChjZW50ZXIgNXhsIHdoaXRlIHNtOmdyYXktODAwIG1kOnBpbmstNzAwKWB9Ij4KICAgICAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICAgICAgPC9oMT4KICAgICAgPC9tYWluPgogICAgYAogIH0KfQoKY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0d2luZC1lbGVtZW50JywgVHdpbmRFbGVtZW50KQoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSAnPHR3aW5kLWVsZW1lbnQ+PC90d2luZC1lbGVtZW50PicK)

## [LitElement](https://lit-element.polymer-project.org/)

> This example is using [Constructable Stylesheet Objects](https://wicg.github.io/construct-stylesheets/) and `DocumentOrShadowRoot.adoptedStyleSheets` which have [limited browser support](https://caniuse.com/mdn-api_documentorshadowroot_adoptedstylesheets) at the moment (December 2020).

```js
import { LitElement, html } from 'lit-element'
import { create, cssomSheet } from 'twind'

// 1. Create separate CSSStyleSheet
const sheet = cssomSheet({ target: new CSSStyleSheet() })

// 2. Use that to create an own twind instance
const { tw } = create({ sheet })

class TwindElement extends LitElement {
  // 3. Apply the same style to each instance of this component
  static styles = [sheet.target]

  render() {
    // 4. Use "own" tw function
    return html`
      <main class="${tw`h-screen bg-purple-400 flex items-center justify-center`}">
        <h1 class="${tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}">
          This is Twind!
        </h1>
      </main>
    `
  }
}

customElements.define('twind-element', TwindElement)

document.body.innerHTML = '<twind-element></twind-element>'
```

> [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgTGl0RWxlbWVudCwgaHRtbCB9IGZyb20gJ2h0dHBzOi8vY2RuLnNreXBhY2suZGV2L2xpdC1lbGVtZW50JwppbXBvcnQgeyBjcmVhdGUsIGNzc29tU2hlZXQgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZCcKCmNvbnN0IHNoZWV0ID0gY3Nzb21TaGVldCh7IHRhcmdldDogbmV3IENTU1N0eWxlU2hlZXQoKSB9KQoKY29uc3QgeyB0dyB9ID0gY3JlYXRlKHsgc2hlZXQgfSkKCmNsYXNzIFR3aW5kRWxlbWVudCBleHRlbmRzIExpdEVsZW1lbnQgewogIGNyZWF0ZVJlbmRlclJvb3QoKSB7CiAgICBjb25zdCBzaGFkb3cgPSBzdXBlci5jcmVhdGVSZW5kZXJSb290KCkKICAgIHNoYWRvdy5hZG9wdGVkU3R5bGVTaGVldHMgPSBbc2hlZXQudGFyZ2V0XQogICAgcmV0dXJuIHNoYWRvdwogIH0KCiAgcmVuZGVyKCkgewogICAgcmV0dXJuIGh0bWxgCiAgICAgIDxtYWluIGNsYXNzPSIke3R3YGgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJgfSI+CiAgICAgICAgPGgxIGNsYXNzPSIke3R3YGZvbnQtYm9sZCB0ZXh0KGNlbnRlciA1eGwgd2hpdGUgc206Z3JheS04MDAgbWQ6cGluay03MDApYH0iPgogICAgICAgICAgVGhpcyBpcyBUd2luZCEKICAgICAgICA8L2gxPgogICAgICA8L21haW4+CiAgICBgCiAgfQp9CgpjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3R3aW5kLWVsZW1lbnQnLCBUd2luZEVsZW1lbnQpOwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSAnPHR3aW5kLWVsZW1lbnQ+PC90d2luZC1lbGVtZW50PicK)

<hr/>

Continue to [`tw` function](./tw.md)
