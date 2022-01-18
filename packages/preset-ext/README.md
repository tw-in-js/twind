# @twind/preset-ext

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

## Installation

Install from npm:

```sh
# Using npm
npm install @twind/preset-ext@next

# Using Yarn
yarn add @twind/preset-ext@next
```

## Usage

```js
import { defineConfig, twind, cssom, observe } from '@twind/core'
import presetExt from '@twind/preset-ext'

const config = defineConfig({
  presets: [presetExt()],
})

const tw = observe(twind(config, cssom()))
```

> Documentation missing: Look at the [source](./src/index.ts) for now.

## Short CSS

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
