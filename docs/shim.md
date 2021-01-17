# twind/shim

> Allows to copy-paste tailwind examples. This feature can be used together with your favorite framework without any additional setup.

The `twind/shim` module allows for the use of the `class` attribute for tailwind rules. If such a rule is detected, the corresponding CSS rule is created and injected into the stylesheet dynamically. The default `twind/shim` export is intended for [client-side](#client-side-dynamic-extraction) usage and, without configuration, utilizes the default/global `tw` instance. For [server-side](#server-side-static-extraction) usage, `twind/shim/server` exports a dedicated `shim` function that will parse and update a static HTML string while collecting the style rules into a sheet for further usage in your respective framework.

There is _no need for `tw`_ but it can be used on the same elements as well. All twind syntax features like [grouping](./grouping.md) are supported. See [example/shim.html](https://github.com/tw-in-js/twind/blob/main/example/shim.html) for a full example.

<details><summary>Table Of Contents (Click To Expand)</summary>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Usage](#usage)
  - [Client-side (Dynamic Extraction)](#client-side-dynamic-extraction)
  - [Server-side (Static Extraction)](#server-side-static-extraction)
- [API](#api)
  - [Client-side implementation](#client-side-implementation)
  - [Server-side implementation](#server-side-implementation)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Usage

### Client-side (Dynamic Extraction)

For runtime processing of your javascript-assisted HTML documents, simply include the `twind/shim` module and watch the magic happen.

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

> [live and interactive shim demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPG1haW4gY2xhc3M9Imgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIiPgogICAgPGgxIGNsYXNzPSJmb250LWJvbGQgdGV4dChjZW50ZXIgNXhsIHdoaXRlIHNtOmdyYXktODAwIG1kOnBpbmstNzAwKSI+CiAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICA8L2gxPgogIDwvbWFpbj4KYA==)

**Customize `tw` instance**

You can provide a `<script type="twind-config">...</script>` within the document. The content must be valid JSON and all [twind setup options](./setup.md) (including [hash](./setup.md#hash)) are supported.

```html
<!DOCTYPE html>
<html lang="en" hidden>
  <head>
    <script type="module" src="https://cdn.skypack.dev/twind/shim"></script>
    <script type="twind-config">
      {
        "hash": true
      }
    </script>
  </head>
  <body>
    <main class="h-screen bg-purple-400 flex items-center justify-center">
      <h1 class="text(center 5xl white sm:gray-800 md:pink-700)">
        This is <span class="font-bold">Twind</span>!
      </h1>
    </main>
  </body>
</html>
```

Alternatively the following works:

```js
import { setup } from "https://cdn.skypack.dev/twind/shim"

setup({
  target: document.body, // Default document.documentElement (eg html)
  ... // All other twind setup options are supported
})
```

It is possible to mix `twind/shim` with `tw`:

```js
import 'twind/shim'
import { tw } from 'twind'

const styles = {
  center: tw`flex items-center justify-center`,
}

document.body.innerHTML = `
  <main class="h-screen bg-purple-400 ${styles.center}">
    <h1 class="font-bold ${tw`text(center 5xl white sm:gray-800 md:pink-700)`}">
      This is Twind!
    </h1>
  </main>
`
```

To prevent FOUC (_flash of unstyled content_) it is advised to set the `hidden` attribute on the target element. `twind/shim` will remove it once all styles have been generated.

```html
<!DOCTYPE html>
<html lang="en" hidden>
  <!-- ... -->
</html>
```

<details><summary>How can I use twind/shim from javascript (Click to expand)</summary>

> Internally `twind/shim` uses [twind/observe](./observe.md) which may be useful for advanced use cases.

```js
import 'twind/shim'
```

```js
import { setup, disconnect } from 'twind/shim'
```

</details>

<details><summary>How to support legacy browser with the UMD bundles (Click to expand)</summary>

> You may need to provide certain [polyfills](./browser-support.md) depending on your target browser.

```html
<script defer src="https://unpkg.com/twind/twind.umd.js"></script>
<script defer src="https://unpkg.com/twind/observe/observe.umd.js"></script>
<script defer src="https://unpkg.com/twind/shim/shim.umd.js"></script>
```

</details>

<details><summary>Implementation Details (Click to expand)</summary>

`twind/shim` starts [observing](./observe.md) class attributes changes right after the [DOM content has been loaded](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event). For further details see [twind/observe - Implementation Details](./observe.md#implementation-details).

</details>

### Server-side (Static Extraction)

If you wish to remove twind's runtime overhead or you're interested in using twind in a universal or "isomorphic" web app, `twind/shim/server` exports the dedicated `shim` function for performant processing of static HTML.

> You'll find more detail and examples in the [twind/server](./ssr.md) documentation.

#### Synchronous SSR

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

#### Asynchronous SSR

> **Note**: This is an experimental feature. Use with care and please [report any issue](https://github.com/tw-in-js/twind/issues/new) you find.
> Consider using the synchronous API when ever possible due to the relatively expensive nature of the [promise introspection API](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) provided by V8.
> Async server side rendering is implemented using [async_hooks](https://nodejs.org/docs/latest-v14.x/api/async_hooks.html). Callback-based APIs and event emitters may not work or need special handling.

```js
import { setup } from 'twind'
import { asyncVirtualSheet, getStyleTagProperties, shim } from 'twind/shim/server'

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

For a full example see [twind/server - WMR](./ssr.md#wmr).

#### Customize `tw` instance

`shim` accepts an optional second argument which can be either a custom `tw` instance or an "options" object containing a custom `tw` instance and/or additional arguments to pass to the HTML parser.

```js
import { create } from 'twind'

const sheet = virtualSheet()

const { tw } create({ ...sharedOptions, sheet })

function ssr() {
  // Same as before

  // 2. Render the app to an html string and handle class attributes
  const body = shim(renderTheApp(), tw)

  // Same as before
}
```

## API

### Client-side implementation

The `twind/shim` module utilizes the [`twind/observe`](./observe.md) module internally, but it provides its own `setup` function for customizing the `tw` instance and setting the target node to be shimmed, and it also provides a `disconnect` function to stop shimming/observing all nodes.

```js
import 'twind/shim'
import { setup, disconnect } from 'twind/shim'
import { strict, voidSheet } from 'twind'

setup({
  preflight: false, // do not include base style reset (default: use tailwind preflight)
  mode: strict, // throw errors for invalid rules (default: warn)
  hash: true, // hash all generated class names (default: false)
  theme: {}, // define custom theme values (default: tailwind theme)
  darkMode: 'class', // use a different dark mode strategy (default: 'media')
  sheet: voidSheet, // use custom sheet (default: cssomSheet in a browser or no-op)
  target: document.querySelector('#__twind'), // node element to shim/observe (default: document.documentElement)
})

// stop shimming/observing all nodes
disconnect()
```

### Server-side implementation

For static HTML processing (usually to provide SSR support for your javascript-powered web apps), `twind/shim/server` exports a dedicated `shim` function that accepts HTML strings as input and will:
a) parse the string and process element classes with either the default/global `tw` instance or a custom `tw` instance
b) populate the provided sheet with the generated rules
c) output the HTML string with the final element classes

This function also accepts an optional 2nd argument that can be a custom `tw` instance or an options object (including `tw` instance) for [node-html-parser](https://www.npmjs.com/package/node-html-parser).

```js
import { create } from 'twind'
import { virtualSheet, shim } from 'twind/shim/server'

const sheet = virtualSheet()

const { tw } create({ ...sharedOptions, sheet })

shim(htmlString, {
  tw: tw,                   // defaults to default `tw` instance
  lowerCaseTagName: false,  // convert tag name to lower case (hurt performance heavily)
  comment: false            // retrieve comments (hurt performance slightly)
  blockTextElements: {
    script: true,           // keep text content when parsing
    noscript: true,         // keep text content when parsing
    style: true,            // keep text content when parsing
    pre: true,              // keep text content when parsing
  }
})
```

<hr/>

Continue to [`tw` function](./tw.md)
