---
title: Overwriting Styles
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: Learn how to overwrite styles in your Twind project.
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

Twind provides three primary ways to overwrite styles:

- [The `apply` function (recommended)](#the-apply-function-recommended)
- [The `override` directive](#the-override-directive)
- [The `!important` directive](#the-important-directive)

## The `apply` function (recommended)

The Twind module exposes an `apply` function, which can be used to define a collection of Twind classes that can later be overwritten in a `tw` call.

```js
import { apply, tw } from 'twind'

const userSuppliedClassName = 'text-blue-800'
const appliedClassName = apply`text-gray-800`
const classNames = tw(appliedClassName, userSuppliedClassName)

document.body.innerHTML = `
  <p class="${classNames}">
    This text will be blue
  </p>
`
```

Any class names passed into the `apply` function will be merged into a single class name like `tw-****`. Once passed into a `tw` call, all of the styles will be merged and any styles defined outside of the `apply` call will take precedence. You can think of any classes inside of an `apply` function to be default values that can be overwritten at runtime.

> Note: The `apply` function does not apply any styles to the document until it is passed into a `tw` call.

## The `override` directive

The `override` directive allows you to write styles directly inside of a `tw` call that can be overwritten.

When to use: When you can't use `apply`.

```js
import { tw } from "twind";

const userSuppliedClassNames = "text-blue-800"

document.body.innerHTML = `
  <p class="${tw`${userSuppliedClassNames} override:(text-gray-800)`)}">
    This text will be blue
  </p>
`
```

## The `!important` directive

You can also apply the CSS `!important` to a style by appending classes with an exclamation mark (`!`).

When to use: Last resort. Only when you can't use `apply` or `override`.

```js
import { tw } from "twind";

document.body.innerHTML = `
  <p class=`${tw`text-gray-800 text-blue-800!`}`>
    This text will be blue
  </p>
`
```
