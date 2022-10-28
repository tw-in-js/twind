# @twind/preset-typography [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/preset-typography/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/preset-typography/v/next) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23preset-typography?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/preset-typography)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

> Based on [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography).

A plugin that provides a set of `prose` classes you can use to add beautiful typographic defaults to any vanilla HTML you don't control, like HTML rendered from Markdown, or pulled from a CMS.

> Visit [twind.style](https://twind.style) for a full documentation or explore [the examples](https://github.com/tw-in-js/twind/tree/next/examples#readme).

## 📦 Installation

**with [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind)**

Install from npm:

```sh
npm install twind@next @twind/preset-typography@next
```

Add the preset to your twind config:

```js
import { setup } from 'twind'
import presetTypography from '@twind/preset-typography'

setup({
  presets: [presetTypography(/* options */)],
  /* config */
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind@next,npm/@twind/preset-typography@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      presets: [twind.presetTypography(/* options */)],
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
    src="https://cdn.jsdelivr.net/combine/npm/@twind/cdn@next,npm/@twind/preset-typography@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      presets: [twind.presetTypography(/* options */)],
      /* config */
    })
  </script>
</head>
```

## 🙇 Usage

Most features of the [Tailwind CSSS › typography-plugin](https://tailwindcss.com/docs/typography-plugin) are implemented in the same way.

### Differences

- _Adding custom color themes_: every color from `theme.colors` is available via `prose-<color>`; the default color `gray` can be changed via `presetTypography({ defaultColor: '...'})`
- _Customizing the CSS_: can be done using `presetTypography({ extend: { /* CSS object */ } })`

## 💬 Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable use [Github Discussions](https://github.com/tw-in-js/twind/discussions).

To ask questions and discuss with other Twind users in real time use [Discord Chat](https://chat.twind.style).

## 🧱 Contribute

See the [Contributing Guide](../../CONTRIBUTING.md) for information on how to contribute to this project.

## 📜 Changelog

[The Changelog for this package is available on GitHub.](https://github.com/tw-in-js/twind/tree/next/packages/preset-typography/CHANGELOG.md)

## ⚖️ License

The [MIT license](https://github.com/tw-in-js/twind/blob/main/LICENSE) governs your use of Twind.
