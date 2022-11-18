---
section: Presets
label: Extensions
package: '@twind/preset-ext'
excerpt: |
  Extension preset for twind providing utilities and variants that are not _yet_ part of [@twind/preset-tailwind](./preset-tailwind) eg Tailwind CSS.
next: ./preset-line-clamp.md
---

## 📦 Installation

**with [twind](https://github.com/tw-in-js/twind/tree/main/packages/twind)**

Install from npm:

```sh
npm install @twind/core @twind/preset-ext
```

Add the preset to your twind config:

```js title="twind.config.js"
import { defineConfig } from '@twind/core'
import presetExt from '@twind/preset-ext'

export default defineConfig({
  presets: [presetExt()],
  /* config */
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind,npm/@twind/preset-ext"
    crossorigin
  ></script>
  <script>
    twind.install({
      presets: [twind.presetExt()],
      /* config */
    })
  </script>
</head>
```

</details>

**with [Twind CDN](./installation#twind-cdn)**

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/@twind/cdn,npm/@twind/preset-ext"
    crossorigin
  ></script>
  <script>
    twind.install({
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

[^1]: [Tailwind CSS › Adding Custom Styles › Handling whitespace](https://tailwindcss.com/docs/adding-custom-styles#handling-whitespace)
