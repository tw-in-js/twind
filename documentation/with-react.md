---
section: Use With
title: React
package: '@twind/with-react'
example: false
excerpt: |
  Setting up Twind for seamless integration in a [React](https://reactjs.org) project.
next: ./with-remix.md
---

This package does not have a dedicated standalone example. Instead, it is used in the following examples:

- [Remix + React v17](https://github.com/tw-in-js/twind/tree/main/examples/with-remix)
- [Remix + React v18](https://github.com/tw-in-js/twind/tree/main/examples/with-remix_react-v18)

## 🤝 Compatibility

| @twind/with-react | react                     |
| ----------------- | ------------------------- |
| `>=1.0.0 <2`      | `^16.6.0`, `17.x`, `18.x` |

## 📦 Installation

`@twind/core` and `@twind/with-react` are available on npm and need to be installed together.

```sh
npm install @twind/core @twind/with-react
```

## 🙇 Usage

This package provides several modules that can be used to integrate Twind into your React project. The default export of `@twind/with-react` is a function that can be used to setup the twind instance.

```js title="twind.js"
import install from '@twind/with-react'
import config from '../twind.config'

export default install(config)
```

The second parameter to `install` determines if hashed class names are used. The default used `process.env.NODE_ENV === 'production'` which might not work depending on your setup. In that case pass `false` to always use non-hashed class names or something like `import.meta.env.PROD` if you are using [vite](https://vitejs.dev).

Besides the default module, the package also provides several subpath exports that can be used to generate server-side rendered styles:

### `inline`

This module can be used to generate server-side rendered styles when using [renderToString](https://reactjs.org/docs/react-dom-server.html#rendertostring) or [renderToStaticMarkup](https://reactjs.org/docs/react-dom-server.html#rendertostaticmarkup).

```jsx title="server.jsx" focus=3,8
import { renderToString } from 'react-dom/server'

import inline from '@twind/with-react/inline'

import tw from './twind'
import App from './App'

const html = inline(renderToString(<App />), tw)
```

### `pipeableStream`

This module can be used to generate server-side rendered styles when using [renderToPipeableStream](https://reactjs.org/docs/react-dom-server.html#rendertopipeablestream).

> **Tip**
> This module fully supports Suspense and streaming of HTML with _delayed_ content blocks _popping in_ via inline `<script>` tags later. During streaming, styles from each chunk will be collected and merged into the existing styles. _If_ client-side Twind is used after it will take over as usual and inject any further dynamic styles once client-side hydration is complete.

```jsx title="server.jsx" focus=3,15
import { renderToPipeableStream } from 'react-dom/server'

import TwindStream from '@twind/with-react/pipeableStream'

import tw from './twind'
import App from './App'

let didError = false
const stream = renderToPipeableStream(<App />, {
  onShellReady() {
    // The content above all Suspense boundaries is ready.
    // If something errored before we started streaming, we set the error code appropriately.
    res.statusCode = didError ? 500 : 200
    res.setHeader('Content-type', 'text/html')
    stream.pipe(new TwindStream(tw)).pipe(res)
  },
  onShellError(error) {
    // Something errored before we could complete the shell so we emit an alternative shell.
    res.statusCode = 500
    res.send('<!doctype html><p>Loading...</p><script src="clientrender.js"></script>')
  },
  onAllReady() {
    // If you don't want streaming, use this instead of onShellReady.
    // This will fire after the entire page content is ready.
    // You can use this for crawlers or static generation.
    // res.statusCode = didError ? 500 : 200;
    // res.setHeader('Content-type', 'text/html');
    // stream.pipe(new TwindStream(tw)).pipe(res);
  },
  onError(err) {
    didError = true
    console.error(err)
  },
})
```

### `readableStream`

This module can be used to generate server-side rendered styles when using [renderToReadableStream](https://reactjs.org/docs/react-dom-server.html#rendertoreadablestream).

> **Tip**
> This module fully supports Suspense and streaming of HTML with _delayed_ content blocks _popping in_ via inline `<script>` tags later. During streaming, styles from each chunk will be collected and merged into the existing styles. _If_ client-side Twind is used after it will take over as usual and inject any further dynamic styles once client-side hydration is complete.

```jsx title="server.jsx" focus=3,30
import { renderToReadableStream } from 'react-dom/server'

import TwindStream from '@twind/with-react/readableStream'

import tw from './twind'
import App from './App'

let controller = new AbortController()
let didError = false
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
      onError(error) {
        didError = true
        console.error(error)
      },
    },
  )

  // This is to wait for all Suspense boundaries to be ready. You can uncomment
  // this line if you want to buffer the entire HTML instead of streaming it.
  // You can use this for crawlers or static generation:

  // await stream.allReady;

  return new Response(stream.pipeThrough(new TwindStream(tw)), {
    status: didError ? 500 : 200,
    headers: { 'Content-Type': 'text/html' },
  })
} catch (error) {
  return new Response('<!doctype html><p>Loading...</p><script src="clientrender.js"></script>', {
    status: 500,
    headers: { 'Content-Type': 'text/html' },
  })
}
```
