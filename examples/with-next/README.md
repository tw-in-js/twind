# Example: Next.js

> Try it live at [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/main/examples/with-next) or [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/main/examples/with-next).

## How does this work?

1. a custom [pages/\_app](./pages/_app.js) [^1]
2. a custom [pages/\_document](./pages/_document.js) [^2] to enable server-side rendering (SSR) of styles
3. (optional) a dedicated [twind.config](./twind.config.js)

## What is included?

- [next](https://www.npmjs.com/package/next)
- [twind](https://github.com/tw-in-js/twind/tree/main/packages/twind)
- [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/main/packages/preset-autoprefix)
- [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/main/packages/preset-tailwind)
- [@twind/with-next](https://github.com/tw-in-js/twind/tree/main/packages/with-next)

[^1]: [Next.js › Custom App](https://nextjs.org/docs/advanced-features/custom-app)
[^2]: [Next.js › Custom Document](https://nextjs.org/docs/advanced-features/custom-document)
