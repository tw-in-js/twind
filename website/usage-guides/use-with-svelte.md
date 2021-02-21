---
title: Use with Svelte
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: How to use Twind with Svelte
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

## [Svelte](https://svelte.dev/)

```html
<script>
  import { tw } from 'twind'
</script>

<main class="{tw`h-screen bg-purple-400 flex items-center justify-center`}">
  <h1 class="{tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}">This is Twind!</h1>
</main>
```

> 🚀 [live and interactive demo](https://svelte.dev/repl/f0026dd2e9a44beaa14839d65117b852?version=3)

## Server Side Rendering

```js
import { setup } from 'twind'
import { virtualSheet, getStyleTag } from 'twind/sheets'

import App from './app.svelte'

const sheet = virtualSheet()

setup({ ...sharedOptions, sheet })

function ssr() {
  // 1. Reset the sheet for a new rendering
  sheet.reset()

  // 2. Render the app
  const { head = '', html, css } = App.render({
    /* options */
  })

  if (css && css.code) {
    head += `<style>${css.code}</style>`
  }

  // 3. Create the style tag with all generated CSS rules
  head += getStyleTag(sheet)

  // 4. Generate the response html
  return `<!DOCTYPE html>
    <html lang="en">
      <head>${head}</head>
      <body>${html}</body>
    </html>
  `
}
```
