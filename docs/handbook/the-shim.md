---
title: The Shim
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: Learn how to use the shim in Twind for seamless integration with Tailwind.
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

The `twind/shim` and `twind/shim/server` modules provides seamless integration with existing Tailwind projects, making refactoring to Twind a breeze.

The shim works by detecting any Tailwind classes names used in your app and wrap them in `tw` call under the hood. And since Twind supports all Tailwind utility classes, they will just work in Twind. The shim also supports all of Twind's extended syntaxes, variants, and rules without any additional configuration. And, it can be used along side the `tw` function, which allows for gradual migration. Please see the [Tailwind migration guide](../migration-guides/tailwind.md) for more information.

## Basic Usage

Simply include the `twind/shim` module and watch the magic happen ✨

**HTML:**

```html
<!DOCTYPE html>
<html lang="en" hidden>
  <head>
    <script type="module" src="https://cdn.skypack.dev/twind/shim"></script>
  </head>
  <body>
    <main class="h-screen bg-purple-400 flex items-center justify-center">
      <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
    </main>
  </body>
</html>
```

**JavaScript:**

```js
import 'twind/shim'
// or
import { setup, disconnect } from 'twind/shim'
```

<!-- > [live and interactive shim demo 🚀 ](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPG1haW4gY2xhc3M9Imgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIiPgogICAgPGgxIGNsYXNzPSJmb250LWJvbGQgdGV4dChjZW50ZXIgNXhsIHdoaXRlIHNtOmdyYXktODAwIG1kOnBpbmstNzAwKSI+CiAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICA8L2gxPgogIDwvbWFpbj4KYA==) -->

### Prevent FOUC

To prevent FOUC (_flash of unstyled content_), set the `hidden` attribute on the target element. `twind/shim` will remove it once all styles have been generated.

```html
<!DOCTYPE html>
<html lang="en" hidden>
  <!-- ... -->
</html>
```

:::tip
Internally `twind/shim` uses `twind/observe`, which may be useful for advanced use cases.
:::

### Support legacy browsers with UMD bundles

> You may need to provide certain [polyfills](./browser-support.md) depending on your target browser.

```html
<script defer src="https://unpkg.com/twind/twind.umd.js"></script>
<script defer src="https://unpkg.com/twind/observe/observe.umd.js"></script>
<script defer src="https://unpkg.com/twind/shim/shim.umd.js"></script>
```

## Server

If you wish to remove Twind's runtime overhead or you're interested in using Twind in a universal or "isomorphic" web app, `twind/shim/server` exports the dedicated `twind/shim/server.shim` function for performant processing of static HTML.

:::tip
You'll find more details and examples in the [ssr](../usage-guides/ssr.md) guide.
:::

```js
import { setup } from 'twind'
import { virtualSheet, getStyleTag, shim } from 'twind/shim/server'

const sheet = virtualSheet()

setup({ ...sharedOptions, sheet })

function ssr() {
  // 1. Reset the sheet for a new rendering
  sheet.reset()

  // 2. Render the app to an html string and handle class attributes
  const body = shim(renderTheApp())

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

All Twind syntax features are supported within class attributes.

The `shim` function also accepts an optional second argument that can be a custom `tw` instance or an options object (including `tw` instance).

```js
import { create } from 'twind'
import { shim, virtualSheet, getStyleTag } from 'twind/shim/server'

const sheet = virtualSheet()

const { tw } = create({ ...sharedOptions, sheet })

sheet.reset()

const markup = shim(htmlString, {
  tw, // defaults to default `tw` instance
})

const styleTag = getStyleTag(sheet)
```

## Asynchronous SSR

> ❗ This is an experimental feature. Use with care and please [report any issue](https://github.com/tw-in-js/twind/issues/new) you find.
> Consider using the synchronous API when ever possible due to the relatively expensive nature of the [promise introspection API](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) provided by V8.
> Async server side rendering is implemented using [async_hooks](https://nodejs.org/docs/latest-v14.x/api/async_hooks.html). Callback-based APIs and event emitters may not work or need special handling.

```js
import { setup } from 'twind'
import { asyncVirtualSheet, getStyleTagProperties, shim } from 'twind/server'

const sheet = asyncVirtualSheet()

setup({ ...sharedOptions, sheet })

async function ssr() {
  // 1. Reset the sheet for a new rendering
  sheet.reset()

  // 2. Render the app to an html string and handle class attributes
  const body = shim(await renderTheApp())

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

<!-- The shim allows for the use of the `class` attribute for tailwind rules. If such a rule is detected, the corresponding CSS rule is created and injected into the stylesheet dynamically. The default `twind/shim` export is intended for client-side usage and, without configuration, utilizes the default/global `tw` instance. For server-side usage, [`twind/shim/server`](#) exports a dedicated `shim` function that will parse and update a static HTML string while collecting the style rules into a sheet for further usage in your respective framework. -->
