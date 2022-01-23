---
'@twind/cdn': patch
'@twind/sveltekit': patch
'twind': patch
---

BREAKING: `tw` accepts only a single string argument (use `cx` for more feature) this reduces the bundle size for the shim mode by 0.25kb
