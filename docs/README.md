# Twind

This is the user manual for the `twind` library. A small compiler that turns Tailwind short hand into CSS rules at run, build or serve time. If you have used Tailwind and/or a CSS-in-JS solution before then most of the API will feel very familiar.

We are confident that feature parity with Tailwind V2 has been achieved. We recommend you refer the Tailwind documentation site for anything non twind implementation specific; information around directives, variants, theming etc.

📚 **[Tailwind Documentation](https://tailwindcss.com)**

If you find any incorrect or missing documentation then please [open an issue](https://github.com/tw-in-js/twind/issues) for discussion.

## Table Of Contents

- [Installation](./installation.md)
- [Usage](./usage.md)
- [Customization](./customization.md)
- [Grouping](./grouping.md)
- [Plugins](./plugins.md)
- [Architecture](./architectiure.md)
- [Contributing](./contributing.md)
- [Browser Support](./browser-support.md)

## Quickstart

If you would like to get started with twind right away then copy paste this code into your favourite sandbox.

> ⚡️ Alternatively try the [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgdHcsIHNldHVwIH0gZnJvbSAnaHR0cHM6Ly9jZG4uc2t5cGFjay5kZXYvdHdpbmQnCgpzZXR1cCh7CiAgdGhlbWU6IHsKICAgIC8vIEV4YW1wbGUgb2YgZXh0ZW5kaW5nIHRoZSBkZWZhdWx0IHRoZW1lCiAgICBleHRlbmQ6IHsKICAgICAgY29sb3JzOiB7IGhvdHBpbms6ICcjRkYwMEZGJyB9LAogICAgICByb3RhdGU6IHsgNTogJzVkZWcnIH0KICAgIH0KICB9Cn0pCgpjb25zdCBhcHAgPSAoKSA9PiBgCiAgICA8ZGl2IGNsYXNzPScke3N0eWxlLmNvbnRhaW5lcn0nPgogICAgICA8aDEgY2xhc3M9JyR7CiAgICAgICAgLy8gRXhhbXBsZSBvZiBhbiBpbmxpbmUgc3R5bGUKICAgICAgICB0d2AKICAgICAgICAgIHRleHQod2hpdGUgNHhsKQogICAgICAgICAgZm9udChib2xkIHNhbnMpCiAgICAgICAgICB0cmFuc2l0aW9uLXRyYW5zZm9ybQogICAgICAgICAgaG92ZXI6KAogICAgICAgICAgICByb3RhdGUtNQogICAgICAgICAgICBzY2FsZS0xNTAKICAgICAgICAgICAgY3Vyc29yLXBvaW50ZXIKICAgICAgICAgICkKICAgICAgICBgCiAgICAgIH0nPkhlbGxvIFdvcmxkPC9oMT4KICAgIDwvZGl2PgogIGA7CiAgCiAgCmNvbnN0IHN0eWxlID0gewogIC8vIEV4YW1wbGUgb2YgYWJzdHJhY3RlZCBzdHlsZQogIGNvbnRhaW5lcjogdHdgCiAgICBoLWZ1bGwKICAgIGJnLWhvdHBpbmsKICAgIGZsZXgKICAgIGl0ZW1zLWNlbnRlcgogICAganVzdGlmeS1jZW50ZXIKICBgCn0KCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYXBwKCk=)

```js
import { tw } from 'https://cdn.skypack.dev/twind'

document.body.innerHTML = `
  <main class="${tw`bg-black text-white`}">
    <h1 class="${tw`text-xl`}">This is Tailwind in JS!</h1>
  </main>
`
```

## Challenges

The core problems we are trying to solve here are as follows:

1. Parsing Input: taking input and normalizing it to create a comprehendable set of Tailwind rules
2. Compiling Rules: taking a set of Tailwind rules and translating them into appropriate CSS rules
3. Injecting Styles: taking CSS rules and generating classes that get append to a stylesheet in the DOM
4. Merging Themes: combining JSON themes which configure and constrain the compiler
5. Custom Plugins: taking functions and using them to extend the capabilities of the compiler

This has to happen in a performant way at runtime, whilst adhering to Tailwind V2 as a language specification. All grammars that exist in Tailwind should be covered by this implementation.

## Opportunities

Simply recreating a tailwind like experience at runtime might seem like a futile exercise but we'd like to believe it opens up the doors to some exciting new possibilities. There is always going to be a tradeoff between compiling at ahead of time and compiling _just in time_, however we are confident the upsides here are significant enough to persue a runtime implementation and the results have been promising so far.

> Note it is still possible to remove all runtime overhead via a prepass either at serve or built time

The flexible nature of a runtime first approach affords us possibilities like:

- Dynamic Theming: generating new themes on the fly without the need to rebuilding anything
- Unlimited Variants: enabling every variant combination by default because unused rules are never generated
- Enhanced Syntax: taking advantage of macros within template literals to create more terse rules
- Error Handling: warning the developer about unknown directives and theme values
- Hashing Classes: reducing the overall output size and eliminating conflicts via deterministic hashing
- [Inline Plugins](https://github.com/tw-in-js/twind/blob/main/docs/plugins.md#inline-plugin): extending the capabilities of the compiler with simple functions at runtime

Another big advantage we see of shipping the interpreter compiler itself (rather than pre-compiled output) is that the effective size of the CSS for your whole app is deterministic and fixed. The weight of the compiler itself along with your theme file is all that users will ever download, no matter how many styles you use.

Currently the compiler weighs around 10KB which is smaller than styled-components and the average tailwind output.

## Motivation

It goes without saying that the primary inspiration here comes from Tailwind. It is a revolutionary take on styling the web which has proven popular by designers and developers alike. All the core plugins here, abide by the rules painstakingly thought out, implemented and popularized by Adam Wathan et al. making us forever in his debt.

We hope one day we will get the chance to collaborate with Tailwind Labs to create an official implementation!

## Licence

[MIT](https://github.com/tw-in-js/twind/blob/main/LICENSE)
