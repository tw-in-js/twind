---
'@example/basic': patch
'@example/playground': patch
'@example/sveltekit': patch
'@example/twind-cdn': patch
'@example/tailwind-forms': patch
'@twind/preset-autoprefix': patch
'@twind/preset-ext': patch
'@twind/preset-tailwind': patch
'@twind/preset-tailwind-forms': patch
'@twind/sveltekit': patch
'twind': patch
---

BREAKING: moved @twind/core and @twind/runtime into twind — this simplifies how we teach twind; API remains the same replace `@twind/core` with `twind`
