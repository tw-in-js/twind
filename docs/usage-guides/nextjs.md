---
title: Use with NextJS
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: How to use Twind with NextJS
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

> [@twind/next](https://github.com/tw-in-js/use-twind-with/tree/main/packages/next#readme) [![Latest Release](https://flat.badgen.net/npm/v/@twind/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/next) [![MIT License](https://flat.badgen.net/github/license/tw-in-js/use-twind-with)](https://github.com/tw-in-js/use-twind-with/blob/main/LICENSE)

## Installation

```sh
npm install @twind/next
```

## Usage

[![Edit twind-nextjs](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/priceless-hill-1lkv3?fontsize=14&hidenavigation=1&theme=dark)

0. Create a `twind.config.js` (optional)

```js
/** @type {import('twind').Configuration} */
export default {
  theme: {
    extend: {
      screens: {
        standalone: { raw: '(display-mode:standalone)' },
      },
    },
  },
}
```

1. Create/Update your `pages/_app.js`

```js
import withTwindApp from '@twind/next/app'
import twindConfig from '../twind.config'

export default withTwindApp(twindConfig)
```

  <details><summary>Without a custom twind config</summary>

```js
import withTwindApp from '@twind/next/app'

export default withTwindApp()
```

  </details>

  <details><summary>With a custom App component</summary>

```js
import withTwindApp from '@twind/next/app'
import twindConfig from '../twind.config'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default withTwindApp(twindConfig, MyApp)
```

  </details>

  <details><summary>With a custom App component and no twind config</summary>

```js
import withTwindApp from '@twind/next/app'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default withTwindApp(MyApp)
```

  </details>

3. Create/Update your `pages/_document.js`

```js
import withTwindDocument from '@twind/next/document'
import twindConfig from '../twind.config'

export default withTwindDocument(twindConfig)
```

  <details><summary>Without a custom twind config</summary>

```js
import withTwindDocument from '@twind/next/document'

export default withTwindDocument()
```

  </details>

  <details><summary>With a custom Document component</summary>

```js
import withTwindDocument from '@twind/next/document'
import twindConfig from '../twind.config'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
}

export default withTwindDocument(twindConfig, MyDocument)
```

  </details>

  <details><summary>With a custom App component and no twind config</summary>

```js
import withTwindDocument from '@twind/next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
}

export default withTwindDocument(MyDocument)
```

  </details>

4. Use twind

```jsx
import NextHead from 'next/head'
import * as React from 'react'
import { tw } from 'twind'

const Home = () => (
  <>
    <NextHead>
      <meta charSet="UTF-8" />
      <title>Twind Next.js Example</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </NextHead>

    <main className={tw`h-screen bg-purple-400 flex items-center justify-center`}>
      <h1 className={tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}>
        This is Twind!
      </h1>
    </main>
  </>
)

export default Home
```

## Usage with the shim

> TL;DR replace `@twind/next/app` with `@twind/next/shim/app` and `@twind/next/document` with `@twind/next/shim/document`

[![Edit twind-shim-nextjs](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/twind-shim-nextjs-7x9nw?fontsize=14&hidenavigation=1&theme=dark)

0. Create a `twind.config.js` (optional)

```js
/** @type {import('twind').Configuration} */
export default {
  theme: {
    extend: {
      screens: {
        standalone: { raw: '(display-mode:standalone)' },
      },
    },
  },
}
```

1. Create/Update your `pages/_app.js`

```js
import withTwindApp from '@twind/next/shim/app'
import twindConfig from '../twind.config'

export default withTwindApp(twindConfig)
```

  <details><summary>Without a custom twind config</summary>

```js
import withTwindApp from '@twind/next/shim/app'

export default withTwindApp()
```

  </details>

  <details><summary>With a custom App component</summary>

```js
import withTwindApp from '@twind/next/shim/app'
import twindConfig from '../twind.config'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default withTwindApp(twindConfig, MyApp)
```

  </details>

  <details><summary>With a custom App component and no twind config</summary>

```js
import withTwindApp from '@twind/next/shim/app'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default withTwindApp(MyApp)
```

  </details>

3. Create/Update your `pages/_document.js`

```js
import withTwindDocument from '@twind/next/shim/document'
import twindConfig from '../twind.config'

export default withTwindDocument(twindConfig)
```

  <details><summary>Without a custom twind config</summary>

```js
import withTwindDocument from '@twind/next/shim/document'

export default withTwindDocument()
```

  </details>

  <details><summary>With a custom Document component</summary>

```js
import withTwindDocument from '@twind/next/shim/document'
import twindConfig from '../twind.config'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
}

export default withTwindDocument(twindConfig, MyDocument)
```

  </details>

  <details><summary>With a custom App component and no twind config</summary>

```js
import withTwindDocument from '@twind/next/shim/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
}

export default withTwindDocument(MyDocument)
```

  </details>

4. Use twind

```jsx
import NextHead from 'next/head'
import * as React from 'react'

const Home = () => (
  <>
    <NextHead>
      <meta charSet="UTF-8" />
      <title>Twind Next.js Example</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </NextHead>

    <main className="h-screen bg-purple-400 flex items-center justify-center">
      <h1 className="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
    </main>
  </>
)

export default Home
```
