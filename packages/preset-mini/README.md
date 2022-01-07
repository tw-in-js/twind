# @twind/preset-mini

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

## Installation

Install from npm:

```sh
# Using npm
npm install @twind/preset-mini@next

# Using Yarn
yarn add @twind/preset-mini@next
```

## Usage

```js
import { defineConfig, twind, cssom, observe } from '@twind/core'
import mini from '@twind/preset-mini'

const config = defineConfig({
  presets: [mini()],
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
