[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev/docs/modules/twind_colors.html)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc%2Fcolors?icon=github&label)](https://github.com/tw-in-js/twind/tree/main/src/colors)
[![Module Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/twind/colors/colors.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/colors/colors.js 'brotli module size')
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/colors/colors.d.ts)

`twind/colors` exposes all [Taiwlind v2 colors](https://tailwindcss.com/docs/customizing-colors#color-palette-reference) as named exports.

```js
import * as colors from 'twind/colors'

setup({
  theme: {
    colors: {
      // Build your palette here
      gray: colors.trueGray,
      red: colors.red,
      blue: colors.lightBlue,
      yellow: colors.amber,
    },
  },
})
```

To extend the existing color palette use `theme.extend`:

```js
import * as colors from 'twind/colors'

setup({
  theme: {
    extend: {
      colors,
    },
  },
})
```
