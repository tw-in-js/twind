# @tw-in-js/core

> a collective dedicated to Tailwind in JS

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

Welcome! If you are here then the likelihood is that you have heard of of used both Tailwind and CSS-in-JS implementations such as styled components. We think that these packages have revolutionised web development and for one reason or another, proved overwhelmingly popular in the world of frontend development.

The purpose of this organization is to merge these two paradigms, both philosophically and practically. Offering all the benefits that come with using Tailwind and bringing them to the runtime.

We aim to create a place for likeminded people to talk about problems and possibilities in this field, as well as come up with implementations that we can share as a community.

<details><summary>Table Of Contents (click to expand)</summary>
- [Installation](#installation)
- [Usage](#usage)
- [Rational](#rational)
- [Challenges](#challenges)
- [Opportunities](#opportunities)
- [Inspiration](#inspiration)
- [Basic Usage](#basic-usage)
- [Customization](#customization)
- [Advanced Usage](#advanced-usage)
- [Browser Support](#browser-support)
- [Contribute](#contribute)
- [License](#license)
</details>

## Installation

```sh
npm install @tw-in-js/core
```

## Usage

```js
import { tw } from '@tw-in-js/core'
```

## Rational

The idea of creating such a community came from the authors of two seperate but similar libraries – oceanwind and beamwind – and the lure of collaboration over competition. The open source community is full of fragmentation (which is often easy) but we wanted to see cohesion here (which is notoriously hard).

> Synergy - the bonus that is achieved when things work together harmoniously. Mark Twain

We noticed ourselves sharing a vision, having overlapping implementations but still duplicating efforts which felt wasteful. So here we are going to break down the problem at large, into smaller problems and try solve each in the most optimal way possible.

## Challenges

The implementation of an efficient tailwind in JS module has already been proven as far from impossible. But breaking the problem down into parts makes it much more approachable, easier to comprehend and evaluate.

Core problems we are trying to solve here are as follows:

1. Parsing Input: taking variadic input and normalizing it to create a comprehendable set of Tailwind rules
2. Merging Themes: taking and combining JSON themes which ultimately configure and constrain the compiler
3. Compiling Rules: taking a set of Tailwind rules and translating them into the appropriate CSS rules
4. Applying Styles: taking CSS rules and applying them to the DOM as stylesheets and elements as class names
5. Extensible Plugins: taking functions and using them to effectively extend the capabilities of the compiler

We would like to do all of this whilst adhering to Tailwind as a language specification. All grammars that exist in Tailwind should be covered by this implementation. Furthermore we aim to do this in the most computationally efficient manner, monitoring and maintaining perf through ongoing benchmark comparrisons.

## Opportunities

Simply recreating a tailwind like experience at runtime might seem like a futile exercise but we'd like to believe it opens up the doors to some exciting new possibilities. There is always going to be a tradeoff between optimizing at build time and compiling just in time but we are confident the upsides are significant enough and downsides negligable enough to persue this approach.

The flexible nature of an implementation in JS at runtime allows for things like:

- Dynamic Theming: generating new themes on the fly without the need to recompile anything
- Enhanced Syntax: taking advantage of macros within template literals to create more terse rules
- Custom Plugins: extending the capabilities of the interpretter and compiler with simple functions
- Error Handling: warning the developer about dublicate and missing variants or directives
- Hashing Classes: reducing the overall size of class names and caches by means of deterministic hashing
- Static Extaction: removing essentially all runtime overhead via render to string on the server
- Unlimited Variants: offering every variant combination due to the fact that unused rules are never generated

One other advantage we see of shipping the interpretter compiler itself (rather than the resultant compiled output) is that the size of the CSS payload for your whole app is both deterministic and fixed. The weight of the implementation here and the theme file you choose to use is all that your users will ever download, no matter how many styles you write. This is likely to be less than 10Kb.

## Inspiration

It goes without saying that the primary inspiration here comes from Tailwind. It is a revolutionary take on styling the web which has taken the world by storm. Given that we are using all the same rules painstakingly though out, written and popularised by Adam Wathan et al. we are forever in his debt.

> I've wanted to do a CSS-in-JS flavor of Tailwind for over 2 years because of all the neat benefits you get there so it's cool to see projects like this! – [@adamwathan](https://twitter.com/adamwathan/status/1320370489408225282)

We were also convinced that this approach could work thanks to the creation and popularisation of htm – a runtime JSX compiler by Jason Miller at Google. This kind of boundary pushing, status quo breaking and compact tooling is always motivating.

## Basic Usage

Despite the module being very flexible and powerful, it is the intention to keep the surface API as minimal as possible. We appreciate that this module is likely to be used by developers and designers alike and so will try maintain a good level of defaults and customisation.

> Note that examples are given in vanilla JS but the module is compatible with all popular frameworks

Getting started with the library requires no configuration, setup (or even installation if you use unpkg):

```js
import { tw } from 'tw-in-js'

document.body.innerHTML = `
  <main class=${tw('bg-black text-white')}>
    <h1 class=${tw('text-xl')}>This is Tailwind in JS!</h1>
  </main>
`
```

Using the `tw` function exported by the module without any configuration results in the compilation of the rules `bg-black text-white` and `text-xl` in exactly as specified in the Tailwind documentation. It is possible to modilfy the behaviour of the compiler by providing a custom theme file but when none is passed then the default Tailwind theme is used.

Calling the `tw` function results in the passed rules to be interpretted, normalized, compiled into CSS and added to a stylesheet in the head of the document.

## Customization

Understadably developers will more often than not, want to customize the out of the box experience. It is possible to do this with the exported `setup` function. Doing this will ultimately change the behaviour of calling the `tw` function, making it appropriate for your particular use case.

```js
import { setup } from 'tw-in-js'

setup({
  preflight: true, // include base style reset
  strict: false, // throw errors for invalid rules
  hash: false, // hash all generated class names
  theme: {}, // define custom theme values
  plugins: {}, // define new grammars for the compiler
})
```

The setup functions is a named export of the main module and accepts an config object as an argument.

### Preflight

To smooth over browser inconsistencies, Tailwind provide a [opinionated modern reset](https://tailwindcss.com/docs/preflight) stylesheet. By default the reset stylesheet will be download and injected into the head of the document as a link tag. In order to prevent this from happening set `preflight` to `false`.

### Strict

One benefit of doing compilation at runtime is that it is possible to warn developers about errors such as:

- Duplication: warn when two of the same rules exist within the same rule set
- Missing Translation: warn when an unrecognized rule is passed to the compiler

By default these warnings will be surfaced in the developer console but will not cause the program to properly throw an error and crash. However, sometimes this might be desireable; for example during testing or continuous integrations.

To force the program to error instead of warn set `strict` to `true`.

### Hash

Most CSS-in-JS solutions, such as styled components or emotion will create hashed class names for rule sets. This makes sense becuase there is no logical way of naming an arbritary set of styles. But it makes less sense to do when using an atomic utility class approach because are already carefully named.

By default, class names that are passed into the `tw` function are not hashed in any way. This helps retain the advantage of using utility classes, aiding inspection and debugging.

To enable hashing of class names set `hash` to `true`.

### Theme

Applying a new theme or extending the default is probably the most common customization. For maximum compatibility and ease of adoption, theming in `tw-in-js` works exactly the same as [theming in Tailwind](https://tailwindcss.com/docs/theme).

Here is an example of overriding and extending values in the theme:

```js
import { setup } from 'tw-in-js'

setup({
  theme: {
    fontFamily: {
      sans: ['Helvetica', 'sans-serif'],
      serif: ['Times', 'serif'],
    },
    extend: {
      spacing: {
        128: '32rem',
        144: '36rem',
      },
    },
  },
})
```

### Plugins

A more advanced customization is to provide plugins in the form of named functions. This allows developers to extend the capabilities of the compiler by defining new grammars.

For example adding the support for the [scroll-snap](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type) property:

```js
import { setup } from 'tw-in-js'

setup({
  plugins: {
    'scroll-snap': (parts) => ({ 'scroll-snap-type': parts[1] }),
  },
})
```

The above plugin would cover cases like `scroll-snap-none` and returning the appropriate CSS. Plugin functions are called upon when a built in translation function for a given directive can't be found.

Plugins are passed two arguments:

- parts: the directive split on '-' with the plugin name as first value e.g `['scroll-snap', 'none']`
- theme: the currently configured theme that is being used by the compiler

## Advanced Usage

Beyond all the basic usage features, a lot of effort has been put into making the library as flexible and helpful for developers as possible. Some nice benefits are afforded to us when chosing to do compilation at runtime rather than at build time and we try to exploit these as much as possible.

### Function Signature

It is possible to invoke the `tw` function in a multitude of different ways. It can take any number of arguments, each of which can be an Object, Array, Boolean, Number, String or inline plugins. This feature is inspired heavily by the [clsx](https://npmjs.com/clsx) library by [Luke Edwards](https://github.com/lukeed).

> Note any falsey values are always discarded as well as standalone boolean and number values

#### Template Literal

```js
bw`bg-gray-200 rounded`
//=> bg-gray-200 rounded
bw`bg-gray-200 ${false && 'rounded'}`
//=> bg-gray-200
bw`bg-gray-200 ${[false && 'rounded', 'block']}`
//=> bg-gray-200 block
bw`bg-gray-200 ${{ rounded: false, underline: isTrue() }}`
//=> bg-gray-200 underline
```

#### Strings

```js
bw('bg-gray-200', true && 'rounded', 'underline')
//=> bg-gray-200 rounded underline
```

#### Objects

```js
bw({ 'bg-gray-200': true, rounded: false, underline: isTrue() })
//=> bg-gray-200 underline
bw({ 'bg-gray-200': true }, { rounded: false }, null, { underline: true })
//=> bg-gray-200 underline
```

#### Arrays

```js
bw(['bg-gray-200', 0, false, 'rounded']) //=> bg-gray-200 rounded
bw(['bg-gray-200'], ['', 0, false, 'rounded'], [['underline']]) //=> bg-gray-200 rounded underline
```

#### Mixture

```js
bw('bg-gray-200', [
  1 && 'rounded',
  { underline: false, 'text-black': null },
  ['text-lg', ['shadow-lg']],
]) //=> bg-gray-200 rounded text-lg shadow-lg
```

### Grouping

One well known shortfall of Tailwind is that class names can become quite unweildly and hard to grok or maintain when a lot of directives are required to style an element. As demonstrated in the above section `tw` is not subject to the limitations of HTML class names, it can accept arguments in many different forms.

Taking advantage of the fact arguments are already normalized before being processed and that it is possible to call the fuction via tagged template literal, a terse DSL was created to try reduce repetition and overall class name length.

#### Variant Grouping

Directives with the same variants can be grouped using parenthesis. The `tw` function will expand the nested directives; applying the variant to each directive in the group before translation.

> Notice that directives within tagged template literals can span multiple lines

```js
tw`sm:(bg-black text-white)`
//=> sm:bg-black sm:text-white
```

It is possible to nest groupings too:

```js
tw`
  sm:(
    bg-black
    text-white
    hover:(bg-white text-black)
  )
`
//=> sm:bg-black sm:text-white sm:hover:bg-white sm:hover:text-black
```

Also nested object values will start new variant groupings:

```js
bw({
  sm: {
    'bg-black': true,
    'text-white': true,
    hover: 'bg-white text-black',
  },
})
// => sm:bg-black sm:text-white sm:hover:bg-white sm:hover:text-black
```

Two things to note here is that the outermost variant should always be a responsive variant (just like in tailwind `hover:sm:` is not supported) and that nesting responsive variants doesn't make sense either, for example `sm:md:` is not supported.

#### Directive Grouping

Much like variants, directives with the same prefix can be grouped using parenthesis. The `tw` function will expand the nested directives; applying the prefix to each directive in the group before translation.

```js
bw`text(center gray-500)`)
// => text-center text-gray-500
bw`divide(y-2 blue-500 opacity(75 md:50))`
// => divide-y-2 divide-blue-500 divide-opacity-75 md:divide-opacity-50
bw`w(1/2 sm:1/3 lg:1/6) p-2`
// => w-1/2 sm:w-1/3 lg:w-1/6 p-2
```

Some directives like `ring` need to be applied themselves as well as being a prefix. In this case you can use the reserved `&` character which is replaced literally with the current prefix:

```js
bw`ring(& ping-700 offset(4 ping-200))`)
// => ring ring-ping-700 ring-offset-4 ring-offset-on-ping-200
```

## Browser Support

[All browsers](https://browserslist.dev/?q=PjAlLCBub3QgQ2hyb21lIDwzNiwgbm90IEVkZ2UgPDEyLCBub3QgRmlyZWZveCA8MjAsIG5vdCBPcGVyYSA8MjUsIG5vdCBTYWZhcmkgPDgsIG5vdCBpT1MgPDgsIG5vdCBPcGVyYU1vYmlsZSA8PSAxMi4xLCBub3QgaWUgPD0gMTEsIG5vdCBJRV9Nb2IgPD0gMTE%3D) that support [Math.imul](https://caniuse.com/mdn-javascript_builtins_math_imul), [Map](https://caniuse.com/mdn-javascript_builtins_map), [Set](https://caniuse.com/mdn-javascript_builtins_set) and [WeakMap](https://caniuse.com/mdn-javascript_builtins_weakmap) (eg Chrome >=36, Edge >=12, Firefox >=20, Opera >=25, Safari >=8, iOS >=8) are supported. Additionally all LTS versions of Node.js are supported.

> If you still have to support IE11 you need to provide a [polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul#Polyfill) for `Math.imul`. IE 11 already supports `Map`, `Set` and `WeakMap` - no polyfills needed for these.

Some new tailwind features use [CSS Variables (Custom Properties)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) which are [**not** available in legacy browsers](https://caniuse.com/css-variables) (Chrome <49, IE, Edge <16, Firefox <31, Opera <36, Safari <9.1, iOS <9.3). For IE 11 you can try the [CSS Variables Polyfill](https://github.com/nuxodin/ie11CustomProperties).

We included fallbacks for the following directives which mimic [Tailwind v1](https://v1.tailwindcss.com/) behavior:

- Color Opacity
  - [border-opacity-\*](https://tailwindcss.com/docs/border-opacity)
  - [bg-opacity-\*](https://tailwindcss.com/docs/background-opacity)
  - [text-opacity-\*](https://tailwindcss.com/docs/text-opacity)
  - [placeholder-opacity-\*](https://tailwindcss.com/docs/placeholder-opacity)
- Reversing Children Order
  - [divide-\*-reverse](https://tailwindcss.com/docs/divide-width#reversing-children-order)
  - [space-\*-reverse](https://tailwindcss.com/docs/space#reversing-children-order)
- `rotate`, `scale` , `skew` and `translate` can only be used alone

  > `rotate-45` works but when using `rotate-45 scale-150` only one of both is applied. In that case you must use `transform`: `transform rotate-45 scale-150`

Some directive only work with CSS Variables and are not supported in legacy browsers:

- [Ring](https://tailwindcss.com/docs/ring-width)

## Contribute

Thanks for being willing to contribute!

> This project is free and open-source, so if you think this project can help you or anyone else, you may [star it on GitHub](https://github.com/tw-in-js/core). Feel free to [open an issue](https://github.com/tw-in-js/core/issues) if you have any idea, question, or you've found a bug.

**Working on your first Pull Request?** You can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

We are following the [Conventional Commits](https://www.conventionalcommits.org) convention.

### Develop

> Ensure you run at least Node v14.

Clone the repository and cd into the project directory.

Run `yarn install && yarn build`.

- `yarn test`: Run test suite
- `yarn format`: Ensure consistent code style
- `yarn build`: Build the package
- `yarn start`: Start example using snowpack
- `yarn release`: To publish the package

## License

[MIT](https://github.com/tw-in-js/core/blob/main/LICENSE)
