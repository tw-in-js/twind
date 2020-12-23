# Setup

Understandably developers will more often than not want to customize the out of the box experience. It is possible to achieve this with the `setup` function. Doing so will ultimately change the behavior of calling the `tw` function, making it appropriate for your particular use case.

> To use `tw` you **do not** need to call `setup`.

```js
import { setup, strict } from 'twind'

setup({
  preflight: false, // do not include base style reset (default: use tailwind preflight)
  mode: strict, // throw errors for invalid rules (default: warn)
  hash: true, // hash all generated class names (default: false)
  theme: {}, // define custom theme values (default: tailwind theme)
  darkMode: 'class', // us ea different dark mode strategy (default: 'media')
})
```

The setup functions is a named export of the main module and accepts an config object as an argument.

## Preflight

To smooth over browser inconsistencies, Tailwind provide a [opinionated modern reset](https://tailwindcss.com/docs/preflight) stylesheet. By default the base reset styles will be injected into the head of the document before any other rules.

- In order to prevent this from happening set this attribute to `false`.
- If you would like to inject a custom reset instead then provide a function as a value.
- You can provide additional CSS rules as an object which are merged with the default reset.

## Mode

One benefit of doing compilation at runtime is that it is possible to warn developers about errors such as:

- Unknown directive: warn when an unrecognized rule is encountered
- Missing theme value: warn when a unknown theme value is encountered

By default these kind of warnings will be surfaced in the developer console but will not cause the program to throw an error and crash.

However, sometimes throwing an error might be desirable; for example during testing or continuous integrations.

To force the program to error instead of warn set `mode` to `strict`:

```js
import { setup, strict } from 'twind'

setup({
  mode: strict, // Throw errors for invalid rules instead of logging
})
```

To ignore all warnings set the `mode` to `silent`:

```js
import { setup, silent } from 'twind'

setup({
  mode: silent,
})
```

If you are using JSON configuration the modes can be set using strings: `"strict"`, `"warn"` or `"silent"`.

## Hash

Most CSS-in-JS solutions, such as styled components or emotion will create hashed class names for rule sets. This makes sense because there is no logical way of naming an arbritary set of styles. Doing this makes less sense when using an utility class approach because directives are usually carefully named.

By default, rules that are passed into the `tw` function are not hashed. This helps retain the advantage of using utility classes, aiding inspection and debugging.

To enable hashing of class names set `hash` to `true`.

## Theme

Applying a new theme or extending the default is probably the most common customization. For maximum compatibility and ease of adoption, theming in Twind works exactly the same as [theming in Tailwind](https://tailwindcss.com/docs/theme).

Here is an example of overriding and extending values in the theme:

```js
import { setup } from 'twind'

setup({
  theme: {
    fontFamily: {
      sans: ['Helvetica', 'sans-serif'],
      serif: ['Times', 'serif'],
    },
    extend: {
      spacing: {
        128: '32rem',
        144: '36rem',
      },
    },
  },
})
```

The Tailwind v2 [extended color palette](https://tailwindcss.com/docs/customizing-colors#color-palette-reference) is available as `twind/colors`:

```js
import * as colors from 'twind/colors'

setup({
  theme: {
    colors: {
      // Build your palette here
      gray: colors.trueGray,
      red: colors.red,
      blue: colors.lightBlue,
      yellow: colors.amber,
    },
  },
})
```

The extend the existing color palette use `theme.extend`:

```js
import * as colors from 'twind/colors'

setup({
  theme: {
    extend: {
      colors,
    },
  },
})
```

### Referencing other values

If you need to reference another value in your theme, you can do so by providing a closure instead of a static value. The closure will receive a `theme()` function that you can use to look up other values in your theme.

```js
setup({
  theme: {
    colors: {
      important: (theme) => theme('colors.red.500', 'red' /* Fallback */),
    },
    fill: (theme) => theme('colors'),
  },
})
```

## Dark Mode

Now that dark mode is a first-class feature of many operating systems, it's becoming more and more common to design a dark version of your website to go along with the default design.

To make this as easy as possible, twind includes a dark variant that lets you style your site differently when dark mode is enabled:

```js
bw`
  bg-white text-black
  dark:(bg-gray-800 text-white)`
```

> It's important to note that the dark mode variant is **always** enabled and available for all directives.

Now whenever dark mode is enabled on the user's operating system, `dark:{directive}` rules will take precedence over unprefixed rules. The `media` strategy uses the [prefers-color-scheme media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) under the hood, but if you'd like to support toggling dark mode manually, you can also use the `class` strategy which uses adds a `.dark` class selector for more control:

```js
setup({
  darkMode: 'class', // default is 'media'
})
```

For an example how to toggle dark mode manually read the [Tailwind Guide](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually).

<hr/>

Continue to [Examples](./examples.md)
