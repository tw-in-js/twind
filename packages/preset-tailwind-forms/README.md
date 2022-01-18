# @twind/preset-tailwind-forms

A [Twind](https://twind.dev) preset that provides a basic reset for form styles that makes form elements easy to override with utilities.

> Based on [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms).

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

Twind v1 is a complete rewrite aiming to be compatible with Tailwind v3 classes.

---

## Installation

Install from npm:

```sh
# Using npm
npm install @twind/preset-tailwind-forms@next

# Using Yarn
yarn add @twind/preset-tailwind-forms@next
```

Then add the preset to your twind config:

**with [twind](https://www.npmjs.com/package/twind)** — ready to use tailwindcss

```js
import { setup } from 'twind'
import presetTailwindForm from '@twind/preset-tailwind-forms'

setup({
  presets: [presetTailwindForms()],
  // ... additional config
})
```

or using the Twind CDN:

```html
<head>
  <!-- ... -->
  <script src="https://cdn.jsdelivr.net/npm/twind@next/cdn.global.js" crossorigin></script>
  <script src="https://cdn.jsdelivr.net/npm/@twind/preset-tailwind-forms@next" crossorigin></script>
  <script>
    twind.setup({
      presets: [twind_presetTailwindForms()],
      // ...
    })
  </script>
  <!-- ... -->
</head>
```

**with [@twind/core](https://www.npmjs.com/package/@twind/core)**

```js
import { twind, cssom, observe } from '@twind/core'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'

const tw = observe(
  twind(
    {
      presets: [presetTailwind(), presetTailwindForms()],
      // ... additional config
    },
    cssom(),
  ),
)
```

## Usage

> Same as with [tailwindcss-forms › Basic Usage](https://github.com/tailwindlabs/tailwindcss-forms#basic-usage)

All of the basic form elements you use will now have some simple default styles that are easy to override with utilities.

### Using classes instead of element selectors

> Same as with [tailwindcss-forms › Using classes instead of element selectors](https://github.com/tailwindlabs/tailwindcss-forms#using-classes-instead-of-element-selectors)

Although we recommend thinking of this plugin as a "form reset" rather than a collection of form component styles, in some cases our default approach may be too heavy-handed, especially when integrating this plugin into existing projects.

For situations where the default strategy doesn't work well with your project, you can use the `class` strategy to make all form styling _opt-in_ instead of applied globally:

```js
setup({
  presets: [presetTailwind(), presetTailwindForms({ strategy: 'class' })],
  // ... additional config
})
```
