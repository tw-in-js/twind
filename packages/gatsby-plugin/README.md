# @twind/gatsby-plugin

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin for [Twind](<(https://www.npmjs.com/package/twind)>) with built-in server-side rendering support.

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [gatsby](https://github.com/tw-in-js/twind/tree/next/examples/gatsby)

## Installation

Install from npm:

```sh
npm install twind @twind/gatsby-plugin@next
```

## Usage

Please see [examples/gatsby](https://github.com/tw-in-js/twind/tree/next/examples/gatsby) for detailed usage example.

**`gatsby-config.js`**

```html
const twindConfig = require('./twind.config') module.exports = { plugins: [ { resolve:
`@twind/gatsby-plugin`, options: { config: twindConfig, }, }, ], }
```
