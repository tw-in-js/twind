# @twind/preset-line-clamp [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/preset-line-clamp/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/preset-line-clamp/v/next) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23preset-line-clamp?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/preset-line-clamp)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

> Based on [@tailwindcss/line-clamp](https://github.com/tailwindlabs/tailwindcss-line-clamp).

A [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind) preset that provides utilities for visually truncating text after a fixed number of lines.

> Visit [twind.style](https://twind.style) for a full documentation or explore [the examples](https://github.com/tw-in-js/twind/tree/next/examples#readme).


Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [Playground](https://github.com/tw-in-js/twind/tree/next/examples/playground)

## 📦 Installation

**with [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind)**

Install from npm:

```sh
npm install twind@next @twind/preset-line-clamp@next
```

Add the preset to your twind config:

```js
import { setup } from 'twind'
import presetLineClamp from '@twind/preset-line-clamp'

setup({
  presets: [presetLineClamp(/* options */)],
  /* config */
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind@next,npm/@twind/preset-line-clamp@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      presets: [twind.presetLineClamp(/* options */)],
      /* config */
    })
  </script>
</head>
```

</details>

**with [Twind CDN](https://github.com/tw-in-js/twind/tree/next/packages/cdn)** — a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn)

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/@twind/cdn@next,npm/@twind/preset-line-clamp@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      presets: [twind.presetLineClamp()],
      /* config */
    })
  </script>
</head>
```

## 🙇 Usage

Use the `line-clamp-{n}` utilities to specify how many lines of text should be visible before truncating:

```html
<p class="line-clamp-3">
  Et molestiae hic earum repellat aliquid est doloribus delectus. Enim illum odio porro ut omnis
  dolor debitis natus. Voluptas possimus deserunt sit delectus est saepe nihil. Qui voluptate
  possimus et quia. Eligendi voluptas voluptas dolor cum. Rerum est quos quos id ut molestiae fugit.
</p>
```

To remove any line-clamping, use `line-clamp-none`:

```html
<p class="line-clamp-3 md:line-clamp-none">
  Et molestiae hic earum repellat aliquid est doloribus delectus. Enim illum odio porro ut omnis
  dolor debitis natus. Voluptas possimus deserunt sit delectus est saepe nihil. Qui voluptate
  possimus et quia. Eligendi voluptas voluptas dolor cum. Rerum est quos quos id ut molestiae fugit.
</p>
```

## 🔧 Theme

A `lineClamp` section is added to the theme. Its values are used for looking up the value. If no value is found the given parameter is used.

```js
setup({
  theme: {
    lineClamp: {
      card: '5',
    },
  },
})

tw('line-clamp-card')
// => -webkit-line-clamp:5

// Not found in theme => use as is
tw('line-clamp-7')
// => -webkit-line-clamp:7
```


## 💬 Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable use [Github Discussions](https://github.com/tw-in-js/twind/discussions).

To ask questions and discuss with other Twind users in real time use [Discord Chat](https://chat.twind.style).

## 🧱 Contribute

See the [Contributing Guide](../../CONTRIBUTING.md) for information on how to contribute to this project.

## 📜 Changelog

[The Changelog for this package is available on GitHub.](https://github.com/tw-in-js/twind/tree/next/packages/preset-line-clamp/CHANGELOG.md)

## ⚖️ License

The [MIT license](https://github.com/tw-in-js/twind/blob/main/LICENSE) governs your use of Twind.
