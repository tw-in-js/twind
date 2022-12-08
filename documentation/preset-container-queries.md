---
section: Presets
label: Container Queries
package: '@twind/preset-container-queries'
playground: true
excerpt: |
  A preset that provides utilities for container queries.
next: ./preset-ext.md
---

> **Note**
> Based on [@tailwindcss/container-queries](https://github.com/tailwindlabs/tailwindcss-container-queries).

## 🤝 Compatibility

| @twind/preset-container-queries | @tailwindcss/container-queries |
| ------------------------------- | ------------------------------ |
| `>=1.0.0 <1.1.0`                | `0.1.0`                        |

## 📦 Installation

**with [@twind/core](https://github.com/tw-in-js/twind/tree/main/packages/core)**

Install from npm:

```sh
npm install @twind/core @twind/preset-container-queries
```

Add the preset to your twind config:

```js title="twind.config.js"
import { defineConfig } from '@twind/core'
import presetContainerQueries from '@twind/preset-container-queries'

export default defineConfig({
  presets: [presetContainerQueries()],
  /* config */
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind,npm/@twind/preset-container-queries"
    crossorigin
  ></script>
  <script>
    twind.install({
      presets: [twind.presetContainerQueries()],
      /* config */
    })
  </script>
</head>
```

</details>

**with [Twind CDN](./installation#twind-cdn)**

```html
<head>
  <script src="https://cdn.twind.style/container-queries" crossorigin></script>
  <script>
    twind.install({
      presets: [twind.presetContainerQueries()],
      /* config */
    })
  </script>
</head>
```

## 🙇 Usage

> Same as with [@tailwindcss/container-queries › Usage](https://github.com/tailwindlabs/tailwindcss-container-queries#usage)

## 🔧 Theme

A `containers` section is added to the theme with the same values as [@tailwindcss/container-queries › Configuration](https://github.com/tailwindlabs/tailwindcss-container-queries#configuration).
