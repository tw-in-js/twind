# @twind/preset-autoprefix

Vendor prefixer and property alias mapper for Twind.

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

## Installation

Install from npm:

```sh
# Using npm
npm install @twind/preset-autoprefix@next

# Using Yarn
yarn add @twind/preset-autoprefix@next
```

## Usage

```js
import { twind, cssom, observe } from '@twind/core'
import autoprefix from '@twind/preset-autoprefix'

const tw = observe(
  twind(
    {
      presets: [autoprefix()],
    },
    cssom(),
  ),
)
```
