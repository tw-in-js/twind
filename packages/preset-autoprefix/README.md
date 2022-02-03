# @twind/preset-autoprefix [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/preset-autoprefix/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/preset-autoprefix/v/next) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23preset-autoprefix?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

CSS vendor prefixer and property alias mapper preset for [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind).

This preset is included out-of-the-box in [@twind/tailwind](https://github.com/tw-in-js/twind/tree/next/packages/tailwind).

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [Playground](https://github.com/tw-in-js/twind/tree/next/examples/playground)

## Installation

Install from npm:

```sh
npm install twind@next @twind/preset-autoprefix@next
```

Then add the preset to your twind config:

**with [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind)**

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

**with [@twind/tailwind](https://github.com/tw-in-js/twind/tree/next/packages/tailwind)** — ready to use Tailwind CSS

_Already included in `@twind/tailwind`_

**with [Twind CDN](https://github.com/tw-in-js/twind/tree/next/packages/cdn)** — a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn)

_Already included in `@twind/cdn`_
