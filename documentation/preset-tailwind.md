---
section: Presets
label: Tailwind CSS
package: '@twind/preset-tailwind'
playground: true
excerpt: |
  The full [Tailwind CSS](https://tailwindcss.com) v3 experience without any build step right in the browser or any other environment like Node.js, deno, workers, ...
next: ./preset-tailwind-forms.md
---

## 🤝 Compatibility

| @twind/preset-tailwind          | tailwindcss |
| ------------------------------- | ----------- |
| `>=1.0.0-next.39 <1.1.0`        | `3.1`       |
| `>=1.0.0-next.1 <1.0.0-next.39` | `3.0`       |

## 📦 Installation

**with [@twind/core](./installation#local--bundler)**

Install from npm:

```sh
npm install @twind/core @twind/preset-tailwind
```

Add the preset to your twind config:

```js title="twind.config.js"
import { defineConfig } from '@twind/core'
import presetTailwind from '@twind/preset-tailwind'

export default defineConfig({
  presets: [presetTailwind(/* options */)],
  /* config */
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/@twind/core@1,npm/@twind/preset-tailwind@1"
    crossorigin
  ></script>
  <script>
    twind.install({
      presets: [twind.presetTailwind(/* options */)],
      /* config */
    })
  </script>
</head>
```

</details>

**with [Twind CDN](./installation#twind-cdn)**

_Already included in `@twind/cdn`_

## 🙇 Usage

All utilities and variants from [Tailwind CSS](https://tailwindcss.com) are available.

## 🔧 Options

This preset can be configured with the following options:

- `disablePreflight: boolean` — allows to disable the [preflight](https://tailwindcss.com/docs/preflight)
