# Example: Next.js

> Try it live at [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/main/examples/with-next) or [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/main/examples/with-next).

This example is using `next@12` and `react@17` because `next@13` is not working in Stackblitz or Codesandbox. You can upgrade this example to `next@13` and `react@18` when you are using it locally.

## How does this work?

1. a custom [pages/\_app](./pages/_app.js) [^1]
2. a custom [pages/\_document](./pages/_document.js) [^2] to enable server-side rendering (SSR) of styles
3. (optional) a dedicated [twind.config](./twind.config.js)

## What is included?

- [next](https://www.npmjs.com/package/next)
- [@twind/core](https://github.com/tw-in-js/twind/tree/main/packages/core)
- [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/main/packages/preset-autoprefix)
- [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/main/packages/preset-tailwind)
- [@twind/with-next](https://github.com/tw-in-js/twind/tree/main/packages/with-next)

[^1]: [Next.js › Custom App](https://nextjs.org/docs/advanced-features/custom-app)
[^2]: [Next.js › Custom Document](https://nextjs.org/docs/advanced-features/custom-document)
