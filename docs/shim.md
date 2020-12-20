# twind/shim

> Allows to copy-paste tailwind examples.

The `twind/shim` modules allows to use the `class` attribute for tailwind rules.
If such a rule is detected the corresponding CSS rule is created and injected
into the stylesheet. *No need for `tw`* but it can be used on the same page as well.

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

To customize the default `tw` instance you can provide a `<script type="twind-shim">...</script>`
within the document. The content must be valid JSON and all twind setup option are supported.

```html
<!DOCTYPE html>
<html lang="en" hidden>
  <head>
    <script type="module" src="https://cdn.skypack.dev/twind/shim"></script>
    <script type="twind-shim">
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
import { setup } "https://cdn.skypack.dev/twind/shim"

setup({
  target: document.body, // Default document.documentElement (eg html)
  ... // All other twind setup options are supported
})
```

To prevent FOUC (flash of unstyled content) it is advised to set
the `hidden` attribute on the target element:

```html
<!DOCTYPE html>
<html lang="en" hidden>
  <!-- ... -->
</html>
```

## Implmentation Details

This uses a [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
to detect changed class attributes or added DOM nodes. On detection the class attribute
is parsed and translated by twind to inject the required classes into the stylesheet and the
class attribute is updated to reflect the added CSS class names that may have been hashed.

<hr/>

Continue to [Tailwind Extensions](./tailwind-extensions.md)
