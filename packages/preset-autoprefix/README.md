# @twind/preset-autoprefix [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/preset-autoprefix/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/preset-autoprefix/v/next) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23preset-autoprefix?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

CSS vendor prefixer and property alias mapper preset for [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind).

> Visit [twind.style](https://twind.style) for a full documentation or explore [the examples](https://github.com/tw-in-js/twind/tree/next/examples#readme).

Used within the most [examples](https://github.com/tw-in-js/twind/tree/next/examples).

## 📦 Installation

**with [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind)**

Install from npm:

```sh
npm install twind@next @twind/preset-autoprefix@next
```

Add the preset to your twind config:

```js
import { setup } from 'twind'
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

**with [Twind CDN](https://github.com/tw-in-js/twind/tree/next/packages/cdn)** — a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn)

_Already included in `@twind/cdn`_

## 💬 Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable use [Github Discussions](https://github.com/tw-in-js/twind/discussions).

To ask questions and discuss with other Twind users in real time use [Discord Chat](https://chat.twind.style).

## 🧱 Contribute

See the [Contributing Guide](../../CONTRIBUTING.md) for information on how to contribute to this project.

## 📜 Changelog

[The Changelog for this package is available on GitHub.](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix/CHANGELOG.md)

## ⚖️ License

The [MIT license](https://github.com/tw-in-js/twind/blob/main/LICENSE) governs your use of Twind.
