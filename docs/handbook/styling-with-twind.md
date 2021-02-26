---
title: Styling with Twind
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: How to style your Twind projects with the tw function
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

## The `tw` function

At the heart of Twind is the `tw` function. This function works by:

- Interpreting and normalizing rules that are provided to it and compiling them into CSS styles
- Injecting those styles into the head of the document
- Returning class name(s) that associate the injected styles to the element

Take this simple example:

```js
document.body.innerHTML = `<p class=${tw`text-blue-500`}>Hello twind!</p>`
```

The class name of `text-blue-500` would be returned to the `p` element's class attribute and a stylesheet similar to the example below would be injected in the head of the document:

```css
.text-blue-500 {
  --tw-text-opacity: 1;
  color: rgba(59, 130, 246, var(--tw-text-opacity));
}
```

The `tw` function accepts a variety of inputs (inspired heavily by [clsx](https://npmjs.com/clsx)):

- Template Literal (recommended)

  ```tsx
  tw`bg-gray-200 ${false && 'rounded'}`
  ```

- Objects

  ```tsx
  tw({ 'bg-gray-200': true, rounded: false, underline: isTrue() })
  ```

- Strings

  ```tsx
  tw('bg-gray-200', true && 'rounded', 'underline')
  ```

- Arrays

  ```tsx
  tw(['bg-gray-200'], ['', 0, false, 'rounded'], [['underline']])
  ```

- Variadic (mixed)

  ```tsx
  tw('bg-gray-200', [
    1 && 'rounded',
    { underline: false, 'text-black': null },
    ['text-lg', ['shadow-lg']],
  ])
  ```

Falsy values, standalone booleans, and number values are always discarded:

```js
// Strings
tw('bg-gray-200', true && 'rounded', 'underline')
//=> bg-gray-200 rounded underline

// Objects
tw({ 'bg-gray-200': true, rounded: false, underline: isTrue() })
//=> bg-gray-200 underline

// Arrays
tw(['bg-gray-200', 0, false, 'rounded'])
//=> bg-gray-200 rounded

// Mixed
tw('bg-gray-200', [
  1 && 'rounded',
  { underline: false, 'text-black': null },
  ['text-lg', ['shadow-lg']],
])
//=> bg-gray-200 rounded text-lg shadow-lg
```

## The `apply` function

The `apply` function is used to compose styles that can be later be overwritten in a `tw` call. It's a companion to the `tw` function and useful for composition.

:::warning
The `apply` function returns a function that must be passed to a `tw` call before those styles are applied to the document. In other words, the function does nothing outside of a `tw` call.
:::

```js
import { apply } from 'twind'

const btn = apply`inline-block bg-gray-500 text-base`
// => generates a CSS class with all declarations of the above rules when used

const btnBlock = apply`${btn} block`
// => generates a CSS class with all declarations of btn & block

<button class={tw`${btn}`}>gray-500</button>
// => tw-XXXXX

<button class={tw`${btn} bg-red-500 text-lg`}>red-500 large</button>
// => tw-XXXX bg-red-500 text-lg

<button class={tw`${btnBlock}`}>block button</button>
// => tw-YYYY
```

:::tip
Another way to extract common component styles is by using [plugins](/handbook/plugins).
:::
