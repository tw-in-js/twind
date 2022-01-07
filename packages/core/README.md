# @twind/core

Minimal implementation of a tailwind-compatible CSS-in-JS framework.

**This package does not contain any Tailwindcss rules. These are defined in [@twind/preset-tailwind](../preset-tailwind).**

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

## Installation

Install from npm:

```sh
# Using npm
npm install @twind/core@next

# Using Yarn
yarn add @twind/core@next
```

## Usage

```js
import { twind, cssom, observe } from '@twind/core'

const tw = observe(
  twind(
    {
      theme: {
        /* .. */
      },
      rules: [
        /* ... */
      ],
    },
    cssom(),
  ),
)
```
