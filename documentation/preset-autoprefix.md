---
section: Presets
label: Autoprefix
package: '@twind/preset-autoprefix'
excerpt: |
  CSS vendor prefixer and property alias mapper preset.
next: ./preset-ext.md
---

## 📦 Installation

**with [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind)**

Install from npm:

```sh
npm install twind@next @twind/preset-autoprefix@next
```

Add the preset to your twind config:

```js title="twind.config.js"
import { defineConfig } from 'twind'
import presetAutoprefix from '@twind/preset-autoprefix'

export default defineConfig({
  presets: [presetAutoprefix()],
  /* config */
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind@next,npm/@twind/preset-autoprefix@next"
    crossorigin
  ></script>
  <script>
    twind.install({
      presets: [twind.presetAutoprefix()],
      /* config */
    })
  </script>
</head>
```

</details>

**with [Twind CDN](./installation#twind-cdn)**

_Already included in `@twind/cdn`_
