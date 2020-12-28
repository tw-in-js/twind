# twind/styled [![Module Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/twind/styled/styled.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/styled/styled.js 'brotli module size') [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc%2Fstyled?icon=github&label)](https://github.com/tw-in-js/twind/tree/main/src/styled) [![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/styled/styled.d.ts)

styled is a way to create [React (twind/styled/react)](#react) and [Preact (twind/styled/preact)](#preact) components that have styles attached to them. It was heavily inspired by [styled-components](https://styled-components.com/) and [@emotion/styled](https://emotion.sh/docs/styled).


<details><summary>Table Of Contents (Click To Expand)</summary>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Introduction

`twind/styles` is framework agnostic and works with most [hyperscript](https://github.com/hyperhype/hyperscript) compatible functions: `h(tag, properties, ...children)`:

```js
import { styled } from 'twind/styled'

const myStyled = styled.bind({ createElement: (tag, props, ...children) => ({ tag, props, children }) })

const Button = myStyled.button`text-blue-600`
```

It is possible to bind the `styled` export:

```js
import { styled, bind } from 'twind/styled'

bind({ createElement: (tag, props, ...children) => ({ tag, props, children }) })

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

styled is very similar to css except you call it with an html tag or React component and then call that with a template literal for string styles or a regular function call for object styles.

```jsx
import { styled } from 'twind/styled/react'

const Button = styled.button`
  text-blue-600
`

render(<Button>This my button component.</Button>)
```
