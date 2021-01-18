# twind/css [![Module Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/twind/css/css.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/css/css.js 'brotli module size') [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc%2Fcss?icon=github&label)](https://github.com/tw-in-js/twind/tree/main/src/css) [![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/css/css.d.ts)

Sometimes you might find yourself wanting to write some arbitrary styles for an element. Some rule that isn't covered by Tailwind API but perhaps isn't general enough to warrant creating a real plugin for.

<details><summary>Table Of Contents (Click To Expand)</summary>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [CSS directive](#css-directive)
  - [Template Literals](#template-literals)
  - [Accessing the theme](#accessing-the-theme)
- [Animation Directive](#animation-directive)
- [Keyframes Helper](#keyframes-helper)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## CSS directive

Essentially a CSS directive uses some CSS rules in object notation format to create a optimized [inline plugin]('./plugins.md#inline-plugin). Here you can use the `&` selector to target the current element much like in other CSS-in-JS libraries. In this way, it is possible to write styles that cannot be described using an inline style attribute alone; things like specific children selectors.

```js
import { css } from 'twind/css'

tw(
  css({
    '&::before': { content: '"🙁"' },
    '&::after': { content: '"😊"' },
  }),
)
// => tw-xxxx
```

For best performance it is advised to extract CSS directive into a variable:

```js
const styles = css({
  '&::before': { content: '"🙁"' },
  '&::after': { content: '"😊"' },
})

tw(styles)
// => tw-xxxx
```

Furthermore any variants or groupings that are active when the CSS directive is called, will be respected by the return value. Meaning that you can scope CSS directives with responsive variants:

```js
tw`
  sm:hover:${css({
    '&::before': { content: '"🙁"' },
    '&::after': { content: '"😊"' },
  })}
`
// => sm:hover:tw-xxxx
```

Values within the CSS object can be functions which are called with the `context` and should return the value to be used:

```js
import { theme } from 'twind'

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

`css` allows to define global styles using the `:global` selector:

```js
const styles = css({
  ':global': {
    a: {
      color: theme('colors.blue.500'),
    },
  },
})
```

Tagged template literal syntax works like in emotion, goober or styled-components:

```js
const style = css`
  color: rebeccapurple;
  background-color: ${theme('colors.gray.500')};
  &:hover {
    ${tw.apply`text-purple-700`}
  }
`
```

> Please note that the template literal syntax has a little performance impact as twind needs to parse the CSS. For optimal performance use the object notation.

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

[tw.apply](./components) can be used within `css`:

```js
css(tw.apply`text-gray(700 dark:300)`, {
  p: tw.apply`my-5`,
  h1: tw.apply`text(black dark:white hover:purple-500)`,
})

// Or using template literals
css`
  ${tw.apply`text-gray(700 dark:300)`}

  p {
    ${tw.apply('my-5')}
  }
`
```

CSS directives can be used without applying it through `tw`:

```js
document.body.className = css({
  '&::before': { content: '"🙁"' },
  '&::after': { content: '"😊"' },
})
// => tw-xxxx
```

This works because they have a `toString()` function that internally calls default `tw` to generate a class name. To use a custom `tw` function you can bind the `css` function:

```js
import { create } from 'twind'

const { tw } = create(/* options */)
const cx = css.bind(tw)

document.body.className = cx({
  '&::before': { content: '"🙁"' },
  '&::after': { content: '"😊"' },
})

// Or providing tw on invocation
document.body.className = css.call(tw, {
  '&::before': { content: '"🙁"' },
  '&::after': { content: '"😊"' },
})
```

### Template Literals

### Accessing the theme

Values of the CSS object maybe functions that are passed the context and should return the value to be used:

```js
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

## Animation Directive

Custom animations are difficult to configure in Tailwind. During `setup` you need to add to the `theme.animation` section and the `theme.keyframes` section. This means all animations must known before hand and you can not use "one-off" animations.

With the `animation` exports this task is greatly simplified:

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
    ${tw.apply`transform-gpu translate-x-0`}
  }
  40%, 43% {
    ${tw.apply`transform-gpu -translate-x-7`}
  }
  70% {
    ${tw.apply`transform-gpu -translate-x-3.5`}
  },
  90% {
    ${tw.apply`transform-gpu -translate-x-1`}
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

The second parameter are the waypoints of a [@keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes) at-rule in CSS object format.

Just like CSS Directives they can be used without a `tw` function:

```js
document.body = bounce
```

To use a custom `tw` function you can bind the `animate` function just like you can with CSS directives.

```js
import { create } from 'twind'

const { tw } = create(/* options */)

const animate = animation.bind(tw)

// Or providing tw on invocation
const bounce = animation.call(tw, {
  /* same as above */
})
```

## Keyframes Helper

The `keyframes` export helps to create custom [@keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes):

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
    ${tw.apply`transform-gpu translate-x-0`}
  }
  40%, 43% {
    ${tw.apply`transform-gpu -translate-x-7`}
  }
  70% {
    ${tw.apply`transform-gpu -translate-x-3.5`}
  },
  90% {
    ${tw.apply`transform-gpu -translate-x-1`}
  }
`
```

The returned values can be used like this:

```js
// As second parameter for animation
animation('1s ease infinite', bounce)

// Within CSS directives
css({
  animation: '1s ease infinite',
  animationName: bounce,
})
```

Keyframes can be used without another `css` or `animation`:

```js
document.body.style.animation = `${bounce} 1s ease infinite`
```

This works because they have a `toString()` function that internally calls the default `tw` to generate a class name. To use a custom `tw` function you can bind the `keyframes` function:

```js
import { create } from 'twind'

const { tw } = create(/* options */)

const kf = keyframes.bind(tw)

// Or providing tw on invocation
const bounce = keyframes.call(tw, {
  /* same as above */
})
```

<hr/>

Continue to [Defining Components](./components.md)
