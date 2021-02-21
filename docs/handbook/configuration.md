---
title: Configuration and Theming
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: How to configure Twind into your project.
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

Understandably developers will more often than not want to customize the out of the box experience. It is possible to achieve this with the `setup` function. Doing so will ultimately change the behavior of calling the `tw` function, making it appropriate for your particular use case.

:::tip
The `setup` function is not required to use Twind
:::

The ` setup` function is a named export of the `twind` module and accepts an config object as an argument.

```js
import { setup, strict, voidSheet } from 'twind'

setup({
  preflight: false, // do not include base style reset (default: use tailwind preflight)
  mode: strict, // throw errors for invalid rules (default: warn)
  hash: true, // hash all generated class names (default: false)
  theme: {}, // define custom theme values (default: tailwind theme)
  darkMode: 'class', // use a different dark mode strategy (default: 'media')
  sheet: voidSheet, // use custom sheet (default: cssomSheet in a browser or no-op)
})
```

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

### Colors

The Tailwind v2 [extended color palette](https://tailwindcss.com/docs/customizing-colors#color-palette-reference) is available as {@link twind/colors}:

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

To extend the existing color palette use `theme.extend`:

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
    fill: (theme) => theme('colors'),
  },
})
```

## Preflight

To smooth over browser inconsistencies, Tailwind provide a [opinionated modern reset](https://tailwindcss.com/docs/preflight) stylesheet. By default the base reset styles will be injected into the head of the document before any other rules.

> 💡 This can be used to inject additional global styles.

- In order to prevent this from happening set this attribute to `false`.

  ```js
  setup({
    preflight: false,
  })
  ```

- If you would like to inject a custom reset instead then provide a function as a value.

  ```js
  setup({
    // preflight: the default preflight CSS object
    // context: tw, theme and, tag functions
    preflight: (preflight, { theme }) => ({ ...preflight /* ... */ }),
  })
  ```

- You can provide additional CSS rules as an object which are merged with the default reset.

  ```js
  setup({
    preflight: {
      /* ... */
    },
  })
  ```

- {@link twind.apply | apply} Tailwind rules

  ```js
  import { apply, setup } from 'twind'

  setup({
    preflight: {
      body: apply`bg-gray-900 text-white`,
    },
  })
  ```

- use {@link twind/css.css | css} to merge rules

  ```js
  import { css, theme, apply } from 'twind/css'

  setup({
    preflight: (preflight) =>
      css(
        preflight,
        {
          body: {
            backgroundColor: theme('colors.gray.900'),
          },
        },
        { body: apply`text-gray-100` },
      ),
  })

  // Or using template literal:

  setup({
    preflight: (preflight) => css`
      ${preflight}
      body {
        background-color: ${theme('colors.gray.900')};
        ${apply`text-gray-100`}
      }
    `,
  })
  ```

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

> 💡 If you are using JSON configuration the modes can be set using strings: `"strict"`, `"warn"` or `"silent"`.

## Hash

Most CSS-in-JS solutions, such as styled components or emotion will create hashed class names for rule sets. This makes sense because there is no logical way of naming an arbitrary set of styles. Doing this makes less sense when using an utility class approach because directives are usually carefully named.

By default, rules that are passed into the `tw` function are not hashed. This helps retain the advantage of using utility classes, aiding inspection and debugging.

To enable hashing of class names set `hash` to `true`.

```js
setup({
  hash: true,
})
```

Alternatively a custom hash function can be provided:

```js
import hash from '@emotion/hash'

setup({
  hash: (string) => 'tw-' + hash(string),
})
```

## Dark Mode

Now that dark mode is a first-class feature of many operating systems, it's becoming more and more common to design a dark version of your website to go along with the default design.

To make this as easy as possible, Twind includes a dark variant that lets you style your site differently when dark mode is enabled:

```js
tw`
  bg-white text-black
  dark:(bg-gray-800 text-white)`
```

> 💡 It's important to note that the dark mode variant is **always** enabled and available for all directives.

Now whenever dark mode is enabled on the user's operating system, `dark:{directive}` rules will take precedence over unprefixed rules. The `media` strategy uses the [prefers-color-scheme media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) under the hood, but if you'd like to support toggling dark mode manually, you can also use the `class` strategy which uses adds a `.dark` class selector for more control:

```js
setup({
  darkMode: 'class', // default is 'media'
})
```

For an example how to toggle dark mode manually read the [Tailwind Guide](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually).

## Sheet

Twind collects generated CSS rules in sheet to make theme available to the environment. By default Twind uses a speedy (CSSOM) implementation when running in the browser. On the server a no-op implementation is used.

### CSSOM Sheet

> 💡 This is the default implementation in browser environments.

If the `cssomSheet` is passed no `target` it looks for an style element with the id `__twind`. If no such element is found it will create one and append it to the `document.head`.

```js
import { setup, cssomSheet } from 'twind'

const sheet = cssomSheet({ target: new CSSStyleSheet() })
setup({ sheet })
```

> 💡 See [Examples - LitElement](./examples.md#litelement) how this can be used.

### Void Sheet

> 💡 This is the default implementation on server environments.

```js
import { setup, voidSheet } from 'twind'

setup({ sheet: voidSheet() })
```

### DOM Sheet

A sheet implementation which inserts style rules through the Document Object Model.

> 💡 This implementation is way slower than the default ([cssomSheet](#cssom-sheet)) but may be useful to see the generated CSS right in the DOM. Most modern browser display CSS rules from the speedy default sheet using their CSS inspector.

```js
import { setup } from 'twind'
import { domSheet } from 'twind/sheets'

setup({ sheet: domSheet() })
```

> 💡 See {@link twind/sheets} for details.

### Virtual Sheet

A sheet implementation which collects style rules into an array.

```js
import { setup } from 'twind'
import { virtualSheet } from 'twind/sheets'

const sheet = virtualSheet()
setup({ sheet })

// An array of all inserted CSS rules
sheet.target
```

> 💡 See {@link twind/sheets} for details.

### Custom Sheet Implementation

In case the builtin sheet implementations do not solve your use case, you can {@link twind/sheets | create your own}.

## Plugins

The `plugins` property allows to define new plugins or override core plugins. See {@page Plugins} for details.

## Variants

The `variants` property allows to define new variants or override {@page Tailwind Extensions | core variants}.

```js
setup({
  variants: {
    'not-checked': '&:not(:checked)',
  },
})
```
