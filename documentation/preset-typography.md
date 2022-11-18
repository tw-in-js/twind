---
section: Presets
label: Typography
package: '@twind/preset-typography'
playground: true
excerpt: Provides a set of `prose` classes you can use to add beautiful typographic defaults to any vanilla HTML you don't control, like HTML rendered from Markdown, or pulled from a CMS.
next: ./with-gatsby.md
---

> **Note**
> Based on [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography).

## 🤝 Compatibility

| @twind/preset-typography         | @tailwindcss/typography |
| -------------------------------- | ----------------------- |
| `>=1.0.0-next.40 <1`             | `>=0.5.3 <0.6`          |
| `>=1.0.0-next.27 <1.0.0-next.40` | `>=0.4 <0.5.3`          |

## 📦 Installation

**with [twind](https://github.com/tw-in-js/twind/tree/main/packages/twind)**

Install from npm:

```sh
npm install twind @twind/preset-tailwind @twind/preset-typography
```

Add the preset to your twind config:

```js title="twind.config.js"
import { defineConfig } from 'twind'
import presetTailwind from '@twind/preset-tailwind'
import presetTypography from '@twind/preset-typography'

setup({
  presets: [presetTailwind(/* options */), presetTypography(/* options */)],
  /* config */
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind,npm/@twind/preset-typography"
    crossorigin
  ></script>
  <script>
    twind.install({
      presets: [twind.presetTypography(/* options */)],
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
    src="https://cdn.jsdelivr.net/combine/npm/@twind/cdn,npm/@twind/preset-typography"
    crossorigin
  ></script>
  <script>
    twind.install({
      presets: [twind.presetTypography(/* options */)],
      /* config */
    })
  </script>
</head>
```

## 🙇 Usage

Most features of the [Tailwind CSS › typography-plugin](https://tailwindcss.com/docs/typography-plugin) are implemented in the same way.

### Differences

- _Adding custom color themes_: every color from `theme.colors` is available via `prose-<color>`; the default color `gray` can be changed via `presetTypography({ defaultColor: '...'})`
- _Customizing the CSS_: can be done using `presetTypography({ extend: { /* CSS object */ } })`
