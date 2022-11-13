---
section: Configuration
title: Variants
excerpt: Variants allow to specify under what circumstances utilities will be activated.
next: ./preset-autoprefix.md
---

The `variants` option is an array of variant declarations. When twind encounters a variant that matches a variant declaration it will call the resolver function with the match and the current context.

Twind already includes some default variants:

- `dark` for dark mode
- screen variants based on the `screens` theme section
- all [simple pseudo classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) like `:hover`

## Static Variants

Static variants are mapping a variant name to a [selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) or [at-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule).

```js
variants: [
  ['print', '@media print'],
  ['odd', '&:nth-child(odd)'],
  ['open', '&[open]'],
]
```

## Dynamic Variants

Dynamic Variants allow to create variants based on the current match and context. The next example create a `ltr`/`rtl` variant:

```js
variants: [
  ['(ltr|rtl)', ({ 1: $1 }) => `[dir="${$1}"] &`],
],
```

## Further Reading

There are some more options and helpers available to create variants. You can find more examples in the official presets:

- [@twind/preset-ext/src/variants.ts](https://github.com/tw-in-js/twind/blob/next/packages/preset-ext/src/variants.ts)
- [@twind/preset-tailwind/src/variants.ts](https://github.com/tw-in-js/twind/blob/next/packages/preset-tailwind/src/variants.ts)
