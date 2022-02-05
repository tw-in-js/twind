# Example: Sveltekit

> Try it live at [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/with-sveltekit) or [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/with-sveltekit).

## How does this work?

1. use twind in [src/routes/\_\_layout.svelte](./src/routes/__layout.svelte)
2. use [@twind/with-sveltekit](https://github.com/tw-in-js/twind/tree/next/packages/with-sveltekit) in [src/hooks](./src/hooks.ts) to enable server-side rendering (SSR) of styles
3. (optional) a dedicated [src/twind.config](./src/twind.config.ts)

## What is included?

- [sveltekit](https://www.npmjs.com/package/@sveltejs/kit)
- [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind)
- [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix)
- [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind)
- [@twind/with-sveltekit](https://github.com/tw-in-js/twind/tree/next/packages/with-sveltekit)