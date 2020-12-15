# Customization

Understadably developers will more often than not, want to customize the out of the box experience. It is possible to do this with the exported `setup` function. Doing this will ultimately change the behaviour of calling the `tw` function, making it appropriate for your particular use case.

```js
import { setup } from 'tw-in-js'

setup({
  preflight: true, // include base style reset
  strict: false, // throw errors for invalid rules
  hash: false, // hash all generated class names
  theme: {}, // define custom theme values
})
```

The setup functions is a named export of the main module and accepts an config object as an argument.

## Preflight

To smooth over browser inconsistencies, Tailwind provide a [opinionated modern reset](https://tailwindcss.com/docs/preflight) stylesheet. By default the reset stylesheet will be download and injected into the head of the document as a link tag. In order to prevent this from happening set `preflight` to `false`.

## Strict

One benefit of doing compilation at runtime is that it is possible to warn developers about errors such as:

- Duplication: warn when two of the same rules exist within the same rule set
- Missing Translation: warn when an unrecognized rule is passed to the compiler

By default these warnings will be surfaced in the developer console but will not cause the program to properly throw an error and crash. However, sometimes this might be desireable; for example during testing or continuous integrations.

To force the program to error instead of warn set `strict` to `true`.

## Hash

Most CSS-in-JS solutions, such as styled components or emotion will create hashed class names for rule sets. This makes sense becuase there is no logical way of naming an arbritary set of styles. But it makes less sense to do when using an atomic utility class approach because are already carefully named.

By default, class names that are passed into the `tw` function are not hashed in any way. This helps retain the advantage of using utility classes, aiding inspection and debugging.

To enable hashing of class names set `hash` to `true`.

## Theme

Applying a new theme or extending the default is probably the most common customization. For maximum compatibility and ease of adoption, theming in `tw-in-js` works exactly the same as [theming in Tailwind](https://tailwindcss.com/docs/theme).

Here is an example of overriding and extending values in the theme:

```js
import { setup } from 'tw-in-js'

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
