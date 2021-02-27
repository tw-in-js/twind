---
title: Frequently Asked Questions
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: Frequently asked questions about Twind
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

> 💡 Didn't find your answer? Try [GitHub discussions](https://github.com/tw-in-js/twind/discussions), our [issues tracker](https://github.com/tw-in-js/twind/issues), or ask the community in our [discord channel](https://discord.com/invite/2aP5NkszvD).

### General

<Collapse title="Why not just TailwindCSS?">

We, in no way, discourage the use of TailwindCSS. In fact, we think everyone **should** try Tailwind before they try Twind. It is an absolutely incredible tool with amazing documentation and the entire backbone of this project!

Twind takes a different approach by removing the build step and generating the styles at run-time, which can be a useful approach for existing apps built on frameworks.

We encourage you to try both and see which one is a better fit for you and your project.

</Collapse>

<Collapse title="How is Twind different from TailwindCSS?">

Twind works with all existing Tailwind classes and configuration. However, Twind offers extended utilities, variants, and syntaxes which are all listed in the [Extended Functionality Guide](/handbook/extended-functionality).

</Collapse>

<Collapse title="How does CSS-in JS perform? Is it slow?">

Twind was designed with performance in mind from the start and is in the top two fastest CSS-in-JS solutions. We've put together [some benchmarks](https://github.com/tw-in-js/twind#benchmarks) if you are interested in learning more.

</Collapse>

<Collapse title="Is this the same as writing style attributes?">

Coming soon...

</Collapse>

<Collapse title="Does Twind work with XYZ framework or library?">

If your project uses JavaScript/TypeScript, it should work with Twind. This includes vanilla JavaScript/TypeScript, React, React Native, Vue, Angular, Solid, AlpineJS, NextJS, Gatsby, Nuxt, 11ty, and virtually any other JavaScript framework.

Please note that usage with some frameworks, including SSR frameworks, requires additional configuration. We've put together several usage guides to help get you started.

</Collapse>

<Collapse title="How is browser support for Twind?">

Twind works with all major browsers but requires a polyfill for IE11 and some older browsers. Please see the [Legacy Browsers guide](/handbook/getting-started#supporting-legacy-browsers) for more information.

</Collapse>

<Collapse title="Does Twind support dark mode?">

Yes! With Twind, dark mode is always available. Please see the [configuration guide](/handbook/configuration#dark-mode) for more info.

</Collapse>

<Collapse title="Does Twind support Tailwind V2 colors?">

Yes, but with a little extra configuration. With Twind, dark mode is always available! Please see the [configuration guide](/handbook/configuration#colors) for more info.

</Collapse>

<Collapse title="Does Twind support TypeScript?">

Yes, Twind is written in TypeScript and includes all type definitions with the modules. Please see the [TypeScript usage guide](/usage-guides/typescript) for more info on how to use Twind in your TypeScript app.

</Collapse>

### Usage

<Collapse title="How do I get started using Twind?">

We've put together a [Getting Started](/handbook/getting-started) guide to get you up in running in under a minute.

</Collapse>

<Collapse title="How do I migrate my existing project to Twind?">

We've put together a [Tailwind Migration Guide](/migration-guides/tailwind) and are working on more.

</Collapse>

<Collapse title="How do I write raw CSS in Twind?">

Tailwind provides a `twind/css` package to help you incorporate raw CSS into your project. This package exposes a `css` function that lets you define your CSS using JavaScript object notation. Please check out our [CSS-in-Twind Guide](/handbook/css-in-twind) for more information.

</Collapse>

<Collapse title="How do I write global styles in Twind?">

Twind provides a first-class approach to writing global styles via the `twind/css` module.

We've put together a [Global Styles Guide](/handbook/css-in-twind#global-styles) for your convenience.

</Collapse>

<Collapse title="How do I override a style in Twind?">

Twind provides several ways to override styles, including an `!important` modifier, `apply` function, and `override` variant.

Please see the [Overwriting Styles Guide](/handbook/overwriting-styles) for more information.

</Collapse>

<Collapse title="How do I access a theme value in Twind?">

The `twind/css` package exposes a `theme` helper for use with the `css` function. [View the docs](https://twind.dev/docs/modules/twind.html#theme-helper) here.

</Collapse>

<Collapse title="How do I use Twind with server-rendered (SSR) apps?">

Twind provides a `twind/server` package to assist with static extraction needed for SSR apps. Please the [SSR Usage Guide](/usage-guides/ssr) for more information.

There is also a working [example Next App](https://github.com/tw-in-js/example-next) to get you up in running.

</Collapse>

<Collapse title="When should I use the shim and are there any downsides?">

The purpose of the shim is to allow you to take advantage of Twind without the use of the `tw` function. This is useful for certain situations:

- You are incrementally refactoring an existing Tailwind app.
- You just want to get up and running quickly (prototyping)

There could be performance implications of using the shim on large or highly dynamic apps due to a requirement to parse entire class attributes. However, these differences should be negligible for most static sites.

Please check out [The Shim Guide](/handbook/the-shim) for more information.

</Collapse>

### Tooling

<Collapse title="Is there a Twind VSCode extension for syntax highlighting, style validation/linting, auto-completion, etc..?">

Not yet, but a Twind VSCode extension is in the works. You can follow the progress on [this issue](https://github.com/tw-in-js/twind/issues/24).

</Collapse>

### Community

<Collapse title="Does Twind have an online community?">

Yes, we are active both on Github Discussions and Discord.

- Github Discussions: [https://github.com/tw-in-js/twind/discussions](https://github.com/tw-in-js/twind/discussions)
- Link to join Discord server: [https://discord.com/invite/2aP5NkszvD](https://discord.com/invite/2aP5NkszvD)

</Collapse>

<Collapse title="How can I contribute to this project?">

Hey, thanks for your interest! There are several ways that you can contribute to this project from spreading the word to fixing bugs to creating new features. We've put together a [Contributing Guide](https://github.com/tw-in-js/twind/blob/main/CONTRIBUTING.md) to get you started.

</Collapse>

<!--
Possible future FAQS:
- How do I cache my Twind styles?
- How do I know when to use `tw` vs. `apply` vs. `lazy`?
- How is Twind different from twin.macro?
- How is Twind different from other CSS-in-JS solutions?
-->
