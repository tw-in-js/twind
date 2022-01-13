---
'@twind/core': patch
'@twind/preset-mini': patch
'@twind/preset-tailwind': patch
'@twind/runtime': patch
'twind': patch
---

BREAKING: a twind instance is now callable `tw('...')` instead of `tw.inject('...')`
