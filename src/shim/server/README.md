[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev/docs/modules/twind_shim_server.html)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc%2Fshim%2Fserver?icon=github&label)](https://github.com/tw-in-js/twind/tree/main/src/shim/server)
[![Module Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/twind/shim/server/server.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/shim/server/server.js 'brotli module size')
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/shim/server/server.d.ts)

`twind/shim/server` exports a dedicated `shim` function that accepts HTML string as input and will:

1. Parse the markup and process element classes with a `tw` instance
2. Populate the provided sheet with the generated rules
3. Output the HTML string with the final element classes

## Exports

### The `shim` function

[📚 View Handbook Guide](/handbook/the-shim#server)

[📓 View API Reference](#shim)

### The `getStyleTag` function

Re-exported from `twind/shim` for convenience

[📚 View Handbook Guide](/handbook/the-shim#server)

[📓 View API Reference](#getstyletag)

### The `getStyleTagProperties` function

Re-exported from `twind/shim` for convenience

[📚 View Handbook Guide](/handbook/the-shim#server)

[📓 View API Reference](#getstyletagproperties)

### The `virtualSheet` function

Re-exported from `twind/shim` for convenience

[📚 View Handbook Guide](/handbook/the-shim#server)

[📓 View API Reference](#virtualsheet)
