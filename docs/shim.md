# twind/shim

> Allows to copy-paste tailwind examples. This feature can be used together with your favorite framework without any additional setup.

The `twind/shim` module allows for the use of the `class` attribute for tailwind rules. If such a rule is detected, the corresponding CSS rule is created and injected into the stylesheet dynamically. The default `shim` export is intended for [client-side](#) usage and, without configuration, utilizes the default `tw` instance. For [server-side](#) usage, `twind/shim/server` exports a special flavor of `shim` that will parse and update a static HTML string while collecting the style rules into a sheet for further usage in your respective framework.

There is _no need for `tw`_ but it can be used on the same elements as well. All twind syntax features like [grouping](./grouping.md) are supported.

<details><summary>Table Of Contents (Click To Expand)</summary>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Usage](#usage)
  - [Client-side (Dynamic Extraction)](#client-side-dynamic-extraction)
  - [Server-side (Static Extraction)](#server-side-static-extraction)
- [API](#api)
  - [`shim(html[, options])`](#shimhtml-options)
  - [Examples](#examples)

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
You can provide a `<script type="twind-config">...</script>` within the document. The content must be valid JSON and all [twind setup options](./setup.md) (including [hash](https://github.com/tw-in-js/twind/blob/main/docs/setup.md#hash)) are supported.

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
    <h1 class="text-7xl rounded-md ring(& pink-700 offset(4 pink-200))">Hello World</h1>
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

To prevent FOUC (flash of unstyled content) it is advised to set the `hidden` attribute on the target element. `twind/shim` will remove it once all styles have been generated.

```html
<!DOCTYPE html>
<html lang="en" hidden>
  <!-- ... -->
</html>
```

### Server-side (Static Extraction)

If you wish to remove twind's runtime overhead or you're interested in using twind in a universal or "isomorphic" web app, we provide a node-powered implementation of `shim` for performant server-side processing of your HTML.

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

##### Example using Next.js

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

### `shim(html[, options])`

- **html** (_required_) - HTML string to process
- **options** (_optional_) - Custom `tw` instance or options object (including `tw` instance)

  ```js
  {
    tw: defaultTW,            // defaults to basic `tw` instance
    lowerCaseTagName: false,  // convert tag name to lower case (hurt performance heavily)
    comment: false            // retrieve comments (hurt performance slightly)
    blockTextElements: {
      script: true,	          // keep text content when parsing
      noscript: true,	        // keep text content when parsing
      style: true,		        // keep text content when parsing
      pre: true			          // keep text content when parsing
    }
  }
  ```

### Examples

```js
// Basic
shim(htmlString)

// Custom `tw` instance
shim(htmlString, tw)

// Options for HTML parser
shim(htmlString, { comment: true })

// Options for HTML parser + custom `tw` instance
shim(htmlString, { comment: true, tw })
```
