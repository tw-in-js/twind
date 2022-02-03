# Example: Gatsby

> Try it live at [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/with-gatsby).

_Does not work in [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/with-gatsby) until [sharp is supported](https://github.com/stackblitz/webcontainer-core/issues/147)._

## How does this work?

1. configure [gatsby-plugin-twind](https://github.com/tw-in-js/twind/tree/next/packages/gatsby-plugin-twind) in [gatsby-config.js](./gatsby-config.js) — to enable server-side rendering (SSR) and injecting of twind styles in the browser
2. a dedicated [twind.config](./twind.config.js)

## What is included?

- [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind)
- [@twind/tailwind](https://github.com/tw-in-js/twind/tree/next/packages/tailwind) — which includes
  - [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix)
  - [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind)
- [gatsby](https://www.npmjs.com/package/gatsby)
- [gatsby-plugin-twind](https://github.com/tw-in-js/twind/tree/next/packages/gatsby-plugin-twind)

## Credits

Based on [Gatsby Starter Tailwind](https://github.com/taylorbryant/gatsby-starter-tailwind)
