---
title: Use with Web Components
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: How to use Twind with Web Components
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

## [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) and [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)

This example shows how Custom Element can have its styles separated without having the side effect of polluting the root document's styles.

> ❗ This example is using [Constructable Stylesheet Objects](https://wicg.github.io/construct-stylesheets/) and `DocumentOrShadowRoot.adoptedStyleSheets` which have [limited browser support](https://caniuse.com/mdn-api_documentorshadowroot_adoptedstylesheets) at the moment (December 2020). The [Constructible style sheets polyfill](https://github.com/calebdwilliams/construct-style-sheets) offers a solution for all modern browsers and IE 11.

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

> 🚀 [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgY3JlYXRlLCBjc3NvbVNoZWV0IH0gZnJvbSAnaHR0cHM6Ly9jZG4uc2t5cGFjay5kZXYvdHdpbmQnCgpjb25zdCBzaGVldCA9IGNzc29tU2hlZXQoeyB0YXJnZXQ6IG5ldyBDU1NTdHlsZVNoZWV0KCkgfSkKCmNvbnN0IHsgdHcgfSA9IGNyZWF0ZSh7IHNoZWV0IH0pCgpjbGFzcyBUd2luZEVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7CiAgY29uc3RydWN0b3IoKSB7CiAgICBzdXBlcigpCgogICAgY29uc3Qgc2hhZG93ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSkKCiAgICBzaGFkb3cuYWRvcHRlZFN0eWxlU2hlZXRzID0gW3NoZWV0LnRhcmdldF0KCiAgICBzaGFkb3cuaW5uZXJIVE1MID0gYAogICAgICA8bWFpbiBjbGFzcz0iJHt0d2BoLXNjcmVlbiBiZy1wdXJwbGUtNDAwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyYH0iPgogICAgICAgIDxoMSBjbGFzcz0iJHt0d2Bmb250LWJvbGQgdGV4dChjZW50ZXIgNXhsIHdoaXRlIHNtOmdyYXktODAwIG1kOnBpbmstNzAwKWB9Ij4KICAgICAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICAgICAgPC9oMT4KICAgICAgPC9tYWluPgogICAgYAogIH0KfQoKY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0d2luZC1lbGVtZW50JywgVHdpbmRFbGVtZW50KQoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSAnPHR3aW5kLWVsZW1lbnQ+PC90d2luZC1lbGVtZW50PicK)
