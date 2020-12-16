# Plugins

Theming and customization lets you specify the values that built in directives use and instruct the compiler to behave in a certain way. This is usually enough for most people but sometimes even more flexibility is required. When this is the case then most likely you are going to need to write a plugin.

> Note there are a handful of ways to build plugins but the API differs slightly to tailwind plugins

Plugins make it possible to extend the compilers grammar by adding new directives or variants. Language extension like this is achieved by providing plugins in the form of named functions to the setup function.

## Plugin without arguments

The simplest form of plugin is one that returns the literal CSS rules that the compiler should return in response to a single directive.

For example, say you wanted to support the directive `scroll-snap-x` based on the [scroll-snap API](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type) that isn't currently supported by tailwind.

Then you could create a plugin like so:

```js
import { setup } from '@tw-in-js/core'

setup({
  plugins: {
    'scroll-snap-x': { 'scroll-snap-type': 'x' },
  },
})
```

As you might expect, this will result in the compiler returning the CSS rule `{ scroll-snap-type: x }` every time it comes along the `scroll-snap-x` directive within a set of rules.

## Plugin with arguments

The above example is trivial to implement but it is contrived and only accounts for one of the many scroll snap types in the CSS specification. Although writing out all the possible rules like this would work in principle, it would be tiresome and be wasteful.

It is possible to generalize a plugins behavior, making its response dynamic by using a function:

```js
import { setup } from '@tw-in-js/core'

setup({
  plugins: {
    'scroll-snap': (parts) => ({ 'scroll-snap-type': parts[0] }),
  },
})
```

Plugins are passed two arguments:

- `parts`: the directive split on '-' with the plugin name excluded
- `context`: an object providing access to several commonly used functions

  - `theme`: the currently configured theme that is being used by the compiler
  - `tw`: the configured `tw` export
  - `tag`: generate a unique value; this can be used to create marker classes like `group`

Meaning that the example plugin above with cover more complex cases of the rule like `scroll-snap-x`, `scroll-snap-y` and `scroll-snap-y` etc. It is worth noting now that the whole of Twind is built upon this exact same premise, every rule outlined in the Tailwind docs has an equivalent plugin. We refer to these as _core plugins_.

> Core plugins cannot be deleted but they can be overwritten

## Plugins that reference the theme

The second named argument passed to a plugin is the configured theme that is being used by the compiler. This is not always required but is useful in circumstances where you might want to provide a default or user defined set of values for a directive to use.

```js
import { setup } from '@tw-in-js/core'

setup({
  theme: {
    scroll: {
      DEFAULT: 'both',
      proximity: 'both proximity',
    },
  },
  plugins: {
    'scroll-snap': (parts, { theme }) => ({
      'scroll-snap-type': theme('scroll', parts[0]),
    }),
  },
})
```

In the above example, the directive `scroll-snap` with no arguments with result in the CSS rule `{ scroll-snap-type: both }` being returned (the `DEFUALT` value from the theme). As you can see the `theme` that gets passed to plugins isn't an object but rather a function that takes a path and attempts to return a matching value from the theme.

The rules determining the theme functions behavior can be found in the [Tailwind documentation](https://tailwindcss.com/).

## Inline Plugin

The final kind of plugin is described as an inline plugin but is not strictly a plugin because it is not doesn't get defined up front in the setup function. It can be seen as an escape hatch when writing out rule sets for your components or apps.

Sometimes for example, you might find yourself wanting to write some arbritary CSS for an element. Some styles that are't covered by Tailwind API but perhaps isn't general enough to warrant creating a setup time plugin for. In this circumstance you can use an inline plugin:

```js
tw(({ theme }) => ({
  '&::before': { content: '🙁' }
  '&::after': { content: '😊' }
}))
```

Essentially an inline plugin is a function that returns some CSS rules in a CSS-in-JS object notation format. Here you can use the `&` selector to target the current element much like in other libraries like styled-components of emotion. Thus it is possible to writes styles in a way that is not possible with a style attribute alone; things like children or pseudo selectors.

Furthermore any active variants or groupings that are active when the plugin is called, will be respected by the return value. Meaning that you can scope inline plugin content with responsive variants:

```js
tw`
  sm:hover:${() => ({
    '&::before': { content: '🙁' }
    '&::after': { content: '😊' }
  })}
`
```

In the above example, the before and after styles are only applied on small screens and when the user is hovering over the element.
