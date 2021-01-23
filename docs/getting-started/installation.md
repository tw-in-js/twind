It is possible to install and thus use Twind in a multitude of different ways. We expose various {@page Modules Summary | different bundles} – from the latest ESM syntax to UMD bundles – with the aim of accommodating for as many dev setups as possible. This said, for the smallest size and fastest performance we recommend you use the ESM bundles.

> 💡 Although compatible with traditional bundlers no build step is required to use Twind.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Importing as a local dependency](#importing-as-a-local-dependency)
- [Importing as a remote dependency](#importing-as-a-remote-dependency)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Importing as a local dependency

Most build tools rely on packages to be installed locally on the machine they are running on. Usually these packages are available on and installed via npm. Twind is no different in this regard.

1. Run the following command in your terminal, from your project root:

```sh
npm i twind
```

2. Then go ahead and import the module into your application using the bare module specifier:

```js
import { tw } from 'twind'
```

Assuming you have your bundler configured correctly then you should now be able to use the module.

## Importing as a remote dependency

Given that nearly all [browsers support es modules](https://caniuse.com/es6-module) now, sometimes it is desirable to import a module straight from from a CDN such as [skypack](https://skypack.dev/), [unpkg](https://unpkg.com/) or [jspm](https://jspm.dev/).

1. Add the following line to a javascript file referenced by a script tag with `type="module"` like below:

```html
<script type="module">
  import { tw } from 'https://cdn.skypack.dev/twind'
</script>
```

Assuming you have an internet connection then you should now be able to use the module.

> 🚀 [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgdHcgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZCcKCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYAogIDxtYWluIGNsYXNzPSIke3R3YGgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJgfSI+CiAgICA8aDEgY2xhc3M9IiR7dHdgZm9udC1ib2xkIHRleHQoY2VudGVyIDV4bCB3aGl0ZSBzbTpncmF5LTgwMCBtZDpwaW5rLTcwMClgfSI+CiAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICA8L2gxPgogIDwvbWFpbj4KYA==)

<details><summary>How to support legacy browser with the UMD bundles (Click to expand)</summary>

> 💡 You may need to provide certain {@page Browser Support | polyfills} depending on your target browser.

```html
<script src="https://unpkg.com/twind/twind.umd.js"></script>
<script>
  var tw = twind.tw
</script>
```

</details>

<hr/>

Continue to {@page Styling with Twind}
