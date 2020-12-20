# twind/css

Sometimes you might find yourself wanting to write some arbitrary styles for an element. Some rule that isn't covered by Tailwind API but perhaps isn't general enough to warrant creating a real plugin for.

TODO test animation in example

## CSS directive

Essentially a CSS directive uses some CSS rules in object notation format to create a optimized [inline plugin]('./plugins.md#inline-plugin). Here you can use the `&` selector to target the current element much like in other CSS-in-JS libraries. In this way, it is possible to write styles that cannot be described using an inline style attribute alone; things like specific children selectors.

```js
import { css } from 'twind/css'

tw(css({
  '&::before': { content: '🙁' }
  '&::after': { content: '😊' }
}))
// => tw-xxxx
```

For best performance it is advised to extract CSS directive into a variable:

```js
const styles = css({
  '&::before': { content: '🙁' }
  '&::after': { content: '😊' }
})

tw(styles)
// => tw-xxxx
```

Furthermore any variants or groupings that are active when the CSS directive is called, will be respected by the return value. Meaning that you can scope CSS directives with responsive variants:

```js
tw`
  sm:hover:${css({
    '&::before': { content: '🙁' }
    '&::after': { content: '😊' }
  })}
`
// => sm:hover:tw-xxxx
```

CSS directives can be used without applying it through `tw`:

```js
document.body.className = css({
  '&::before': { content: '🙁' }
  '&::after': { content: '😊' }
})
// => tw-xxxx
```

This works because they have a `toString()` function that internally calls default `tw` to generate a class name. To use a custom `tw` function you can bind the `css` function:

```js
import { create } from 'twind'

const { tw } = create(/* options */)
const cx = css.bind(tw)

document.body.className = cx({
  '&::before': { content: '🙁' }
  '&::after': { content: '😊' }
})

// Or providing tw on invocation
document.body.className = css.call(tw, {
  '&::before': { content: '🙁' }
  '&::after': { content: '😊' }
})

// Or providing tw on generation
const smiley = css({
  '&::before': { content: '🙁' }
  '&::after': { content: '😊' }
})
document.body.className = smiley({ tw })
```

## Animation Directive

Custom animations are difficult to configure in Tailwind. During `setup` you to add to the `theme.animation` section and the `theme.keyframes` section. This must know all animation before hand and can not use "one-off" animations.

With the `animation` exports this task is greatly simplified:

```js
import { css } from 'twind/css'

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
  }
})

tw`hover:${bounce}`
```

The first argument can be a [animation shorthand CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/animation) string, an object of CSS animation properties or a function which is passed the context:

```js
const slidein = animation(
  ({ theme }) =>
    `${theme('durations', '500')} ${theme('transitionTimingFunction', 'in-out')}`,
  {
    from: {
      transform: 'translateX(0%)',
    },
    to: {
      transform: 'translateX(100%)',
    },
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
const bounce = animation.call(tw, { /* same as above */ })

// Or providing tw on generation
const slidein = animation('1s slidein', {
  from: {
    transform: 'translateX(0%)',
  },
  to: {
    transform: 'translateX(100%)'
  },
})
slidein({ tw })
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
  }
})
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
const bounce = keyframes.call(tw, { /* same as above */ })

// Or providing tw on generation
const slidein = keyframes({
  from: {
    transform: 'translateX(0%)',
  },
  to: {
    transform: 'translateX(100%)'
  },
})
slidein({ tw })
```
