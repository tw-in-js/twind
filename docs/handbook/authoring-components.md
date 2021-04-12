---
title: Authoring Components
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: How to author components with Twind
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

As a component author, it's common to end up with several components that share a similar set of styles that could be extracted out to avoid redundancy. And, more often than not, the intention is to provide your components with a default set of styles that can easily be overwritten later on a per instance basis.

The `apply` function sets out to solve both of these problems.

```js
import { apply } from 'twind'

const btn = apply`inline-block bg-gray-500 text-base`
```

When you pass Twind classes to the `apply` function, that group of corresponding styles gets applied to a single class name (`tw-XXXX`), combining all rules by deep merging rules in order of declaration.

```js
import { apply } from 'twind'

const btn = apply`inline-block bg-gray-500 text-base`
// => generates on CSS class with all declarations of the above rules when used

const btnBlock = apply`${btn} block`
// => generates on CSS class with all declarations of btn & block

<button class={tw`${btn}`}>gray-500</button>
// => tw-XXXXX

<button class={tw`${btn} bg-red-500 text-lg`}>red-500 large</button>
// => tw-XXXX bg-red-500 text-lg

<button class={tw`${btnBlock}`}>block button</button>
// => tw-YYYY
```

:::tip
Another way to extract common component styles is by using an alias plugin.
:::

The component styles are added **before** the utility classes to the stylesheet which allows utilities to override component styles.

<details><summary>Why can I not use <code>tw</code> for components?</summary>

```js
const Button = ({ className, children}) => {
  return <button className={tw`inline-block bg-gray-500 text-base ${className}`}>{children}</button>
}

const ButtonBlock = ({ className, children}) => {
  return <Button className={`block ${className}`}>{children}</Button>
}

<Button>gray-500</Button>
<Button className="bg-red-500 text-lg">red-500 large</Button>
```

The example above does not reliably work because the injected CSS classes have all the same specificity and therefore the order in which they appear in the stylesheet determines which styles are applied.

It is really difficult to know which directive does override another. For now, let's stick with `bg-*` but there are others. The `bg` prefix and its plugin handle several CSS properties where `background-color` is only one of them.

- `background-color`: `bg-current`, `bg-gray-50`, ... (see https://tailwindcss.com/docs/background-color)
- `background-attachment`: `bg-local`, ... (see https://tailwindcss.com/docs/background-attachment)
- `--tw-bg-opacity`: `bg-opacity-10`, ... (see https://tailwindcss.com/docs/background-opacity)
- and a lot more
- not to forget about user plugins and inline directives

This ambiguity makes class based composition really difficult. That was the reason we introduced the `override` variant.

Consider the following example:

```js
const Button = tw`
  text(base blue-600)
  rounded-sm
  border(& solid 2 blue-600)
  m-4 py-1 px-4
`

// Create a child component overriding some colors
const PurpleButton = tw`
  ${Button}
  override:(text-purple-600 border-purple-600)
`
```

As you see it is difficult to override certain utility classes on usage or when creating a child component. For this to work Twind introduced the `override` variant which increases the specificity of the classes it is applied to. But what do you do for a grandchild component or if you want to override the `PurpleButton` styles? `override:override:...`? This is where `apply` should be used.

Tailwind has a component concept using [@apply](https://tailwindcss.com/docs/extracting-components#extracting-component-classes-with-apply) which basically merges the CSS rules of several Tailwind classes into one class. twin.macro does the same.

<details><summary>Details of Tailwind @apply</summary>

Tailwind CSS provides [@apply to extract component classes](https://tailwindcss.com/docs/extracting-components#extracting-component-classes-with-apply) which merges the underlying styles of the utility classes into a single CSS class.

```css
.btn-indigo {
  @apply py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75;
}
```

[twin.macro](https://github.com/ben-rogerson/twin.macro) does the same during build time to generate CSS-in-JS objects which are evaluated with a runtime like Emotion or styled-components:

```js
const hoverStyles = css`
  &:hover {
    border-color: black;
    ${tw`text-black`}
  }
`
const Input = ({ hasHover }) => <input css={[tw`border`, hasHover && hoverStyles]} />
```

> The `tw` function from `twin.macro` acts like the `@apply` helper from Tailwind CSS.

</details>

</details>

## API

> `apply` accepts the same arguments as [`tw`](./styling-with-twind.md#tw-function).

```js
import { tw, apply } from 'twind'

const btn = apply`
  py-2 px-4
  font-semibold
  rounded-lg shadow-md
  focus:(outline-none ring(2 indigo-400 opacity-75))
`

tw`${btn} font-bold`
// => .tw-btn .font-bold
// CSS:
// .tw-XXXX { padding-top: 0.5rem; padding-bottom: 0.5rem; padding-left: 1rem; padding-right: 1rem; font-weight: 600; ...}
// .font-bold { font-weight: 700; }

const btnLarge = apply`${btn} py-4 px-8`
// Result: () => ({ paddingTop: '1rem', paddingBottom: '1rem', paddingLeft: '2rem', paddingRight: '2rem', fontWeight: '600', ... })

tw`${btnLarge} rounded-md`
// => .tw-btn-large .rounded-md
// CSS:
// .tw-btn-large { padding-top: 1rem; padding-bottom: 1rem; padding-left: 2rem; padding-right: 2rem; font-weight: 600; ... }
// .rounded-md { ... }
```

You can use this helper to use `apply` together with `tw`:

```js
import { tw, apply } from 'twind'

// There is a better name out there somewhere
const twind = (...args) => tw(apply(...args))

<button className={twind`bg-red bg-blue`}>blue</button>
// => tw-red-blue

document.body.className = twind`bg-blue bg-red`
// => tw-blue-red
```

## Examples

<details><summary>Using <code>apply</code> within <code>preflight</code></summary>

Use Tailwind rules within preflight.

```js
setup({
  preflight: {
    body: apply('bg-gray-900 text-white'),
  },
})
```

</details>

<details><summary><code>CSS</code> can be used within <code>apply</code></summary>

`twind/css` can be used to define additional styles.

```js
const btn = apply`
  py-2 px-4
  ${css({
    borderColor: 'black',
  })}
`
```

</details>

<details><summary>Using within <code>CSS</code></summary>

`apply` can be used with the `css` function:

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

</details>

<details><summary>Using Tailwind directives with <code>animation</code> from <code>twind/css</code></summary>

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

</details>

<details><summary>A React button component</summary>

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

</details>
