<div align="center">

<img src="https://twind.dev/assets/twind-logo-animated.svg" height="125" width="125" />
<a href="https://twind.dev" align="center"><h1>Twind</h1></a>

<p align="center">
The smallest, fastest, most feature complete Tailwind-in-JS solution in existence
</p>

</div>

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

Twind v1 is a complete rewrite aiming to be compatible with Tailwind v3 classes.

---

## Quickstart

See [twind](./packages/twind/README.md) for a quick intro.

## Notable Changes

- [@twind/core](./packages/core) — without any rules to have a clean start
  - `apply` and `css` as known from twind v0.16.
  - new `cx` function to create class names
    - grouped rules are ungrouped
- [@twind/preset-tailwind](./packages/preset-tailwind) — a tailwindcss v3 compatible preset
- [twind](./packages/twind) — shim-first implementation using [@twind/preset-tailwind](./packages/preset-tailwind) and [@twind/preset-autoprefixer](./packages/preset-autoprefixer)
  - `setup` can be called as many times as you want.
  - `tw`, `apply` and `theme` as known from twind v0.16.
- grouping syntax:
  - allow trailing dash before parentheses for utilities -> `border-(md:{2 black opacity-50 hover:dashed}}`
  - support comma-separated group values — this would prevent different classNames errors during hydration:
    - `hover:~(!text-(3xl,center),!underline,italic,focus:not-italic)`
- rules and shortcuts based on ideas from [UnoCSS](https://github.com/antfu/unocss)

  ```js
  // defineConfig is optional but helps with type inference
  defineConfig({
    rules: [
      // Some rules
      ['hidden', { display: 'none' }],

      // Table Layout
      // .table-auto { table-layout: auto }
      // .table-fixed { table-layout: fixed }
      ['table-(auto|fixed)', 'tableLayout'],

      // Some shortcuts
      {
        // single utility alias
        red: 'text-red-100',

        // shortcuts to multiple utilities
        btn: 'py-2 px-4 font-semibold rounded-lg shadow-md',
        'btn-green': 'text-white bg-green-500 hover:bg-green-700',

        // dynamic shortcut — could be a rule as well
        'btn-': ({ $$ }) => `bg-${$$}-400 text-${$$}-100 py-2 px-4 rounded-lg`,
      },
    ],
  })
  ```

  There are lot of things possible. See [preset-tailwind/rules](./packages/preset-tailwind/src/rules.ts) for more examples.

- ignorelist: can be used ignore certain rules

  This following example matches class names from common CSS-in-JS libraries:

  ```js
  defineConfig({
    // emotion: `css-`
    // styled-components: `sc-`and `-sc-
    // goober: `go1234567890`
    ignorelist: /^((css|sc)-|_|go\d)|-sc-/,
  })
  ```

- comments (single and multiline)
- inline shortcut: `~` to apply/merge utilities -> `~{text{5xl red-700} bg-red-100}`
- no more important suffix: `rule!` -> `!rule`
- styles (the generated CSS rules) are sorted predictably and stable — no matter in which order the rules are injected
- no implicit ordering within preflight
- the css helper supports `@label` for a more readable classname
- support [theme(...)](https://tailwindcss.com/docs/functions-and-directives#theme) in property and arbitrary values
- no more `@screen sm` -> use the [tailwindcss syntax](https://tailwindcss.com/docs/functions-and-directives#screen) `@media screen(sm)`
- [@apply](https://tailwindcss.com/docs/functions-and-directives#apply) finally works as expected
- full support for color functions: `primary: ({ opacityVariable, opacityValue }) => ...`
- strict tailwindcss v3 compatibility
  - no IE 11 fallbacks (color, box-shadow, ...)
  - no more `font-*` and `text-*` shortcuts
  - no `border-tr` but `border-[xytrbl]*` still exists
  - no `bg-origin-*`
- no more `@global` — you must use `&` for nested selectors (this follows the [CSS Nesting Module](https://tabatkins.github.io/specs/css-nesting/))
- new `@layer` directive following the [Cascade Layers (CSS @layer) spec](https://www.bram.us/2021/09/15/the-future-of-css-cascade-layers-css-at-layer/)

  The following layer exist in the given order: `defaults`, `preflight`, `base`, `components`, `shortcuts`, `utilities`, `css`, `overrides`

  ```js
  import { css } from '@twind/core'

  tw.inject(css`
    @layer base {
      h1 {
        @apply text-2xl;
      }
      h2 {
        @apply text-xl;
      }
      /* ... */
    }

    @layer components {
      .select2-dropdown {
        @apply rounded-b-lg shadow-md;
      }
      .select2-search {
        @apply border border-gray-300 rounded;
      }
      .select2-results__group {
        @apply text-lg font-bold text-gray-900;
      }
      /* ... */
    }
  `)
  ```

- drop IE 11 support

## ⚖️ License

The [MIT license](https://github.com/tw-in-js/twind/blob/main/LICENSE) governs your use of Twind.
