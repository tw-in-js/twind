---
title: Installation
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: How to install Twind into your project
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

Twind is designed to be used in almost any environment and exposes several different bundles from ESM to UMD. The ESM bundles should be preferred for it's smaller size and faster performance.

:::tip
Although Twind is compatible with traditional bundlers, there is no build step required to use Twind.
:::

## Importing as a local dependency

Twind is available as an NPM module.

```shell
npm i twind
```

## Importing as an ES Module

Twind is available as an ES Module on [skypack](https://skypack.dev/). Be sure to check [browsers support](https://caniuse.com/es6-module) if your users may not be using modern browsers.

```html
<script type="module">
  import { tw } from "https://cdn.skypack.dev/twind";
</script>
```

Try a [live and interactive demo🚀](https://esm.codes/#aW1wb3J0IHsgdHcgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZCcKCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYAogIDxtYWluIGNsYXNzPSIke3R3YGgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJgfSI+CiAgICA8aDEgY2xhc3M9IiR7dHdgZm9udC1ib2xkIHRleHQoY2VudGVyIDV4bCB3aGl0ZSBzbTpncmF5LTgwMCBtZDpwaW5rLTcwMClgfSI+CiAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICA8L2gxPgogIDwvbWFpbj4KYA==)

## Supporting legacy browsers

A UMD build is available for legacy browsers.

:::tip
You may need to provide certain polyfills depending on your target browser.
:::

```html
<script src="https://unpkg.com/twind/twind.umd.js"></script>
<script>
  var tw = twind.tw;
</script>
```
