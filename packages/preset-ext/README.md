# @twind/preset-ext [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/preset-ext/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/preset-ext) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23preset-ext?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/preset-ext)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [Playground](https://github.com/tw-in-js/twind/tree/next/examples/playground)

## Installation

Install from npm:

```sh
npm install twind@next @twind/preset-ext@next
```

Then add the preset to your twind config:

**with [twind](https://www.npmjs.com/package/twind)**

```js
import { setup } from 'twind'
import presetExt from '@twind/preset-ext'

setup({
  presets: [presetExt()],
  // ... additional config
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind@next,npm/@twind/preset-ext@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      presets: [twind.presetExt()],
      // ...
    })
  </script>
</head>
```

</details>

**with [@twind/tailwind](https://www.npmjs.com/package/@twind/tailwind)** — ready to use Tailwind CSS

```js
import { setup } from '@twind/tailwind'
import presetExt from '@twind/preset-ext'

setup({
  presets: [presetExt()],
  /* config */
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind@next,npm/@twind/tailwind@next,npm/@twind/preset-ext@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      presets: [twind.presetExt()],
      /* config */
    })
  </script>
</head>
```

</details>

**with [Twind CDN](https://www.npmjs.com/package/@twind/cdn)** — a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn)

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/@twind/cdn@next,npm/@twind/preset-ext@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      presets: [twind.presetExt()],
      /* config */
    })
  </script>
</head>
```

## Usage

TBD: Look at the [source](./src/index.ts) for now.

### Short CSS

Allows any CSS properties to be added:

```html
<div class="background-color[#1da1f1]" />
```

↓ ↓ ↓ ↓ ↓ ↓

```css
.background-color\[\#1da1f1\] {
  background-color: #1da1f1;
}
```

When a value needs to contain a space, use an underscore (`_`) instead and Twind will automatically convert it to a space at build-time [^1].

[^1]: [Tailwind CSS › Adding Custom Styles › Handling whitespace](https://tailwindcss.com/docs/adding-custom-styles#handling-whitespace)
