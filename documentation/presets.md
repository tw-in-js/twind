---
section: Getting Started
title: Presets
excerpt: Presets group common configuration, like rules and variants, into a reusable package.
next: ./integrations.md
---

The [Twind package](./packages/twind) does not include any utilities — all utilities are provided via presets or user configuration.

The most common task of a preset is to add custom [rules](./rules) and [variants](./variants).

- [Rules](./rules) are responsible for generating CSS declarations for a given class name.
- [Variants](./variants) allow to specify under what circumstances utilities will be activated.

> **Tip**
> For the full [Tailwind CSS](https://tailwindcss.com) experience use [@twind/preset-tailwind](./preset-tailwind) or start with [Twind CDN](./installation#twind-cdn) a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn) that is 6 times smaller (104kb vs 17kB).

## Using Presets

Presets need to be installed and added to the `presets` option of the `twind` config.

```js title="twind.config.js"
import { defineConfig } from 'twind'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'

export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind()],
})
```

## Official Presets

All official presets are [available on npm](https://www.npmjs.com/search?q=keywords:twind-preset) with the prefix `@twind/preset-`.

- [@twind/preset-autoprefix](./preset-autoprefix) — provides a CSS vendor prefixer and property alias mapper
- [@twind/preset-ext](./preset-ext) — adds some commonly used rules and variants that are not part of Tailwind CSS
- [@twind/preset-line-clamp](./preset-line-clamp) - adds utilities for visually truncating text after a fixed number of lines
- [@twind/preset-tailwind](./preset-tailwind) — adds all Tailwind v3 classes
- [@twind/preset-tailwind-forms](./preset-tailwind-forms) — provides a basic reset for form styles
- [@twind/preset-typography](./preset-typography) — add beautiful typographic defaults

## Community Presets

> **Tip**
> To find community presets [search for the keyword `twind-preset`](https://www.npmjs.com/search?q=keywords:twind-preset) on npm.

## Create A New Preset

TODO: Add documentation for creating a new preset.

Here are some examples of how to write your own preset:

- [@twind/preset-ext/src/index.ts](https://github.com/tw-in-js/twind/blob/next/packages/preset-ext/src/index.ts)
- [@twind/preset-line-clamp/src/index.ts](https://github.com/tw-in-js/twind/blob/next/packages/preset-line-clamp/src/index.ts)
- [@twind/preset-tailwind/src/index.ts](https://github.com/tw-in-js/twind/blob/next/packages/preset-tailwind/src/index.ts)
- [@twind/preset-tailwind-forms/src/index.ts](https://github.com/tw-in-js/twind/blob/next/packages/preset-tailwind-forms/src/index.ts)
- [@twind/preset-typography/src/index.ts](https://github.com/tw-in-js/twind/blob/next/packages/preset-typography/src/index.ts)
