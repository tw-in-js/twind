---
title: Tailwind
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: A guide on how to migrate your Tailwind app to Twind
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

### Start with the Shim

The easiest way to migrate your existing Tailwind app to Twind is by using [the Shim](#link-to-shim).

The Shim will automagically convert all of your Tailwind classes to Twind, and even pick up on your custom Tailwind theme configuration simply by importing the shim into your project:

```js
import twind/shim
```

Example: `class="text-blue-500 font-bold"` becomes `` class=`${tw`text-blue-500 font-bold"`} ``

While the shim is a good starting point, it is recommended that you eventually move your project away from using the shim. In order to do so, you will need to do a few things:

### Migrate your Tailwind theme configuration

If your Tailwind project uses a custom theme configuration (`tailwind.config.js`), you will want to move things like your custom colors to your Twind configuration using the `setup` function. The `setup` function accepts a configuration object that looks very similiar to a Tailwind config with a few differences.

Here is a example of a Tailwind configuration file and it's Twind equivalent:

Tailwind

```js
const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    colors: {
      gray: colors.coolGray,
      blue: colors.lightBlue,
      red: colors.rose,
      pink: colors.fuchsia,
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  variants: {
    extend: {
      borderColor: ['focus-visible'],
      opacity: ['disabled'],
    },
  },
}
```

Twind

```js
import { setup } from 'twind'
import * as colors from 'twind/colors'

setup({
  theme: {
    colors: {
      gray: colors.coolGray,
      blue: colors.lightBlue,
      red: colors.rose,
      pink: colors.fuchsia,
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  // There is no need to include the variants section Twind supports all variants plus more with no additional configuration required
})
```

[Check out the docs](https://twind.dev/docs/handbook/advanced/setup.html) on the `setup` function for more configuration options like preflight, dark mode, and hashing.

### Wrap your classes in `tw` calls

Example: `class="text-blue-500 font-bold"` becomes `` class=`${tw`text-blue-500 font-bold"`} ``

### Move away from PostCSS

Your project might be using a custom PostCSS configuration if you are either:

- using an older version of Tailwind
- Using PostCSS plugins like purge or autoprefixer

Once you've converted all your existing Tailwind to Twind, you can remove all things PostCSS. Seriously, you don't need PostCSS or any PostCSS plugins with Twind. Since styles are generated at runtime, there is nothing to purge and Twind takes care of autoprefixing.
