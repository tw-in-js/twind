# @twind/preset-ext

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

## Installation

Install from npm:

```sh
npm install @twind/preset-ext@next
```

Then add the preset to your twind config:

**with [twind](https://www.npmjs.com/package/twind)** — ready to use Tailwind CSS

```js
import { setup } from 'twind'
import presetExt from '@twind/preset-ext'

setup({
  presets: [presetExt()],
  // ... additional config
})
```

**with [twind/core](https://github.com/tw-in-js/twind/tree/next/packages/twind#twindcore)**

```js
import { setup } from 'twind/core'
import presetExt from '@twind/preset-ext'
import presetTailwindForms from '@twind/preset-tailwind-forms'

setup({
  presets: [presetExt()],
  // ... additional config
})
```

**with [Twind CDN](https://github.com/tw-in-js/twind/tree/next/packages/twind#twindcdn)**:

```html
<head>
  <!-- ... -->
  <script src="https://cdn.jsdelivr.net/npm/twind@next/cdn.global.js" crossorigin></script>
  <script src="https://cdn.jsdelivr.net/npm/@twind/preset-ext@next" crossorigin></script>
  <script>
    twind.setup({
      presets: [twind_presetExt()],
      // ...
    })
  </script>
  <!-- ... -->
</head>
```

## Usage

TBD: Look at the [source](./src/index.ts) for now.

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
