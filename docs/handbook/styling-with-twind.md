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

> 💡 `apply` accepts the same arguments as the `tw` function

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

The `apply` function allows you to use Twind rules and utility classes to define your preflight styles:

```js
setup({
  preflight: {
    body: apply('bg-gray-900 text-white'),
  },
})
```

The `css` function can be used with the `apply` function to define additional styles:

```js
const btn = apply`
  py-2 px-4
  ${css({
    borderColor: 'black',
  })}
`
```

The `apply` function can be used within the `css` function:

```js
const prose = css(
  apply`text-gray-700 dark:text-gray-300`,
  {
    p: apply`my-5`,
    h1: apply`text-black dark:text-white`,
  },
  {
    h1: {
      fontWeight: '800',
      fontSize: '2.25em',
      marginTop: '0',
      marginBottom: '0.8888889em',
      lineHeight: '1.1111111',
    },
  },
)
```

Using template literal syntax:

```js
const prose = css`
  ${apply`text-gray-700 dark:text-gray-300`}

  p {
    ${apply`my-5`}
  }

  h1 {
    ${apply`text-black dark:text-white`}
    font-weight: 800;
    font-size: 2.25em;
    margin-top: 0;
    margin-bottom: 0.8888889em;
    line-height: 1.1111111;
  }
`
```

Using Tailwind directives with `animation` function from the `twind/css` module:

```js
const motion = animation('.6s ease-in-out infinite', {
  '0%': apply`scale-100`,
  '50%': apply`scale-125 rotate-45`,
  '100%': apply`scale-100 rotate-0`,
})

const bounce = animation(
  '1s ease infinite',
  keyframes`
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
`,
)
```

A React button component

```js
import { tw } from 'twind'

const variantMap = {
  success: 'green',
  primary: 'blue',
  warning: 'yellow',
  info: 'gray',
  danger: 'red',
}

const sizeMap = {
  sm: apply`text-xs py(2 md:1) px-2`,
  md: apply`text-sm py(3 md:2) px-2`,
  lg: apply`text-lg py-2 px-4`,
  xl: apply`text-xl py-3 px-6`,
}

const baseStyles = apply`
  w(full md:auto)
  text(sm white uppercase)
  px-4
  border-none
  transition-colors
  duration-300
`

function Button({
  size = 'md',
  variant = 'primary',
  round = false,
  disabled = false,
  className,
  children,
}) {
  // Collect all styles into one class
  const instanceStyles = apply`
    ${baseStyles}
    bg-${variantMap[variant]}(600 700(hover:& focus:&)))
    ${sizeMap[size]}
    rounded-${round ? 'full' : 'lg'}
    ${disabled && 'bg-gray-400 text-gray-100 cursor-not-allowed'}
  `

  // Allow passed classNames to override instance styles
  return <button className={tw(instanceStyles, className)}>{children}</button>
}

render(
  <Button variant="info" className="text-lg rounded-md">
    Click me
  </Button>,
)
```
