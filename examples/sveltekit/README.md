# Example: Sveltekit

> Try it live at [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/sveltekit) or [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/sveltekit).

## How does this work?

1. setup twind in [src/routes/\_\_layout.svelte](./src/routes/__layout.svelte)
2. use [@twind/sveltekit](https://www.npmjs.com/package/@twind/sveltekit) in [src/hooks](./src/hooks.ts) to enable server-side rendering (SSR) and injecting of twind styles
3. (optional) a dedicated [src/twind.config](./src/twind.config.ts)

## What is included?

- [sveltekit](https://www.npmjs.com/package/@sveltejs/kit)
- [@twind/sveltekit](https://www.npmjs.com/package/@twind/sveltekit)
- [twind](https://www.npmjs.com/package/twind) — which includes
  - [@twind/preset-autoprefix](https://www.npmjs.com/package/@twind/preset-autoprefix)
  - [@twind/preset-tailwind](https://www.npmjs.com/package/@twind/preset-tailwind)
- [@twind/preset-tailwind-forms](https://www.npmjs.com/package/@twind/preset-tailwind-forms)
- [@twind/preset-ext](https://www.npmjs.com/package/@twind/preset-ext)
