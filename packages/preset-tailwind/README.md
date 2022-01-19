# @twind/preset-tailwind

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

Twind v1 is a complete rewrite aiming to be compatible with Tailwind v3 classes.

---

## Installation

Install from npm:

```sh
npm install @twind/preset-tailwind@next
```

## Usage

**with [twind](https://www.npmjs.com/package/twind)** — ready to use Tailwind CSS

_Already included in `twind`_

**with [twind/core](https://github.com/tw-in-js/twind/tree/next/packages/twind#twindcore)**

```js
import { setup } from 'twind/core'
import presetTailwind from '@twind/preset-tailwind'

setup({
  presets: [presetTailwind(), presetTailwindForms()],
})
```

**with [Twind CDN](https://github.com/tw-in-js/twind/tree/next/packages/twind#twindcdn)**:

_Already included in `twind/cdn`_
