---
title: Comparison
next: ./usage.md
---

## tailwindcss

CDN: 96.4kB (brotli) vs 17.6kB (brotli) -> almost 5.5 times smaller (5.47)

- no implicit ordering of utilities: https://play.tailwindcss.com/EsRtpBotox
  - if two utilities use the same CSS property, the one used first anywhere in the document will be used
  - twind ensures that the order of the utilities is always predictable, no matter which one is used first
- darkMode: custom selectors like `.dark-mode` or `[theme=dark]`
- auto dark colors

## twind v0.x

### New Features

- simplified API
  - helpers return strings that can be used as-is — no need to pass through `tw`
- hot module reloading (HMR) support
- working `apply` — and new `shortcut`s
- theme:
  - dotted deep access: `colors.gray.500` or `spacing[2.5]`

## twind.macro

## Windy CSS

## UnoCSS

## Stitches
