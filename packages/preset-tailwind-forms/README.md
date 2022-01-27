# @twind/preset-tailwind-forms [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/preset-tailwind-forms/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/preset-tailwind-forms) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23preset-tailwind-forms?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind-forms)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

A [twind](https://www.npmjs.com/package/twind) preset that provides a basic reset for form styles that makes form elements easy to override with utilities.

> Based on [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms).

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [Tailwind Forms](https://github.com/tw-in-js/twind/tree/next/examples/using-tailwind-forms)

## Installation

Install from npm:

```sh
npm install twind@next @twind/preset-tailwind@next @twind/preset-tailwind-forms@next

# or when using @twind/tailwind
npm install twind@next @twind/tailwind@next @twind/preset-tailwind-forms@next
```

Then add the preset to your twind config:

**with [twind](https://www.npmjs.com/package/twind)**

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

**with [@twind/tailwind](https://www.npmjs.com/package/@twind/tailwind)** — ready to use Tailwind CSS

```js
import { setup } from '@twind/tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'

setup({
  presets: [presetTailwindForms(/* options */)],
  /* config */
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind@next,npm/@twind/tailwind@next,npm/@twind/preset-tailwind-forms@next"
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

</details>

**with [Twind CDN](https://www.npmjs.com/package/@twind/cdn)** — a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn)

_Currently not possible_

## Usage

> Same as with [tailwindcss-forms › Basic Usage](https://github.com/tailwindlabs/tailwindcss-forms#basic-usage)

All of the basic form elements you use will now have some simple default styles that are easy to override with utilities.

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
