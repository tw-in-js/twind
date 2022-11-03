<div align="center">

<img src="https://twind.dev/assets/twind-logo-animated.svg" height="125" width="125" />
<a href="https://twind.style" align="center"><h1>Twind</h1></a>

<p align="center">
The smallest, fastest, most feature complete Tailwind-in-JS solution in existence
</p>

</div>

---

[![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE)
[![Latest Release](https://flat.badgen.net/npm/v/twind/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/twind/v/next)
[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.style)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind?icon=github&label)](https://github.com/tw-in-js/twind/tree/next)
[![Discord](https://img.shields.io/discord/798324011980423188?label=chat&logo=discord)](https://chat.twind.style)
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

[twind](https://github.com/tw-in-js/twind/tree/next/packages/twind) does **not** include any core utilities — use one of the existing presets:

- [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix)
- [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind) to get a full Tailwind v3 experience
- [@twind/preset-tailwind-forms](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind-forms) to get Tailwind v3 and Tailwind Forms.
- [@twind/preset-ext](hhttps://github.com/tw-in-js/twind/tree/next/packages/preset-ext)

For the full [Tailwind CSS](https://tailwindcss.com) experience try [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind) or start with [Twind CDN](https://github.com/tw-in-js/twind/tree/next/packages/cdn) a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn) that is almost 5.5 times smaller (96.4kb vs 17.6kB).

While we work on the new documentation website we have created a [reference sheet](https://github.com/tw-in-js/twind/blob/next/website/pages/docs/reference.md) to lookup up the available API.

We have created a few [examples](https://github.com/tw-in-js/twind/tree/next/examples) to get you started:

| Example                                                                       | Try it live at                                                                                                                                                                    | Description                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Basic](https://github.com/tw-in-js/twind/tree/next/examples/basic)           | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/basic) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/basic)           | using [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix) and [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind) |
| [Playground](https://github.com/tw-in-js/twind/tree/next/examples/playground) | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/playground) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/playground) | using using all presets                                                                                                                                                                                     |

**Packages**

| Example                                                                               | Try it live at                                                                                                                                                                                        | Description                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Tailwind Forms](https://github.com/tw-in-js/twind/tree/next/examples/tailwind-forms) | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/using-tailwind-forms) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/using-tailwind-forms) | using [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix) and [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind) and [@twind/preset-tailwind-forms](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind-forms) |
| [Twind CDN](https://github.com/tw-in-js/twind/tree/next/examples/using-twind-cdn)     | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/using-twind-cdn) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/using-twind-cdn)           | using [@twind/cdn](https://github.com/tw-in-js/twind/tree/next/packages/cdn)                                                                                                                                                                                                                                               |

**Frameworks**

| Example                                                                          | Try it live at                                                                                                                                                                            | Description                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Gatsby](https://github.com/tw-in-js/twind/tree/next/examples/gatsby)            | ~~[Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/with-gatsby)~~ • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/with-gatsby)   | with [Gatsby](https://www.gatsbyjs.com) using [gatsby-plugin-twind](https://github.com/tw-in-js/twind/tree/next/packages/gatsby-plugin-twind), [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix) and [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind) |
| [Next.js](https://github.com/tw-in-js/twind/tree/next/examples/with-next)        | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/with-next) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/with-next)           | with [Next.js](https://nextjs.org) using [@twind/with-next](https://github.com/tw-in-js/twind/tree/next/packages/with-next), [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix) and [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind)                   |
| [Remix](https://github.com/tw-in-js/twind/tree/next/examples/with-remix)         | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/with-remix) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/with-remix)         | with [Remix](https://remix.run) using [@twind/with-remix](https://github.com/tw-in-js/twind/tree/next/packages/with-remix), [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix) and [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind)                    |
| [SvelteKit](https://github.com/tw-in-js/twind/tree/next/examples/with-sveltekit) | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/with-sveltekit) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/with-sveltekit) | with [SvelteKit](https://kit.svelte.dev) using [@twind/with-sveltekit](https://github.com/tw-in-js/twind/tree/next/packages/with-sveltekit), [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix) and [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind)   |

## Migration from twind v0.16

We have collected a list of changes in [Migration › Twind v0.16 › Notable Changes](https://github.com/tw-in-js/twind/blob/next/website/pages/docs/migration.md#notable-changes). A detailed migration guide will follow.

## 🧱 Contribute

See the [Contributing Guide](./CONTRIBUTING.md) for information on how to contribute to this project.

## 🌸 Credits

### 💡 Inspiration

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

### 🤝 Contributors

Thank you to all the people who have <a href="https://github.com/tw-in-js/twind/graphs/contributors">already contributed</a> to twind!

### 🙏🏾 Sponsors

This project is kindly sponsored by <a href="https://www.kenoxa.com" target="_blank">Kenoxa GmbH</a> who support [@sastan](https://github.com/sastan) to maintain this project as part of their open-source engagement.

<a href="https://www.copilottravel.com" target="_blank">COPILOT TRAVEL</a> is partnering with [@sastan](https://github.com/sastan) to keep twind aligned with the latest tailwindcss releases.

Thank you to all our sponsors!

![Image](./sites/twind.style/static/sponsors.png)

Please ask your company to also support this open source project by becoming a sponsor on [opencollective](https://opencollective.com/twind#sponsor) or [GitHub](https://github.com/sponsors/tw-in-js)).

## ⚖️ License

The [MIT license](https://github.com/tw-in-js/twind/blob/main/LICENSE) governs your use of Twind.
