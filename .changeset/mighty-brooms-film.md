---
'@twind/website': patch
'@example/basic': patch
'@example/playground': patch
'@example/using-tailwind-forms': patch
'@example/using-twind-cdn': patch
'@example/with-gatsby': patch
'@example/with-next': patch
'@example/with-remix': patch
'@example/with-sveltekit': patch
'@twind/cdn': patch
'gatsby-plugin-twind': patch
'@twind/preset-autoprefix': patch
'@twind/preset-ext': patch
'@twind/preset-line-clamp': patch
'@twind/preset-tailwind': patch
'@twind/preset-tailwind-forms': patch
'@twind/tailwind': patch
'twind': patch
'@twind/with-next': patch
'@twind/with-remix': patch
'@twind/with-sveltekit': patch
---

DEPRECATE: @twind/tailwind — use @twind/preset-autoprefix and @twind/preset-tailwind directly

Adjust your `package.json`:

```diff
{
  "dependencies": {
+    "@twind/preset-autoprefix": "1.0.0-next.34",
+    "@twind/preset-tailwind": "1.0.0-next.34",
-    "@twind/tailwind": "1.0.0-next.34",
  }
}
```

If you are using `defineConfig` from `@twind/tailwind`:

```diff
-import { defineConfig } from '@twind/tailwind'
+import { defineConfig } from 'twind'
+import presetAutoprefix from '@twind/preset-autoprefix'
+import presetTailwind from '@twind/preset-tailwind'

export default defineConfig({
+  presets: [presetAutoprefix(), presetTailwind()],
  /* config */
})
```

If you are using `setup` from `@twind/tailwind`:

```diff
-import { setup } from '@twind/tailwind'
+import { setup } from 'twind'
+import presetAutoprefix from '@twind/preset-autoprefix'
+import presetTailwind from '@twind/preset-tailwind'

export default setup({
+  presets: [presetAutoprefix(), presetTailwind()],
  /* config */
})
```
