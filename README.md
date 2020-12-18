# twind

> the smallest, fastest, most feature complete Tailwind-in-JS solution in existence

[![MIT License](https://badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/main/LICENSE)
[![Latest Release](https://flat.badgen.net/npm/v/twind?icon=npm&label)](https://www.npmjs.com/package/twind)
[![Bundle Size](https://flat.badgen.net/bundlephobia/minzip/twind?icon=packagephobia&label&color=blue)](https://bundlephobia.com/result?p=twind 'gzip bundle size (including dependencies)')
[![Package Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/twind/module/twind.js?icon=jsdelivr&label&color=blue)](https://unpkg.com/twind/module/twind.js 'brotli package size (without dependencies)')
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/types/index.d.ts)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind?icon=github&label)](https://github.com/tw-in-js/twind)
[![CI](https://github.com/tw-in-js/twind/workflows/CI/badge.svg)](https://github.com/tw-in-js/twind/actions?query=workflow%3Aci)
[![Coverage Status](https://flat.badgen.net/coveralls/c/github/tw-in-js/twind/main?icon=codecov&label)](https://coveralls.io/github/tw-in-js/twind?branch=main)
[![PRs Welcome](https://flat.badgen.net/badge/PRs/welcome/purple)](http://makeapullrequest.com)

---

If you are here then the likelihood is that you using in Tailwind or CSS-in-JS libraries such as styled components, emotion or goober before. These packages have proven overwhelmingly popular and revolutionized web development as we know it.

The purpose of this project is unify these two philosophies and create the smallest, fastest, most feature complete Tailwind-in-JS solution in existence. Embracing the flexibility of CSS-in-JS whilst conforming to the natural constraints of the Tailwind API.

More importantly though, we hope to create a place for likeminded people to discuss issues and share ideas.

## Quickstart

If you would like to get started with twind right away then copy paste this code into your favorite sandbox.

> ⚡️ Alternatively try the [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgdHcsIHNldHVwIH0gZnJvbSAnaHR0cHM6Ly9jZG4uc2t5cGFjay5kZXYvdHdpbmQnCgpzZXR1cCh7CiAgdGhlbWU6IHsKICAgIC8vIEV4YW1wbGUgb2YgZXh0ZW5kaW5nIHRoZSBkZWZhdWx0IHRoZW1lCiAgICBleHRlbmQ6IHsKICAgICAgY29sb3JzOiB7IGhvdHBpbms6ICcjRkYwMEZGJyB9LAogICAgICByb3RhdGU6IHsgNTogJzVkZWcnIH0KICAgIH0KICB9Cn0pCgpjb25zdCBhcHAgPSAoKSA9PiBgCiAgICA8ZGl2IGNsYXNzPScke3N0eWxlLmNvbnRhaW5lcn0nPgogICAgICA8aDEgY2xhc3M9JyR7CiAgICAgICAgLy8gRXhhbXBsZSBvZiBhbiBpbmxpbmUgc3R5bGUKICAgICAgICB0d2AKICAgICAgICAgIHRleHQod2hpdGUgNHhsKQogICAgICAgICAgZm9udChib2xkIHNhbnMpCiAgICAgICAgICB0cmFuc2l0aW9uLXRyYW5zZm9ybQogICAgICAgICAgaG92ZXI6KAogICAgICAgICAgICByb3RhdGUtNQogICAgICAgICAgICBzY2FsZS0xNTAKICAgICAgICAgICAgY3Vyc29yLXBvaW50ZXIKICAgICAgICAgICkKICAgICAgICBgCiAgICAgIH0nPkhlbGxvIFdvcmxkPC9oMT4KICAgIDwvZGl2PgogIGA7CiAgCiAgCmNvbnN0IHN0eWxlID0gewogIC8vIEV4YW1wbGUgb2YgYWJzdHJhY3RlZCBzdHlsZQogIGNvbnRhaW5lcjogdHdgCiAgICBoLWZ1bGwKICAgIGJnLWhvdHBpbmsKICAgIGZsZXgKICAgIGl0ZW1zLWNlbnRlcgogICAganVzdGlmeS1jZW50ZXIKICBgCn0KCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYXBwKCk=)

```js
import { tw } from 'https://cdn.skypack.dev/twind'

document.body.innerHTML = `
  <main class="${tw`bg-black text-white`}">
    <h1 class="${tw`text-xl`}">This is Tailwind in JS!</h1>
  </main>
`
```

> 📚 For further instruction on usage please [read the documentation](https://github.com/tw-in-js/twind/tree/main/docs)!

## Rational

This project was started by the authors of two similar libraries – [oceanwind](https://github.com/lukejacksonn/oceanwind) and [beamwind](https://github.com/kenoxa/beamwind) – who chose to collaborate rather than compete with each other in this space. The open source community is full of fragmentation but we wanted to see cohesion here.

Combining efforts has saved us time and resulted in a much more complete and production ready offering. Furthermore we were able to agree on and coin some standards for certain aspects of the implementation, based on all of our learnings; things like parsing input, [grouping syntax](https://github.com/tw-in-js/twind/blob/main/docs/grouping.md), prescedence calculation and [plugin API](https://github.com/tw-in-js/twind/blob/main/docs/plugins.md).

## Why twind?

A lot of developers ask _"Why not just use Tailwind?"_ and our answer is always that you should use Tailwind, it is an absolutely incredible invention! However, if like us you are already building your app in JS using a framework like react, preact, vue or svelte, rather than just static HTML, then compiling Tailwind shorthand just in time (like twind does) rather than ahead of time like with Tailwind and PostCSS, comes with a lot of advantages.

> I've wanted to do a CSS-in-JS flavor of Tailwind for over 2 years because of all the neat benefits you get there so it's cool to see projects like this! – [@adamwathan](https://twitter.com/adamwathan/status/1320370489408225282)

Take the following snippet for example:

```js
import { tw, setup, strict } from 'https://cdn.skypack.dev/twind'

setup({
  hash: true, // Hashes all generated class names
  mode: strict, // Throw errors for invalid rules instead of logging
  theme: {
    fontFamily: {
      sans: ['Helvetica', 'sans-serif'],
      serif: ['Times', 'serif'],
      display: ['Baloo', 'sans-serif'],
    },
    extend: {
      colors: { hotpink: '#FF00FF' },
      rotate: { 5: '5deg' },
    },
  },
  plugins: {
    'scroll-snap': (parts) => ({
      'scroll-snap-type': parts.join(' '),
    }),
  },
})

const app = () => `
    <div class='${style.container}'>
      <h1 class='${tw`
          text(white 4xl)
          font(bold sans)
          transition-transform
          hover:(
            rotate-5
            scale-150
            cursor-pointer
          )
        `}'>Hello World</h1>
    </div>
  `

const style = {
  container: tw`
    h-full
    bg-hotpink
    md:(bg-purple-500)
    lg:(bg-white text-hotpink)
    flex
    items-center
    justify-center
  `,
}

document.body.innerHTML = app()
```

- All setup is done at runtime, no build step required! This makes that is possible to configure and reconfigure the compiler on the fly.
- By shipping the compiler (rather than the resultant output) there is a known and fixed cost associated with styling. No matter how many styles you write or how many variants you use, all your users will ever have to download is approximately 10Kb of code (which is less than styled-components or your average Tailwind build).
- By default the [base reset](https://tailwindcss.com/docs/preflight) provided by tailwind is instantiated with your theme values (like fonts and colors) and injected in the document during setup. Guaranteeing more consistent cross browser results out of the box.
- It is possible to configure twind to [hash class names](https://github.com/tw-in-js/twind/blob/main/docs/customization.md#hash) before injecting them into the DOM. This can reduce the overall down the wire size of pages and eliminate any chance of class name conflicts.
- Theming is done exactly as [documented by the Tailwind](https://tailwindcss.com/docs/theme) meaning that you can copy paste in your project theme from existing projects. The only different here is that there is no need to rebuild after changing you theme. Just refresh the page!
- Input to the compiler is not limited to just a string like HTML classes are. Twind accept arrays, objects, template literals, functions, almost everything! The interpretter spec is inspired by and very similar to [clsx](https://github.com/lukeed/clsx) and offers a much more developer friendly API that handles null values gracefully.
- Using template literals as input ([the recommended method](https://github.com/tw-in-js/twind/blob/main/docs/usage.md#template-literal-recommended)) allows you to break rules over multiple lines, drastically improving readability and maintainability.
- Control over the interpreter affords us the possibility of defining syntax for [grouping responsive and pseudo variants](https://github.com/tw-in-js/twind/blob/main/docs/grouping.md) as well as directives with common prefixes. This massively reduces repetition and improves comprehension.
- The fact that the compiler [accepts functions](https://github.com/tw-in-js/twind/blob/main/docs/usage.md#inline-plugins) that return arbritary CSS-in-JS provides an escape hatch for all those one off rules which aren't supported by tailwind. The `&` keyword allows you to write complex rules (like pseudo elements `&::before` and `&::after`) that are beyond the scope of inline styles.
- Given the finite grammars that the compiler has to support, we are able to specialize it to compile and inject CSS faster than all the popular CSS-in-JS solutions.
- Extending the grammar is trivial and can be achieved by providing a function _inline_ or generalizing inline rules and defining them during setup under [the _plugins_ key](https://github.com/tw-in-js/twind/blob/main/docs/plugins.md).
- The compiler itself is not reliant on the DOM at all, which makes it an ideal candidate for static extraction which would remove all runtime overhead. This is possible during SSR or build time prepass.

## Prior Art

It would be untrue to suggest that the design here is totally original, other than the founders initial attempts at implementing such a module ([oceanwind](https://github.com/lukejacksonn/oceanwind) and [beamwind](https://github.com/kenoxa/beamwind)) we are truly standing on the shoulders of giants. Prior art includes but is not limited to:

- [tailwind](https://tailwindcss.com/): created a wonderfully thought out API on which the compiler's grammar was defined.
- [styled-components](https://styled-components.com/): implemented and popularised the advantages of doing CSS-in-JS.
- [htm](https://github.com/developit/htm): a JSX compiler that proved there is merit in doing runtime compilation of DSLs like JSX.
- [goober](https://github.com/cristianbote/goober): an impossibly small yet efficient CSS-in-JS implemetation that defines critical module features.
- [otion](https://github.com/kripod/otion): the first CSS-in-JS solution specifically oriented around handling CSS in an atomic fashion.
- [clsx](https://github.com/lukeed/clsx): a tiny utility for constructing class name strings conditionally.
- [tiny-css-prefixer](https://github.com/kitten/tiny-css-prefixer): essentials CSS prefixing helpers in less than 1KB of JavaScript.
- [csstype](https://github.com/frenic/csstype): providing autocompletion and type checking for CSS properties and values.

## License

[MIT](https://github.com/tw-in-js/twind/blob/main/LICENSE)
