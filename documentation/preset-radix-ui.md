---
section: Presets
label: Radix UI
package: '@twind/preset-radix-ui'
playground: true
excerpt: |
  The [Radix UI](https://www.radix-ui.com/colors) [color scales](https://www.radix-ui.com/docs/colors/palette-composition/the-scales) as a twind preset with automatic dark colors.
next: ./preset-tailwind.md
---

## 🤝 Compatibility

| @twind/preset-tailwind | @radix-ui/colors |
| ---------------------- | ---------------- |
| `>=1.1.0 <1.2.0`       | `0.1.8`          |

## 📦 Installation

> **Important**
> This preset only includes the [color scales](https://www.radix-ui.com/docs/colors/palette-composition/the-scales) from [Radix UI › Colors](https://www.radix-ui.com/colors) and a dark color function to enable automatic dark colors. It does not include any rules or variants. Please read the [Usage](#-usage) guide for detailed instructions.

**with [@twind/core](./installation#local--bundler)**

Install from npm:

```sh
npm install @twind/core @twind/preset-radix-ui
```

Add the preset to your twind config:

```js title="twind.config.js"
import { defineConfig } from '@twind/core'
import presetRadixUi from '@twind/preset-radix-ui'

export default defineConfig({
  presets: [presetRadixUi()],
  /* config */
})
```

<details><summary>Usage with a script tag</summary>

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/@twind/core@1,npm/@twind/preset-radix-ui@1"
    crossorigin
  ></script>
  <script>
    twind.install({
      presets: [twind.presetRadixUi()],
      /* config */
    })
  </script>
</head>
```

</details>

**with [Twind CDN](./installation#twind-cdn)**

```html
<head>
  <script src="https://cdn.twind.style/radix-ui" crossorigin></script>
  <script>
    twind.install({
      presets: [twind.presetRadixUi()],
      /* config */
    })
  </script>
</head>
```

## 🙇 Usage

This preset does not include any rules or variants but it includes all [colors](https://www.radix-ui.com/docs/colors/palette-composition/the-scales). To reduce the package size it is advised to select only the colors you'll need. Please refer to [Radix UI › Colors › Composing a color palette](https://www.radix-ui.com/docs/colors/palette-composition/composing-a-palette) for a guide how to compose a color palette and [Radix UI › Colors › Understanding the scale](https://www.radix-ui.com/docs/colors/palette-composition/understanding-the-scale) to learn which scale step is the most appropriate for each use case.

### With @twind/preset-tailwind

The following example shows how to use the colors with [@twind/preset-tailwind](./preset-tailwind) using [semantic color names](https://www.radix-ui.com/docs/colors/palette-composition/composing-a-palette#choosing-semantic-scales) with automatic dark colors.

```js title="twind.config.js"
import { defineConfig } from '@twind/core'
import presetAutoprefix from '@twind/preset-autoprefix'
// Using @twind/preset-tailwind/base to exclude the default tailwind colors
import presetTailwind from '@twind/preset-tailwind/base'

// Following https://www.radix-ui.com/docs/colors/palette-composition/composing-a-palette
// This color palette is used on this site
import {
  sky as brand,
  skyDark as brandDark,
  plum as accent,
  plumDark as accentDark,
  slate as neutral,
  slateDark as neutralDark,

  // Error: Red/Tomato/Crimson
  tomato as error,
  tomatoDark as errorDark,

  // Success: Teal/Green/Grass/Mint
  green as success,
  greenDark as successDark,

  // Warning: Yellow/Amber
  amber as warning,
  amberDark as warningDark,

  // Info: Blue/Sky/Cyan
  cyan as info,
  cyanDark as infoDark,
} from '@twind/preset-radix-ui/colors'

// Optional: enable automatic dark colors
import darkColor from '@twind/preset-radix-ui/darkColor'

export default defineConfig({
  presets: [
    presetAutoprefix(),
    presetTailwind({
      colors: {
        brand,
        brandDark,
        accent,
        accentDark,
        neutral,
        neutralDark,

        // Error: Red/Tomato/Crimson
        error,
        errorDark,

        // Success: Teal/Green/Grass/Mint
        success,
        successDark,

        // Warning: Yellow/Amber
        warning,
        warningDark,

        // Info: Blue/Sky/Cyan
        info,
        infoDark,
      },
    }),
  ],
  // auto dark colors
  darkColor,
})
```

> **Hint**
> Radix UI uses a different [color scale](https://www.radix-ui.com/docs/colors/palette-composition/understanding-the-scale) that tailwindcss. There are 12 steps in each scale. Each step was designed for at least one specific use case.

```html
<main class="bg-brand-1 text-brand-11"></main>
```

### With @twind/preset-typography

The following example shows how to use the colors with [@twind/preset-typography](./preset-typography).

```js title="twind.config.js"
import { defineConfig } from '@twind/core'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind/base'
import presetTypography from '@twind/preset-typography'

// Import other colors as needed
import { sky as brand, skyDark as brandDark } from '@twind/preset-radix-ui/colors'

// Use automatic dark colors
import darkColor from '@twind/preset-radix-ui/darkColor'

export default defineConfig({
  presets: [
    presetAutoprefix(),
    presetTailwind({ colors: { brand, brandDark /* define other colors as needed */ } }),
    presetTypography({
      // The color to use when `prose` without a color is used
      defaultColor: 'brand',
      colors: {
        body: '11',
        headings: '12',
        lead: '11',
        links: '12',
        bold: '12',
        counters: '7',
        bullets: '6',
        hr: '6',
        quotes: '12',
        'quote-borders': '6',
        captions: '11',
        code: '11',
        'pre-code': '11',
        'pre-bg': '3',
        'th-borders': '7',
        'td-borders': '6',
        // invert colors (dark mode) — default to auto dark color
        dark: null,
      },
    }),
  ],
  darkColor,
})
```
