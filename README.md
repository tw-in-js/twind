<div align="center">

<img src="https://twind.dev/assets/twind-logo-animated.svg" height="125" width="125" />
<a href="https://twind.dev" align="center"><h1>Twind</h1></a>

<p align="center">
The smallest, fastest, most feature complete Tailwind-in-JS solution in existence
</p>

</div>

---

[![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE)
[![Latest Release](https://flat.badgen.net/npm/v/twind/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/twind)
[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind?icon=github&label)](https://github.com/tw-in-js/twind/tree/next)
[![Discord](https://img.shields.io/discord/798324011980423188?label=chat&logo=discord)](https://discord.com/invite/2aP5NkszvD)
[![CI](https://github.com/tw-in-js/twind/actions/workflows/ci.yml/badge.svg?branch=next)](https://github.com/tw-in-js/twind/actions/workflows/ci.yml)
[![Coverage Status](https://flat.badgen.net/coveralls/c/github/tw-in-js/twind/next?icon=codecov&label&cache=10800)](https://coveralls.io/github/tw-in-js/twind?branch=next)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

Twind is a small compiler that converts utility-classes into actual CSS rules without any build step right in the browser or any other environment like Node.js, deno, workers, ...

If you have used Tailwind or other CSS-in-JS solutions, then most of the API should feel very familiar.

## 🚀 Features

**⚡️ No build step**

Get all the benefits of Tailwind without the need for Tailwind, PostCSS, configuration, purging, or autoprefixing.

**🚀 Framework agnostic**

If your app uses HTML and JavaScript, it should work with Twind. This goes for server-rendered apps too.

**😎 One low fixed cost**

Twind ships the compiler, not the CSS. This means unlimited styles and variants for one low fixed cost.

Other features include:

- 🌎 No bundler required: Usable via CDN
- 🎨 Seamless integration with Tailwind
- 🤝 Feature parity with Tailwind v3
- ✈️ Tailwind preflight by default
- 🎯 Extended variants, rules, and syntax
- 🚓 Escape hatch for arbitrary CSS
- 🤖 Built in support for conditional rule combining
- 🧐 Improved readability with multiline styles and comments
- ❄️ Optional hashing of class names ensuring no conflicts
- 🔩 Flexible: configurable theme, rules and variants
- 🔌 Language extension via presets
- 🎩 No runtime overhead with static extraction
- 🚅 Faster than most CSS-in-JS libraries
- ⚡ Fully tree shakeable: Only take what you want
- 🦾 Type Strong: Written in Typescript
- and more!

## 🦄 Quickstart

[twind](https://www.npmjs.com/package/twind) does **not** include any core utilities — use one of the existing presets:

- [@twind/preset-autoprefix](https://www.npmjs.com/package/@twind/preset-autoprefix)
- [@twind/preset-tailwind](https://www.npmjs.com/package/@twind/preset-tailwind) to get a full Tailwind v3 experience
- [@twind/preset-tailwind-forms](https://www.npmjs.com/package/@twind/preset-tailwind-forms) to get Tailwind v3 and Tailwind Forms.
- [@twind/preset-ext](https://www.npmjs.com/package/@twind/preset-ext)

For the full [Tailwind CSS](https://tailwindcss.com) experience try [@twind/tailwind](https://www.npmjs.com/package/@twind/tailwind) or start with [Twind CDN](https://www.npmjs.com/package/@twind/cdn) a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn) that is almost 6 times smaller (96.4kb vs 16.9kB).

We have created a few [examples](https://github.com/tw-in-js/twind/tree/next/examples) to get you started:

| Example                                                                               | Try it live at                                                                                                                                                                            | Description                                                                                                                                                          |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Basic](https://github.com/tw-in-js/twind/tree/next/examples/basic)                   | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/basic) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/basic)                   | with [@twind/tailwind](https://www.npmjs.com/package/@twind/tailwind)                                                                                                |
| [Playground](https://github.com/tw-in-js/twind/tree/next/examples/playground)         | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/playground) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/playground)         | all presets enabled                                                                                                                                                  |
| [SvelteKit](https://github.com/tw-in-js/twind/tree/next/examples/sveltekit)           | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/sveltekit) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/sveltekit)           | for [SvelteKit](https://kit.svelte.dev) with [@twind/tailwind](https://www.npmjs.com/package/@twind/tailwind)                                                        |
| [Tailwind Forms](https://github.com/tw-in-js/twind/tree/next/examples/tailwind-forms) | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/tailwind-forms) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/tailwind-forms) | with [@twind/tailwind](https://www.npmjs.com/package/@twind/tailwind) and [@twind/preset-tailwind-forms](https://www.npmjs.com/package/@twind/preset-tailwind-forms) |
| [Twind CDN](https://github.com/tw-in-js/twind/tree/next/examples/twind-cdn)           | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/twind-cdn) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/twind-cdn)           | with [@twind/cdn](https://www.npmjs.com/package/@twind/cdn)                                                                                                          |

## Notable Changes

- [twind](./packages/twind) — shim-first implementation without any presets to have a clean start
- [@twind/tailwind](./packages/tailwind) — shim-first implementation using [@twind/preset-tailwind](./packages/preset-tailwind) and [@twind/preset-autoprefixer](./packages/preset-autoprefixer)
- API
  - `setup` can be called as many times as you want.
  - classes are returned in order they are applied by the browser - last one wins
  - `tw` as known from twind v0.16; additional it can be used to access:
    - the theme: `tw.theme(...)`
    - the target sheet: `tw.target`
    - allows to reset twind (start clean): `tw.clear()`
    - allows to remove twind (remove the associated style element): `tw.destroy()`
  - `shortcut` (previously known as `apply`) and `css` as known from twind v0.16.
    - with support for creating named shortcuts: `shortcut.PrimaryButton\`bg-red-500 text-white\``->`PrimaryButton#<hash>`
  - new `cx` function to create class names
    - grouped rules are ungrouped
  - `style` — stitches like component definitions
    - creates _readable_ class names like
      - `style#1hvn013 style--variant-gray#1hvn013 style--size-sm#1hvn013 style--outlined-@sm-true#1hvn013`
    - with label: `style({ label: 'button', ... })`
      - `button#p8xtwh button--color-orange#p8xtwh button--size-small#p8xtwh button--color-orange_outlined-true$0#p8xtwh`
- grouping syntax:
  - allow trailing dash before parentheses for utilities -> `border-(md:{2 black opacity-50 hover:dashed}}`
  - shortcuts: `~` to apply/merge utilities -> `~(text(5xl,red-700),bg-red-100)`
    - anonymous shortcuts: `~(!text-(3xl center) !underline italic focus:not-italic)`
      - support comma-separated shortcuts — this would prevent different classNames errors during hydration:
        - `hover:~(!text-(3xl,center),!underline,italic,focus:not-italic)`
        - `cx()` converts these to comma-separated group
    - named shortcuts: `PrimaryButton~(bg-red-500 text-white)` -> `PrimaryButton#<hash>`
      - `shortcut()` is an helper to simplify creation of shortcuts (works like `apply()` in twind v0.16); it supports creating named shortcuts: `shortcut.PrimaryButton\`bg-red-500 text-white\``->`PrimaryButton#<hash>`
- config

  - presets are executed in order they are defined
  - presets can currently not contain other presets — a work-around may by to use `defineConfig()` within the preset (not tested)
  - `defineConfig() helper for typing
  - preset merging:

    - `preflight` — last one wins
    - `theme` and `theme.extend` are shallow merged — last one wins
    - `rules`, `variants`, and `ignorelist` — first one wins
    - `hash` and `stringify` are overridden if defined by the preset — last one wins

  - user config merging

    - `preflight` — applied last
    - `theme` and `theme.extend` are shallow merged — applied last
    - `rules`, `variants`, and `ignorelist` — applied first
    - `hash` and `stringify` are overridden if defined by the preset — applied first

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

    There are lots of things possible. See [preset-tailwind/rules](./packages/preset-tailwind/src/rules.ts) and [preset-ext/rules](./packages/preset-ext/src/rules.ts) for more examples.

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
    -  fill: (theme) => ({
    +  fill: ({ theme }) => ({
        gray: theme('colors.gray')
      })
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
  import { css } from 'twind'

  element.className = css`
    /* rules with base are not sorted */
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
  `
  ```

- drop IE 11 support

## TODO

- `const acx = cx'aaa~(text-blue-500)'` works, but `const bcx = 'bbb~(text-red-500 ${acx})'` not
- support `is(:hover,:focus-visible):underline`?
- style: should it pass `class` and `className` through? alternatives: string concat, `cx`
- console.warn(`[twind] unknown rule "${value}"`)
- ci: post on discord after release
- @twind/tailwind: parse style elements like tailwind?
- cdn.twind.dev -> https://cdn.jsdelivr.net/npm/twind@next/cdn.global.js
- docs: remix run, wmr, astro, next??? — must be react based for codehike
- docs: explain and examples of both modes (observe/shim vs library)
- docs: common patterns
- auto support dark mode in theme helpers (`<section>.dark.<key>` or `dark.<section>.<key>`)
- @twind/preset-\* from tailwind core
- @twind/react
- @twind/completions — provide autocompletion for classNames
- a package to make it easy to create lightweight versions of presets (like https://lodash.com/custom-builds)
- postcss plugin like tailwindcss for SSR

  ```css
  @twind;
  ```

## 🧱 Contribute

See the [Contributing Guide](./CONTRIBUTING.md)

## 💡 Inspiration

It would be untrue to suggest that the design here is totally original. Other than the founders' initial attempts at implementing such a module ([oceanwind](https://github.com/lukejacksonn/oceanwind) and [beamwind](https://github.com/kenoxa/beamwind)) we are truly standing on the shoulders of giants.

- [Tailwind](https://tailwindcss.com/): created a wonderfully thought out API on which the compiler's grammar was defined.
- [styled-components](https://styled-components.com/): implemented and popularized the advantages of doing CSS-in-JS.
- [htm](https://github.com/developit/htm): a JSX compiler that proved there is merit in doing runtime compilation of DSLs like JSX.
- [goober](https://github.com/cristianbote/goober): an impossibly small yet efficient CSS-in-JS implementation that defines critical module features.
- [otion](https://github.com/kripod/otion): the first CSS-in-JS solution specifically oriented around handling CSS in an atomic fashion.
- [clsx](https://github.com/lukeed/clsx): a tiny utility for constructing class name strings conditionally.
- [style-vendorizer](https://github.com/kripod/style-vendorizer): essential CSS prefixing helpers in less than 1KB of JavaScript.
- [UnoCSS](https://github.com/antfu/unocss): for the configuration syntax.
- [CSSType](https://github.com/frenic/csstype): providing autocompletion and type checking for CSS properties and values.

## 🌸 Credits

### 🤝 Contributors

Thank you to all the people who have already contributed to twind!

<a href="https://github.com/tw-in-js/twind/graphs/contributors"><img src="https://opencollective.com/twind/contributors.svg?width=890" /></a>

### 🙏🏾 Sponsors

Thank you to all our sponsors! (please ask your company to also support this open source project by [becoming a sponsor](https://opencollective.com/twind#sponsor))

<a href="https://www.kenoxa.com" target="_blank"><img src="https://images.opencollective.com/kenoxa/9c25796/logo/68.png"></a>
<a href="https://opencollective.com/twind/sponsor/0/website" target="_blank"><img src="https://opencollective.com/twind/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/twind/sponsor/1/website" target="_blank"><img src="https://opencollective.com/twind/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/twind/sponsor/2/website" target="_blank"><img src="https://opencollective.com/twind/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/twind/sponsor/3/website" target="_blank"><img src="https://opencollective.com/twind/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/twind/sponsor/4/website" target="_blank"><img src="https://opencollective.com/twind/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/twind/sponsor/5/website" target="_blank"><img src="https://opencollective.com/twind/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/twind/sponsor/6/website" target="_blank"><img src="https://opencollective.com/twind/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/twind/sponsor/7/website" target="_blank"><img src="https://opencollective.com/twind/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/twind/sponsor/8/website" target="_blank"><img src="https://opencollective.com/twind/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/twind/sponsor/9/website" target="_blank"><img src="https://opencollective.com/twind/sponsor/9/avatar.svg"></a>

<a href="https://opencollective.com/twind#backers" target="_blank"><img src="https://opencollective.com/twind/backers.svg?width=890"></a>

<a href="https://github.com/OnurGvnc" target="_blank"><img style="border-radius: 50%!important" src="https://avatars.githubusercontent.com/u/1294640?v=4" width="64" height="64" alt="@OnurGvnc"></a>
<a href="https://github.com/tylerforesthauser" target="_blank"><img style="border-radius: 50%!important" src="https://avatars.githubusercontent.com/u/1226786?v=4" width="64" height="64" alt="@tylerforesthauser"></a>
<a href="https://github.com/mtsknn" target="_blank"><img style="border-radius: 50%!important" src="https://avatars.githubusercontent.com/u/2226144?v=4" width="64" height="64" alt="@mtsknn"></a>
[[Become a GitHub Sponsor](https://github.com/sponsors/tw-in-js)]

## ⚖️ License

The [MIT license](https://github.com/tw-in-js/twind/blob/main/LICENSE) governs your use of Twind.
