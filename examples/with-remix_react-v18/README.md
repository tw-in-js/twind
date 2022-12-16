# Example: Remix with React v18

> Try it live at [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/main/examples/with-remix_react-v18) or [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/main/examples/with-remix_react-v18).

This example uses [renderToPipeableStream](https://reactjs.org/docs/react-dom-server.html#rendertopipeablestream) to generate server-side rendered styles. For an example with [renderToString](https://reactjs.org/docs/react-dom-server.html#rendertostring) take a look at [with-remix](../with-remix).

## How does this work?

1. a modified [app/entry.client](./app/entry.client.tsx) to enable dynamic styling in the browser
2. a modified [app/entry.server](./app/entry.server.tsx) to enable server-side rendering (SSR) of styles
3. (optional) a dedicated [twind](./app/twind.ts) file to ensure the `@twind/core` `tw` function is defined
4. (optional) a dedicated [twind.config](./twind.config.ts)

## What is included?

- [remix](https://www.npmjs.com/package/remix)
- [@twind/core](https://github.com/tw-in-js/twind/tree/main/packages/core)
- [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/main/packages/preset-autoprefix)
- [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/main/packages/preset-tailwind)
- [@twind/with-react](https://github.com/tw-in-js/twind/tree/main/packages/with-react)
