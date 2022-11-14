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

Twind is a small compiler that converts utility classes into CSS at runtime. The goal of this project is to unify the flexibility of CSS-in-JS with the carefully considered constraints of the Tailwind API.

Utility-first CSS without any build step right in the browser or any other environment like Node.js, deno, workers, ...

- 📖 Study [the documentation](https://twind.style)
- 🤖 Try [the playground](https://twind.run)
- 🧭 Explore [the examples](https://twind.style/examples)
- 📓 Consult [the API reference](https://twind.style/packages)
- 📜 Read [the changelog](https://github.com/tw-in-js/twind/tree/next/CHANGELOG.md)

## ✨ Features

**⚡️ No build step**

Get all the benefits of Tailwind without the need for Tailwind, PostCSS, configuration, purging, or autoprefixing.

**🚀 Framework agnostic**

If your app uses HTML and JavaScript, it should work with Twind. This goes for server-rendered apps too.

**😎 One low fixed cost**

Twind ships the compiler, not the CSS. This means unlimited styles and variants for one low fixed cost.

<details>
  <summary><strong>Other features</strong></summary>

- 🌎 No bundler required: Usable via CDN
- 🎨 Seamless integration with Tailwind
- 🤝 Feature parity with Tailwind v3
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

</details>

## 📖 Documentation

The full documentation is available at [twind.style](https://twind.style).

## 💬 Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable use [Github Discussions](https://github.com/tw-in-js/twind/discussions).

To ask questions and discuss with other Twind users in real time use [Discord Chat](https://chat.twind.style).

## 🧱 Contribute

See the [Contributing Guide](./CONTRIBUTING.md) for information on how to contribute to this project.

## 🌸 Credits

### 💡 Inspiration

It would be untrue to suggest that the design here is totally original. Other than the founders' initial attempts at implementing such a module ([oceanwind](https://github.com/lukejacksonn/oceanwind) and [beamwind](https://github.com/kenoxa/beamwind)) we are truly standing on the shoulders of giants.

- [Tailwind CSS](https://tailwindcss.com/): created a wonderfully thought out API on which the compiler's grammar was defined.
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

<a href="https://www.copilottravel.com" target="_blank">COPILOT TRAVEL</a> is partnering with [@sastan](https://github.com/sastan) to keep twind aligned with the latest Tailwind CSS releases.

Thank you to all our sponsors!

<p align="center">
  <a href="https://twind.style/sponsors.svg">
    <img src="https://twind.style/sponsors.svg" alt="Sponsors"/>
  </a>
</p>

Please ask your company to also support this open source project by becoming a sponsor on [opencollective](https://opencollective.com/twind#sponsor) or [GitHub](https://github.com/sponsors/tw-in-js)).

## ⚖️ License

The [MIT license](https://github.com/tw-in-js/twind/blob/main/LICENSE) governs your use of Twind.
