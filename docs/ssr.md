# Server Side Rendering (SSR)

Twind supports synchronous Server Side Rendering (SSR) out of the box.

The following example assumes your app is using the `tw` named export from `twind`
but the same logic can be applied to custom instances.

```js
import { setup } from 'twind'
import { virtualSheet, getStyleTag } from 'twind/sheets'

const sheet = virtualSheet()

setup({ ...sharedOptions, sheet })

function ssr() {
  // 1. Reset the sheet for a new rendering
  sheet.reset()

  // 2. Render the app
  const body = renderTheApp()

  // 3. Create the style tag with all generated CSS rules
  const styleTag = getStyleTag(sheet)

  // 4. Generate the reponse html
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

> We are currently only support synchronous rendering. In the future we will provide an async rendering solution which will work with streams and async functions to support ReactDOM.renderToNodeStream, vue, next.js and gatsby.

## Frameworks

### React

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

  // 4. Generate the reponse html
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

  // 4. Generate the reponse html
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
import { virtualSheet, getStyleTag } from 'twind/sheets'

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

  // 4. Generate the reponse html
  return `<!DOCTYPE html>
    <html lang="en">
    <head>${head}</head>
    <body>${html}</body>
    </html>
  `
}
```
