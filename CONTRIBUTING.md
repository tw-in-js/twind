# Contributing to Twind

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

### Packages / Modules

- twind/test - to simplify test setups
- twind/play - play mode which infers number, sizes, and colors from rules

  ```
  p-2.5 -> padding: 0.625rem;
  p-3.2 -> padding: 0.8rem;
  // ${size} must end up with rem|em|px|vh|vw|ch|ex
  p-3px -> padding: 3px;
  p-4rem -> padding: 4rem;
  w-9/12 -> width: 75%;
  bg-#1c1c1e -> background-color: rgba(28, 28, 30, var(--tw-bg-opacity));
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
- support CSS variables - could be done as a plugin when `bg-var-` is used
  ```
  bg-var-test-variable -> background-color: rgba(var(--test-variable), var(--tw-bg-opacity));
  bg-$test-variable -> background-color: rgba(var(--test-variable), var(--tw-bg-opacity));
  ```
- Screen Utilities
  https://github.com/windicss/windicss/discussions/28
  ```
   sm -> @media (min-width:640px);
  <sm -> @media (max-width:639px)
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
