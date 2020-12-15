# Twind

This is the user manual for the `twind` library. A small compiler that turns Tailwind directives into CSS rules at run, build or serve time. Great effort has gone into designing the API to be both flexible enough but small enough to be maintainable. Testing has been a vital part of development and coverage is close to 100%.

Currently we are confident that feature parity with the Tailwind V2 specification has been met. For this reason we recommend you refer the Tailwind documentation site for anything non implementation specific.

📚 **[Tailwind Documentation](https://tailwindcss.com)**

If you come across and undocumented then please [open an issue](https://github.com/tw-in-js/core/issues) for discussion.

## Table Of Contents

- [Installation](./installation.md)
- [Usage](./usage.md)
- [Customization](./customization.md)
- [Grouping](./grouping.md)
- [Plugins](./plugins)
- [Architecture](./architectiure)
- [Contributing](./contributing)
- [Browser Support](./browser-support.md)

## Quickstart

If you would like to get started with twind right away then copy paste this code into your favourite sandbox.

> ⚡️ Alternatively try the [live and interactive demo](https://esm.codes/)

```js
import { tw, setup } from 'https://unpkg.com/@tw-in-js/core'

document.body.innerHTML = `
  <main class=${tw('bg-black text-white')}>
    <h1 class=${tw('text-xl')}>This is Tailwind in JS!</h1>
  </main>
`
```

## Licence

[MIT](https://github.com/tw-in-js/core/blob/main/LICENSE)
