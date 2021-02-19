# Module: twind/css

[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev/docs/modules/twind_css.html)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc%2Fcss?icon=github&label)](https://github.com/tw-in-js/twind/tree/main/src/css)
[![Module Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/twind/css/css.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/css/css.js 'brotli module size')
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/css/css.d.ts)

Sometimes you might find yourself wanting to write some arbitrary styles for an element. Some rule that isn't covered by Tailwind API but perhaps isn't general enough to warrant creating a real plugin for.

## CSS directive

Essentially the [css](twind_css.md#css) directive uses some CSS rules in object notation, array or template literal format to create a optimized [inline plugin](https://twind.dev/docs/handbook/advanced/plugins.html#inline-plugins). Here you can use the `&` selector to target the current element much like in other CSS-in-JS libraries. In this way, it is possible to write styles that cannot be described using an inline style attribute alone; things like specific children selectors.

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

{@page Defining Components | apply} can be used within `css`:

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

### Accessing the theme

Values of the CSS object maybe functions that are passed the context and should return the value to be used:

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

## Screen Directive

The `screen` directive allows you to create media queries that reference your breakpoints by name instead of duplicating their values in your own CSS.

For example, say you have a `sm` breakpoint at `640px` and you need to write some custom CSS that references this breakpoint.

Instead of writing a raw media query that duplicates that value like this:

```js
css`
  @media (min-width: 640px) {
    /* ... */
  }
`
```

...you can use the `screen` directive and reference the breakpoint by name:

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

## Animation Directive

Custom animations are difficult to configure in Tailwind. During [twind.setup](twind.md#setup) you need to add to the `theme.animation` section and the `theme.keyframes` section. This means all animations must known before hand and you can not use "one-off" animations.

With the [animation](twind_css.md#animation) exports this task is greatly simplified:

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

## Keyframes Helper

The [keyframes](twind_css.md#keyframes) export helps to create custom [@keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes):

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

// Within CSS directives
css({
  animation: '1s ease infinite',
  animationName: bounce,
})
```

## Table of contents

### Interfaces

- [Animation](../interfaces/twind_css.animation.md)
- [CSSFactory](../interfaces/twind_css.cssfactory.md)
- [Screen](../interfaces/twind_css.screen.md)

## References

### apply

Re-exports: [apply](twind.md#apply)

___

### setup

Re-exports: [setup](twind.md#setup)

___

### theme

Re-exports: [theme](twind.md#theme)

___

### tw

Re-exports: [tw](twind.md#tw)

## Functions

### animation

▸ `Const`**animation**(`value`: *string* \| [*CSSRules*](../interfaces/twind.cssrules.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => *string*): [*CSSFactory*](../interfaces/twind_css.cssfactory.md)<Record<string, [*CSSProperties*](../interfaces/twind.cssproperties.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => [*CSSProperties*](../interfaces/twind.cssproperties.md)\>, [*CSSProperties*](../interfaces/twind.cssproperties.md) \| Record<string, [*CSSProperties*](../interfaces/twind.cssproperties.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => [*CSSProperties*](../interfaces/twind.cssproperties.md)\>, [*CSSRules*](../interfaces/twind.cssrules.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *string* \| [*CSSRules*](../interfaces/twind.cssrules.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => *string* |

**Returns:** [*CSSFactory*](../interfaces/twind_css.cssfactory.md)<Record<string, [*CSSProperties*](../interfaces/twind.cssproperties.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => [*CSSProperties*](../interfaces/twind.cssproperties.md)\>, [*CSSProperties*](../interfaces/twind.cssproperties.md) \| Record<string, [*CSSProperties*](../interfaces/twind.cssproperties.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => [*CSSProperties*](../interfaces/twind.cssproperties.md)\>, [*CSSRules*](../interfaces/twind.cssrules.md)\>

Defined in: [src/css/index.ts:218](https://github.com/gojutin/twind/blob/8f04bb3/src/css/index.ts#L218)

▸ `Const`**animation**(`value`: *string* \| [*CSSRules*](../interfaces/twind.cssrules.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => *string*, `waypoints`: *Record*<string, [*CSSProperties*](../interfaces/twind.cssproperties.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => [*CSSProperties*](../interfaces/twind.cssproperties.md)\> \| [*Directive*](../interfaces/twind.directive.md)<string\>): [*Directive*](../interfaces/twind.directive.md)<[*CSSRules*](../interfaces/twind.cssrules.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *string* \| [*CSSRules*](../interfaces/twind.cssrules.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => *string* |
`waypoints` | *Record*<string, [*CSSProperties*](../interfaces/twind.cssproperties.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => [*CSSProperties*](../interfaces/twind.cssproperties.md)\> \| [*Directive*](../interfaces/twind.directive.md)<string\> |

**Returns:** [*Directive*](../interfaces/twind.directive.md)<[*CSSRules*](../interfaces/twind.cssrules.md)\>

Defined in: [src/css/index.ts:218](https://github.com/gojutin/twind/blob/8f04bb3/src/css/index.ts#L218)

___

### css

▸ `Const`**css**(`strings`: *TemplateStringsArray*, ...`interpolations`: readonly [*MaybeThunk*](twind.md#maybethunk)<[*MaybeArray*](twind.md#maybearray)<undefined \| *null* \| string \| number \| *false* \| void \| [*CSSRules*](../interfaces/twind.cssrules.md)\>\>[]): [*Directive*](../interfaces/twind.directive.md)<[*CSSRules*](../interfaces/twind.cssrules.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`strings` | *TemplateStringsArray* |
`...interpolations` | readonly [*MaybeThunk*](twind.md#maybethunk)<[*MaybeArray*](twind.md#maybearray)<undefined \| *null* \| string \| number \| *false* \| void \| [*CSSRules*](../interfaces/twind.cssrules.md)\>\>[] |

**Returns:** [*Directive*](../interfaces/twind.directive.md)<[*CSSRules*](../interfaces/twind.cssrules.md)\>

Defined in: [src/css/index.ts:142](https://github.com/gojutin/twind/blob/8f04bb3/src/css/index.ts#L142)

▸ `Const`**css**(`tokens`: [*MaybeThunk*](twind.md#maybethunk)<[*MaybeArray*](twind.md#maybearray)<undefined \| *null* \| *false* \| void \| ** \| *0* \| [*CSSRules*](../interfaces/twind.cssrules.md)\>\>): [*Directive*](../interfaces/twind.directive.md)<[*CSSRules*](../interfaces/twind.cssrules.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`tokens` | [*MaybeThunk*](twind.md#maybethunk)<[*MaybeArray*](twind.md#maybearray)<undefined \| *null* \| *false* \| void \| ** \| *0* \| [*CSSRules*](../interfaces/twind.cssrules.md)\>\> |

**Returns:** [*Directive*](../interfaces/twind.directive.md)<[*CSSRules*](../interfaces/twind.cssrules.md)\>

Defined in: [src/css/index.ts:142](https://github.com/gojutin/twind/blob/8f04bb3/src/css/index.ts#L142)

▸ `Const`**css**(...`tokens`: readonly [*MaybeThunk*](twind.md#maybethunk)<undefined \| *null* \| *false* \| void \| ** \| *0* \| [*CSSRules*](../interfaces/twind.cssrules.md)\>[]): [*Directive*](../interfaces/twind.directive.md)<[*CSSRules*](../interfaces/twind.cssrules.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`...tokens` | readonly [*MaybeThunk*](twind.md#maybethunk)<undefined \| *null* \| *false* \| void \| ** \| *0* \| [*CSSRules*](../interfaces/twind.cssrules.md)\>[] |

**Returns:** [*Directive*](../interfaces/twind.directive.md)<[*CSSRules*](../interfaces/twind.cssrules.md)\>

Defined in: [src/css/index.ts:142](https://github.com/gojutin/twind/blob/8f04bb3/src/css/index.ts#L142)

___

### keyframes

▸ `Const`**keyframes**(`strings`: *TemplateStringsArray*, ...`interpolations`: readonly [*MaybeThunk*](twind.md#maybethunk)<[*MaybeArray*](twind.md#maybearray)<undefined \| *null* \| string \| number \| *false* \| void \| [*CSSProperties*](../interfaces/twind.cssproperties.md) \| Record<string, [*CSSProperties*](../interfaces/twind.cssproperties.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => [*CSSProperties*](../interfaces/twind.cssproperties.md)\>\>\>[]): [*Directive*](../interfaces/twind.directive.md)<string\>

```js
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

css({
  animation: `${bounce} 1s ease infinite`,
})
```

#### Parameters:

Name | Type |
:------ | :------ |
`strings` | *TemplateStringsArray* |
`...interpolations` | readonly [*MaybeThunk*](twind.md#maybethunk)<[*MaybeArray*](twind.md#maybearray)<undefined \| *null* \| string \| number \| *false* \| void \| [*CSSProperties*](../interfaces/twind.cssproperties.md) \| Record<string, [*CSSProperties*](../interfaces/twind.cssproperties.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => [*CSSProperties*](../interfaces/twind.cssproperties.md)\>\>\>[] |

**Returns:** [*Directive*](../interfaces/twind.directive.md)<string\>

Defined in: [src/css/index.ts:182](https://github.com/gojutin/twind/blob/8f04bb3/src/css/index.ts#L182)

▸ `Const`**keyframes**(`tokens`: [*MaybeThunk*](twind.md#maybethunk)<[*MaybeArray*](twind.md#maybearray)<undefined \| *null* \| *false* \| void \| ** \| *0* \| Record<string, [*CSSProperties*](../interfaces/twind.cssproperties.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => [*CSSProperties*](../interfaces/twind.cssproperties.md)\>\>\>): [*Directive*](../interfaces/twind.directive.md)<string\>

```js
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

css({
  animation: `${bounce} 1s ease infinite`,
})
```

#### Parameters:

Name | Type |
:------ | :------ |
`tokens` | [*MaybeThunk*](twind.md#maybethunk)<[*MaybeArray*](twind.md#maybearray)<undefined \| *null* \| *false* \| void \| ** \| *0* \| Record<string, [*CSSProperties*](../interfaces/twind.cssproperties.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => [*CSSProperties*](../interfaces/twind.cssproperties.md)\>\>\> |

**Returns:** [*Directive*](../interfaces/twind.directive.md)<string\>

Defined in: [src/css/index.ts:182](https://github.com/gojutin/twind/blob/8f04bb3/src/css/index.ts#L182)

▸ `Const`**keyframes**(...`tokens`: readonly [*MaybeThunk*](twind.md#maybethunk)<undefined \| *null* \| *false* \| void \| ** \| *0* \| Record<string, [*CSSProperties*](../interfaces/twind.cssproperties.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => [*CSSProperties*](../interfaces/twind.cssproperties.md)\>\>[]): [*Directive*](../interfaces/twind.directive.md)<string\>

```js
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

css({
  animation: `${bounce} 1s ease infinite`,
})
```

#### Parameters:

Name | Type |
:------ | :------ |
`...tokens` | readonly [*MaybeThunk*](twind.md#maybethunk)<undefined \| *null* \| *false* \| void \| ** \| *0* \| Record<string, [*CSSProperties*](../interfaces/twind.cssproperties.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => [*CSSProperties*](../interfaces/twind.cssproperties.md)\>\>[] |

**Returns:** [*Directive*](../interfaces/twind.directive.md)<string\>

Defined in: [src/css/index.ts:182](https://github.com/gojutin/twind/blob/8f04bb3/src/css/index.ts#L182)

___

### screen

▸ `Const`**screen**(`size`: *string*): [*Directive*](../interfaces/twind.directive.md)<string\>

#### Parameters:

Name | Type |
:------ | :------ |
`size` | *string* |

**Returns:** [*Directive*](../interfaces/twind.directive.md)<string\>

Defined in: [src/css/index.ts:254](https://github.com/gojutin/twind/blob/8f04bb3/src/css/index.ts#L254)

▸ `Const`**screen**(`size`: *string*, `css`: *undefined* \| *null* \| *false* \| *void* \| ** \| *0* \| [*CSSRules*](../interfaces/twind.cssrules.md) \| [*Directive*](../interfaces/twind.directive.md)<[*CSSRules*](../interfaces/twind.cssrules.md)\> \| readonly (*undefined* \| *null* \| *false* \| *void* \| ** \| *0* \| [*CSSRules*](../interfaces/twind.cssrules.md))[]): [*Directive*](../interfaces/twind.directive.md)<[*CSSRules*](../interfaces/twind.cssrules.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`size` | *string* |
`css` | *undefined* \| *null* \| *false* \| *void* \| ** \| *0* \| [*CSSRules*](../interfaces/twind.cssrules.md) \| [*Directive*](../interfaces/twind.directive.md)<[*CSSRules*](../interfaces/twind.cssrules.md)\> \| readonly (*undefined* \| *null* \| *false* \| *void* \| ** \| *0* \| [*CSSRules*](../interfaces/twind.cssrules.md))[] |

**Returns:** [*Directive*](../interfaces/twind.directive.md)<[*CSSRules*](../interfaces/twind.cssrules.md)\>

Defined in: [src/css/index.ts:254](https://github.com/gojutin/twind/blob/8f04bb3/src/css/index.ts#L254)
