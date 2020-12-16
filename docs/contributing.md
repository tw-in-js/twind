# Contributing

Here is an outline of some todos, packages, plugins and ideas that we would like to explore or implement given enough time and resources. If you would like to help us at all then please create an issue around any of the following points so that we can discuss the idea further.

## Local development

> Ensure you run at least Node v12.

To develop the project locally, first clone the repository and cd into the project directory.

Run `yarn install`.

- `yarn start`: Start example
- `yarn build`: Build the package
- `yarn test`: Run test suite
- `yarn test:coverage`: Run test suite with coverage
- `yarn test:watch`: Run test suite in watch mode
- `yarn format`: Ensure consistent code style
- `yarn lint`: Run eslint
- `yarn lint:fix`: Run eslint fix
- `yarn release`: To publish the package

## Packages

- Server Side Rendering
- @twind/legacy - for IE11 with reset and polyfills (Math.imul, CSS.escape)
- @twind/css: css and keyframes
- @twind/styled - like styled components (https://github.com/cristianbote/goober/tree/master/benchmarks)
- @twind/eslint-plugin - nice to have
- @twind/prettier-plugin - nice to have
- @twind/tw.macro - maybe?
- @twind/extensions
  - border gradients: https://t.co/W7YVS7f0Jp
  - scroll snap: https://t.co/7xqvpFQ9Qu
  - "on" colors: generate matching contrast color and use that one as text/background color
  - Floating labels: https://t.co/g5TMqIBh4b?ssr=true
  - Stretched link: https://v5.getbootstrap.com/docs/5.0/helpers/stretched-link/
  - and others (see Plugins below)
- @twind/play - play mode

## Docs

- Explain differences with twin.macro
  - requires a build step and a run time lib (emotion, styled-components, ...)
  - has only hashed class names?
  - no directive grouping

## Ideas

- presets: https://tailwindcss.com/docs/presets
- benchmark using https://github.com/A-gambit/CSS-IN-JS-Benchmarks
- size comparison: build same page with other libs and compare size
- on manual class name change in dev-tools and generate that directive
- adapter for standard tailwindcss plugins

### Theme

- live theme updates
- track used theme values and re-translate

### Plugins

- plugin api like tailwind: `setup({ plugins: [typography] })`
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
