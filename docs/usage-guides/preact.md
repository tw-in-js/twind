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

> [@twind/preact](https://github.com/tw-in-js/use-twind-with/tree/main/packages/preact) [![Latest Release](https://flat.badgen.net/npm/v/@twind/preact?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/preact) [![MIT License](https://flat.badgen.net/github/license/tw-in-js/use-twind-with)](https://github.com/tw-in-js/use-twind-with/blob/main/LICENSE)

Integration for [Preact](https://preactjs.com) which allows to use the [tw property](https://github.com/tw-in-js/twind-jsx-preprocessor/blob/main/docs/tw-prop.md), `css` property and `className` (shim without [shim](../handbook/the-shim.md)).

## Installation

```sh
npm install @twind/preact
```

## Usage

[![Edit twind-preact](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/thirsty-banzai-smrpi?fontsize=14&hidenavigation=1&theme=dark)

> You **must** call `setup` during the app initialization.

```js
import { setup } from '@twind/preact'

// Must call
setup({
  // Optional define props to use
  props: {
    // tw: false, // to disable
    // css: false, // to disable
    // className: true, // to enable
  },
  /* other twind configuration options */
})

const App = () => (
  <main
    tw="h-screen bg-purple-400 flex items-center justify-center"
    css={
      {
        /* CSS Object */
      }
    }
  >
    <h1 tw="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
  </main>
)
```

## Shim-like usage but without the [shim](https://twind.dev/docs/handbook/getting-started/using-the-shim.html)

[![Edit twind-shim-preact](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/twind-preact-forked-wfou9?fontsize=14&hidenavigation=1&theme=dark)

```js
import { setup } from '@twind/preact'

setup({
  props: {
    // tw: false, // to disable
    // css: false, // to disable
    className: true, // to enable – suppports `class` property as well
  },
  /* other twind configuration options */
})

const App = () => (
  <main className="h-screen bg-purple-400 flex items-center justify-center">
    <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
  </main>
)
```

## Styled API

> Coming soon! In the mean time try [@twind/react](./react.md) with [aliasing React to Preact](https://preactjs.com/guide/v10/getting-started#aliasing-react-to-preact)
