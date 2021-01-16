# Installation

It is possible to install and thus use Twind in a multitude of different ways. We expose various different modules – from the latest es syntax to umd builds – with the aim of accommodating for as many dev setups as possible. This said, for the smallest size and fastest performance we recommend you use the module build.

> Although compatible with traditional bundlers no build step is required to use the module

<details><summary>Table Of Contents (Click To Expand)</summary>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Importing as a local dependency](#importing-as-a-local-dependency)
- [Importing as a remote dependency](#importing-as-a-remote-dependency)
- [twind/shim](#twindshim)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Importing as a local dependency

Most build tools rely on modules to be installed locally on the machine they are running on. Usually these modules are available on and installed via npm. Twind is no different in this regard.

1. Run the following command in your terminal, from your project root:

```sh
npm i twind
```

2. Then go ahead and import the module into your application using the bare module specifier:

```js
import { tw, setup } from 'twind'
```

Assuming you have your bundler configured correctly then you should now be able to just use the module.

## Importing as a remote dependency

Given that nearly all [browsers support es modules](https://caniuse.com/es6-module) now, sometimes it is desirable to import a module straight from from a CDN such as [skypack](https://skypack.dev/) or [unpkg](https://unpkg.com/).

1. Add the following line to a javascript file referenced by a script tag with `type="module"` like below:

```html
<script type="module">
  import { tw, setup } from 'https://cdn.skypack.dev/twind'
</script>
```

Assuming you have an internet connection then you should now be able to use the module.

> [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgdHcgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZCcKCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYAogIDxtYWluIGNsYXNzPSIke3R3YGgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJgfSI+CiAgICA8aDEgY2xhc3M9IiR7dHdgZm9udC1ib2xkIHRleHQoY2VudGVyIDV4bCB3aGl0ZSBzbTpncmF5LTgwMCBtZDpwaW5rLTcwMClgfSI+CiAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICA8L2gxPgogIDwvbWFpbj4KYA==)

<details><summary>How to support legacy browser with the UMD bundles (Click to expand)</summary>

> You may need to provide certain [polyfills](./browser-support.md) depending on your target browser.

```html
<script src="https://unpkg.com/twind/twind.umd.js"></script>
<script>
  var tw = twind.tw
  var setup = twind.setup
</script>
```

</details>

## twind/shim

> Allows to copy-paste tailwind examples. This feature can be used together with your favorite framework without any additional setup.

The `twind/shim` modules allows to use the `class` attribute for tailwind rules. If such a rule is detected the corresponding CSS rule is created and injected into the stylesheet. _No need for `tw`_ but it can be used on the same page as well (see example below).

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

All twind syntax features like [grouping](./grouping.md) are supported. See [example/shim.html](https://github.com/tw-in-js/twind/blob/main/example/shim.html) for a full example.

To prevent FOUC (_flash of unstyled content_) it is advised to set the `hidden` attribute on the target element. `twind/shim` will remove it once all styles have been generated.

```html
<!DOCTYPE html>
<html lang="en" hidden>
  <!-- ... -->
</html>
```

<hr/>

Continue to [Setup](./setup.md)
