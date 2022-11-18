[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev/api/modules/twind_shim.html)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc%2Fshim?icon=github&label)](https://github.com/tw-in-js/twind/tree/v0.16/src/shim)
[![Module Size](https://flat.badgen.net/badgesize/brotli/https://cdn.jsdelivr.net/npm/twind/shim/shim.min.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/shim/shim.js 'brotli module size')
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/shim/shim.d.ts)

`twind/shim` detects Tailwind class names used inside of `class` attributes. If Tailwind utility classes are detected, the corresponding CSS rule is created and injected into the stylesheet dynamically. `twind/shim` is intended for client-side usage and, without configuration, utilizes the default/global `tw` instance. There is _no need for `tw`_, but it can be used on the same elements as well. All Twind syntax features like grouping are supported within class attributes.

[📚 View Handbook Guide](/handbook/the-shim)

## Exports

### The `disconnect` function

[📓 View API Reference](#disconnect)

### The `setup` function

[📓 View API Reference](#setup)
