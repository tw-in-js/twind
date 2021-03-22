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

## @twind/react

> A styled API inspired by [stitches](https://stitches.dev).

[![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind-react)](https://github.com/tw-in-js/twind-react/blob/main/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/react?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/react) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind-react?icon=github&label)](https://github.com/tw-in-js/twind-react) [![Module Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/@twind/react/react.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/@twind/react/react.js 'brotli module size') [![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/@twind/react/react.d.ts)

### Installation

Install from npm:

```sh
# Using npm
npm install @twind/react

# Using Yarn
yarn add @twind/react
```

### Usage

> Please see [twind/style](https://twind.dev/docs/modules/twind_style.html) for config examples.

[![Try this example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/twind-react-styled-90y9n?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark)

```jsx
import { styled } from "@twind/react"

const Box = styled()

const Button = styled("button", {
  base: `
    appearance-none border-none bg-transparent
    rounded-full px-2.5
  `,

  variants: {
    size: {
      sm: `text-sm h-6`,
      md: `text-base h-9`,
    },

    variant: {
      gray: `
        bg-gray-500
        hover:bg-gray-600
      `,
      primary: `
        text-white bg-purple-500
        hover:bg-purple-600
      `,
    },
    outlined: {
      true: `bg-transparent ring-1`,
    },
  },

  defaults: {
    variant: "gray",
    size: "sm",
  },

  matches: [
    {
      variant: "gray",
      outlined: true,
      use: `ring-gray-500`,
    },
    {
      variant: "primary",
      outlined: true,
      use: `text-purple-500 ring-gray-500 hover:text-white`,
    },
  ],
})

<Box tw="m-2.5 flex flex-wrap" css={{ gap: "20px" }}>
  <Button>Button</Button>
  <Button variant="gray">Gray Button</Button>
  <Button variant="primary">Primary Button</Button>
  <Button variant="gray" outlined>
    Outlined Gray Button
  </Button>
  <Button variant="primary" outlined>
    Outlined Primary Button
  </Button>
  <Button variant="primary" outlined size={{ initial: "sm", lg: "md" }}>
    Responsive Primary Button
  </Button>
</Box>
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

> 🚀 [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAnaHR0cHM6Ly9jZG4uc2t5cGFjay5kZXYvcmVhY3QtZG9tJwppbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi9yZWFjdCcKaW1wb3J0IGh0bSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi9odG0nCgppbXBvcnQgeyB0dyB9IGZyb20gJ2h0dHBzOi8vY2RuLnNreXBhY2suZGV2L3R3aW5kJwoKY29uc3QgaHRtbCA9IGh0bS5iaW5kKFJlYWN0LmNyZWF0ZUVsZW1lbnQpCgpyZW5kZXIoCiAgaHRtbGAKICAgIDxtYWluIGNsYXNzTmFtZT0iJHt0d2BoLXNjcmVlbiBiZy1wdXJwbGUtNDAwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyYH0iPgogICAgICA8aDEgY2xhc3NOYW1lPSIke3R3YGZvbnQtYm9sZCB0ZXh0KGNlbnRlciA1eGwgd2hpdGUgc206Z3JheS04MDAgbWQ6cGluay03MDApYH0iPgogICAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICAgIDwvaDE+CiAgICA8L21haW4+CiAgYCwKICBkb2N1bWVudC5ib2R5LAopCg==)

## Server Side Rendering

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
