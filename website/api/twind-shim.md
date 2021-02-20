---
title: twind/shim
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: API for the twind/shim module
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# `{{ $frontmatter.title }}`

[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev/docs/modules/twind_shim.html)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc%2Fshim?icon=github&label)](https://github.com/tw-in-js/twind/tree/main/src/shim)
[![Module Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/twind/shim/shim.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/shim/shim.js "brotli module size")
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/shim/shim.d.ts)

> Allows to copy-paste tailwind examples. This feature can be used together with your favorite framework without any additional setup.

The `twind/shim` module allows for the use of the `class` attribute for tailwind rules. If such a rule is detected, the corresponding CSS rule is created and injected into the stylesheet dynamically. `twind/shim` is intended for client-side usage and, without configuration, utilizes the default/global {@link twind.tw | tw instance}. For server-side usage, {@link twind/shim/server} exports a dedicated {@link twind/shim/server.shim | shim function} that will parse and update a static HTML string while collecting the style rules into a sheet for further usage in your respective framework.

There is _no need for `tw`_ but it can be used on the same elements as well. All Twind syntax features like {@page Thinking in Groups | grouping} are supported within class attributes. See [example/shim.html](https://github.com/tw-in-js/twind/blob/main/example/shim.html) for a full example.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Usage](#usage)
- [Customize `tw` instance](#customize-tw-instance)
- [Prevent FOUC (_flash of unstyled content_)](#prevent-fouc-_flash-of-unstyled-content_)
- [FAQ](#faq)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

For runtime processing of your javascript-assisted HTML documents, simply include the `twind/shim` module and watch the magic happen.

```html
<!DOCTYPE html>
<html lang="en" hidden>
  <head>
    <script type="module" src="https://cdn.skypack.dev/twind/shim"></script>
  </head>
  <body>
    <main class="h-screen bg-purple-400 flex items-center justify-center">
      <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">
        This is Twind!
      </h1>
    </main>
  </body>
</html>
```

> 🚀 [live and interactive shim demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPG1haW4gY2xhc3M9Imgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIiPgogICAgPGgxIGNsYXNzPSJmb250LWJvbGQgdGV4dChjZW50ZXIgNXhsIHdoaXRlIHNtOmdyYXktODAwIG1kOnBpbmstNzAwKSI+CiAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICA8L2gxPgogIDwvbWFpbj4KYA==)

The `twind/shim` module utilizes the {@link twind/observe} module internally, but it provides its own {@link setup} function for customizing the used {@link tw} instance and setting the target node to be shimmed. It also provides a {@link disconnect} function to stop shimming/observing all nodes.

```js
import { setup, disconnect } from "twind/shim";

setup({
  // node element to shim/observe (default: document.documentElement)
  target: document.querySelector("#__twind"),

  // All other setup options are supported
});

// stop shimming/observing all nodes
disconnect();
```

## Customize `tw` instance

You can provide a `<script type="twind-config">...</script>` within the document. The content must be valid JSON and all {@link twind.setup | twind setup options} (including {@link twind.Configuration.hash | hash}) are supported.

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

It is possible to mix `twind/shim` with {@link tw}:

```js
import "twind/shim";
import { tw } from "twind";

const styles = {
  center: tw`flex items-center justify-center`,
};

document.body.innerHTML = `
  <main class="h-screen bg-purple-400 ${styles.center}">
    <h1 class="font-bold ${tw`text(center 5xl white sm:gray-800 md:pink-700)`}">
      This is Twind!
    </h1>
  </main>
`;
```

## Prevent FOUC (_flash of unstyled content_)

To prevent FOUC (_flash of unstyled content_) it is advised to set the `hidden` attribute on the target element. `twind/shim` will remove it once all styles have been generated.

```html
<!DOCTYPE html>
<html lang="en" hidden>
  <!-- ... -->
</html>
```

## FAQ

> You can click on each question to reveal the answer.

<details><summary>How can I use twind/shim from javascript?</summary>

> Internally `twind/shim` uses {@link twind/observe} which may be useful on its own for advanced use cases.

```js
import "twind/shim";
```

```js
import { setup, disconnect } from "twind/shim";
```

</details>

<details><summary>How to support legacy browser with the UMD bundles?</summary>

> You may need to provide certain [polyfills](./browser-support.md) depending on your target browser.

```html
<script defer src="https://unpkg.com/twind/twind.umd.js"></script>
<script defer src="https://unpkg.com/twind/observe/observe.umd.js"></script>
<script defer src="https://unpkg.com/twind/shim/shim.umd.js"></script>
```

</details>

<details><summary>How does the shim work?</summary>

`twind/shim` starts {@link twind/observe.observer | observing} class attributes changes right after the [DOM content has been loaded](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event). For further details see {@link twind/observe}.

</details>

## Type Definitions

<Typedoc module="twind_shim" />
