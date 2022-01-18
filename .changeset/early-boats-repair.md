---
'@twind/core': patch
'@twind/preset-autoprefix': patch
'@twind/preset-ext': patch
'@twind/preset-tailwind': patch
'twind': patch
---

BREAKING(preset authors): removed `preset()` helper to simplify config merging — What needs to change? instead calling preset, return your preset
