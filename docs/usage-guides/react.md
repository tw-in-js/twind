---
title: Use with React
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: How to use Twind with React
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

[React site](https://reactjs.org/)

```js
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

#### htm/react - [React](https://reactjs.org/) with [htm](https://github.com/developit/htm)

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

> 🚀 [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAnaHR0cHM6Ly9jZG4uc2t5cGFjay5kZXYvcmVhY3QtZG9tJwppbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi9yZWFjdCcKaW1wb3J0IGh0bSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi9odG0nCgppbXBvcnQgeyB0dyB9IGZyb20gJ2h0dHBzOi8vY2RuLnNreXBhY2suZGV2L3R3aW5kJwoKY29uc3QgaHRtbCA9IGh0bS5iaW5kKFJlYWN0LmNyZWF0ZUVsZW1lbnQpCgpyZW5kZXIoCiAgaHRtbGAKICAgIDxtYWluIGNsYXNzTmFtZT0iJHt0d2BoLXNjcmVlbiBiZy1wdXJwbGUtNDAwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyYH0iPgogICAgICA8aDEgY2xhc3NOYW1lPSIke3R3YGZvbnQtYm9sZCB0ZXh0KGNlbnRlciA1eGwgd2hpdGUgc206Z3JheS04MDAgbWQ6cGluay03MDApYH0iPgogICAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICAgIDwvaDE+CiAgICA8L21haW4+CiAgYCwKICBkb2N1bWVudC5ib2R5LAopCg==)

#### Server Side Rendering

```js
import { renderToString } from 'react-dom/server'

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
