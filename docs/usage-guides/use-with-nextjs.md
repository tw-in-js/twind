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

## [Next.js](https://nextjs.org/)

```js
import { tw } from 'twind'

export default function IndexPage() {
  return (
    <main className={tw`h-screen bg-purple-400 flex items-center justify-center`}>
      <h1 className={tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}>
        This is Twind!
      </h1>
    </main>
  )
}
```

## Server Side Rendering

> 💡 The [tw-in-js/example-next](https://github.com/tw-in-js/example-next) repository uses this setup.

```js
/* twind.config.js */
export default {
  /* Shared config */
}
```

```js
/* pages/_app.js */
import App from 'next/app'

import { setup } from 'twind'
import twindConfig from '../twind.config'

if (typeof window !== 'undefined') {
  setup(twindConfig)
}

export default App
```

```js
/* pages/_document.js */

import Document from 'next/document'
import * as React from 'react'

import { setup } from 'twind'
import { asyncVirtualSheet, getStyleTagProperties } from 'twind/server'

import twindConfig from '../twind.config'

const sheet = asyncVirtualSheet()

setup({ ...twindConfig, sheet })

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    sheet.reset()

    const initialProps = await Document.getInitialProps(ctx)

    const { id, textContent } = getStyleTagProperties(sheet)

    const styleProps = {
      id,
      key: id,
      dangerouslySetInnerHTML: {
        __html: textContent,
      },
    }

    return {
      ...initialProps,
      styles: [...initialProps.styles, React.createElement('style', styleProps)],
    }
  }
}
```
