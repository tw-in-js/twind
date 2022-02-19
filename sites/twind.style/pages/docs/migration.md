---
title: Migration
next: ./comparison.md
---

TODO with file diffs

## from tailwindcss

## from twind v0.16

### Notable Changes

- [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind) does **not** include any core utilities — use one or more of the following presets:

  - [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix)
  - [@twind/preset-ext](hhttps://github.com/tw-in-js/twind/tree/next/packages/preset-ext)
  - [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind) to get a full Tailwind v3 experience
  - [@twind/preset-tailwind-forms](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind-forms) to get Tailwind v3 and Tailwind Forms.

- API
  - `setup` can be called as many times as you want.
  - classes are returned in order they are applied by the browser - last one wins
  - `tw` as known from twind v0.16; additional it can be used to access:
    - the theme: `tw.theme(...)`
    - the target sheet: `tw.target`
    - allows to reset twind (start clean): `tw.clear()`
    - allows to remove twind (remove the associated style element): `tw.destroy()`
  - `css` as known from twind v0.16
  - `apply` finally works — styles are generated in order they are declared
  - `shortcut` — styles are generated as defined by twind — same as if they where used alone
    - with support for creating named shortcuts: `` shortcut.PrimaryButton`bg-red-500 text-white`​ `` -> `PrimaryButton#<hash>`
  - new `cx` function to create class names
    - grouped rules are ungrouped
  - new `tx` function to create class names and inject styles — like using `tw(cx(...))`
  - `style` — stitches like component definitions
    - creates _readable_ class names like
      - `style#1hvn013 style--variant-gray#1hvn013 style--size-sm#1hvn013 style--outlined-@sm-true#1hvn013`
    - with label: `style({ label: 'button', ... })`
      - `button#p8xtwh button--color-orange#p8xtwh button--size-small#p8xtwh button--color-orange_outlined-true$0#p8xtwh`
- grouping syntax:
  - allow trailing dash before parentheses for utilities -> `border-(md:{2 black opacity-50 hover:dashed}}`
  - shortcuts: `~` to apply/merge utilities -> `~(text(5xl,red-700),bg-red-100)`
    - anonymous shortcuts: `~(!text-(3xl center) !underline italic focus:not-italic)`
      - support comma-separated shortcuts — this prevents different classNames errors during hydration:
        - `hover:~(!text-(3xl,center),!underline,italic,focus:not-italic)`
        - `cx()` converts space-separated to comma-separated
    - named shortcuts: `PrimaryButton~(bg-red-500 text-white)` -> `PrimaryButton#<hash>`
      - `shortcut()` is a helper to simplify creation of shortcuts (works like `apply()` in twind v0.16); it supports creating named shortcuts: `` shortcut.PrimaryButton`bg-red-500 text-white`​ `` -> `PrimaryButton#<hash>`
- config

  - presets are executed in order they are defined
  - presets can currently not contain other presets — a work-around may by to use `defineConfig()` within the preset (not tested)
  - `defineConfig() helper for typing
  - preset merging:

    - `preflight` — last one wins
    - `theme` and `theme.extend` are shallow merged — last one wins
    - `rules`, `variants`, and `ignorelist` — first one wins
    - `darkMode`, `hash` and `stringify` are overridden if defined by the preset — last one wins

  - user config merging

    - `preflight` — applied last
    - `theme` and `theme.extend` are shallow merged — applied last
    - `rules`, `variants`, and `ignorelist` — applied first
    - `darkMode`, `hash` and `stringify` are overridden if defined by the preset — applied first

  - darkMode can be selector string `{ darkMode: '.dark-mode &' }` or `{ darkMode: 'html[data-theme="dark"] &` }`

  - rules based on ideas from [UnoCSS](https://github.com/antfu/unocss)

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

        // Some aliases
        // shortcut to multiple utilities
        ['card', 'py-2 px-4 font-semibold rounded-lg shadow-md'],

        // dynamic shortcut
        ['card-', ({ $$ }) => `bg-${$$}-400 text-${$$}-100 py-2 px-4 rounded-lg`],

        // single utility alias — need to use `~(...)` as it would be otherwise recognized as a CSS property
        ['red', '~(text-red-100)'],

        // apply to multiple utilities
        ['btn-green', '@(bg-green-500 hover:bg-green-700 text-white)'],

        // dynamic apply
        ['btn-', ({ $$ }) => `@(bg-${$$}-400 text-${$$}-100 py-2 px-4 rounded-lg)`],
      ],
    })
    ```

    There are lots of things possible. See [preset-tailwind/rules](https://github.com/tw-in-js/twind/treee/next/packages/preset-tailwind/src/rules.ts) and [preset-ext/rules](https://github.com/tw-in-js/twind/treee/next/packages/preset-ext/src/rules.ts) for more examples.

  - ignorelist: can be used ignore certain rules

    This following example matches class names from common libraries:

    ```js
    defineConfig({
      // emotion: `css-`
      // stitches: `c-`
      // styled-components: `sc-`and `-sc-
      // svelte: `svelte-`
      // vanilla-extract: sprinkles_
      // goober: `go1234567890`
      // DO NOT IGNORE rules starting with `^[~#]`, `^css#`, or `^style[~#-]` — these may have been generated by `css()` or `style()`, or are hashed
      ignorelist: /^((css|s?c|svelte)-|(sprinkles)?_|go\d)|-sc-/,
    })
    ```

  - config [theme section function](https://tailwindcss.com/docs/theme#referencing-other-values) has a changed signature

    ```diff
    theme: {
      extend: {
    -  fill: (theme) => ({
    +  fill: ({ theme }) => ({
        gray: theme('colors.gray')
      })
      }
    }
    ```

  - no implicit ordering within preflight

- comments (single and multiline)
- no more important suffix: `rule!` -> `!rule`
- styles (the generated CSS rules) are sorted predictably and stable — no matter in which order the rules are injected
- support `label` for a more readable class names (https://emotion.sh/docs/labels)
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

  The following layer exist in the given order: `defaults`, `base`, `components`, `shortcuts`, `utilities`, `overrides`

  ```js
  import { injectGlobal } from 'twind'

  injectGlobal`
    /* rules with base are not sorted */
    h1 {
      @apply text-2xl;
    }
    h2 {
      @apply text-xl;
    }
    /* ... */
  
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
  `
  ```

- drop IE 11 support
