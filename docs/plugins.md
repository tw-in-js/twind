# Plugins

Theming and customization lets you specify how core plugins and the compiler behave. This is usually ample for most use cases but sometimes more flexibility is required. Sometimes you might want to extend the abilities of the compiler. When this is the case then most likely you are going to need to write a plugin.

> Note that currently the plugin API for Twind differs slightly to tailwind plugins

Plugins make it possible to extend the compilers grammar by adding new directives or variants. Language extension like this is achieved by providing plugins as named functions during setup.

## Plugin without arguments

The simplest form of plugin is one that returns the literal CSS rules that the compiler should return in response to a single directive.

For example, say you wanted to take advantage of the [scroll-snap API](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type) which isn't supported by tailwind currently.

You could create a simple plugin like so:

```js
import { setup } from 'twind'

setup({
  plugins: {
    'scroll-snap-x': { 'scroll-snap-type': 'x' },
  },
})
```

The above code will result in the compiler returning `{ scroll-snap-type: x }` every time it encounters the directive `scroll-snap-x` within a set of rules.

## Plugin with arguments

The previous example is trivial to implement but it only accounts for one of the many valid scroll snap values in the CSS specification. It is possible to write out all the possible scroll-snap rules like this but it would be arduous and somewhat wasteful.

It is possible to generalize a plugins behavior by using a function:

```js
import { setup } from 'twind'

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

This means that the plugin above now covers more single part cases like `scroll-snap-x`, `scroll-snap-y` and `scroll-snap-none` etc. It is worth noting now that the whole of Twind is built upon this exact same premise, every rule outlined in the Tailwind docs has an equivalent plugin. We refer to these as _core plugins_.

> Core plugins cannot be deleted but they can be overwritten

If we wanted to take this one step futher and cover all scroll-snap cases then we could do something like:

```js
setup({
  plugins: {
    'scroll-snap': (parts) => ({ 'scroll-snap-type': parts.join(' ') }),
  },
})
```

This would now work for multi-part rules like `scroll-snap-both-proximity` which would return `{ scroll-snap-type: both proximity; }` demonstrating how parts can be combined to produce output which adheres to whatever CSS specification they are trying to abstract over.

## Plugins that reference the theme

The second named argument passed to a plugin is the configured theme that is being used by the compiler. This is not always required but is useful in circumstances where you might want to provide a default or configurable set of values for a given directive.

```js
import { setup } from 'twind'

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

In the above example, the directive `scroll-snap` with no arguments with result in the CSS rule `{ scroll-snap-type: both }` being returned (using the `DEFUALT` value from the theme). The `theme` that gets passed to plugins isn't an object but rather a function that takes a path and attempts to return a value from that location in the theme.

Rules determining the theme functions behavior can be found in the [Tailwind documentation](https://tailwindcss.com/).

## Inline Plugin

The final kind of plugin is described as an inline plugin but is not strictly a plugin because it doesn't get defined up front in the setup function. They can be used as an escape hatch when writing out "one off" rules.

Sometimes you might find yourself wanting to write some arbitrary styles for an element. Some rule that isn't covered by Tailwind API but perhaps isn't general enough to warrant creating a real plugin for.

If you find yourself in this circumstance, use an inline plugin:

```js
tw(({ theme }) => ({
  '&::before': { content: '🙁' }
  '&::after': { content: '😊' }
}))
```

Essentially an inline plugin is a function that returns some CSS rules in object notation format. Here you can use the `&` selector to target the current element much like in other CSS-in-JS libraries. In this way, it is possible to write styles that cannot be described using an inline style attribute alone; things like children or pseudo selectors.

Furthermore any variants or groupings that are active when the plugin is called, will be respected by the return value. Meaning that you can scope inline plugin content with responsive variants:

```js
tw`
  sm:hover:${() => ({
    '&::before': { content: '🙁' }
    '&::after': { content: '😊' }
  })}
`
```

In the above example, the before and after styles are only applied on small screens and when the user is hovering over the element.

Additionally inline plugins allow to extract common definitions:

```js
const link = ({ tw }) => tw`text-cyan-600 hover:text-cyan-700`

tw`font-bold ${link}`
// => font-bold text-cyan-600 hover:text-cyan-700
```

<hr/>

Continue to [Contributing](./contributing.md)
