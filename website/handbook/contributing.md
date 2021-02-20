---
title: Contributing to Twind
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: See how you can help make Twind even better!
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

Thanks for checking out Twind! Please read on to learn how you can help make this project even better.

## Ways to help

Regardless of your experience level, there are ways that you can help:

- Share the project on Twitter
- Star the project on Github
- Tell your friends/co-workers about Twind
- Write an article about Twind on Medium, Dev, or your platform of choice
- Create written or video tutorials about Twind
- Report bugs or provide feedback by [creating issues](https://github.com/tw-in-js/twind)
- Contribute to the source code by fixing bugs/issues or helping us build new features

## Local development

> Node >v12 and yarn are required

Clone the repo and install the dependencies

```
git clone git@github.com:tw-in-js/twind.git
```

Navigate into the root directory

```
cd twind
```

Install the dependencies with yarn

```
yarn
```

From here, the following scripts are available:

| Scripts              | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| `yarn start`         | Starts the dev server for the example app                           |
| `yarn build`         | Builds the package using Rollup                                     |
| `yarn test`          | Runs the test suite                                                 |
| `yarn test:coverage` | Runs the test suite with a coverage report                          |
| `yarn test:watch`    | Runs test suite in watch mode                                       |
| `yarn format`        | Formats the source code with Prettier                               |
| `yarn lint`          | Statically analyzes the source code to look for issues using ESLint |
| `yarn lint:fix`      | Same as above but also attempts to fix issues                       |
| `yarn release`       | Publishes the package to npm                                        |

## Ideas

If you think anything here sounds like a good idea and/or would like to make it happen, please [file an issue](https://github.com/tw-in-js/twind) and let us know!

- convert css to twind
  - https://github.com/miklosme/css-to-tailwind
  - https://github.com/ritz078/transform/pull/263
  - https://transform-git-fork-jlarky-convert-to-twind.ritz078.now.sh/css-to-twind
- minifier for template-literals
  - apply grouping where possible
- react-native support
- presets: https://tailwindcss.com/docs/presets
- benchmark using https://github.com/A-gambit/CSS-IN-JS-Benchmarks
- size comparison: build same page with other libs and compare size
- adapter for standard tailwindcss plugins

### Modules

- `twind/styled` - like styled components (https://github.com/cristianbote/goober/tree/master/benchmarks)
- `twind/legacy` - for IE11 with reset and polyfills (Math.imul, CSS.escape)
  - add note in docs about umd bundles and how to use them
- `twind/play` - play mode
- `@twind/forms`
- `@twind/eslint-plugin` - nice to have
- `@twind/prettier-plugin` - nice to have
- `@twind/extensions`
  - border gradients: https://t.co/W7YVS7f0Jp
  - scroll snap: https://t.co/7xqvpFQ9Qu
  - "on" colors: generate matching contrast color and use that one as text/background color
  - Floating labels: https://t.co/g5TMqIBh4b?ssr=true
  - Stretched link: https://v5.getbootstrap.com/docs/5.0/helpers/stretched-link/
  - and others (see Plugins below)

### Theme

- live theme updates
- track used theme values and re-translate

### Plugins

- plugin api like tailwind: `setup({ plugins: [typography] })`
- `flex-gap-*`: https://github.com/tailwindlabs/tailwindcss/discussions/2316
- https://www.npmjs.com/package/@savvywombat/tailwindcss-grid-areas
- https://www.npmjs.com/package/tailwindcss-ripple
- https://github.com/tailwindlabs/tailwindcss-aspect-ratio
- https://github.com/innocenzi/tailwindcss-scroll-snap
- https://github.com/aerni/tailwindcss-rfs
- https://github.com/jhta/tailwindcss-truncate-multiline#
- https://github.com/opdavies/tailwindcss-plugin-skip-link
- https://github.com/bradlc/tailwindcss-type

## Links

- https://github.com/aniftyco/awesome-tailwindcss
- https://nerdcave.com/tailwind-cheat-sheet
