> 💡 Didn't found an answer? Try [GitHub discussions](https://github.com/tw-in-js/twind/discussions), our [issues tracker](https://github.com/tw-in-js/twind/issues) or ask the community in our [discord channel](https://discord.com/invite/2aP5NkszvD).

## General

<details><summary>Why not just TailwindCSS?</summary>
Coming soon...
</details>

<details><summary>What do you mean by CSS-in-JS?</summary>
Coming soon...
</details>

<details><summary>How does CSS-in JS perform? Is it slow? </summary>
Coming soon...
</details>

<details><summary>Is this the same as writing style attributes?</summary>
Coming soon...
</details>

<details><summary>Does Twind work with XYZ framework or library?</summary>
If your project uses JavaScript/TypeScript, it should work with Twind. This includes vanilla JavaScript/TypeScript, React, React Native, Vue, Angular, Solid, AlpineJS, NextJS, Gatsby, Nuxt, 11ty, and virtually any other JavaScript framework.

Please note that usage with some frameworks, including SSR frameworks, requires additional configuration. We've put together several [recipes](#) and [example apps](#) to get you started: 

Server Rendered Apps (SSR)- [https://twind.dev/docs/modules/twind_server.html](https://twind.dev/docs/modules/twind_server.
</details>

<details><summary>How is browser support for Twind?</summary>
Twind works with all major browsers but requires a polyfill for IE11 and some older browsers. We've put together a [Browser Support](https://twind.dev/docs/handbook/getting-started/browser-support.html) page in the docs with detailed information.
</details>

<details><summary>Does Twind support dark mode?</summary>
Coming soon...
</details>

<details><summary>Does Twind support Tailwind V2 colors?</summary>
Yes, but with a little extra configuration. You can find usage instructions [in the docs](https://twind.dev/docs/modules/twind_colors.html).
</details>

<details><summary>Does Twind support TypeScript?</summary>
Coming soon...
</details>

## Comparisons

<details><summary>How is Twind different from TailwindCSS?</summary>
Coming soon...
</details>

<details><summary>Does Twind maintain feature parity with TailwindCSS?</summary>
Coming soon...
</details>

<details><summary>How is Twind different from twin.macro? </summary>
Coming soon...
</details>

<details><summary>How is Twind different from other CSS-in-JS solutions?</summary>
Coming soon...
</details>

## Usage
<details><summary>How do I get started using Twind? </summary>

We've put together a [Quickstart Guide](https://twind.dev/docs/handbook/getting-started.html#quickstart) and [Installation Guide](https://twind.dev/docs/handbook/getting-started/installation.html) guide to get you up in running in under a minute. 
</details>

<details><summary>How do I migrate my existing project to Twind?</summary>
Coming soon...
</details>

<details><summary>How do I write global styles in Twind?</summary>
Coming soon...
</details>

<details><summary>How do I write raw CSS in Twind?</summary>

Tailwind provides a `twind/css` package to help you incorporate raw CSS into your project. This package exposes a  `css` function that lets you define your CSS using JavaScript object notation. [Learn more in the docs](https://twind.dev/docs/modules/twind_css.html).

</details>

<details><summary>How do I override a style in Twind?</summary>
Coming soon...
</details>
<details><summary>How do I access a theme value in Twind?</summary>

The  `twind/css` package exposes a `theme` helper for use with the `css` function. [View the docs](https://twind.dev/docs/modules/twind.html#theme-helper) here.

</details>

<details><summary>How do I use Twind with server-rendered (SSR) apps?</summary>

Twind provides a `twind/server` package to assist with static extraction needed for SSR apps. [Learn more in the docs.](https://twind.dev/docs/modules/twind_server.html)

There is also a working [example Next App](https://github.com/tw-in-js/example-next) to get you up in running.
</details>

<details><summary>How do I cache my Twind styles?</summary>
Coming soon...
</details>

<details><summary>When should I use the shim and are there any downsides?</summary>

The purpose of the shim is to allow you to take advantage of Twind without the use of the `tw` function. This is useful for certain situations:
- You are incrementally refactoring an existing Tailwind app.
- You just want to get up and running quickly (prototyping)

There could be performance implications of using the shim on large or highly dynamic apps due to a requirement to parse entire class attributes. However, these differences should be negligible for most static sites.

[Learn more in the docs.](https://twind.dev/docs/modules/twind_shim.html)
</details>

<details><summary>How do I know when to use `tw` vs. `apply` vs. `lazy`?</summary>
Coming soon...
</details>

## Tooling

<details><summary>Is there a Twind VSCode extension for syntax highlighting, style validation/linting, auto-completion, etc..?</summary>
Coming soon...
</details>

## Community

<details><summary>Does Twind have an online community?</summary>

Yes, we are active both on Github Discussions and Discord.
- Github Discussions: [https://github.com/tw-in-js/twind/discussions](https://github.com/tw-in-js/twind/discussions)
- Link to join Discord server: [https://discord.com/invite/2aP5NkszvD](https://discord.com/invite/2aP5NkszvD)
</details>

<details><summary>How do I contribute to this project?</summary>

Hey, we're glad you'd like to contribute! We've put together a [Contributing Guide](https://twind.dev/docs/handbook/advanced/contributing.html) to get you started. 
</details>

