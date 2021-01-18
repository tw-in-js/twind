[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev/api/modules/twind_shim_server.html)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc%2Fshim%2Fserver?icon=github&label)](https://github.com/tw-in-js/twind/tree/main/src/shim/server)
[![Module Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/twind/shim/server/server.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/shim/server/server.js 'brotli module size')
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/shim/server/server.d.ts)

For static HTML processing (usually to provide SSR support for your javascript-powered web apps), `twind/shim/server` exports a dedicated {@link shim} function that accepts HTML string as input and will:

1. parse the markup and process element classes with either the {@link twind.tw | default/global tw} instance or a {@link ShimOptions.tw | custom} instance
2. populate the provided sheet with the generated rules
3. output the HTML string with the final element classes

All twind syntax features like [grouping](https://github.com/tw-in-js/twind/blob/main/docs/grouping.md) are supported within class attributes.

The {@link shim} function also accepts an optional 2nd argument that can be a {@link twind.create | custom} `tw` instance or an {@link ShimOptions | options object} (including `tw` instance) for [node-html-parser](https://www.npmjs.com/package/node-html-parser).

```js
import { create } from 'twind'
import { shim, virtualSheet, getStyleTag } from 'twind/shim/server'

const sheet = virtualSheet()

const { tw } = create({ ...sharedOptions, sheet })

sheet.reset()

const markup = shim(htmlString, {
  tw,                       // defaults to default `tw` instance
  lowerCaseTagName: false,  // convert tag name to lower case (hurt performance heavily)
  comment: false            // retrieve comments (hurt performance slightly)
  blockTextElements: {
    script: true,           // keep text content when parsing
    noscript: true,         // keep text content when parsing
    style: true,            // keep text content when parsing
    pre: true,              // keep text content when parsing
  }
})

const styleTag = getStyleTag(sheet)
```
