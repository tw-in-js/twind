---
title: Global Styles
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: Learn how to apply global styles with Twind.
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

The `css` function provided by the `twind/css` module provides an easy way to inject global styles into your app using the `:global` selector.

```js
import { tw } from 'twind'
import { css } from 'twind/css'

const globalStyles = css({
  ':global': {
    a: {
      color: '#333',
    },
  },
})

document.getElementById('app').innerHTML = `
<div class=${tw(globalStyles)}>
<h1>Hello Twind!</h1>
<p>
  Look
  <a href="https://twind.dev">here</a>
  for more info about Twind.
</p>
</div>
`
```

You can use the `theme` function to apply theme values, the `apply` function to apply Twind classes, and much more.

```js
import { tw } from 'twind'
import { css, apply, theme } from 'twind/css'

const globalStyles = css({
  ':global': {
    a: {
      color: theme('colors.blue.500'),
      '&:hover': apply`text-blue-700`,
    },
  },
})

document.getElementById('app').innerHTML = `
<div class=${tw(globalStyles)}>
<h1>Hello Twind!</h1>
<p>
  Look
  <a href="https://twind.dev">here</a>
  for more info about Twind.
</p>
</div>
`
```

You have the full power of the `twind/css` module when writing global styles. This approach also allows you to inject global styles anywhere in your app, which is useful for multi-page apps.

Please refer to the [css-in-twind](#) page to learn more about all the things you can do with the `css` function.
