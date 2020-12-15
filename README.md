# @tw-in-js/core

> the smallest, fastest, most feature complete Tailwind-in-JS solution ever

[![MIT License](https://badgen.net/github/license/tw-in-js/core)](https://github.com/tw-in-js/core/blob/main/LICENSE)
[![Latest Release](https://flat.badgen.net/npm/v/@tw-in-js/core?icon=npm&label)](https://www.npmjs.com/package/@tw-in-js/core)
[![Bundle Size](https://flat.badgen.net/bundlephobia/minzip/@tw-in-js/core@>0.2.1?icon=packagephobia&label&color=blue)](https://bundlephobia.com/result?p=@tw-in-js/core 'gzip bundle size (including dependencies)')
[![Package Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/@tw-in-js/core/module/core.js?icon=jsdelivr&label&color=blue)](https://unpkg.com/@tw-in-js/core/module/core.js 'brotli package size (without dependencies)')
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/@tw-in-js/core/types/core.d.ts)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Fcore?icon=github&label)](https://github.com/tw-in-js/core)
[![CI](https://github.com/tw-in-js/core/workflows/CI/badge.svg)](https://github.com/tw-in-js/core/actions?query=workflow%3Aci)
[![Coverage Status](https://flat.badgen.net/coveralls/c/github/tw-in-js/core/main?icon=codecov&label)](https://coveralls.io/github/tw-in-js/core?branch=main)
[![PRs Welcome](https://flat.badgen.net/badge/PRs/welcome/purple)](http://makeapullrequest.com)

---

If you are here then the likelihood is that you have heard of and are interested in, or have used both Tailwind and CSS-in-JS libraries such as styled components, emotion or goober before. These packages have revolutionised web development and for one reason or another, have proved overwhelmingly popular with the community.

The purpose of this project is to create and maintain the smallest, fastest, most feature complete Tailwind-in-JS solution in the world. Exercising the flexibility of CSS-in-JS within the constraints of the Tailwind API.

We aim to create a place for likeminded people to discuss issues and share implemetations around this idea.

## Quickstart

If you would like to get started with twind right away then copy paste this code into your favourite sandbox.

> ⚡️ Alternatively try the [live and interactive demo](https://esm.codes/)

```js
import { tw, setup } from 'https://unpkg.com/twind'

document.body.innerHTML = `
  <main class=${tw('bg-black text-white')}>
    <h1 class=${tw('text-xl')}>This is Tailwind in JS!</h1>
  </main>
`
```

For further instruction on usage please [read the documentation](docs)!

## Rational

This project was started by the authors of two similar libraries – [oceanwind](https://github.com/lukejacksonn/oceanwind) and [beamwind](https://github.com/kenoxa/beamwind) – who chose to collaborate rather than compete with each other in this space. The open source community is full of fragmentation but we wanted to see cohesion here. We hope that combining efforts helps us coin standards for certain aspects of the implementation; things like input parsing, grouping syntax and prescedence calculation.

## Challenges

The core problems we are trying to solve here are as follows:

1. Parsing Input: taking input and normalizing it to create a comprehendable set of Tailwind rules
2. Merging Themes: combining JSON themes which configure and constrain the compiler
3. Compiling Rules: taking a set of Tailwind rules and translating them into appropriate CSS rules
4. Injecting Styles: taking CSS rules and generating classes that get append to a stylesheet in the DOM
5. Custom Plugins: taking functions and using them to extend the capabilities of the compiler

This has to happen in a performant way at runtime, whilst adhering to Tailwind V2 as a language specification. All grammars that exist in Tailwind should be covered by this implementation.

## Opportunities

Simply recreating a tailwind like experience at runtime might seem like a futile exercise but we'd like to believe it opens up the doors to some exciting new possibilities. There is always going to be a tradeoff between compiling at ahead of time and compiling _just in time_, however we are confident the upsides here are significant enough to persue a runtime implementation and the results have been promising so far.

> Note it is still possible to remove all runtime overhead via a prepass either at serve or built time

The flexible nature of a runtime first approach affords us possibilities like:

- Dynamic Theming: generating new themes on the fly without the need to recompile anything
- Unlimited Variants: enabling every variant combination by default because unused rules are never generated
- Enhanced Syntax: taking advantage of macros within template literals to create more terse rules
- Error Handling: warning the developer about dublicate and missing variants or directives
- Hashing Classes: reducing the overall output size and eliminating conflicts via deterministic hashing
- Inline Plugins: extending the capabilities of the compiler with simple functions at runtime

Another big advantage we see of shipping the interpretter compiler itself (rather than pre-compiled output) is that the effective size of the CSS for your whole app is deterministic and fixed. The weight of the compiler itself along with your theme file is all that users will ever download, no matter how many styles you use.

Currently the compiler weighs around 10KB which is smaller than styled-components and the average tailwind output.

## Inspiration

It goes without saying that the primary inspiration here comes from Tailwind. It is a revolutionary take on styling the web which has proven popular by designers and developers alike. All the core plugins here, abide by the rules painstakingly thought out, implemented and popularised by Adam Wathan et al. making us forever in his debt.

> I've wanted to do a CSS-in-JS flavor of Tailwind for over 2 years because of all the neat benefits you get there so it's cool to see projects like this! – [@adamwathan](https://twitter.com/adamwathan/status/1320370489408225282)

We hope one day we will get the chance to collaborate together on an official implementation!

Another big motiovator was seeing `htm` by Jason Miller at Google, compiling JSX at runtime with performance characteristics that were comparable to code that was transpile ahead of time with babel.

We'd like to call ourselves the htm of the css world but that awards goes to `goober` wich is an inspiringly small and efficient CSS-in-JS library by Cristian Bote a member of the core preact team.

## License

[MIT](https://github.com/tw-in-js/core/blob/main/LICENSE)
