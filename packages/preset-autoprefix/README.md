# @twind/preset-autoprefix

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

CSS vendor prefixer and property alias mapper preset for [twind](https://www.npmjs.com/package/twind).

This preset is included out-of-the-box in [@twind/tailwind](https://www.npmjs.com/package/@twind/tailwind).

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [Playground](https://github.com/tw-in-js/twind/tree/next/examples/playground)

## Installation

Install from npm:

```sh
npm install twind@next @twind/preset-autoprefix@next
```

Then add the preset to your twind config:

**with [twind](https://www.npmjs.com/package/twind)**

```js
import { setup } from 'twind/core'
import presetAutoprefix from '@twind/preset-autoprefix'

setup({
  presets: [presetAutoprefix()],
  /* config */
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind@next,npm/@twind/preset-autoprefix@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      presets: [twind.presetAutoprefix()],
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
