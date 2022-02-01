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

For the full [Tailwind CSS](https://tailwindcss.com) experience try [@twind/tailwind](https://www.npmjs.com/package/@twind/tailwind) or start with [Twind CDN](https://www.npmjs.com/package/@twind/cdn) a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn) that is almost 5.5 times smaller (96.4kb vs 17.6kB).

While we work on the new documentation website we have created a [reference sheet](https://github.com/tw-in-js/twind/blob/next/documentation/40-reference/README.md) to lookup up the available API.

We have created a few [examples](https://github.com/tw-in-js/twind/tree/next/examples) to get you started:

| Example                                                                       | Try it live at                                                                                                                                                                    | Description                                                            |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [Basic](https://github.com/tw-in-js/twind/tree/next/examples/basic)           | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/basic) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/basic)           | using [@twind/tailwind](https://www.npmjs.com/package/@twind/tailwind) |
| [Playground](https://github.com/tw-in-js/twind/tree/next/examples/playground) | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/playground) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/playground) | using using all presets                                                |

**Packages**

| Example                                                                               | Try it live at                                                                                                                                                                                        | Description                                                                                                                                                           |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Tailwind Forms](https://github.com/tw-in-js/twind/tree/next/examples/tailwind-forms) | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/using-tailwind-forms) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/using-tailwind-forms) | using [@twind/tailwind](https://www.npmjs.com/package/@twind/tailwind) and [@twind/preset-tailwind-forms](https://www.npmjs.com/package/@twind/preset-tailwind-forms) |
| [Twind CDN](https://github.com/tw-in-js/twind/tree/next/examples/using-twind-cdn)     | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/using-twind-cdn) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/twind-cdn)                 | using [@twind/cdn](https://www.npmjs.com/package/@twind/cdn)                                                                                                          |

**Frameworks**

| Example                                                                          | Try it live at                                                                                                                                                                            | Description                                                                                                                                                                                 |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Gatsby](https://github.com/tw-in-js/twind/tree/next/examples/gatsby)            | ~~[Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/with-gatsby)~~ • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/with-gatsby)   | with [Gatsby](https://www.gatsbyjs.com) using [gatsby-plugin-twind](https://www.npmjs.com/package/gatsby-plugin-twind) and [@twind/tailwind](https://www.npmjs.com/package/@twind/tailwind) |
| [SvelteKit](https://github.com/tw-in-js/twind/tree/next/examples/with-sveltekit) | [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/with-sveltekit) • [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/with-sveltekit) | with [SvelteKit](https://kit.svelte.dev) using [@twind/sveltekit](https://www.npmjs.com/package/@twind/sveltekit) and [@twind/tailwind](https://www.npmjs.com/package/@twind/tailwind)      |

## Migration from twind v0.16

We have collected a list of changes in [Migration › Twind v0.16 › Notable Changes](https://github.com/tw-in-js/twind/blob/next/documentation/30-guide/50-migration.md#notable-changes). A detailed migration guide will follow.

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

> This project is kindly sponsored by <a href="https://www.kenoxa.com" target="_blank">Kenoxa GmbH</a> who support [@sastan](https://github.com/sastan) to maintain this project as part of their open-source engagement.

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

<a href="https://github.com/tonysaad" target="_blank"><img style="border-radius: 50%!important" src="https://avatars.githubusercontent.com/u/1137569?v=4" width="64" height="64" alt="@tonysaad"></a>
<a href="https://github.com/OnurGvnc" target="_blank"><img style="border-radius: 50%!important" src="https://avatars.githubusercontent.com/u/1294640?v=4" width="64" height="64" alt="@OnurGvnc"></a>
<a href="https://github.com/tylerforesthauser" target="_blank"><img style="border-radius: 50%!important" src="https://avatars.githubusercontent.com/u/1226786?v=4" width="64" height="64" alt="@tylerforesthauser"></a>
<a href="https://github.com/mtsknn" target="_blank"><img style="border-radius: 50%!important" src="https://avatars.githubusercontent.com/u/2226144?v=4" width="64" height="64" alt="@mtsknn"></a>
[[Become a GitHub Sponsor](https://github.com/sponsors/tw-in-js)]

## ⚖️ License

The [MIT license](https://github.com/tw-in-js/twind/blob/main/LICENSE) governs your use of Twind.
