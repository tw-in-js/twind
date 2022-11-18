[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev/api/modules/twind_css.html)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc%2Fcss?icon=github&label)](https://github.com/tw-in-js/twind/tree/v0.16/src/css)
[![Module Size](https://flat.badgen.net/badgesize/brotli/https://cdn.jsdelivr.net/npm/twind/css/css.min.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/css/css.js 'brotli module size')
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/css/css.d.ts)

`twind/css` provides a set of utilities that allow you to write arbitrary CSS within Twind with support for global styles, animations, and more.

📚 Please see the [CSS in Twind](/handbook/css-in-twind) for detailed usage instructions an examples.

## Exports

### The `css` function

This function allows you to write CSS within Twind and provides support for global styling.

[📚 View Handbook Guide](/handbook/css-in-twind#the-css-function)

[📓 View API Reference](#css)

### The `theme` function

This function can be used to access theme values inside of a `css` function call.

[📚 View Handbook Guide](/handbook/css-in-twind#the-theme-function)

[📓 View API Reference](#theme)

### The `apply` function

This function allows you to provide Twind rules inside of a `css` function call.

[📚 View Handbook Guide](/handbook/css-in-twind#the-apply-function)

[📓 View API Reference](#apply)

### The `screen` function

This function allows you to create media queries that reference your Twind breakpoints by name (`sm`,`md`, etc.).

[📚 View Handbook Guide](/handbook/css-in-twind#the-screen-function)

[📓 View API Reference](#screen)

### The `animation` function

This function provides a simplified abstraction for creating custom animations within a `css` function call.

[📚 View Handbook Guide](/handbook/css-in-twind#the-animation-function)

[📓 View API Reference](#animation)

### The `keyframes` function

This function provides a simple way to define [keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes) for use within an `animation` function call.

[📚 View Handbook Guide](/handbook/css-in-twind#the-keyframes-function)

[📓 View API Reference](#keyframes)
