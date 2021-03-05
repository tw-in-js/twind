---
title: CSS in Twind
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: How to write CSS in your Twind project.
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

`twind/css` provides a set of utilities that allow you to write arbitrary CSS within Twind with support for global styles, animations, and more.

:::tip
It is recommended to try to stay within the constraints of the Twind rules when possible. Applying arbitrary CSS should be generally be viewed as an escape hatch.
:::

## The `css` function

This function allows you to write CSS within Twind and provides support for global styling.

You can use the `&` selector to target the current element much like in other CSS-in-JS libraries:

```js
import { tw, css } from 'twind/css'

tw(
  css({
    '&::before': { content: '"🙁"' },
    '&::after': { content: '"😊"' },
  }),
)
// => tw-xxxx
```

For optimal performance, it is advised to extract your `css` function call into a variable:

```js
const styles = css({
  '&::before': { content: '"🙁"' },
  '&::after': { content: '"😊"' },
})

tw(styles)
// => tw-xxxx
```

Any variants or groupings that are active when the `css` function is called will be respected by the return value. This means that you can scope a `css` call with every variant:

```js
tw`
  sm:hover:${css({
    '&::before': { content: '"🙁"' },
    '&::after': { content: '"😊"' },
  })}
`
// => sm:hover:tw-xxxx
```

Values within the CSS object can be functions which are called with the context and should return the value to be used:

```js
import { css, theme } from 'twind/css'

const styles = css({
  // .tw-xxx a
  a: {
    color: theme('colors.blue.500'),
    // .tw-xxx a:hover
    '&:hover': {
      color: theme('colors.blue.700'),
    },
  },
})
```

Tagged template literal syntax works like in emotion, goober or styled-components:

```js
import { css, apply, theme } from 'twind/css'

const style = css`
  color: rebeccapurple;
  background-color: ${theme('colors.gray.500')};
  &:hover {
    ${apply`text-purple-700`}
  }
`
```

> ❗ Please note that the template literal syntax has a little performance impact as Twind needs to parse the CSS. For optimal performance use the object notation.

Variadic arguments and arrays (nested as deep as you like) are supported as well:

```js
const style = css(
  {
    backgroundColor: 'hotpink',
    '&:hover': {
      color: 'darkgreen',
    },
  },
  {
    color: 'red',
  },
)

const style = css([
  {
    backgroundColor: 'hotpink',
    '&:hover': {
      color: 'darkgreen',
    },
  },
  {
    color: 'red',
  },
])
```

`apply` can be used within `css`:

```js
import { css, apply } from 'twind/css'

css(apply`text-gray(700 dark:300)`, {
  p: apply`my-5`,
  h1: apply`text(black dark:white hover:purple-500)`,
})

// Or using template literals
css`
  ${apply`text-gray(700 dark:300)`}

  p {
    ${apply('my-5')}
  }

  h1 {
    ${apply`text(black dark:white hover:purple-500)`}
  }
`
```

For convenience, Twind provides the `@apply` CSS rule:

```js
css`
  @apply text-gray(700 dark:300);

  p {
    @apply my-5;
  }

  h1 {
    @apply text(black dark:white hover:purple-500);
  }
`

css`
  @apply ${['font-bold', false && 'underline', 'py-2 px-4']};
  color: fuchsia;
`
```

`@apply` can be used in the object notation as well:

```js
css({
  '@apply': 'font-bold py-2 px-4 underline',
  // '@apply': ['font-bold py-2 px-4', false && underline'],
  color: 'fuchsia',
  transform: 'translateY(-1px)',
})
```

## The `theme` function

This function can be used to access theme values inside of a `css` function call.

```js
import { css, theme } from 'twind/css'

css({
  color: theme('colors.blue.500'),
  '&:hover': {
    color: theme('colors.blue.700'),
  },
})

css({
  a: {
    color: theme('colors.blue.500'),
    // .tw-xxx a:hover
    '&:hover': {
      color: theme('colors.blue.700'),
    },
  },
})
```

## The `screen` function

This function allows you to create media queries that reference your Twind breakpoints by name (`sm`,`md`, etc.).

For example, say you have a `sm` breakpoint at `640px` and you need to write some custom CSS that references this breakpoint.

Instead of writing a raw media query that duplicates that value like this:

```js
css`
  @media (min-width: 640px) {
    /* ... */
  }
`
```

...you can use the `screen` function and reference the breakpoint by name:

```js
import { css, screen, apply } from 'twind/css'

// With template literal
css`
  ${screen('sm')} {
    /* ... */
  }
  ${screen('md', css` /* ... */ `)}
  ${screen('lg', css({ /* ... */ }))}
  ${screen('xl', { /* ... */ })}
  ${screen('2xl', apply` ... `)}
`

// With object notation
css(
  screen('md', css` /* ... */ `),
  screen('lg', css({ /* ... */ })),
  screen('xl', { /* ... */ }),
  screen('2xl', apply` ... `),
)
`
```

For convenience, Twind provides the `@screen` CSS rule:

```js
import { css, screen, apply } from 'twind/css'

// With template literal
css`
  @screen sm {
    /* ... */
  }
`

// With object notation
css({
  '@screen md': {
    /* ... */
  }
})
`
```

## The `animation` function

This function provides a simplified abstraction for creating custom animations within a `css` function call.

Custom animations are difficult to configure in Tailwind. During `setup` you need to add to the `theme.animation` section and the `theme.keyframes` section. This means all animations must known before hand and you can not use "one-off" animations.

With the `animation` exports, this task is greatly simplified:

```js
import { animation } from 'twind/css'

const bounce = animation('1s ease infinite', {
  'from, 20%, 53%, 80%, to': {
    transform: 'translate3d(0,0,0)',
  },
  '40%, 43%': {
    transform: 'translate3d(0, -30px, 0)',
  },
  '70%': {
    transform: 'translate3d(0, -15px, 0)',
  },
  '90%': {
    transform: 'translate3d(0, -4px, 0)',
  },
})

tw`hover:${bounce}`
```

Template literal syntax is supported as well:

```js
const bounce = animation('1s ease infinite')`
  from, 20%, 53%, 80%, to {
    ${apply`transform-gpu translate-x-0`}
  }
  40%, 43% {
    ${apply`transform-gpu -translate-x-7`}
  }
  70% {
    ${apply`transform-gpu -translate-x-3.5`}
  },
  90% {
    ${apply`transform-gpu -translate-x-1`}
  }
`
```

The first argument can be a [animation shorthand CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/animation) string, an object of CSS animation properties or a function which is passed the context to return the shorthand CSS:

```js
const slidein = animation(
  ({ theme }) => `${theme('durations.500')} ${theme('transitionTimingFunction.in-out')}`,
  {
    from: {
      transform: 'translateX(0%)',
    },
    to: {
      transform: 'translateX(100%)',
    },
  },
)

import { theme } from 'twind'

const bounce = animation(
  {
    animationDuration: '1s',
    animationTimingFunction: theme('transitionTimingFunction.in-out'),
    animationIterationCount: 'infinite',
  },
  {
    /* keyframes */
  },
)
```

The second parameter are the waypoints of a [@keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes) at-rule in CSS object format. The [keyframes helper](#keyframes-helper) can be used the create waypoints.

The result of `animation` can be used within `css`:

```js
css(bounce, {
  /* other properties */
})

css`
  ${bounce}
`
```

## The `keyframes` function

This function provides a simple way to define [keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes) for use within an `animation` function call.

```js
import { keyframes } from 'twind/css'

const bounce = keyframes({
  'from, 20%, 53%, 80%, to': {
    transform: 'translate3d(0,0,0)',
  },
  '40%, 43%': {
    transform: 'translate3d(0, -30px, 0)',
  },
  '70%': {
    transform: 'translate3d(0, -15px, 0)',
  },
  '90%': {
    transform: 'translate3d(0, -4px, 0)',
  },
})
```

Template literal syntax is supported as well:

```js
const bounce = keyframes`
  from, 20%, 53%, 80%, to {
    ${apply`transform-gpu translate-x-0`}
  }
  40%, 43% {
    ${apply`transform-gpu -translate-x-7`}
  }
  70% {
    ${apply`transform-gpu -translate-x-3.5`}
  },
  90% {
    ${apply`transform-gpu -translate-x-1`}
  }
`
```

The returned values can be used like this:

```js
// As second parameter for animation
animation('1s ease infinite', bounce)

// Within CSS functions
css({
  animation: '1s ease infinite',
  animationName: bounce,
})
```

## Global styles

The `css` function provided by the `twind/css` module provides an easy way to inject global styles into your app using the `:global` selector.

```js
import { tw } from 'twind'
import { css } from 'twind/css'

const globalStyles = css({
  ':global': {
    a: {
      color: '#333',
    },
  },
})

document.getElementById('app').innerHTML = `
<div class=${tw(globalStyles)}>
<h1>Hello Twind!</h1>
<p>
  Look
  <a href="https://twind.dev">here</a>
  for more info about Twind.
</p>
</div>
`
```

You can use the `theme` function to apply theme values, the `apply` function to apply Twind classes, and much more.

```js
import { tw } from 'twind'
import { css, apply, theme } from 'twind/css'

const globalStyles = css({
  ':global': {
    a: {
      color: theme('colors.blue.500'),
      '&:hover': apply`text-blue-700`,
    },
  },
})

document.getElementById('app').innerHTML = `
<div class=${tw(globalStyles)}>
<h1>Hello Twind!</h1>
<p>s
  Look
  <a href="https://twind.dev">here</a>
  for more info about Twind.
</p>
</div>
`
```

You have the full power of the `twind/css` module when writing global styles. This approach also allows you to inject global styles anywhere in your app, which is useful for multi-page apps.
