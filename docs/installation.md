# Installation

It is possible to install and thus use Twind in a multitude of different ways. We expose various different modules – from the latest es syntax to umd builds – with the aim of accommodating for as many dev setups as possible. This said, for the smallest size and fastest performance we recommend you use the module build.

> Although compatible with traditional bundlers no build step is required to use the module

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

<details><summary>How to support legacy browser with the UMD bundles (Click to expand)</summary>

> You may need to provide certain [polyfills](./browser-support.md) depending on your target browser.

```html
<script src="https://unpkg.com/twind/twind.umd.js"></script>
<script>
  var tw = twind.tw
  var setup = twind.setup
</script>
```

</summary>

## twind/shim

> Allows to copy-paste tailwind examples.

The `twind/shim` modules allows to use the `class` attribute for tailwind rules.
If such a rule is detected the corresponding CSS rule is created and injected
into the stylesheet. _No need for `tw`_ but it can be used on the same page as well (see example below).

```html
<!DOCTYPE html>
<html lang="en" hidden>
  <head>
    <script type="module" src="https://cdn.skypack.dev/twind/shim"></script>
  </head>
  <body>
    <h1 class="text-7xl border(2 black opacity-50 dashed)">Hello World</h1>
</bod>
</html>
```

All twind syntax features like [grouping](./grouping.md) are supported.
See [example/shim.html](https://github.com/tw-in-js/twind/blob/main/example/shim.html) for a full example.

To customize the default `tw` instance you can provide a `<script type="twind-config">...</script>`
within the document. The content must be valid JSON and all twind setup options are supported.

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
  </bod>
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
  <main class="h-screen bg-purple-400 ${center}">
    <h1 class="font-bold ${tw`text(center 5xl white sm:gray-800 md:pink-700)`}">This is Twind!</h1>
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

<details><summary>How to support legacy browser with the UMD bundles (Click to expand)</summary>

> You may need to provide certain [polyfills](./browser-support.md) depending on your target browser.

```html
<script defer src="https://unpkg.com/twind/twind.umd.js"></script>
<script defer src="https://unpkg.com/twind/shim/shim.umd.js"></script>
```

</details>

<details><summary>Implementation Details (Click to expand)</summary>

This uses a [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) to detect changed class attributes or added DOM nodes. On detection the class attribute is parsed and translated by twind to inject the required classes into the stylesheet and the class attribute is updated to reflect the added CSS class names that may have been hashed.

</details>

<hr/>

Continue to [Setup](./setup.md)
