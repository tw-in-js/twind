# Example: Twind CDN

> Try it live at [Stackblitz](https://stackblitz.com/fork/github/tw-in-js/twind/tree/next/examples/using-twind-cdn) or [Codesandbox](https://githubbox.com/tw-in-js/twind/tree/next/examples/using-twind-cdn).

Twind CDN is a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn) that is almost 5.5 times smaller (96.4kb vs 17.6kB) without any build step right in the browser or any other environment like Node.js, deno, workers, ...

This example uses

- [twind/cdn](https://www.npmjs.com/package/twind) — which includes
  - [@twind/preset-autoprefix](https://www.npmjs.com/package/@twind/preset-autoprefix)
  - [@twind/preset-tailwind](https://www.npmjs.com/package/@twind/preset-tailwind)
