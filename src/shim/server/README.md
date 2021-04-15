[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev/api/modules/twind_shim_server.html)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc%2Fshim%2Fserver?icon=github&label)](https://github.com/tw-in-js/twind/tree/main/src/shim/server)
[![Module Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/twind/shim/server/server.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/shim/server/server.js 'brotli module size')
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/shim/server/server.d.ts)

For static HTML processing (usually to provide SSR support for your javascript-powered web apps), `twind/shim/server` exports a dedicated {@link shim} function that accepts HTML string as input and will:

1. parse the markup and process element classes with either the {@link twind.tw | default/global tw} instance or a {@link ShimOptions.tw | custom} instance
2. populate the provided sheet with the generated rules
3. output the HTML string with the final element classes

All Twind syntax features like {@page Thinking in Groups | grouping} are supported within class attributes.

The {@link shim} function also accepts an optional 2nd argument that can be a {@link twind.create | custom} `tw` instance or an {@link ShimOptions | options object} (including `tw` instance).

```js
import { create } from 'twind'
import { shim, virtualSheet, getStyleTag } from 'twind/shim/server'

const sheet = virtualSheet()

const { tw } = create({ ...sharedOptions, sheet })

sheet.reset()

const markup = shim(htmlString, {
  tw, // defaults to default `tw` instance
})

const styleTag = getStyleTag(sheet)
```

<details><summary>Asynchronous SSR</summary>

> ❗ This is an experimental feature. Use with care and please [report any issue](https://github.com/tw-in-js/twind/issues/new) you find.
> Consider using the synchronous API when ever possible due to the relatively expensive nature of the [promise introspection API](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) provided by V8.
> Async server side rendering is implemented using [async_hooks](https://nodejs.org/docs/latest-v14.x/api/async_hooks.html). Callback-based APIs and event emitters may not work or need special handling.

```js
import { setup } from 'twind'
import { asyncVirtualSheet, getStyleTagProperties, shim } from 'twind/server'

const sheet = asyncVirtualSheet()

setup({ ...sharedOptions, sheet })

async function ssr() {
  // 1. Reset the sheet for a new rendering
  sheet.reset()

  // 2. Render the app to an html string and handle class attributes
  const body = shim(await renderTheApp())

  // 3. Create the style tag with all generated CSS rules
  const styleTag = getStyleTag(sheet)

  // 4. Generate the response html
  return `<!DOCTYPE html>
    <html lang="en">
      <head>${styleTag}</head>
      <body>${body}</body>
    </html>
  `
}
```

</details>
