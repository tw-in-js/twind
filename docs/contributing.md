# Contributing

If you have made it this far then thanks for checking out Twind. We hoped you have enjoyed learning about Tailwind-in-JS and would love to hear what you think!

Please show your appreciation by sharing the project on twitter or by starring it on GitHub.

If you have any implementation specific feedback or ideas then please [create an issue](https://github.com/tw-in-js/twind) for discussion.

<details><summary>Table Of Contents (Click To Expand)</summary>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Local development](#local-development)
- [Ideas for the future](#ideas-for-the-future)
- [Packages / Modules](#packages--modules)
- [Ideas](#ideas)
  - [Theme](#theme)
  - [Plugins](#plugins)
- [Links](#links)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Local development

If you would like to try your hand at fixing a bug or adding a new feature then first clone the repository and cd into the project directory.

> Ensure you run at least Node v12.

Then run `yarn install` followed by any of the following commands:

- `yarn start`: Start example
- `yarn build`: Build the package
- `yarn test`: Run test suite
- `yarn test:coverage`: Run test suite with coverage
- `yarn test:watch`: Run test suite in watch mode
- `yarn format`: Ensure consistent code style
- `yarn lint`: Run eslint
- `yarn lint:fix`: Run eslint fix
- `yarn release`: To publish the package

## Ideas for the future

Below is an outline of some todos, packages, plugins and ideas that we would like to explore or implement given enough time and resources. If you would like to help us at all then please create an issue around any of the following points so that we can discuss the idea further.

## Packages / Modules

- twind/styled - like styled components (https://github.com/cristianbote/goober/tree/master/benchmarks)
- twind/server - support for shim (HTML find class and replace)
- twind/legacy - for IE11 with reset and polyfills (Math.imul, CSS.escape)
  - add note in docs about umd bundles and how to use them
- twind/play - play mode
- @twind/forms
- @twind/eslint-plugin - nice to have
- @twind/prettier-plugin - nice to have
- @twind/tw.macro - maybe?
- @twind/babel-plugin https://github.com/emotion-js/emotion/tree/master/packages/babel-plugin
- @twind/extensions
  - border gradients: https://t.co/W7YVS7f0Jp
  - scroll snap: https://t.co/7xqvpFQ9Qu
  - "on" colors: generate matching contrast color and use that one as text/background color
  - Floating labels: https://t.co/g5TMqIBh4b?ssr=true
  - Stretched link: https://v5.getbootstrap.com/docs/5.0/helpers/stretched-link/
  - and others (see Plugins below)

## Ideas

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

<hr/>

Continue to [Architecture](./architecture.md)
