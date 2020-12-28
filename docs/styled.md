# twind/styled [![Module Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/twind/styled/styled.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/styled/styled.js 'brotli module size') [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc%2Fstyled?icon=github&label)](https://github.com/tw-in-js/twind/tree/main/src/styled) [![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/styled/styled.d.ts)

styled is a way to create [React (twind/styled/react)](#react) and [Preact (twind/styled/preact)](#preact) components that have styles attached to them. It was heavily inspired by [styled-components](https://styled-components.com/) and [@emotion/styled](https://emotion.sh/docs/styled).

<details><summary>Table Of Contents (Click To Expand)</summary>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Introduction](#introduction)
  - [React](#react)
  - [Preact](#preact)
- [Styling elements and components](#styling-elements-and-components)
- [Adapting based on props](#adapting-based-on-props)
- [Styling any component](#styling-any-component)
- [Extending Styles](#extending-styles)
- [`as` prop](#as-prop)
- [Attaching additional props](#attaching-additional-props)
- [Refs](#refs)
- [Referring to other components](#referring-to-other-components)
- [shouldForwardProp](#shouldforwardprop)
- [Using custom tw instance](#using-custom-tw-instance)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Introduction

`twind/styles` is framework agnostic and works with most [hyperscript](https://github.com/hyperhype/hyperscript) compatible functions: `h(tag, properties, ...children)`:

```js
import { styled } from 'twind/styled'

const myStyled = styled.bind({
  createElement: (tag, props, ...children) => ({ tag, props, children }),
})

const Button = myStyled.button`text-blue-600`
```

It is possible to bind the `styled` export which work similar to [setup](./setup.md) for `tw`.

```js
import { styled, bind } from 'twind/styled'

bind({
  createElement: (tag, props, ...children) => ({ tag, props, children }),
})

const Button = styled.button`text-blue-600`
```

We provide already bound styled functions for [react](#react) and [preact](#preact).

### React

```js
import { styled } from 'twind/styled/react'

const Button = styled.button`text-blue-600`
```

### Preact

```js
import { styled } from 'twind/styled/preact'

const Button = styled.button`text-blue-600`
```

## Styling elements and components

`styled` is very similar to [tw](./tw.md) except you call it with an html tag or component and then call that with a template literal for string styles or a regular function call for object styles.

```jsx
// Template literal
const Button = styled.button`text-blue-600 rounded`

render(<Button>This my button component.</Button>)
```

## Adapting based on props

```jsx
const Button = styled.button`
  ${(props) => (props.primary ? 'text-purple-600' : 'text-blue-600')} rounded
`

const Container = styled.div`flex ${(props) => props.column && 'flex-col'}`

render(
  <Container column>
    <Button>This is a regular button.</Button>
    <Button primary>This is a primary button.</Button>
  </Container>,
)
```

## Styling any component

`styled` can style any component as long as it accepts a `className` prop.

```jsx
const Basic = ({ className }) => <div className={className}>Some text</div>

const Fancy = styled(Basic)`text-purple-600`

render(<Fancy />)
```

## Extending Styles

```jsx
const Button = styled.button`
  text(base blue-600)
  rounded-sm
  border(& solid 2 blue-600)
  m-4 py-1 px-4
`

// prettier-ignore
const PurpleButton = styled(Button)`
  override:(text-purple-600 border-purple-600)
`

render(
  <div>
    <Button>Normal Button</Button>
    <PurpleButton>Purple Button</PurpleButton>
  </div>,
)
```

## `as` prop

To use styles from a styled component but change the element that’s rendered, you can use the `as` prop.

```jsx
const Button = styled.button`text-purple-600`

render(
  <Button as="a" href="https://github.com/tw-in-js/twind">
    Twind on GitHub
  </Button>,
)
```

The `as` prop is only used by styled when it’s not forwarded to the underlying element. By default, this means that the `as` prop is used for html tags and forwarded for components. To change this, you can pass a custom [shouldForwardProp](#shouldforwardprop) which returns `true` for `'as'` to forward it or returns `false` for `'as'` to use it and not forward it.

## Attaching additional props

To avoid unnecessary wrappers that just pass on some props to the rendered component, or element, you can use the `.attrs` function. It allows you to attach additional props (or "attributes") to a component.

```jsx
// we can define static props
const Input = styled.input.attrs({
  type: 'text',
})`
  rounded-md
  border(& 4 indigo-600)
`

// Or we can define dynamic ones
const SizedInput = Input.attrs((props) => ({
  size: props.size || '1em',
}))
```

Notice that when wrapping styled components, `.attrs` are applied from the innermost styled component to the outermost styled component.

This allows each wrapper to override nested uses of `.attrs`, similarly to how css properties defined later in a stylesheet override previous declarations.

```jsx
// prettier-ignore
const PasswordInput = styled(Input).attrs({
  type: 'password',
})`
  override:(border-blue-600)
`
```

> `className` and `class` properties are merged into one string. They do **not** override each other.

## Refs

Passing a `ref` prop to a styled component will give you one of two things depending on the styled target:

- the underlying DOM node (if targeting a basic element, e.g. `styled.div`)
- a React component instance (if targeting a custom component e.g. extended from `React.Component`)

```jsx
const Input = styled.input`
  rounded-sm m-2 p-2
  text-pink-500
  bg-yellow-200
`

const Form = () => {
  const inputRef = useRef()

  return (
    <Input
      ref={inputRef}
      placeholder="Hover to focus!"
      onMouseEnter={() => {
        inputRef.current.focus()
      }}
    />
  )
}
```

## Referring to other components

We can nest selectors using `&`:

```jsx
const Child = styled.div`text-purple-600`
const Parent = styled.div(
  css({
    [`& ${Child}`]: {
      color: 'green',
    },
  }),
)
```

> Currently you must use the [css](./css-in-js.md) helper. We are exploring how this could be done with tailwind rules.

## shouldForwardProp

`styled` is smart enough to filter non-standard attributes automatically for you. By default, `styled` passes all props to custom components and only props that are valid html attributes for string tags.

You can customize this by passing a custom `shouldForwardProp` function. It works much like the predicate callback of `Array.filter`. A prop that fails the test isn't passed down to underlying components.

Optionally, `shouldForwardProp` can take a second parameter that provides access to the default validator function (`@emotion/is-prop-valid`) which is used by styled internally. This function can be used as a fallback, and of course, it also works like a predicate, filtering based on known HTML attributes.

```jsx
const H1 = styled('h1', {
  shouldForwardProp: (prop, defaultValidator) => prop !== 'hidden' && defaultValidator(prop),
})`
  text-2xl underline
  ${(props) => props.hidden && 'sr-only'}
`

render(<H1 hidden>Screen Reader Only</H1>)
```

## Using custom tw instance

`styled` uses the named `tw` export from the `twind` module. You can use a custom instance:

```js
import { create } from 'twind'
import { styled } from 'twind/styled/react'

const { tw } = create(/* addtional config */)

const myStyled = styled.bind(tw)
```
