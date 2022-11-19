---
section: Presets
label: Tailwind CSS Forms
package: '@twind/preset-tailwind-forms'
playground: true
excerpt: |
  A preset that provides a basic reset for form styles that makes form elements easy to override with utilities.
next: ./preset-typography.md
---

> **Note**
> Based on [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms).

## 🤝 Compatibility

| @twind/preset-tailwind-forms     | @tailwindcss/forms |
| -------------------------------- | ------------------ |
| `>=1.0.0-next.40 <1.1.0`         | `>=0.5 <0.6`       |
| `>=1.0.0-next.27 <1.0.0-next.40` | `>=0.4 <0.5`       |

## 📦 Installation

**with [@twind/core](https://github.com/tw-in-js/twind/tree/main/packages/core)**

Install from npm:

```sh
npm install @twind/core @twind/preset-tailwind @twind/preset-tailwind-forms
```

Add the preset to your twind config:

```js title="twind.config.js"
import { defineConfig } from '@twind/core'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'

export default defineConfig({
  presets: [presetTailwind(/* options */), presetTailwindForms(/* options */)],
  /* config */
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind,npm/@twind/preset-tailwind,npm/@twind/preset-tailwind-forms"
    crossorigin
  ></script>
  <script>
    twind.install({
      presets: [twind.presetTailwind(/* options */), twind.presetTailwindForms(/* options */)],
      /* config */
    })
  </script>
</head>
```

</details>

**with [Twind CDN](./installation#twind-cdn)**

```html
<head>
  <script src="https://cdn.twind.style/tailwind-forms" crossorigin></script>
  <script>
    twind.install({
      presets: [twind.presetTailwindForms(/* options */)],
      /* config */
    })
  </script>
</head>
```

All of the basic form elements you use will now have some simple default styles that are easy to override with utilities.

## 🙇 Usage

> Same as with [@tailwindcss/forms › Basic Usage](https://github.com/tailwindlabs/tailwindcss-forms#basic-usage)

### Using only global styles or only classes

> Same as with [@tailwindcss/forms › Using only global styles or only classes](https://github.com/tailwindlabs/tailwindcss-forms#using-only-global-styles-or-only-classes)

```js title="twind.config.js"
import { defineConfig } from '@twind/core'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'

export default defineConfig({
  presets: [
    presetTailwind(/* options */),
    presetTailwindForms({
      strategy: 'base', // only generate global styles
      strategy: 'class', // only generate classes
    }),
  ],
  /* config */
})
```
