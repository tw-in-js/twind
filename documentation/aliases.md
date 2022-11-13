---
section: Advanced
title: Aliases
excerpt: Aliases allow to define a set of utilities as a single utility.
next: ./library-mode.md
---

Aliases are used to create a set of utilities which can be referenced by a single utility. This is useful to create a set of utilities which are used together often.

1. [`shortcut`](#shortcut-aliases) — styles are generated as defined by twind — same as if they where used alone
1. [`apply`](#apply-aliases) — styles are generated in order they are declared

They can be defined inline (within a class attribute or class name string), the [rules configuration](./rules#static-alias-rules), or using a helper function. Additionally, they can be named or anonymous.

The generated style of an alias is always a single class and put into the `shortcuts` layer. This allows other utilities to override the styles of an alias.

> **Tip**
> For complex scenarios, it is recommended to use [style](./component-styles) instead of aliases.

## Shortcut Aliases

Shortcut aliases are the simplest type of aliases. They are used to create a shortcut for multiple utilities where the styles are generated as defined by twind — same as if they where used alone.

### Inline Shortcuts

```html
<!-- anonymous -->
<div class="~(py-2 px-4 font-semibold rounded-lg shadow-md)">
  <!-- ... -->
</div>

<!-- named -->
<div class="Card~(py-2 px-4 font-semibold rounded-lg shadow-md)">
  <!-- ... -->
</div>
```

Shortcuts are especially useful within component libraries as they allow users of the library to selectively override the styles of a component.

```jsx [3,6-8,16,19]
import { cx } from 'twind'

function Card({ className, ...props }) {
  return (
    <div
      className={cx(
        'Card~(py-2 px-4 font-semibold rounded-lg shadow-md)',
        className,
      )}
      {...props}
    />
  )
}

// Standard style
<Card />

// Override style
<Card className="rounded-sm shadow-none" />
```

### `shortcut` helper

> **Important** > `shortcut` does **not** inject the styles into the document. The returned class name must be used within a class attribute or a class name string.

```js
import { shortcut } from 'twind'

// anonymous
const card = shortcut('py-2 px-4 font-semibold rounded-lg shadow-md')

// named
const card = shortcut.Card('py-2 px-4 font-semibold rounded-lg shadow-md')
```

## Apply Aliases

Apply aliases are similar to shortcut aliases **but** styles are generated in order they are declared. This matches the behavior of the `@apply` directive of Tailwind CSS ([Extracting classes with @apply](https://tailwindcss.com/docs/reusing-styles#extracting-classes-with-apply)).

Consider the following utilities: `py-2 p-4`.

- `shortcut` — The `py-4` utility will override the `p-2` utility
- `apply` — The `p-4` utility will override the `py-2` utility

> **Caution**
> Almost always you want to use [`shortcut`](#shortcut-aliases) instead of `apply`. The only exception is when the implicit order of styles does not match your expectation.

### Inline Apply

```html
<!-- anonymous -->
<div class="@(py-2 px-4 font-semibold rounded-lg shadow-md)">
  <!-- ... -->
</div>

<!-- named -->
<div class="Card@(py-2 px-4 font-semibold rounded-lg shadow-md)">
  <!-- ... -->
</div>
```

### `apply` helper

> **Important** > `apply` does **not** inject the styles into the document. The returned class name must be used within a class attribute or a class name string.

```js
import { apply } from 'twind'

// anonymous
const card = apply('py-2 px-4 font-semibold rounded-lg shadow-md')

// named
const card = apply.Card('py-2 px-4 font-semibold rounded-lg shadow-md')
```
