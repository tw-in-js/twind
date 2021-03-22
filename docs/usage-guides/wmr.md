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

> [@twind/wmr](https://github.com/tw-in-js/use-twind-with/tree/main/packages/wmr) [![Latest Release](https://flat.badgen.net/npm/v/@twind/wmr?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/wmr) [![MIT License](https://flat.badgen.net/github/license/tw-in-js/use-twind-with)](https://github.com/tw-in-js/use-twind-with/blob/main/LICENSE)
>
> This package is utilizing [@twind/preact](./preact.md).

## Installation

```sh
npm install @twind/wmr
```

## Usage

[![Edit twind-wmr](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/twind-wmr-orudp?fontsize=14&hidenavigation=1&theme=dark)

```diff
-import hydrate from 'preact-iso/hydrate';
+import withTwind from '@twind/wmr';

+const { hydrate, prerender } = withTwind((data) => <App {...data} />)

hydrate(<App />)

-export async function prerender(data) {
-  // we use dynamic import to prevent this from being loaded in the browser:
-  return (await import('preact-iso/prerender')).default(<App {...data} />);
-}
+export { prerender }
```

## Shim-like usage but without the [shim](https://twind.dev/docs/handbook/getting-started/using-the-shim.html)

[![Edit twind-shim-wmr](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/twind-shim-wmr-nu61v?fontsize=14&hidenavigation=1&theme=dark)

```diff
-import hydrate from 'preact-iso/hydrate';
+import withTwind from '@twind/wmr';

+const { hydrate, prerender } = withTwind({
+  // Options for @twind/preact
+  props: {
+    className: true, // Shim like experience without the shim
+  },
+  /* other twind configuration options */
+}, (data) => <App {...data} />)

hydrate(<App />)

-export async function prerender(data) {
-  // we use dynamic import to prevent this from being loaded in the browser:
-  return (await import('preact-iso/prerender')).default(<App {...data} />);
-}
+export { prerender }
```
