If you have made it this far then thanks for checking out Twind. We hoped you have enjoyed learning about Tailwind-in-JS and would love to hear what you think!

Please show your appreciation by sharing the project on twitter or by starring it on GitHub.

If you have any implementation specific feedback or ideas then please [create an issue](https://github.com/tw-in-js/twind) for discussion.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Local development](#local-development)
- [Ideas for the future](#ideas-for-the-future)
  - [Packages / Modules](#packages--modules)
  - [Features](#features)
  - [Documentation](#documentation)
  - [Plugins](#plugins)
- [Links](#links)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

### Packages / Modules

- twind/styled - like styled components (https://github.com/cristianbote/goober/tree/master/benchmarks)
  - with variants like https://stitches.dev
- twind/test - to simplify test setups
- twind/play - play mode which infers number, sizes, and colors from rules
  ```
  p-2.5 -> padding: 0.625rem;
  p-3.2 -> padding: 0.8rem;
  // ${size} must end up with rem|em|px|vh|vw|ch|ex
  p-3px -> padding: 3px;
  p-4rem -> padding: 4rem;
  w-9/12 -> width: 75%;
  ```
- @twind/cli: https://github.com/tw-in-js/twind/discussions/121

  ```
  # update the HTML in place adding a style tag into the head
  twind './**/*.html'

  # generate external style file
  twind './**/*.html' --out twind.css
  ```

- Framework specific integration packages
  ```html
  <div sm="bg-white font-bold" hover="bg-gray-200" dark="bg-gray-900" />
  ```
  - @twind/svelte-preprocess
  - @twind/vite-plugin
  - @twind/vue-preprocess
  - @twind/macro for jsx like frameworks
- @twind/extensions
  - border gradients: https://t.co/W7YVS7f0Jp
  - scroll snap: https://t.co/7xqvpFQ9Qu
  - "on" colors: generate matching contrast color and use that one as text/background color
  - Floating labels: https://t.co/g5TMqIBh4b?ssr=true
  - Stretched link: https://v5.getbootstrap.com/docs/5.0/helpers/stretched-link/
  - and others (see Plugins below)
- @twind/eslint-plugin - nice to have
- @twind/prettier-plugin - nice to have

### Features

- prevent feature creep: create a summary of existing APIs and evaluate what is needed
- re-think extraction API: https://github.com/tw-in-js/twind/discussions/123

  ```js
  const renderedApp = await collectStyles(async () => {
    // render app
  })

  collectStyles.toString()
  // => the styles
  collectStyles.toTag()
  // => <style>...</style>
  collectStyles.toProperties()
  // => { id, textContent }
  ```

  ```js
  const markup = shim(/* string or function returning string */)

  shim.toString()
  // => the styles
  shim.toTag()
  // => <style>...</style>
  shim.toProperties()
  // => { id, textContent }
  ```

- instead of generating utility CSS generate component CSS (auto `apply`)
- support hex colors - could be done as a plugin
  ```
  bg-hex-1c1c1e -> background-color: rgba(28, 28, 30, var(--tw-bg-opacity));
  ```
- support CSS variables - could be done as a plugin when `bg-var-` is used
  ```
  bg-var-test-variable -> background-color: rgba(var(--test-variable), var(--tw-bg-opacity));
  bg-$test-variable -> background-color: rgba(var(--test-variable), var(--tw-bg-opacity));
  ```
- Screen Utilities - use `+` and `-` screen utilities, even for custom screen sizes.
  https://github.com/windicss/windicss/discussions/28
  ```
   sm -> @media (min-width:640px);
  ~sm -> @media (max-width:640px)
  @sm -> @media (min-width:640px) and (max-width:768px);
  ```
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
- Theme
  - live theme updates
  - track used theme values and re-translate
- errors as links to wind.dev/errors/[id] where we provide additional infos
- comments in template literals
- `not-` prefix for variants: `not-focus:invalid:border-red-500`

### Documentation

- repl based on svelte repl
- show how warnings appear in the browser console with a screenshot
- recipes: add example repos
- nested groups: add hint that all pseudo classes are supported
- advantage: stacked variants for pseudo-classes and pseudo-elements: `hover:focus:before::text-red-500`

### Plugins

- plugin api like tailwind: `setup({ plugins: [typography] })`
- `flex-gap-*`: https://github.com/tailwindlabs/tailwindcss/discussions/2316
- https://www.npmjs.com/package/@savvywombat/tailwindcss-grid-areas
- https://www.npmjs.com/package/tailwindcss-ripple
- https://github.com/innocenzi/tailwindcss-scroll-snap
- https://github.com/aerni/tailwindcss-rfs
- https://github.com/jhta/tailwindcss-truncate-multiline#
- https://github.com/opdavies/tailwindcss-plugin-skip-link
- https://github.com/bradlc/tailwindcss-type

## Links

- https://github.com/aniftyco/awesome-tailwindcss
- https://nerdcave.com/tailwind-cheat-sheet
- https://palettolithic.com - tailwind color scheme generator
