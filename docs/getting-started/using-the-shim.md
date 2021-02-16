> Seamless integration with existing Tailwind HTML. This feature can be used together with your favorite framework without any additional setup.

The {@link twind/shim} module allows for the use of the `class` attribute for tailwind rules. If such a rule is detected, the corresponding CSS rule is created and injected into the stylesheet dynamically. The default {@link twind/shim} export is intended for [client-side](#client-side-dynamic-extraction) usage and, without configuration, utilizes the default/global `tw` instance. For [server-side](#server-side-static-extraction) usage, {@link twind/shim/server} exports a dedicated {@link twind/shim/server.shim | shim} function that will parse and update a static HTML string while collecting the style rules into a sheet for further usage in your respective framework.

> 💡 `twind/shim` can be used together with `tw` and every framework as it detects `class` changes. All Twind syntax features like {@page Thinking in Groups | grouping} are supported.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Dynamic Extraction](#dynamic-extraction)
- [Static Extraction](#static-extraction)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Dynamic Extraction

For runtime processing of your javascript-assisted HTML documents, simply include the {@link twind/shim} module and watch the magic happen.

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

> 🚀 [live and interactive shim demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPG1haW4gY2xhc3M9Imgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIiPgogICAgPGgxIGNsYXNzPSJmb250LWJvbGQgdGV4dChjZW50ZXIgNXhsIHdoaXRlIHNtOmdyYXktODAwIG1kOnBpbmstNzAwKSI+CiAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICA8L2gxPgogIDwvbWFpbj4KYA==)

To prevent FOUC (_flash of unstyled content_) it is advised to set the `hidden` attribute on the target element. {@link twind/shim} will remove it once all styles have been generated.

```html
<!DOCTYPE html>
<html lang="en" hidden>
  <!-- ... -->
</html>
```

<details><summary>How can I use twind/shim from javascript (Click to expand)</summary>

> Internally {@link twind/shim} uses {@link twind/observe} which may be useful for advanced use cases.

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

{@link twind/shim} starts {@link twind/observe | observing} class attributes changes right after the [DOM content has been loaded](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event). For further details see {@link twind/observe | twind/observe}.

</details>

## Static Extraction

If you wish to remove Twind's runtime overhead or you're interested in using Twind in a universal or "isomorphic" web app, {@link twind/shim/server} exports the dedicated {@link twind/shim/server.shim} function for performant processing of static HTML.

> 💡 You'll find more details and examples in the {@page Extract Styles aka SSR} guide.

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

<hr/>

Continue to {@page Customize the Theme}
