# @twind/core

## 1.1.3

### Patch Changes

- prevent invalid default rule in legacy browsers ([`ccc9c9a9`](https://github.com/tw-in-js/twind/commit/ccc9c9a959c8b61b7429c3539e709e7b39cc3ae8))

## 1.1.2

### Patch Changes

- do not replace window and document for deno bundles ([`5fd4bb08`](https://github.com/tw-in-js/twind/commit/5fd4bb082857c6f5504a23a641a2b61a33e7db88))

## 1.1.1

### Patch Changes

- create dedicated worker and deno bundles, and downgrade module to es2019 (fixes [#426](https://github.com/tw-in-js/twind/issues/426)) ([`02ea227a`](https://github.com/tw-in-js/twind/commit/02ea227afffe474cde5e843c3519f0836ee18f8a))

- add `@twind/with-react` package with support for React v18 streamed responses (fixes [#409](https://github.com/tw-in-js/twind/issues/409)) ([`6521e678`](https://github.com/tw-in-js/twind/commit/6521e678821f05de8cd3a87b0176083efee43405))

  - the `@twind/with-remix` package is deprecated in favor of the `@twind/with-react` package
  - added a Remix with React v18 and [renderToPipeableStream](https://reactjs.org/docs/react-dom-server.html#rendertopipeablestream) example: [examples/with-remix_react-v18](https://github.com/tw-in-js/twind/tree/main/examples/with-remix_react-v18) (related to #400 & #408)

- ensure that all functions from the internal context are destructurable (fixes [#423](https://github.com/tw-in-js/twind/issues/423)) ([`c832b338`](https://github.com/tw-in-js/twind/commit/c832b33849690545e7a4dffbdada2f5b97f6aa08))

## 1.1.0

### Minor Changes

- automatically add `content: ''` to `before` and `after` variant styles (closes #405, related to #414) ([`58c87006`](https://github.com/tw-in-js/twind/commit/58c870060e13e95ac50bcd8b98de441126dafb05))

- Add support for configuring default font-feature-settings for a font-family ([`b24af095`](https://github.com/tw-in-js/twind/commit/b24af09537c889eda791f675499f73acb37e7fb0))

- add `supports-*` variant ([`9254d208`](https://github.com/tw-in-js/twind/commit/9254d20855db6c4b1ce3e114f28d4af1d307ac51))

### Patch Changes

- support observing shadow dom (fixes [#421](https://github.com/tw-in-js/twind/issues/421)) ([`1e16652d`](https://github.com/tw-in-js/twind/commit/1e16652d4d7a5aae72390e0ceef29519a5e18d4d))

- add new web components integration ([`c64fb457`](https://github.com/tw-in-js/twind/commit/c64fb4577267b5e339ae86d5f96179fdf764465b))

- add Lit example ([`e06a4830`](https://github.com/tw-in-js/twind/commit/e06a4830e31b27591eb574f106dddd65ab41a26a))

- workaround webpack accessing the prototype in dev mode ([`64f1ea37`](https://github.com/tw-in-js/twind/commit/64f1ea3796ae28e3f6b4be1682940287828c3323))

## 1.0.3

### Patch Changes

- Fixes "warn" message doesn't respect `event.preventDefault()` (#403) ([#412](https://github.com/tw-in-js/twind/pull/412)) 🙏🏽 [@wzulfikar](https://github.com/wzulfikar)!

## 1.0.2

### Patch Changes

- add @twind/preset-container-queries ([`0ba8cca0`](https://github.com/tw-in-js/twind/commit/0ba8cca0c5c18dcad7831ae3107c55eedeadc8e1))

- respect modifier and non-alphanumeric chars in precedence ([`0ba8cca0`](https://github.com/tw-in-js/twind/commit/0ba8cca0c5c18dcad7831ae3107c55eedeadc8e1))

- improve slotting based on at-rule width ([`0ba8cca0`](https://github.com/tw-in-js/twind/commit/0ba8cca0c5c18dcad7831ae3107c55eedeadc8e1))

## 1.0.1

### Patch Changes

- introduce new @twind/core package to prevent issue with existing code that imports from CDNs without a version ([`4cab9d2f`](https://github.com/tw-in-js/twind/commit/4cab9d2fc573dd2a91cc6667510ff1b7b890854b))

- prevent name mangling of toplevel variables when creating a iife script ([`4cab9d2f`](https://github.com/tw-in-js/twind/commit/4cab9d2fc573dd2a91cc6667510ff1b7b890854b))

## 1.0.0

### Patch Changes

- helpful error message during dev when no active twind instance is found ([`fe891f9c`](https://github.com/tw-in-js/twind/commit/fe891f9c7990a041e0eccaff9a4f58d0834d46d2))

- big documentation update ([`a63ca2cb`](https://github.com/tw-in-js/twind/commit/a63ca2cbf450d8a6f72f4d60f5856cee88d16911))

- allow for `cssom` and `dom` to accept a selector string to find the server rendered stylesheet ([`e2c17a2e`](https://github.com/tw-in-js/twind/commit/e2c17a2e8087875f1725e3b07bc32218d2f0c2c0))

- BREAKING: use `install` instead of `setup` for cdn configuration to align with other integrations ([`d481948b`](https://github.com/tw-in-js/twind/commit/d481948b0513a59cc3495d5e31f0437c9690d59b))

- handle hex encoded ampersand ([`a61e0d1d`](https://github.com/tw-in-js/twind/commit/a61e0d1d4a31be6f398b57ceefffdb04b6bceccf))

- warn about invalid classes and invalid css during development ([`e6acbea2`](https://github.com/tw-in-js/twind/commit/e6acbea2f48e3c6441e0cf71cd069f48500ca493))

  When run in development mode, which is determined by the [export condition](https://nodejs.org/api/packages.html#packages_conditional_exports) `development`, twind notifies about invalid classes and invalid css.

  > Further reading:
  >
  > - [Conditional exports](https://nodejs.org/api/packages.html#packages_conditional_exports)
  > - [Vite](https://vitejs.dev/config/shared-options.html#resolve-conditions)
  > - [esbuild](https://esbuild.github.io/api/#conditions)

  In the the browser a `warning` event is emitted on the `window` object and, in case there is no event listener or the event listener did not call `event.preventDefault()`, a warning is logged to the console.

  ```js
  addEventListener('warning', (event) => {
    // prevent default console.warn(`[<code>] <message>: <detail>`) logging
    event.preventDefault()

    const warning = event.detail

    // { message: '...', code: 'TWIND_INVALID_CLASS', detail: '<className>'}
    // { message: '...', code: 'TWIND_INVALID_CSS', detail: '<css>'}
    console.warn(warning)
  })
  ```

  In Node.js a warning is emitted using [`process.emitWarning`](https://nodejs.org/api/process.html#processemitwarningwarning-options).

  If there is no `warning` event listener, the warning is printed to `stderr`.

  ```
  (node:56338) [TWIND_INVALID_CLASS] Warning: ...
  ```

  Alternatively, you can use the [`process.on('warning', ...)`](https://nodejs.org/api/process.html#event-warning) to handle warnings.

  ```js
  import process from 'node:process'

  process.on('warning', (warning) => {
    console.warn(warning.message) // Print the warning message
    console.warn(warning.code) // 'TWIND_INVALID_CLASS' | 'TWIND_INVALID_CSS'
    console.warn(warning.detail) // '<className>' | '<css>'
  })
  ```

- initial intellisense support ([`2ac8e695`](https://github.com/tw-in-js/twind/commit/2ac8e6950ad37bac0eb88116448bee8738388f59))

- stringify in user config always wins ([`0705e419`](https://github.com/tw-in-js/twind/commit/0705e41946e191974da76c2b27019755520d9c0a))

## 1.0.0

### Patch Changes

- helpful error message during dev when no active twind instance is found (fe891f9c)

- allow for `cssom` and `dom` to accept a selector string to find the server rendered stylesheet (e2c17a2e)

- BREAKING: use `install` instead of `setup` for cdn configuration to align with other integrations (d481948b)

- warn about invalid classes and invalid css during development (e6acbea2)

  When run in development mode, which is determined by the [export condition](https://nodejs.org/api/packages.html#packages_conditional_exports) `development`, twind notifies about invalid classes and invalid css.

  > Further reading:
  >
  > - [Conditional exports](https://nodejs.org/api/packages.html#packages_conditional_exports)
  > - [Vite](https://vitejs.dev/config/shared-options.html#resolve-conditions)
  > - [esbuild](https://esbuild.github.io/api/#conditions)

  In the the browser a `warning` event is emitted on the `window` object and, in case there is no event listener or the event listener did not call `event.preventDefault()`, a warning is logged to the console.

  ```js
  addEventListener('warning', (event) => {
    // prevent default console.warn(`[<code>] <message>: <detail>`) logging
    event.preventDefault()

    const warning = event.detail

    // { message: '...', code: 'TWIND_INVALID_CLASS', detail: '<className>'}
    // { message: '...', code: 'TWIND_INVALID_CSS', detail: '<css>'}
    console.warn(warning)
  })
  ```

  In Node.js a warning is emitted using [`process.emitWarning`](https://nodejs.org/api/process.html#processemitwarningwarning-options).

  If there is no `warning` event listener, the warning is printed to `stderr`.

  ```
  (node:56338) [TWIND_INVALID_CLASS] Warning: ...
  ```

  Alternatively, you can use the [`process.on('warning', ...)`](https://nodejs.org/api/process.html#event-warning) to handle warnings.

  ```js
  import process from 'node:process'

  process.on('warning', (warning) => {
    console.warn(warning.message) // Print the warning message
    console.warn(warning.code) // 'TWIND_INVALID_CLASS' | 'TWIND_INVALID_CSS'
    console.warn(warning.detail) // '<className>' | '<css>'
  })
  ```

- initial intellisense support (2ac8e695)

- stringify in user config always wins (0705e419)

## 1.0.0-next.39

### Patch Changes

- configurable Dark Mode ClassName ([`774e2bb4`](https://github.com/tw-in-js/twind/commit/774e2bb4c7a019d76e55296e9af75fedc77bd054))

* Arbitrary variants ([`a3b1bcba`](https://github.com/tw-in-js/twind/commit/a3b1bcba6269bc4a51b63041689baf58f6222b7f))

- prevent orphaned style tag when calling setup multiple times (closes #321) ([`0e2aa5c4`](https://github.com/tw-in-js/twind/commit/0e2aa5c4f07e5bca3bea37f864773f665935a263))

* `injectGlobal` support for `@media print (#333, #334) 🙏 @javascriptjedi! ([`9b5e3297`](https://github.com/tw-in-js/twind/commit/9b5e3297470f9d2bdbd4f540d819ee0f42e63595))

- Add `<alpha-value>` placeholder support for custom colors (closes #349) ([`0a63948e`](https://github.com/tw-in-js/twind/commit/0a63948e9f6c5f1bb8088ae6e21dc4bf215ee9e8))

* feat: support rgb and hsl colors opacity conversion ([#336](https://github.com/tw-in-js/twind/pull/336)) 🙏🏽 [@javascriptjedi](https://github.com/javascriptjedi)!

- support alpha values for `theme()` function ([`bdc0a7a1`](https://github.com/tw-in-js/twind/commit/bdc0a7a1c353990d0ef009af181f79c1134bfcec))

* fix missing spaces around arithmetic operators ([`f74163ba`](https://github.com/tw-in-js/twind/commit/f74163ba7310ece8d2de4a80586d19df419bfa86))

## 1.0.0-next.38

### Patch Changes

- fix: replace escaped quotes within class names during SSR ([`b212b52f`](https://github.com/tw-in-js/twind/commit/b212b52fbd53e9ecb38d97589ca2f717445ed185))

* Rewrites HTML entity &amp; when self-referenced groups are used with (p)react ([`782f93df`](https://github.com/tw-in-js/twind/commit/782f93df6abb1ebd24ef6c45dc08de602e198107)) 🙏🏽 [@rschristian](https://github.com/rschristian)!

- feat: preserve classes created by explicit `tw` calls during SSR ([`fe88051d`](https://github.com/tw-in-js/twind/commit/fe88051deb3176d014ba527471b1345c47bfb28e))

  Previously `inline` and `extract` cleared the `tw` instance before parsing the html assuming that all classes are available via `class` attributes. That led to missing styles from `injectGlobal` or explicit `tw` calls.

  This change introduces a `snaphot` method on `tw` and sheet instances which allows to preserve the classes that are created by explicit `tw` calls.

  **Default Mode** _(nothing changed here)_

  ```js
  import { inline } from '@twind/core'

  function render() {
    return inline(renderApp())
  }
  ```

  **Library Mode**

  ```js
  import { tw, stringify } from '@twind/core'

  function render() {
    // remember global classes
    const restore = tw.snapshot()

    // generated html
    const html = renderApp()

    // create CSS
    const css = stringify(tw.target)

    // restore global classes
    restore()

    // inject as last element into the head
    return html.replace('</head>', `<style data-twind>${css}</style></head>`)
  }
  ```

* fix: gradients with arbitrary color stop positions (#296) ([`77954405`](https://github.com/tw-in-js/twind/commit/7795440566fc95a424a7f6210998dd1d16ef216f))

## 1.0.0-next.37

### Patch Changes

- fix: workaround for replaced `'` and `" when using react renderToString` ([`08c66ee8`](https://github.com/tw-in-js/twind/commit/08c66ee8f7f80a6c998a380acc4f44280aef3280))

## 1.0.0-next.36

### Patch Changes

- relax some typings where the actual generic type does not matter ([`28cbaef5`](https://github.com/tw-in-js/twind/commit/28cbaef54f226e7542e9197b0dab69e55f588806))

* fix: ensure colors DEFAULT values override nested objects ([`43d61076`](https://github.com/tw-in-js/twind/commit/43d610769152aef2943383b3a2574b9be01acc49))

- refactor: include full precendence in resume data ([`80ce410a`](https://github.com/tw-in-js/twind/commit/80ce410a60892ba70fa8805a37aa89f0dbc13c7d))

* fix: move styles generated by `animation()` into `components` layer — this allows to override animation properties using utilities ([`39b45125`](https://github.com/tw-in-js/twind/commit/39b451256c10bd6f82f45015effbefb41aee8a76))

- feat: auto dark colors ([`2f8f69d2`](https://github.com/tw-in-js/twind/commit/2f8f69d27531fad4346af57f0fef3f473d2c6ee3))

  If enabled, automatic dark colors are generated for each light color (eg no `dark:` variant is present). This feature is opt-in and twind provides a builtin function that works with [tailwind color palettes](https://tailwindcss.com/docs/customizing-colors) (`50`, `100`, `200`, ..., `800`, `900`).

  ```ts
  import { autoDarkColor } from '@twind/core'

  defineConfig({
    // for tailwind color palettes: 50 -> 900, 100 -> 800, ..., 800 -> 100, 900 -> 50
    darkColor: autoDarkColor,
    // other possible implementations
    darkColor: (section, key, { theme }) => theme(`${section}.${key}-dark`) as ColorValue,
    darkColor: (section, key, { theme }) => theme(`dark.${section}.${key}`) as ColorValue,
    darkColor: (section, key, { theme }) => theme(`${section}.dark.${key}`) as ColorValue,
    darkColor: (section, key, context, lightColor) => generateDarkColor(lightColor),
  })
  ```

  Example css for `text-gray-900`:

  ```css
  .text-gray-900 {
    --tw-text-opacity: 1;
    color: rgba(15, 23, 42, var(--tw-text-opacity));
  }
  @media (prefers-color-scheme: dark) {
    .text-gray-900 {
      --tw-text-opacity: 1;
      color: rgba(248, 250, 252, var(--tw-text-opacity));
    }
  }
  ```

  The auto-generated dark color can be overridden by the usual `dark:...` variant: `text-gray-900 dark:text-gray-100`.

  ```css
  .text-gray-900 {
    --tw-text-opacity: 1;
    color: rgba(15, 23, 42, var(--tw-text-opacity));
  }
  @media (prefers-color-scheme: dark) {
    .text-gray-900 {
      --tw-text-opacity: 1;
      color: rgba(248, 250, 252, var(--tw-text-opacity));
    }
  }
  @media (prefers-color-scheme: dark) {
    .dark\\:text-gray-100 {
      --tw-text-opacity: 1;
      color: rgba(241, 245, 249, var(--tw-text-opacity));
    }
  }
  ```

* fix: handle color function in replacement for `theme(...)` ([`9fc5baec`](https://github.com/tw-in-js/twind/commit/9fc5baeca6031d27ac81402b0e614d01c3cd20e7))

- fix: always use rgba color ([`aaad7e44`](https://github.com/tw-in-js/twind/commit/aaad7e4426068a55b00e23df2e084cfc8a46b2ca))

* refactor: move hashing of vars (`--tw-<...>`) from preset-tailwind into core — this allows var hashing without the tailwind preset ([`ae979d12`](https://github.com/tw-in-js/twind/commit/ae979d12fe01cfed32c44eea23ef8a9f2d983eae))

- fix: prevent double class name hashing ([`fc9b0c27`](https://github.com/tw-in-js/twind/commit/fc9b0c277f26e0fc1aad693bd13a80d50b27c71c))

* fix: use `text-decoration-line` ([`346efc4e`](https://github.com/tw-in-js/twind/commit/346efc4e84042d043e17bac8d829f0408279448e))

- fix: ensure theme returns all sections ([`8bbc2a42`](https://github.com/tw-in-js/twind/commit/8bbc2a426054cedc705392eb51aebf0029547d67))

* fix: use same color section detection ([`8dfd105b`](https://github.com/tw-in-js/twind/commit/8dfd105bf0b10d82e3d024b6a318a4b7e6064d90))

## 1.0.0-next.35

### Patch Changes

- chore: cleanup eslint rules ([`009594c6`](https://github.com/tw-in-js/twind/commit/009594c65fb7d0f1da0203c6b6c26bd258ee46d0))

## 1.0.0-next.34

### Patch Changes

- add animation helper ([`b56b7282`](https://github.com/tw-in-js/twind/commit/b56b7282cb92cbadd70c8d9dd80be54d665093fe))

  ```js
  import { animation, keyframes } from '@twind/core'

  const fadeIn = animation(
    '1s ease-out',
    keyframes`
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    `,
  )
  ```

* BREAKING: removed support for single line comments (`//`) — CSS comments (`/* ... */`) are supported ([`a3191b5f`](https://github.com/tw-in-js/twind/commit/a3191b5ff0bd2b415fe8589f6a369501f239f7c1))

- adjust typings for `injectGlobal`, `keyframes`, and `tx` to handle `.call` and `.apply` correctly ([`b9da668c`](https://github.com/tw-in-js/twind/commit/b9da668c12aa80daedf3240f4b721d25b41fc0c4))

* support arrays for @font-face, @import, and @apply in object notation ([`a3191b5f`](https://github.com/tw-in-js/twind/commit/a3191b5ff0bd2b415fe8589f6a369501f239f7c1))

## 1.0.0-next.33

### Patch Changes

- server side generated styles are resumed in the browser ([`b223e5bb`](https://github.com/tw-in-js/twind/commit/b223e5bb9f701db03c30e14d3f7b84b705d43ef0))

  Server side generated styles now include resume data that allows twind in the browser to know which styles are already included in the stylesheet. This change significantly reduces the time to interactive, supports hashed classes, and prevents missing classes that have been generated by `css` or `style` and are not yet registered.

  Resuming styles is enabled by default for `setup` (_Shim Mode_).

  ```js
  import { setup } from '@twind/core'
  import config from './twind.config'

  // styles are resumed!
  setup(config)
  ```

  If you want to used the `dom` sheet during development or if you currently pass a sheet as the second argument, please switch to the new `getSheet(useDOMSheet?: boolean, disableResume?: boolean)` function. This function returns a `Sheet` for the current environment — `virtual` on server, either `dom` or `cssom` in browsers.

  ```js
  import { setup, getSheet } from '@twind/core'
  import config from './twind.config'

  setup(config, getSheet(process.env.NODE_ENV != 'production'))
  ```

  If you want to use resuming styles with _Library Mode_ you need to adjust your code to use `getSheet`:

  ```js
  import { twind, getSheet } from '@twind/core'
  import config from './twind.config'

  export const tw = twind(config, getSheet(process.env.NODE_ENV != 'production'))
  ```

  To generate server side styles use either `inline` or `extract`:

  ```js
  import { inline, extract } from '@twind/core'

  // 1. using inline
  const html = inline(renderApp())

  // 2. using extract
  const { html, css } = extract(renderApp())
  // add the css to the head using <style data-twind>{css}</style>
  ```

  The signature of `virtual(includeResumeData?: boolean)` has changed as well. This is technically a breaking change, but I doubt anybody has used the previous possible `virtual([])`.

* expose the used config via `tw.config` ([`92037344`](https://github.com/tw-in-js/twind/commit/92037344787e28454ffa688b969244f261d28306))

## 1.0.0-next.32

### Patch Changes

- fixing the strange bug now ([`916e7fb9`](https://github.com/tw-in-js/twind/commit/916e7fb928e3e90703126792d704ad561bc1d01a))

## 1.0.0-next.31

### Patch Changes

- bump all packages ([`57405812`](https://github.com/tw-in-js/twind/commit/57405812281dd1bf32b1250c459db9a48466786c))

## 1.0.0-next.30

### Patch Changes

- mark the twind style sheet ([`39001d2a`](https://github.com/tw-in-js/twind/commit/39001d2a2b6718a92080ae47cb6157d1077405b3))

  ```html
  <!-- the SSR stylesheet -->
  <style data-twind="ssr"></style>
  <!-- the client stylesheet -->
  <style data-twind></style>
  ```

## 1.0.0-next.29

### Patch Changes

- ensure dark class condition is always applied last ([`a15d2655`](https://github.com/tw-in-js/twind/commit/a15d26559f3b04144552e3123c04672c4260b23b))

* fix: native methods such as `bind` not working properly when used on twind's apply helper ([#269](https://github.com/tw-in-js/twind/pull/269)) 🙏🏽 Thanks [@IgnusG](https://github.com/IgnusG)!

- keyframes can be use within arbitrary values `` ​ `animate-[1s_${fadeIn}_ease-out]`​ `` ([`e1d3433a`](https://github.com/tw-in-js/twind/commit/e1d3433a985a906454d53b289554db026dbd527d))

* merge multiple group and peer classes ([`2c823293`](https://github.com/tw-in-js/twind/commit/2c82329376ef3f743bc25f355468f4a45c36a3e6))

  `peer-disabled:peer-first-child:group-hover:group-focus:focus:hover:space-x-4`

  ↓ ↓ ↓ ↓ ↓ ↓

  ```css
  .peer:first-child:disabled
    ~ .group:focus:hover
    .peer-disabled\\:peer-first-child\\:group-hover\\:group-focus\\:focus\\:hover\\:space-x-4:focus:hover
    > :not([hidden])
    ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
    margin-right: calc(1rem * var(--tw-space-x-reverse));
  }
  ```

- Fix: keyframes Proxy now passthrough Function's own properties ([#270](https://github.com/tw-in-js/twind/pull/270)) 🙏🏽 Thanks [@danielweck](https://github.com/danielweck)!

## 1.0.0-next.28

### Patch Changes

- BREAKING: changed the definition of shortcuts within config.rules ([`24b095af`](https://github.com/tw-in-js/twind/commit/24b095af51195a43fe32229e5560aed088b97c0a))

  The new format should be more readable and clear about what is happening.

  ```js
  // defineConfig is optional but helps with type inference
  defineConfig({
    rules: [
      /* Some aliases */
      // shortcut: styles are generated as defined by twind — same as if they where used alone
      // shortcut to multiple utilities
      ['card', 'py-2 px-4 font-semibold rounded-lg shadow-md'],

      // dynamic shortcut — `$` is everything after the match eg `btn-red` -> `red`
      ['card-', ({ $ }) => `bg-${$}-400 text-${$}-100 py-2 px-4 rounded-lg`],

      // single utility alias — need to use `~(...)` as it would be otherwise recognized as a CSS property
      ['red', '~(text-red-100)'],

      // apply: styles are generated in order they are declared
      // apply to multiple utilities
      ['btn-green', '@(bg-green-500 hover:bg-green-700 text-white)'],

      // dynamic apply
      ['btn-', ({ $ }) => `@(bg-${$}-400 text-${$}-100 py-2 px-4 rounded-lg)`],

      /* Some rules */
      ['hidden', { display: 'none' }],

      // Table Layout
      // .table-auto { table-layout: auto }
      // .table-fixed { table-layout: fixed }
      ['table-(auto|fixed)', 'tableLayout'],

      // dynamic
      ['table-', (match, context) => /* ... */],
  ],
  })
  ```

* allow `css()`, `cx()`, and `style()` to be used for rule definition ([`b7280003`](https://github.com/tw-in-js/twind/commit/b728000391cffea29eb4215b79a1b23d75751fe8))

  ```js
  defineConfig({
    rules: [
      // Using css
      [
        'target-new-tab',
        css`
          target-name: new;
          target-new: tab;
        `,
      ],
      // dynamic
      [
        'target-new-(tab|window)',
        ({ 1: $1 }) => css`
          target-name: new;
          target-new: ${$1};
        `,
      ],

      // Using cx
      ['highlight(-rounded)?', ({ 1: rounded }) => cx({ 'bg-yellow-200': true, rounded })],

      // Using style
      // `box?color=coral` -> `.box\\?color\\=coral{background-color:coral}`
      // `box?rounded` -> `.box\\?rounded{border-radius:0.25rem}`
      // `box?color=coral&rounded` -> `.box\\?color\\=coral\\&rounded{background-color:coral;border-radius:0.25rem}`
      // `box?color=purple&rounded=md` -> `.box\\?color\\=purple\\&rounded\\=md{background-color:purple;border-radius:0.375rem}`
      [
        'box\\?(.+)',
        style({
          props: {
            color: {
              coral: css({
                backgroundColor: 'coral',
              }),
              purple: css`
                background-color: purple;
              `,
            },
            rounded: {
              '': 'rounded',
              md: 'rounded-md',
            },
          },
        }),
      ],
    ],
  })
  ```

## 1.0.0-next.27

### Patch Changes

- fix: ensure sources are included in sourcemap ([`bbbbd88e`](https://github.com/tw-in-js/twind/commit/bbbbd88efc7cb8c0c1b73ade9249389958e1d7cf))

* add ssr marker to server render twind style ([`e8eaae8b`](https://github.com/tw-in-js/twind/commit/e8eaae8b6034b3117bf781ec374c1cd7e05a2d26))

- perf: remove unnecessary conditions compare ([`b526c888`](https://github.com/tw-in-js/twind/commit/b526c88843424ef8a6caf93c3236947b59414edd))

## 1.0.0-next.26

### Patch Changes

- keyframes: access global tw on usage eg lazily ([`bb288434`](https://github.com/tw-in-js/twind/commit/bb2884347354f3edb2fc888ad1a27d953639b91b))

* rewritten token parser to better supported nested brackets ([`063b002b`](https://github.com/tw-in-js/twind/commit/063b002bafd4782e7d75cd7bf008d237ab4d5649))

- filter rules can be used alone and modify defaults selector to include `::before` and `::after` ([`966fcb93`](https://github.com/tw-in-js/twind/commit/966fcb93448ea7fe9e69cd5e67df84163a83617c))

* ensure tw returned by observe is callable ([`f1fe9a81`](https://github.com/tw-in-js/twind/commit/f1fe9a8180f828da1985b166d4abb0e0e30bc1e0))

- enhance typings for config.theme ([`2b91cf29`](https://github.com/tw-in-js/twind/commit/2b91cf29967d9fa26d95d792650cfbf3b4ead9c3))

* cssom: the ownerNode might have already been removed ([`49002cac`](https://github.com/tw-in-js/twind/commit/49002cac273d4e6502e98d985174a27a2b87b7d2))

## 1.0.0-next.25

### Patch Changes

- update package badges ([`4527aa91`](https://github.com/tw-in-js/twind/commit/4527aa919f853d613c89df9dde2587173cb91a3a))

## 1.0.0-next.24

### Patch Changes

- ensure dark variant is handled correctly within nested groups ([`18f0caff`](https://github.com/tw-in-js/twind/commit/18f0caffb903f0de7f5e7d2f1b8f816e5d0d9fad))

* add `keyframes` function that lazily injects the keyframes into the sheet and return a unique name ([`a415d389`](https://github.com/tw-in-js/twind/commit/a415d3896ec1981cf1d9a2f884a07be9c8a86bcc))

- add `injectGlobal` which allows to add CSS to the base layer ([`1800dec7`](https://github.com/tw-in-js/twind/commit/1800dec790a3487280d3342f6a00c32c7221f207))

* ensure each varaiant occurs only onces eg is unique ([`90da3bbc`](https://github.com/tw-in-js/twind/commit/90da3bbc7d47a26453adf5414012d0f5a2892f5a))

## 1.0.0-next.23

### Patch Changes

- allow CSS to be used in preflight and rules ([#252](https://github.com/tw-in-js/twind/pull/252))

  ```js
  setup({
    preflight: css`
      body {
        background: theme(colors.gray.100);
      }
    `,

    rules: [
      [
        // bg-red, bg-#ccc, bg-transparent
        'bg-',
        ({ $ }) =>
          css`
            background-color: ${$};
          `,
      ],
    ],
  })
  ```

* refactor: handling of nested (shortcuts atm) groups ([#252](https://github.com/tw-in-js/twind/pull/252))

- add `apply` and `@(...)` that uses the given order ([#252](https://github.com/tw-in-js/twind/pull/252))

* inline: pass html to minify function — allows to only include above-the-fold CSS ([#252](https://github.com/tw-in-js/twind/pull/252))

## 1.0.0-next.22

### Patch Changes

- add `tx` as convenient helper for `tw(cx(...))` ([`877152d1`](https://github.com/tw-in-js/twind/commit/877152d1401287aaeaa3f5405ce3d4c9673f7bf0))

* BREAKING: `tw` accepts only a single string argument (use `cx` for more feature) this reduces the bundle size for the shim mode by 0.25kb ([#251](https://github.com/tw-in-js/twind/pull/251))

- ensure that `dark` variant is always applied first ([#251](https://github.com/tw-in-js/twind/pull/251))

* BREAKING: move `darkMode` into twind core ([#251](https://github.com/tw-in-js/twind/pull/251))

- `inline` can accept an options object with a `minify` to minify the resulting CSS before injecting it ([#251](https://github.com/tw-in-js/twind/pull/251))

## 1.0.0-next.21

### Patch Changes

- a custom hash function receives the default hash ([`0a2daf0f`](https://github.com/tw-in-js/twind/commit/0a2daf0f3daf7ebfde103407b5c0e914625c17c9))

* BREAKING: rename `inject` to `inline` ([`762c5153`](https://github.com/tw-in-js/twind/commit/762c515362f09e13e93ea8c10aa84109b65f13b3))

## 1.0.0-next.20

### Patch Changes

- revert: remove dom sheet ([`6d50cf5f`](https://github.com/tw-in-js/twind/commit/6d50cf5f7bd8fb79caf02a81c30060c8abf2382e))

## 1.0.0-next.19

### Patch Changes

- fix variant cache condition ([`1f578c9e`](https://github.com/tw-in-js/twind/commit/1f578c9ede1882ee714db249a6bed48c0e1e3059))

## 1.0.0-next.18

### Patch Changes

- add inject(html) helper to simplify extracting CSS and injecting it into the head element ([#247](https://github.com/tw-in-js/twind/pull/247))

## 1.0.0-next.17

### Patch Changes

- bump to same version ([`ca157601`](https://github.com/tw-in-js/twind/commit/ca1576017f172bfb0ba61e936f0f44d36102016c))

## 1.0.0-next.16

### Patch Changes

- BREAKING(@twind/runtime): renamed `init` to `setup` to better align with other APIs ([#245](https://github.com/tw-in-js/twind/pull/245))

* use `data-twind` to locate SSR style element ([#245](https://github.com/tw-in-js/twind/pull/245))

* Updated dependencies [[`ae9c1201`](https://github.com/tw-in-js/twind/commit/ae9c1201918ea316e14d452818663847886507fa), [`ed21b253`](https://github.com/tw-in-js/twind/commit/ed21b253ea1403ebfee0f38060b5fa8670bcaebb), [`5d40cc5b`](https://github.com/tw-in-js/twind/commit/5d40cc5bbf2f0f8b2f1769ca95630b7d83d6ef8f), [`6bdf326f`](https://github.com/tw-in-js/twind/commit/6bdf326f8aa41bfdc89d77a47f24433536f3c9a5), [`f0715269`](https://github.com/tw-in-js/twind/commit/f0715269afe91c7cbaaf97ee7e21bb99080f37b0), [`13b806cd`](https://github.com/tw-in-js/twind/commit/13b806cd3f74550bdc43cdc995026ee6d65b894f), [`82de0d53`](https://github.com/tw-in-js/twind/commit/82de0d53755f35c72fe41200f9091bdc2c960f83)]:
  - @twind/runtime@1.0.0-next.14
  - @twind/core@1.0.0-next.14
  - @twind/preset-autoprefix@1.0.0-next.14
  - @twind/preset-tailwind@1.0.0-next.15

## 1.0.0-next.15

### Patch Changes

- ensure globale `twind_core` variable points to bundled `@twind/core` which allows presets to uses it ([#244](https://github.com/tw-in-js/twind/pull/244))

* all bundles should use the same globalName `twind` ([#244](https://github.com/tw-in-js/twind/pull/244))

- BREAKING(preset authors): removed `preset()` helper to simplify config merging — What needs to change? instead calling preset, return your preset ([#244](https://github.com/tw-in-js/twind/pull/244))

* add `comsume(html, tw)` to process static HTML ([#244](https://github.com/tw-in-js/twind/pull/244))

- only update class attributes if the class names within are different (ignore order) ([#244](https://github.com/tw-in-js/twind/pull/244))

- Updated dependencies [[`61509050`](https://github.com/tw-in-js/twind/commit/61509050a539a0e2e28ec961f7e7bc8ffa15a9e0), [`d45cdfd9`](https://github.com/tw-in-js/twind/commit/d45cdfd98ebccabc3c9376660a077b29f295765b), [`6178fdc8`](https://github.com/tw-in-js/twind/commit/6178fdc8363e9d04133fe14818b522cd07f9d9d1), [`01ac6b62`](https://github.com/tw-in-js/twind/commit/01ac6b62dabf1c2217342ce4ec23ffef272ab780), [`599b903a`](https://github.com/tw-in-js/twind/commit/599b903ab3e9d59cdea47948d46abffe64e8cbe2), [`30b374f6`](https://github.com/tw-in-js/twind/commit/30b374f61bab1780a654b0475c12e993d4b57524), [`d9123489`](https://github.com/tw-in-js/twind/commit/d912348915675a1928df91965b701d7b6eefebf8), [`115a5b07`](https://github.com/tw-in-js/twind/commit/115a5b079972fefe468f9c9ed51ef8feea403690), [`a8a0bf49`](https://github.com/tw-in-js/twind/commit/a8a0bf49cec96285ae79ff6ada9c718784c11d6e), [`0614955f`](https://github.com/tw-in-js/twind/commit/0614955f56aca56c9937e80b3eb5d6ec1b55ec0b), [`67f39048`](https://github.com/tw-in-js/twind/commit/67f39048127c777388b549b6630ea1100d757d35), [`2093be98`](https://github.com/tw-in-js/twind/commit/2093be98bb58c393e29bef93c0e8d425cb97bc1d)]:
  - @twind/runtime@1.0.0-next.13
  - @twind/core@1.0.0-next.13
  - @twind/preset-autoprefix@1.0.0-next.13
  - @twind/preset-tailwind@1.0.0-next.14

## 1.0.0-next.14

### Patch Changes

- Updated dependencies [[`eb875119`](https://github.com/tw-in-js/twind/commit/eb8751194b21ec0941483e9a72d61a36d90e73da)]:
  - @twind/preset-tailwind@1.0.0-next.13

## 1.0.0-next.13

### Patch Changes

- introduce `twind/cdn`: a bore bones Tailwind CSS replacement — no additional exports like (`cx`, `style` or `css`) ([`9bc26949`](https://github.com/tw-in-js/twind/commit/9bc26949dd729b7002bc27032bb2f999e766546d))

- Updated dependencies [[`9bc26949`](https://github.com/tw-in-js/twind/commit/9bc26949dd729b7002bc27032bb2f999e766546d)]:
  - @twind/core@1.0.0-next.12
  - @twind/preset-autoprefix@1.0.0-next.12
  - @twind/preset-tailwind@1.0.0-next.12
  - @twind/runtime@1.0.0-next.12

## 1.0.0-next.12

### Patch Changes

- Updated dependencies [[`c595b348`](https://github.com/tw-in-js/twind/commit/c595b348dc06ce3061322bcc8235463d2f27d488), [`dc778be0`](https://github.com/tw-in-js/twind/commit/dc778be038180c8f0409adc044305d565d35493f), [`2ba630a3`](https://github.com/tw-in-js/twind/commit/2ba630a36237bdeb428976ab959268e8faee2128), [`5848d13f`](https://github.com/tw-in-js/twind/commit/5848d13f70037c237364b08195a71fe8f8049e1f), [`f41e367f`](https://github.com/tw-in-js/twind/commit/f41e367fa03bb335c2d1226d954d68b725707740), [`bea09c04`](https://github.com/tw-in-js/twind/commit/bea09c040bbe3a6cd4df3530d6090441a1e40535), [`123fb7f8`](https://github.com/tw-in-js/twind/commit/123fb7f897cc2d7999c446c896c622cb4df4712c)]:
  - @twind/core@1.0.0-next.11
  - @twind/preset-ext@1.0.0-next.11
  - @twind/preset-tailwind@1.0.0-next.11
  - @twind/preset-autoprefix@1.0.0-next.11
  - @twind/runtime@1.0.0-next.11

## 1.0.0-next.11

### Patch Changes

- rename `@twind/preset-mini` to `@twind/preset-ext` ([`d9e8c3a1`](https://github.com/tw-in-js/twind/commit/d9e8c3a12fddb85de4b7f5b0a02a9a9ddcd9c6f8))

- Updated dependencies [[`8d846cf2`](https://github.com/tw-in-js/twind/commit/8d846cf2b8c5e4d8042c41ab1079109230c92612), [`b2c7f824`](https://github.com/tw-in-js/twind/commit/b2c7f8249a15acc434601c55b0b0b0af2bc5dfa9), [`3e76ea1b`](https://github.com/tw-in-js/twind/commit/3e76ea1ba46b076920ae4029272d64c3a3b21e6b), [`9ac89873`](https://github.com/tw-in-js/twind/commit/9ac89873517e03960f7af8784efe441172b3cbb1), [`a5f112fa`](https://github.com/tw-in-js/twind/commit/a5f112fa4c3dd2ce63334d5111ba04468750911b)]:
  - @twind/core@1.0.0-next.10
  - @twind/preset-tailwind@1.0.0-next.10
  - @twind/preset-autoprefix@1.0.0-next.10
  - @twind/preset-ext@1.0.0-next.10
  - @twind/runtime@1.0.0-next.10

## 1.0.0-next.10

### Patch Changes

- BREAKING: a twind instance is now callable `tw('...')` instead of `tw.inject('...')` ([#239](https://github.com/tw-in-js/twind/pull/239))

* setup github actions for auto release ([#239](https://github.com/tw-in-js/twind/pull/239))

* Updated dependencies [[`56b9adef`](https://github.com/tw-in-js/twind/commit/56b9adef3f8779ad649d89fc69db321a9b8ee71e), [`f618afd7`](https://github.com/tw-in-js/twind/commit/f618afd7c82e372dd64da03eda8ee6f86d70d174), [`bec4218d`](https://github.com/tw-in-js/twind/commit/bec4218d9fe6f8c214aea5100379454c6b11583f), [`37164d82`](https://github.com/tw-in-js/twind/commit/37164d822506a9d201f9d463f5c867368fddc89e), [`e284b0f4`](https://github.com/tw-in-js/twind/commit/e284b0f43c97d53a81fee15ac15406c8db0e694e)]:
  - @twind/core@1.0.0-next.9
  - @twind/preset-mini@1.0.0-next.9
  - @twind/preset-tailwind@1.0.0-next.9
  - @twind/runtime@1.0.0-next.9
  - @twind/preset-autoprefix@1.0.0-next.9

## 1.0.0-next.9

### Patch Changes

- adding stitches like style helper ([`7360f15a`](https://github.com/tw-in-js/twind/commit/7360f15a828ccd136a0eb40bbe6ccd629b145361))

- Updated dependencies [[`cc3c4fee`](https://github.com/tw-in-js/twind/commit/cc3c4fee9d5b572faf46838a0287d30b9eb0045f), [`7360f15a`](https://github.com/tw-in-js/twind/commit/7360f15a828ccd136a0eb40bbe6ccd629b145361), [`be5def30`](https://github.com/tw-in-js/twind/commit/be5def30416835d8100f6c0c3e88b38ab8171487)]:
  - @twind/preset-mini@1.0.0-next.8
  - @twind/preset-tailwind@1.0.0-next.8
  - @twind/core@1.0.0-next.8
  - @twind/preset-autoprefix@1.0.0-next.8
  - @twind/runtime@1.0.0-next.8

## 1.0.0-next.8

### Patch Changes

- revert to observing document.documentElement and describe a solution to prevent FOUC ([`2a9f1685`](https://github.com/tw-in-js/twind/commit/2a9f1685843b50b741dbe0338f4cf068603411c8))

* re-order args for setup to simplify providing an alternative sheet like `dom()` for enhanced debugging ([`a7b25242`](https://github.com/tw-in-js/twind/commit/a7b252425e3f38ce2b5d2097e63d23cca5c6c4f2))

* Updated dependencies [[`2a9f1685`](https://github.com/tw-in-js/twind/commit/2a9f1685843b50b741dbe0338f4cf068603411c8), [`a7b25242`](https://github.com/tw-in-js/twind/commit/a7b252425e3f38ce2b5d2097e63d23cca5c6c4f2)]:
  - @twind/core@1.0.0-next.7
  - @twind/runtime@1.0.0-next.7
  - @twind/preset-autoprefix@1.0.0-next.7
  - @twind/preset-mini@1.0.0-next.7
  - @twind/preset-tailwind@1.0.0-next.7

## 1.0.0-next.7

### Patch Changes

- allow twind and @twind/runime package to be used outside of a DOM environment ([`d8705f9d`](https://github.com/tw-in-js/twind/commit/d8705f9d3b812f2aa71c6d19efdbc743f90cffcb))

* extract runtime into own package with re-worked autoinit using MutationObserver ([`aa96aef4`](https://github.com/tw-in-js/twind/commit/aa96aef4037d773c1880bfed0c07a7952a668412))

* Updated dependencies [[`184d96ff`](https://github.com/tw-in-js/twind/commit/184d96ffb934e621bb07f8ccbf809a6a14675298), [`a3d09cf4`](https://github.com/tw-in-js/twind/commit/a3d09cf40db55fb980441500121bf1820ea2a3ae), [`d8705f9d`](https://github.com/tw-in-js/twind/commit/d8705f9d3b812f2aa71c6d19efdbc743f90cffcb), [`aa96aef4`](https://github.com/tw-in-js/twind/commit/aa96aef4037d773c1880bfed0c07a7952a668412), [`881e1e16`](https://github.com/tw-in-js/twind/commit/881e1e16005cecd1930cdb988f6983c2b1aff516)]:
  - @twind/core@1.0.0-next.6
  - @twind/preset-mini@1.0.0-next.6
  - @twind/preset-tailwind@1.0.0-next.6
  - @twind/runtime@1.0.0-next.6
  - @twind/preset-autoprefix@1.0.0-next.6

## 1.0.0-next.6

### Patch Changes

- Updated dependencies [[`d68ce341`](https://github.com/tw-in-js/twind/commit/d68ce3413ae29b6ea7cd88d3c094e59876d7e5d5), [`2c5792f9`](https://github.com/tw-in-js/twind/commit/2c5792f9c2c1295a7d0aac094e9aa760999f5cc0)]:
  - @twind/core@1.0.0-next.5
  - @twind/preset-tailwind@1.0.0-next.5
  - @twind/preset-autoprefix@1.0.0-next.5
  - @twind/preset-mini@1.0.0-next.5

## 1.0.0-next.5

### Patch Changes

- add `apply` as known from twind v0.16 ([`230a57ba`](https://github.com/tw-in-js/twind/commit/230a57ba6c6d77ae73ffc6b6a426b9c28ba8c908))

- Updated dependencies [[`af822490`](https://github.com/tw-in-js/twind/commit/af822490d0a02a2fc227b8bc19471141a5586de2), [`bda8c19c`](https://github.com/tw-in-js/twind/commit/bda8c19c9abb80678225b5c947db87e1a4f07aa6), [`3382dd0b`](https://github.com/tw-in-js/twind/commit/3382dd0be26fcedba466d1ac011f76403ece278d), [`230a57ba`](https://github.com/tw-in-js/twind/commit/230a57ba6c6d77ae73ffc6b6a426b9c28ba8c908)]:
  - @twind/core@1.0.0-next.4
  - @twind/preset-tailwind@1.0.0-next.4
  - @twind/preset-mini@1.0.0-next.4
  - @twind/preset-autoprefix@1.0.0-next.4

## 1.0.0-next.4

### Patch Changes

- ensure there is config object when called from setTimeout

- Updated dependencies []:
  - @twind/core@1.0.0-next.3
  - @twind/preset-autoprefix@1.0.0-next.3
  - @twind/preset-mini@1.0.0-next.3
  - @twind/preset-tailwind@1.0.0-next.3

## 1.0.0-next.3

### Patch Changes

- expose `tw` and `apply` for twind v0.16 compatibility ([`79c63ef9`](https://github.com/tw-in-js/twind/commit/79c63ef9ed3dda9f3bfafde977016b3b75db7c4c))

* expose setup function to configure twind ([`79c63ef9`](https://github.com/tw-in-js/twind/commit/79c63ef9ed3dda9f3bfafde977016b3b75db7c4c))

- BREAKING: renamed umd bundles to global (`twind.global.js`) and there are plain IIFEs ([`79c63ef9`](https://github.com/tw-in-js/twind/commit/79c63ef9ed3dda9f3bfafde977016b3b75db7c4c))

- Updated dependencies [[`79c63ef9`](https://github.com/tw-in-js/twind/commit/79c63ef9ed3dda9f3bfafde977016b3b75db7c4c)]:
  - @twind/core@1.0.0-next.2
  - @twind/preset-autoprefix@1.0.0-next.2
  - @twind/preset-mini@1.0.0-next.2
  - @twind/preset-tailwind@1.0.0-next.2

## 1.0.0-next.1

### Patch Changes

- Initial publish of twind v1 preview ([`179b9653`](https://github.com/tw-in-js/twind/commit/179b9653de661a62a661c80d5506ae68f7964aba))

- Updated dependencies [[`179b9653`](https://github.com/tw-in-js/twind/commit/179b9653de661a62a661c80d5506ae68f7964aba)]:
  - @twind/core@1.0.0-next.1
  - @twind/preset-autoprefix@1.0.0-next.1
  - @twind/preset-tailwind@1.0.0-next.1
