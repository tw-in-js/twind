# Example: Gatsby

> Try it live at [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/gatsby) or [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/gatsby).

## Pending a working plugin

This example currently does not use the [@twind/gatsby-plugin](https://www.npmjs.com/package/@twind/gatsby-plugin) package.

Instead it configures twind in `gatsby-browser.js` and `gatsby-ssr.js`. Looking for help to make the [plugin](https://github.com/tw-in-js/twind/tree/next/packages/gatsby-plugin) work.

## How does this work?

1. configure [@twind/gatsby-plugin](https://www.npmjs.com/package/@twind/gatsby-plugin) in [gatsby-config.js](./gatsby-config.js) — to enable server-side rendering (SSR) and injecting of twind styles in the browser
2. a dedicated [twind.config](./twind.config.js)

## What is included?

- [twind](https://www.npmjs.com/package/twind)
- [@twind/tailwind](https://www.npmjs.com/package/@twind/tailwind) — which includes
  - [@twind/preset-autoprefix](https://www.npmjs.com/package/@twind/preset-autoprefix)
  - [@twind/preset-tailwind](https://www.npmjs.com/package/@twind/preset-tailwind)
- [gatsby](https://www.npmjs.com/package/gatsby)
- [@twind/gatsby-plugin](https://www.npmjs.com/package/@twind/gatsby-plugin)

## Credits

Based on [Gatsby Starter Tailwind](https://github.com/taylorbryant/gatsby-starter-tailwind)
