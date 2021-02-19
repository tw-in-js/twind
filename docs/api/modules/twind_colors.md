# Module: twind/colors

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

## Variables

### amber

• `Const` **amber**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:196](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L196)

___

### black

• `Const` **black**: *#000*= '#000'

Defined in: [src/colors/index.ts:11](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L11)

___

### blue

• `Const` **blue**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:92](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L92)

___

### blueGray

• `Const` **blueGray**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:287](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L287)

___

### coolGray

• `Const` **coolGray**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:274](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L274)

___

### cyan

• `Const` **cyan**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:118](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L118)

___

### emerald

• `Const` **emerald**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:144](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L144)

___

### fuchsia

• `Const` **fuchsia**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:40](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L40)

___

### gray

• `Const` **gray**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:261](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L261)

___

### green

• `Const` **green**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:157](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L157)

___

### indigo

• `Const` **indigo**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:79](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L79)

___

### lightBlue

• `Const` **lightBlue**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:105](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L105)

___

### lime

• `Const` **lime**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:170](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L170)

___

### orange

• `Const` **orange**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:209](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L209)

___

### pink

• `Const` **pink**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:27](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L27)

___

### purple

• `Const` **purple**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:53](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L53)

___

### red

• `Const` **red**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:222](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L222)

___

### rose

• `Const` **rose**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:14](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L14)

___

### teal

• `Const` **teal**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:131](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L131)

___

### trueGray

• `Const` **trueGray**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:248](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L248)

___

### violet

• `Const` **violet**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:66](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L66)

___

### warmGray

• `Const` **warmGray**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:235](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L235)

___

### white

• `Const` **white**: *#fff*= '#fff'

Defined in: [src/colors/index.ts:12](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L12)

___

### yellow

• `Const` **yellow**: [*ThemeColor*](twind.md#themecolor)

Defined in: [src/colors/index.ts:183](https://github.com/gojutin/twind/blob/8f04bb3/src/colors/index.ts#L183)
