# twind

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

Twind v1 is a complete rewrite aiming to be compatible with Tailwind v3 classes

---

Tailwind without any build step right in the browser or any other environment like Node.js, deno, workers, ...

## Usage

```sh
npm install twind@next
```

```js
import { setup } from 'twind'

// You must call setup atleast once, but can call it multiple times
setup({
  /* options */
})
```

Incase you are not using SSR to inject the pre-computed styles apply the following pattern to prevent [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content):

```html
<body class="!block" style="display: none">
  <!-- ... -->
</body>
```

**Script tag without a build step**

Add this line to your `index.html`:

```html
<head>
  <!-- ... -->
  <script src="https://cdn.jsdelivr.net/npm/twind@next" crossorigin></script>
  <!-- ... -->
</head>
```

To configure Twind add a script block _after_ the previous one (optional):

```html
<script>
  twind.setup({
    presets: [
      // custom presets...
    ],
    theme: {
      extend: {
        colors: {
          clifford: '#da373d',
        },
      },
    },
    rules: [
      // custom rules...
    ],
    // ...
  })
</script>
```

**Presets**

- [@twind/preset-autoprefix](https://www.npmjs.com/package/@twind/preset-autoprefix)
- [@twind/preset-tailwind](https://www.npmjs.com/package/@twind/preset-tailwind)

To add another preset add its script after the current one:

```html
<head>
  <!-- ... -->
  <script src="https://cdn.jsdelivr.net/npm/twind@next" crossorigin></script>
  <script src="https://cdn.jsdelivr.net/npm/@twind/preset-ext@next" crossorigin></script>
  <script>
    twind.setup({
      presets: [twind_presetExt()],
      // ...
    })
  </script>
  <!-- ... -->
</head>
```

**API**: accessible through the global `twind` variable

- [`setup`](#setupconfig--sheet--target)
- `tw` — from [@twind/runtime](https://www.npmjs.com/package/@twind/runtime#tw)
- `*` — everything from [@twind/core](https://www.npmjs.com/package/@twind/core#api)

### `twind/cdn`

A drop-in replacement for Tailwind CSS Play CDN that is almost 6 times smaller (96.4kb vs 16.9kB).

```js
import /* ... */ 'twind/cdn'
```

```html
<script src="https://cdn.jsdelivr.net/npm/twind@next/cdn.global.js" crossorigin></script>
<script>
  const {
    /* ... */
  } = twind
</script>
```

**Presets**

- [@twind/preset-autoprefix](https://www.npmjs.com/package/@twind/preset-autoprefix)
- [@twind/preset-tailwind](https://www.npmjs.com/package/@twind/preset-tailwind)

**API** — accessible through the global `twind` variable

- [`setup`](#setupconfig--sheet--target)
- `tw` — from [@twind/runtime](https://www.npmjs.com/package/@twind/runtime#tw)

### `twind/core`

```js
import /* ... */ 'twind/core'
```

```html
<script src="https://cdn.jsdelivr.net/npm/twind@next/core.global.js" crossorigin></script>
<script>
  const {
    /* ... */
  } = twind
</script>
```

**Presets**

None

**API** — accessible through the global `twind` variable

- [`setup`](#setupconfig--sheet--target)
- `tw` — from [@twind/runtime](https://www.npmjs.com/package/@twind/runtime#tw)
- everything from [@twind/core](https://www.npmjs.com/package/@twind/core#api)

## API

We are using `twind` in the following examples, but these work the same for `twind/core`.

### `setup(config [, sheet [, target]])`

_Available in: `twind`, `twind/core`, `twind/cdn`_

Can be called as many times as you want.

```js
import { setup } from 'twind'

// can be called as many times as you want.
const tw = setup({
  /* config */
})
```

### `tw(...tokens)` — the current Twind instance

_Available in: `twind`, `twind/core`_

```js
import { tw } from 'twind'

tw`underline`
tw({ underline: true })

tw.theme('colors.blue.500', 'blue')
```

### `extract(html, tw)`

_Available in: `twind`, `twind/core`_

Used for static HTML processing (usually to provide SSR support for your javascript-powered web apps) — powered by [consume(html, tw)](#consumehtml-tw)

**Note**: This clears the Twind instance before processing the HTML.

```js
import { setup, extract, tw } from 'twind'

// can be in a different file — but should be called at least once
setup({
  /* config */
})

function render() {
  const { html, css } = extract(renderApp(), tw)

  // inject as last element into the head
  return html.replace('</head>', `<style data-twind>${css}</style></head>`)
}
```

### `consume(html, tw)`

_Available in: `twind`, `twind/core`_

Used for static HTML processing (usually to provide SSR support for your javascript-powered web apps)

1. parse the markup and process element classes with the provided Twind instance
2. update the class attributes _if_ necessary
3. return the HTML string with the final element classes

```js
import { setup, tw, consume, stringify } from 'twind'

// can be in a different file — but should be called at least once
setup({
  /* config */
})

function render() {
  const html = renderApp()

  // clear all styles
  tw.clear()

  // generated markup
  const markup = comsume(html, tw)

  // create CSS
  const css = stringify(tw.target)

  // inject as last element into the head
  return markup.replace('</head>', `<style data-twind>${css}</style></head>`)
}
```
