# @twind/preset-tailwind-forms [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/preset-tailwind-forms/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/preset-tailwind-forms/v/next) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23preset-tailwind-forms?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind-forms)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

> Based on [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms).

A [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind) preset that provides a basic reset for form styles that makes form elements easy to override with utilities.

> Visit [twind.style](https://twind.style) for a full documentation or explore [the examples](https://github.com/tw-in-js/twind/tree/next/examples#readme).

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [Tailwind Forms](https://github.com/tw-in-js/twind/tree/next/examples/using-tailwind-forms)

## 📦 Installation

**with [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind)**

Install from npm:

```sh
npm install twind@next @twind/preset-tailwind@next @twind/preset-tailwind-forms@next
```

Add the preset to your twind config:

```js
import { setup } from 'twind'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'

setup({
  presets: [presetTailwind(/* options */), presetTailwindForms(/* options */)],
  /* config */
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind@next,npm/@twind/preset-tailwind@next,npm/@twind/preset-tailwind-forms@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      presets: [twind.presetTailwind(/* options */), twind.presetTailwindForms(/* options */)],
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
    src="https://cdn.jsdelivr.net/combine/npm/npm/@twind/cdn@next,npm/@twind/preset-tailwind-forms@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      presets: [twind.presetTailwindForms(/* options */)],
      /* config */
    })
  </script>
</head>
```

All of the basic form elements you use will now have some simple default styles that are easy to override with utilities.

## 🙇 Usage

> Same as with [tailwindcss-forms › Basic Usage](https://github.com/tailwindlabs/tailwindcss-forms#basic-usage)

### Using classes instead of element selectors

> Same as with [tailwindcss-forms › Using classes instead of element selectors](https://github.com/tailwindlabs/tailwindcss-forms#using-classes-instead-of-element-selectors)

Although we recommend thinking of this plugin as a "form reset" rather than a collection of form component styles, in some cases our default approach may be too heavy-handed, especially when integrating this plugin into existing projects.

For situations where the default strategy doesn't work well with your project, you can use the `class` strategy to make all form styling _opt-in_ instead of applied globally:

```js
setup({
  presets: [presetTailwindForms({ strategy: 'class' })],
  // ... additional config
})
```

## 💬 Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable use [Github Discussions](https://github.com/tw-in-js/twind/discussions).

To ask questions and discuss with other Twind users in real time use [Discord Chat](https://chat.twind.style).

## 🧱 Contribute

See the [Contributing Guide](../../CONTRIBUTING.md) for information on how to contribute to this project.

## 📜 Changelog

[The Changelog for this package is available on GitHub.](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind-forms/CHANGELOG.md)

## ⚖️ License

The [MIT license](https://github.com/tw-in-js/twind/blob/main/LICENSE) governs your use of Twind.
