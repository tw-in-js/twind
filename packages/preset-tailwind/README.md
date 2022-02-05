# @twind/preset-tailwind [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/preset-tailwind/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/preset-tailwind/v/next) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23preset-tailwind?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

The full [Tailwind CSS](https://tailwindcss.com) v3 experience without any build step right in the browser or any other environment like Node.js, deno, workers, ...

This preset is included out-of-the-box in [@twind/cdn](https://github.com/tw-in-js/twind/tree/next/packages/cdn) — a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn)

Used within the most [examples](https://github.com/tw-in-js/twind/tree/next/examples).

## Installation

Install from npm:

```sh
npm install twind@next @twind/preset-tailwind@next
```

## Installation

**with [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind)**

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

**with [Twind CDN](https://github.com/tw-in-js/twind/tree/next/packages/cdn)** — a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn)

_Already included in `@twind/cdn`_

## Usage

This preset can be configured with the following options:

- `disablePreflight: boolean` — allows to disable the [preflight](https://tailwindcss.com/docs/preflight)
