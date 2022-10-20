---
'twind': patch
---

warn about invalid classes and invalid css during development

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
