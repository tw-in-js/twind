[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev/api/modules/twind_style.html)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc%2Fstyle?icon=github&label)](https://github.com/tw-in-js/twind/tree/v0.16/src/style)
[![Module Size](https://flat.badgen.net/badgesize/brotli/https://cdn.jsdelivr.net/npm/twind/style/style.min.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/style/style.js 'brotli module size')
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/style/style.d.ts)

`twind/style` is a framework agnostic component API that is heavily inspired by [stitches](https://stitches.dev). It allows you to define composable components which are typed automatically.

> For a preview of the React integration take a look at [@twind/react](https://github.com/tw-in-js/twind-react). Other framework integrations will follow.

```js
import { tw, style } from 'twind/style'

const button = style({
  // Define the base style using tailwindcss class names
  base: `rounded-full px-2.5`,

  // Declare all possible properties
  variants: {
    // button({ size: 'sm' })
    size: {
      sm: `text-sm h-6`,
      md: `text-base h-9`,
    },

    // button({ variant: 'primary' })
    variant: {
      gray: `
        bg-gray-400
        hover:bg-gray-500
      `,
      primary: `
        text-white bg-purple-400
        hover:bg-purple-500
      `,
    },
    // button({ outlined: true })
    outlined: {
      true: `bg-transparent ring-1`,
    },
  },

  // Set defaults for properties
  defaults: {
    variant: 'gray',
    size: 'sm',
  },

  // Apply additional styling based on the compination of properties
  matches: [
    {
      // If props match { variant: 'gray', outlined: true } add ring-gray-400
      variant: 'gray',
      outlined: true,
      use: `ring-gray-400`,
    },
  ],
})

// Use the defaults { variant: 'gray', size: 'sm }
tw(button())
// => rounded-full px-2.5 bg-gray-400 hover:bg-gray-500 text-sm h-6

// Customize the style
tw(button({ variant: 'primary', size: 'md', outlined: true }))
// => rounded-full px-2.5 text-white bg-purple-400 hover:bg-purple-500 text-base h-9 bg-transparent ring-1

// Matches props combination
tw(button({ outlined: true }))
// => rounded-full px-2.5 bg-gray-400 hover:bg-gray-500 text-sm h-6 bg-transparent ring-1 ring-gray-400

// Use the tw property to add special styles
tw(button({ tw: `rounded-sm px-4 mx-auto` }))
// => bg-gray-400 hover:bg-gray-500 text-sm h-6 rounded-sm px-4 mx-auto

// Use the css property to add special styles
tw(button({ css: { scrollSnapType: 'x' } }))
// => rounded-full px-2.5 bg-gray-400 hover:bg-gray-500 text-sm h-6 tw-css

// Add additional classes to the component (className is a convenience for jsx)
tw(button({ class: 'x y', className: 'a b' }))
// => rounded-full px-2.5 bg-gray-400 hover:bg-gray-500 text-sm h-6 x y a b
```

All configuration properties are optional in which case you have a component (often called box) that only accepts the `tw`, `css`, `class` and `className` properties.

```js
import { tw, style } from 'twind/style'

const box = style()

tw(box({ tw: `text-center` }))
```

Instead of using strings, eg tailwind class names, you can use CSS objects or the result of `css` or `apply`.

```js
import { tw, style, apply, css, theme } from 'twind/style'
import { lineClamp } from '@twind/line-clamp'

const card = style({
  base: apply`rounded-sm p-4 ${lineClamp(3)}`,

  variants: {
    size: {
      sm: 'text-sm',
      lg: css`
        font-size: 3rem;
        height: ${theme('spacing.12')};
      `,
    },
    variant: {
      gray: {
        backgroundColor: theme('colors.gray.400'),
        '&:hover': {
          backgroundColor: theme('colors.gray.500'),
        },
      },
    },
  },
})
```

## Responsive variants

You can apply different variants at different breakpoints or even [arbitrary at-rule](https://developer.mozilla.org/docs/Web/CSS/At-rule).

```js
import { tw, style } from 'twind/style'

const box = style({
  variants: {
    color: {
      coral: {
        backgroundColor: 'coral',
      },
      purple: {
        backgroundColor: 'purple',
      },
      tomato: {
        backgroundColor: 'tomato',
      },
    },
  },
})

tw(box({
  color: {
    // Optional initial value
    initial: 'coral',
    // Any theme screen value
    md: 'purple',
    // Some at-rule
    '@media (orientation: portrait)': 'tomato',
  },
})
```

### Composing Components

Components can be composed via the `style` function.

```js
import { tw, style } from 'twind/style'

const base = style({
  base: `bg-purple-500 text(white md) font-bold`,
  variants: {
    size: {
      small: `text-sm h-5 px-2`,
      large: `text-lg h-7 px-5`,
    },
  },
})

const pill = style(base, {
  base: 'rounded-full',
})

tw(base({ size: 'small' }))
// => bg-purple-500 text-white font-bold text-sm h-5 px-2

tw(pill({ size: 'large' }))
// => bg-purple-500 text-white font-bold text-lg h-7 px-5 rounded-full
```
