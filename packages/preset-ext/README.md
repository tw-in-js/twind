# @twind/preset-ext [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/preset-ext/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/preset-ext/v/next) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23preset-ext?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/preset-ext)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

> Visit [twind.style](https://twind.style) for a full documentation or explore [the examples](https://github.com/tw-in-js/twind/tree/next/examples#readme).

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [Playground](https://github.com/tw-in-js/twind/tree/next/examples/playground)

## 📦 Installation


**with [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind)**

Install from npm:

```sh
npm install twind@next @twind/preset-ext@next
```

Add the preset to your twind config:

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

**with [Twind CDN](https://github.com/tw-in-js/twind/tree/next/packages/cdn)** — a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn)

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

## 🙇 Usage

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

## 💬 Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable use [Github Discussions](https://github.com/tw-in-js/twind/discussions).

To ask questions and discuss with other Twind users in real time use [Discord Chat](https://chat.twind.style).

## 🧱 Contribute

See the [Contributing Guide](../../CONTRIBUTING.md) for information on how to contribute to this project.

## 📜 Changelog

[The Changelog for this package is available on GitHub.](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind/CHANGELOG.md)

## ⚖️ License

The [MIT license](https://github.com/tw-in-js/twind/blob/main/LICENSE) governs your use of Twind.

[^1]: [Tailwind CSS › Adding Custom Styles › Handling whitespace](https://tailwindcss.com/docs/adding-custom-styles#handling-whitespace)
