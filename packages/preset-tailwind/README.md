# @twind/preset-tailwind

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

The full [Tailwind CSS](https://tailwindcss.com) experience without any build step right in the browser or any other environment like Node.js, deno, workers, ...

This preset is included out-of-the-box in

- [@twind/tailwind](https://www.npmjs.com/package/@twind/tailwind) — ready to use Tailwind CSS
- [@twind/cdn](https://www.npmjs.com/package/@twind/cdn) — a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn)

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [Playground](https://github.com/tw-in-js/twind/tree/next/examples/playground)

## Installation

Install from npm:

```sh
npm install twind@next @twind/preset-tailwind@next
```

## Installation

**with [twind](https://www.npmjs.com/package/twind)**

```js
import { setup } from 'twind/core'
import presetTailwind from '@twind/preset-tailwind'

setup({
  presets: [presetTailwind(/* options */)],
  /* config */
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind@next,npm/@twind/preset-tailwind@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      presets: [twind.presetTailwind(/* options */)],
      /* config */
    })
  </script>
</head>
```

</details>

**with [@twind/tailwind](https://www.npmjs.com/package/@twind/tailwind)** — ready to use Tailwind CSS

_Already included in `@twind/tailwind`_

**with [Twind CDN](https://www.npmjs.com/package/@twind/cdn)** — a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn)

_Already included in `@twind/cdn`_

## Usage

This preset can be configured with the following options:

- `enablePreflight: boolean = true` — whether to enable the [preflight](https://tailwindcss.com/docs/preflight)
