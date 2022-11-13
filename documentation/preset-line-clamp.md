---
section: Presets
label: Line Clamp
package: '@twind/preset-line-clamp'
playground: true
excerpt: |
  A preset that provides utilities for visually truncating text after a fixed number of lines.
next: ./preset-tailwind.md
---

> **Note**
> Based on [@tailwindcss/line-clamp](https://github.com/tailwindlabs/tailwindcss-line-clamp).

## 🤝 Compatibility

| @twind/preset-line-clamp | @tailwindcss/line-clamp |
| ------------------------ | ----------------------- |
| `>=1.0.0-next.27 <1`     | `>=0.3 <0.5`            |

## 📦 Installation

**with [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind)**

Install from npm:

```sh
npm install twind@next @twind/preset-line-clamp@next
```

Add the preset to your twind config:

```js title="twind.config.js"
import { defineConfig } from 'twind'
import presetLineClamp from '@twind/preset-line-clamp'

export default defineConfig({
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
    twind.install({
      presets: [twind.presetLineClamp(/* options */)],
      /* config */
    })
  </script>
</head>
```

</details>

**with [Twind CDN](./installation#twind-cdn)**

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/@twind/cdn@next,npm/@twind/preset-line-clamp@next"
    crossorigin
  ></script>
  <script>
    twind.install({
      presets: [twind.presetLineClamp()],
      /* config */
    })
  </script>
</head>
```

## 🙇 Usage

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

## 🔧 Theme

A `lineClamp` section is added to the theme. Its values are used for looking up the value. If no value is found the given parameter is used.

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
