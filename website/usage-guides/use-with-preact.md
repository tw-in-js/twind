---
title: Use with Preact
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: How to use Twind with Preact
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

## [Preact](https://preactjs.com/)

```js
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

> 🚀 [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAnaHR0cHM6Ly9jZG4uc2t5cGFjay5kZXYvcHJlYWN0JwppbXBvcnQgaHRtIGZyb20gJ2h0dHBzOi8vY2RuLnNreXBhY2suZGV2L2h0bScKCmltcG9ydCB7IHR3IH0gZnJvbSAnaHR0cHM6Ly9jZG4uc2t5cGFjay5kZXYvdHdpbmQnCgpjb25zdCBodG1sID0gaHRtLmJpbmQoaCkKCnJlbmRlcigKICBodG1sYAogICAgPG1haW4gY2xhc3NOYW1lPSIke3R3YGgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJgfSI+CiAgICAgIDxoMSBjbGFzc05hbWU9IiR7dHdgZm9udC1ib2xkIHRleHQoY2VudGVyIDV4bCB3aGl0ZSBzbTpncmF5LTgwMCBtZDpwaW5rLTcwMClgfSI+CiAgICAgICAgVGhpcyBpcyBUd2luZCEKICAgICAgPC9oMT4KICAgIDwvbWFpbj4KICBgLAogIGRvY3VtZW50LmJvZHksCikK)

## Server Side Rendering

```js
import renderToString from 'preact-render-to-string'

import { setup } from 'twind'
import { virtualSheet, getStyleTag } from 'twind/sheets'

import App from './app'

const sheet = virtualSheet()

setup({ ...sharedOptions, sheet })

function ssr() {
  // 1. Reset the sheet for a new rendering
  sheet.reset()

  // 2. Render the app
  const body = renderToString(<App />)

  // 3. Create the style tag with all generated CSS rules
  const styleTag = getStyleTag(sheet)

  // 4. Generate the response html
  return `<!DOCTYPE html>
    <html lang="en">
      <head>${styleTag}</head>
      <body>${body}</body>
    </html>
  `
}
```
