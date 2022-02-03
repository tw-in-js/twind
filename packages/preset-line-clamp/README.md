# @twind/preset-line-clamp [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/preset-line-clamp/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/preset-line-clamp/v/next) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23preset-line-clamp?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/preset-line-clamp)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

A [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind) preset that provides utilities for visually truncating text after a fixed number of lines.

> Based on [@tailwindcss/line-clamp](https://github.com/tailwindlabs/tailwindcss-line-clamp).

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [Playground](https://github.com/tw-in-js/twind/tree/next/examples/playground)

## Installation

Install from npm:

```sh
npm install twind@next @twind/preset-line-clamp@next
```

## Installation

**with [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind)**

```js
import { setup } from 'twind/core'
import presetLineClamp from '@twind/preset-line-clamp'

setup({
  presets: [presetLineClamp(/* options */)],
  /* config */
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind@next,npm/@twind/preset-line-clamp@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      presets: [twind.presetLineClamp(/* options */)],
      /* config */
    })
  </script>
</head>
```

</details>

**with [@twind/tailwind](https://github.com/tw-in-js/twind/tree/next/packages/tailwind)** — ready to use Tailwind CSS

```js
import { setup } from '@twind/tailwind'
import presetLineClamp from '@twind/preset-line-clamp'

setup({
  presets: [presetLineClamp(/* options */)],
  /* config */
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind@next,npm/@twind/tailwind@next,npm/@twind/preset-line-clamp@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      presets: [twind.presetLineClamp(/* options */)],
      /* config */
    })
  </script>
</head>
```

</details>

**with [Twind CDN](https://github.com/tw-in-js/twind/tree/next/packages/cdn)** — a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn)

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/@twind/cdn@next,npm/@twind/preset-line-clamp@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      presets: [twind.presetLineClamp()],
      /* config */
    })
  </script>
</head>
```

## Usage

Use the `line-clamp-{n}` utilities to specify how many lines of text should be visible before truncating:

```html
<p class="line-clamp-3">
  Et molestiae hic earum repellat aliquid est doloribus delectus. Enim illum odio porro ut omnis
  dolor debitis natus. Voluptas possimus deserunt sit delectus est saepe nihil. Qui voluptate
  possimus et quia. Eligendi voluptas voluptas dolor cum. Rerum est quos quos id ut molestiae fugit.
</p>
```

To remove any line-clamping, use `line-clamp-none`:

```html
<p class="line-clamp-3 md:line-clamp-none">
  Et molestiae hic earum repellat aliquid est doloribus delectus. Enim illum odio porro ut omnis
  dolor debitis natus. Voluptas possimus deserunt sit delectus est saepe nihil. Qui voluptate
  possimus et quia. Eligendi voluptas voluptas dolor cum. Rerum est quos quos id ut molestiae fugit.
</p>
```

## Theming

A `lineClamp` section is added to the theme. Its values are used for looking up the value. If no value us found the given parameter is used.

```js
setup({
  theme: {
    lineClamp: {
      card: '5',
    },
  },
})

tw('line-clamp-card')
// => -webkit-line-clamp:5

// Not found in theme => use as is
tw('line-clamp-7')
// => -webkit-line-clamp:7
```
