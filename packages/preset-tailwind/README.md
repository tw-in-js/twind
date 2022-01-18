# @twind/preset-tailwind

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

Twind v1 is a complete rewrite aiming to be compatible with Tailwind v3 classes.

---

## Installation

Install from npm:

```sh
# Using npm
npm install @twind/preset-tailwind@next

# Using Yarn
yarn add @twind/preset-tailwind@next
```

## Usage

```js
import { twind, cssom, observe } from '@twind/core'
import presetTailwind from '@twind/preset-tailwind'

const tw = observe(
  twind(
    {
      presets: [presetTailwind()],
      theme: {
        colors: {
          primary: '#f00',
        },
      },
    },
    cssom(),
  ),
)
```
