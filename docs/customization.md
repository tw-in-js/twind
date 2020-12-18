# Customization

Understandably developers will more often than not want to customize the out of the box experience. It is possible to achieve this with the `setup` function. Doing so will ultimately change the behaviour of calling the `tw` function, making it appropriate for your particular use case.

```js
import { setup, strict } from 'twind'

setup({
  preflight: false, // do not include base style reset
  mode: strict, // throw errors for invalid rules
  hash: true, // hash all generated class names
  theme: {}, // define custom theme values
})
```

The setup functions is a named export of the main module and accepts an config object as an argument.

## Preflight

To smooth over browser inconsistencies, Tailwind provide a [opinionated modern reset](https://tailwindcss.com/docs/preflight) stylesheet. By default the base reset styles will be injected into the head of the document before any other rules.

- In order to prevent this from happening set this attribute to `false`.
- If you would like to inject a custom reset instead then provide a function as a value.

## Strict

One benefit of doing compilation at runtime is that it is possible to warn developers about errors such as:

- Unknown directive: warn when an unrecognized rule is encountered
- Missing theme value: warn when a unknown theme value is encountered

By default these kind of warnings will be surfaced in the developer console but will not cause the program to throw an error and crash.

However, sometimes throwing an error might be desirable; for example during testing or continuous integrations.

To force the program to error instead of warn set `mode` to `strict`:

```js
import { setup, strict } from 'twind'

setup({
  mode: 'strict', // throw errors for invalid rules instead of logging
})
```

## Hash

Most CSS-in-JS solutions, such as styled components or emotion will create hashed class names for rule sets. This makes sense because there is no logical way of naming an arbritary set of styles. Doing this makes less sense when using an atomic utility class approach because directives are usually atomic and carefully named.

By default, shorthand that is passed into the `tw` function is not hashed. This helps retain the advantage of using utility classes, aiding inspection and debugging.

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

<hr/>

Continue to [Grouping](./grouping.md)
