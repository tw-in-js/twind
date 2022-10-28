# @twind/preset-tailwind [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/preset-tailwind/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/preset-tailwind/v/next) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23preset-tailwind?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind)

The full [Tailwind CSS](https://tailwindcss.com) v3 experience without any build step right in the browser or any other environment like Node.js, deno, workers, ...

> Visit [twind.style](https://twind.style) for a full documentation or explore [the examples](https://github.com/tw-in-js/twind/tree/next/examples#readme).

## 📦 Installation


**with [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind)**

Install from npm:

```sh
npm install twind@next @twind/preset-tailwind@next
```

Add the preset to your twind config:

```js
import { setup } from 'twind'
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

## 🙇 Usage

All classes and variants from [tailwindcss](https://tailwindcss.com/docs/installation) are available.

## 🔧 Options

This preset can be configured with the following options:

- `disablePreflight: boolean` — allows to disable the [preflight](https://tailwindcss.com/docs/preflight)

## 💬 Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable use [Github Discussions](https://github.com/tw-in-js/twind/discussions).

To ask questions and discuss with other Twind users in real time use [Discord Chat](https://chat.twind.style).

## 🧱 Contribute

See the [Contributing Guide](../../CONTRIBUTING.md) for information on how to contribute to this project.

## 📜 Changelog

[The Changelog for this package is available on GitHub.](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind/CHANGELOG.md)

## ⚖️ License

The [MIT license](https://github.com/tw-in-js/twind/blob/main/LICENSE) governs your use of Twind.
