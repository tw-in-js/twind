# twind/server [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc%2Fserver?icon=github&label)](https://github.com/tw-in-js/twind/tree/main/src/server) [![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/server/server.d.ts)

Twind supports static extraction a.k.a. Server Side Rendering (SSR) out of the box.

> Please note the `twind/server` bundle is Node.JS only.

<details><summary>Table Of Contents (Click To Expand)</summary>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Synchronous SSR](#synchronous-ssr)
- [Asynchronous SSR](#asynchronous-ssr)
- [Streaming SSR](#streaming-ssr)
- [Frameworks](#frameworks)
  - [React](#react)
  - [Preact](#preact)
  - [Svelte](#svelte)
  - [Vue](#vue)
- [WMR](#wmr)
- [Next.js](#nextjs)
- [Gatsby](#gatsby)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Synchronous SSR

The following example assumes your app is using the `tw` named export from `twind`
but the same logic can be applied to custom instances.

```js
import { setup } from 'twind'
import { virtualSheet, getStyleTag } from 'twind/server'

const sheet = virtualSheet()

setup({ ...sharedOptions, sheet })

function ssr() {
  // 1. Reset the sheet for a new rendering
  sheet.reset()

  // 2. Render the app
  const body = renderTheApp()

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

In order to prevent harmful code injection on the web, a [Content Security Policy (CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP) may be put in place. During server-side rendering, a cryptographic nonce (number used once) may be embedded when generating a page on demand:

```js
// ... other code is the same as before ...

// Usage with webpack: https://webpack.js.org/guides/csp/
const styleTag = getStyleTag(sheet, { nonce: __webpack_nonce__ })
```

## Asynchronous SSR

> **Note**: This is an experimental feature and only supported for Node.JS >=12. Use with care and please [report any issue](https://github.com/tw-in-js/twind/issues/new) you find.
> Consider using the synchronous API when ever possible due to the relatively expensive nature of the [promise introspection API](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) provided by V8.
> Async server side rendering is implemented using [async_hooks](https://nodejs.org/docs/latest-v14.x/api/async_hooks.html). Callback-based APIs and event emitters may not work or need special handling.

```js
import { setup } from 'twind'
import { asyncVirtualSheet, getStyleTag } from 'twind/server'

const sheet = asyncVirtualSheet()

setup({ ...sharedOptions, sheet })

async function ssr() {
  // 1. Reset the sheet for a new rendering
  sheet.reset()

  // 2. Render the app
  const body = await renderTheApp()

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

## Streaming SSR

> Supporting ReactDOM.renderToNodeStream and Vue.renderToStream is still on the roadmap...

## Frameworks

### React

```js
import { renderToString } from 'react-dom/server'

import { setup } from 'twind'
import { virtualSheet, getStyleTag } from 'twind/server'

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

### Preact

```js
import renderToString from 'preact-render-to-string'

import { setup } from 'twind'
import { virtualSheet, getStyleTag } from 'twind/server'

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

### Svelte

```js
import { setup } from 'twind'
import { virtualSheet, getStyleTag } from 'twind/server'

import App from './app.svelte'

const sheet = virtualSheet()

setup({ ...sharedOptions, sheet })

function ssr() {
  // 1. Reset the sheet for a new rendering
  sheet.reset()

  // 2. Render the app
  const { head = '', html, css } = App.render({})

  if (css && css.code) {
    head += `<style>${css.code}</style>`
  }

  // 3. Create the style tag with all generated CSS rules
  head += getStyleTag(sheet)

  // 4. Generate the response html
  return `<!DOCTYPE html>
    <html lang="en">
      <head>${head}</head>
      <body>${html}</body>
    </html>
  `
}
```

### Vue

```js
// createBundleRenderer works the same
import { createRenderer } from 'vue-server-renderer'

import { setup } from 'twind'
import { asyncVirtualSheet, getStyleTag } from 'twind/server'

import { createApp } from './app'

const sheet = asyncVirtualSheet()

setup({ ...sharedOptions, sheet })

const renderer = createRenderer({
  /* options */
})

async function ssr() {
  // 1. Reset the sheet for a new rendering
  sheet.reset()

  // 2. Render the app
  const body = await renderer.renderToString(createApp())

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

## [WMR](https://github.com/preactjs/wmr)

> The [tw-in-js/example-wmr](https://github.com/tw-in-js/example-wmr) repository uses this setup.

```js
/* public/twind.config.js */
export default {
  /* Shared config */
}
```

```js
/* public/index.js */
import hydrate from 'preact-iso/hydrate'

import { setup } from 'twind'
// Or if you are using twind/shim
// import { setup } from 'twind/shim'

import twindConfig from './twind.config'

if (typeof window !== 'undefined') {
  setup(twindConfig)
}

export function App() {
  /* Your app */
}

hydrate(<App />)

export async function prerender(data) {
  const { default: prerender } = await import('./prerender')

  return prerender(<App {...data} />)
  // Or if you are using twind/shim
  // return prerender(<App {...data} />, { shim: true })
}
```

```js
/* public/prerender.js */
import prerender from 'preact-iso/prerender'

import { setup } from 'twind'
import { asyncVirtualSheet, getStyleTagProperties, shim } from 'twind/server'

import twindConfig from './twind.config'

const sheet = asyncVirtualSheet()

setup({ ...twindConfig, sheet })

export default async (app, options = {}) => {
  sheet.reset()

  const result = await prerender(app)

  if (options.shim) {
    result.html = shim(result.html)
  }

  const { id, textContent } = getStyleTagProperties(sheet)

  result.html = `<style id="${id}">${textContent}</style>${result.html}`

  return result
}
```

## Next.js

> The [tw-in-js/example-next](https://github.com/tw-in-js/example-next) repository uses this setup.

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

## Gatsby

> **Note** This has not been tested yet.

```js
/* gatsby-ssr.js */

const { setup } = require('twind')
const { asyncVirtualSheet, getStyleTagProperties } = require('twind/server')

const sheet = asyncVirtualSheet()

setup({ ...sharedOptions, sheet })

exports.wrapPageElement = ({ element }) => {
  sheet.reset()

  return element
}

exports.onRenderBody = ({ setHeadComponents, pathname }) => {
  const { id, textContent } = getStyleTagProperties(sheet)

  const styleProps = {
    id,
    dangerouslySetInnerHTML: {
      __html: textContent,
    },
  }

  setHeadComponents([
    React.createElement('style', {
      id,
      dangerouslySetInnerHTML: {
        __html: textContent,
      },
    }),
  ])
}
```

<hr/>

Continue to [Browser Support](./browser-support.md)
