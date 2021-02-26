---
title: Lit Element
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: How to use Twind with Lit Element
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

[LitElement Site](https://lit-element.polymer-project.org/)

> ❗ This example is using [Constructable Stylesheet Objects](https://wicg.github.io/construct-stylesheets/) and `DocumentOrShadowRoot.adoptedStyleSheets` which have [limited browser support](https://caniuse.com/mdn-api_documentorshadowroot_adoptedstylesheets) at the moment (December 2020).

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

> 🚀 [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgTGl0RWxlbWVudCwgaHRtbCB9IGZyb20gJ2h0dHBzOi8vY2RuLnNreXBhY2suZGV2L2xpdC1lbGVtZW50JwppbXBvcnQgeyBjcmVhdGUsIGNzc29tU2hlZXQgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZCcKCmNvbnN0IHNoZWV0ID0gY3Nzb21TaGVldCh7IHRhcmdldDogbmV3IENTU1N0eWxlU2hlZXQoKSB9KQoKY29uc3QgeyB0dyB9ID0gY3JlYXRlKHsgc2hlZXQgfSkKCmNsYXNzIFR3aW5kRWxlbWVudCBleHRlbmRzIExpdEVsZW1lbnQgewogIGNyZWF0ZVJlbmRlclJvb3QoKSB7CiAgICBjb25zdCBzaGFkb3cgPSBzdXBlci5jcmVhdGVSZW5kZXJSb290KCkKICAgIHNoYWRvdy5hZG9wdGVkU3R5bGVTaGVldHMgPSBbc2hlZXQudGFyZ2V0XQogICAgcmV0dXJuIHNoYWRvdwogIH0KCiAgcmVuZGVyKCkgewogICAgcmV0dXJuIGh0bWxgCiAgICAgIDxtYWluIGNsYXNzPSIke3R3YGgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJgfSI+CiAgICAgICAgPGgxIGNsYXNzPSIke3R3YGZvbnQtYm9sZCB0ZXh0KGNlbnRlciA1eGwgd2hpdGUgc206Z3JheS04MDAgbWQ6cGluay03MDApYH0iPgogICAgICAgICAgVGhpcyBpcyBUd2luZCEKICAgICAgICA8L2gxPgogICAgICA8L21haW4+CiAgICBgCiAgfQp9CgpjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3R3aW5kLWVsZW1lbnQnLCBUd2luZEVsZW1lbnQpOwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSAnPHR3aW5kLWVsZW1lbnQ+PC90d2luZC1lbGVtZW50PicK)
