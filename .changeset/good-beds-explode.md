---
'twind': patch
---

feat: auto dark colors

If enabled, automatic dark colors are generated for each light color (eg no `dark:` variant is present). This feature is opt-in and twind provides a builtin function that works with [tailwind color palettes](https://tailwindcss.com/docs/customizing-colors) (`50`, `100`, `200`, ..., `800`, `900`).

```ts
import { autoDarkColor } from 'twind'

defineConfig({
  // for tailwind color palettes: 50 -> 900, 100 -> 800, ..., 800 -> 100, 900 -> 50
  darkColor: autoDarkColor,
  // other possible implementations
  darkColor: (section, key, { theme }) => theme(`${section}.${key}-dark`) as ColorValue,
  darkColor: (section, key, { theme }) => theme(`dark.${section}.${key}`) as ColorValue,
  darkColor: (section, key, { theme }) => theme(`${section}.dark.${key}`) as ColorValue,
  darkColor: (section, key, context, lightColor) => generateDarkColor(lightColor),
})
```

Example css for `text-gray-900`:

```css
.text-gray-900 {
  --tw-text-opacity: 1;
  color: rgba(15, 23, 42, var(--tw-text-opacity));
}
@media (prefers-color-scheme: dark) {
  .text-gray-900 {
    --tw-text-opacity: 1;
    color: rgba(248, 250, 252, var(--tw-text-opacity));
  }
}
```

The auto-generated dark color can be overridden by the usual `dark:...` variant: `text-gray-900 dark:text-gray-100`.

```css
.text-gray-900 {
  --tw-text-opacity: 1;
  color: rgba(15, 23, 42, var(--tw-text-opacity));
}
@media (prefers-color-scheme: dark) {
  .text-gray-900 {
    --tw-text-opacity: 1;
    color: rgba(248, 250, 252, var(--tw-text-opacity));
  }
}
@media (prefers-color-scheme: dark) {
  .dark\\:text-gray-100 {
    --tw-text-opacity: 1;
    color: rgba(241, 245, 249, var(--tw-text-opacity));
  }
}
```
