---
title: Use with WMR
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: How to use Twind with WMR
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

## [WMR](https://github.com/preactjs/wmr)

> 💡 The [tw-in-js/example-wmr](https://github.com/tw-in-js/example-wmr) repository uses this setup.

First we need to add `@rollup/plugin-json` to the dependencies.

```
npm install -D @rollup/plugin-json
```

Next we create or modify the following files:

**wmr.config.mjs**

```js
/** @param {import('wmr').Options} config */
export default async function (config) {
  if (config.mode === "build") {
    const { default: json } = await import("@rollup/plugin-json");
    config.plugins.push(json());
  }
}
```

**public/twind.config.js**

```js
export default {
  /* Shared config */
};
```

**public/index.js**

```js
import hydrate from "preact-iso/hydrate";

import { setup } from "twind";
// Or if you are using twind/shim
// import { setup } from 'twind/shim'

import twindConfig from "./twind.config";

if (typeof window !== "undefined") {
  setup(twindConfig);
}

export function App() {
  /* Your app */
}

hydrate(<App />);

export async function prerender(data) {
  const { default: prerender } = await import("./prerender");

  return prerender(<App {...data} />);
  // Or if you are using twind/shim
  // return prerender(<App {...data} />, { shim: true })
}
```

**public/prerender.js**

```js
import prerender from "preact-iso/prerender";

import { setup } from "twind";
import { asyncVirtualSheet, getStyleTagProperties, shim } from "twind/server";

import twindConfig from "./twind.config";

const sheet = asyncVirtualSheet();

setup({ ...twindConfig, sheet });

export default async (app, options = {}) => {
  sheet.reset();

  const result = await prerender(app);

  if (options.shim) {
    result.html = shim(result.html);
  }

  const { id, textContent } = getStyleTagProperties(sheet);

  result.html = `<style id="${id}">${textContent}</style>${result.html}`;

  return result;
};
```
