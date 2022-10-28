# gatsby-plugin-twind [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/gatsby-plugin-twind/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/gatsby-plugin-twind/v/next) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23gatsby-plugin?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/gatsby-plugin)

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin for [Twind](<(https://www.npmjs.com/package/twind)>) with built-in server-side rendering support.

> Visit [twind.style](https://twind.style) for a full documentation or explore [the examples](https://github.com/tw-in-js/twind/tree/next/examples#readme).

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [gatsby](https://github.com/tw-in-js/twind/tree/next/examples/with-gatsby)

## 📦 Installation

Install from npm:

```sh
npm install twind@next gatsby-plugin-twind@next
```

## 🙇 Usage

Please see [examples/gatsby](https://github.com/tw-in-js/twind/tree/next/examples/gatsby) for detailed usage example.

### `twind.config.js`

```js
import { defineConfig } from 'twind'

export default defineConfig({
  /* config */
)
```

`gatsby-plugin-twind` will use hashed class names in production by default. If you don't want this, you can use the `hash` config option:

```js
export default defineConfig({
  hash: false,
  /* config */
})
```

### `gatsby-config.js`

```js
module.exports = {
  plugins: [
    `gatsby-plugin-twind`,
    // {
    //   resolve: `gatsby-plugin-twind`,
    //   options: {
    //     config: `./path/to/twind.config`
    //   }
    // },
  ],
}
```

## 🔧 Options

This plugin assumes a `twind.config.js` file in the root of your project.

You can use the `config` option to specify a different path to a twind config file:

```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-twind`,
      options: {
        config: `./path/to/twind.config.js`,
      },
    },
  ],
}
```

## 💬 Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable use [Github Discussions](https://github.com/tw-in-js/twind/discussions).

To ask questions and discuss with other Twind users in real time use [Discord Chat](https://chat.twind.style).

## 🧱 Contribute

See the [Contributing Guide](../../CONTRIBUTING.md) for information on how to contribute to this project.

## 📜 Changelog

[The Changelog for this package is available on GitHub.](https://github.com/tw-in-js/twind/tree/next/packages/gatsby-plugin/CHANGELOG.md)

## ⚖️ License

The [MIT license](https://github.com/tw-in-js/twind/blob/main/LICENSE) governs your use of Twind.
