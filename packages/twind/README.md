# twind [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/twind/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/twind/v/next) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23twind?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/twind)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

Utility-first CSS without any build step right in the browser or any other environment like Node.js, deno, workers, ...

Twind does **not** include any core utilities — use one or more of the existing presets:

- [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix)
- [@twind/preset-ext](https://github.com/tw-in-js/twind/tree/next/packages/preset-ext)
- [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind)
- [@twind/preset-tailwind-forms](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind-forms) to get Tailwind v3 and Tailwind Forms.

Here are some examples of how to write your own rules or variants:

- preset-tailwind: [rules](https://github.com/tw-in-js/twind/blob/next/packages/preset-tailwind/src/rules.ts) and [variants](https://github.com/tw-in-js/twind/blob/next/packages/preset-tailwind/src/variants.ts)
- preset-ext: [rules](https://github.com/tw-in-js/twind/blob/next/packages/preset-ext/src/rules.ts) and [variants](https://github.com/tw-in-js/twind/blob/next/packages/preset-ext/src/variants.ts)

Additionally we provides several integrations:

- [Gatsby](https://github.com/gatsbyjs/gatsby) — [gatsby-plugin-twind](https://github.com/tw-in-js/twind/tree/next/packages/gatsby-plugin-twind)
- [Next.js](https://kit.svelte.dev) — [@twind/with-next](https://github.com/tw-in-js/twind/tree/next/packages/with-next)
- [Remix](https://remix.run) — [@twind/with-remix](https://github.com/tw-in-js/twind/tree/next/packages/with-remix)
- [SvelteKit](https://kit.svelte.dev) — [@twind/with-sveltekit](https://github.com/tw-in-js/twind/tree/next/packages/with-sveltekit)

To get you started, take a look at the [examples](https://github.com/tw-in-js/twind/tree/next/examples).

## Usage

```sh
npm install twind@next
```

```js
import { setup } from 'twind'

// You must call setup at least once, but can call it multiple times
setup({
  /* options */
})
```

Incase you are not using SSR to inject the pre-computed styles apply the following pattern to prevent [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content):

```html
<body class="!block" style="display: none">
  <!-- ... -->
</body>
```

If any element has the `autofocus` attribute, Twind will focus it after all styles are injected.

<details><summary>Usage with a script tag</summary>

Add this line to your `index.html`:

```html
<head>
  <script src="https://cdn.jsdelivr.net/npm/twind@next" crossorigin></script>
  <script>
    twind.setup({
      /* options */
    })
  </script>
</head>
```

To add presets add their ids to the script `src` attribute:

```html
<head>
  <!-- ... -->
  <script
    src="https://cdn.jsdelivr.net/npm/twind@next,npm/@twind/preset-tailwind@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      presets: [twind.presetTailwind()],
      // ...
    })
  </script>
  <!-- ... -->
</head>
```

</details>

## API

> If you are using the `script` tag these methods are available via the `twind` global object (eg `twind.setup`).

### `setup(config [, sheet [, target]])`

Initializes Twind and can be called as many times as you want.

```js
import { setup } from 'twind'

// can be called as many times as you want.
const tw = setup({
  /* config */
})
// -> tw === import { tw } from 'twind'
```

### `tw(...tokens)` — the current Twind instance

```js
import { tw } from 'twind'

tw`underline`
tw({ underline: true })

tw.theme('colors.blue.500', 'blue')
```

### `cx`

```js
import { cx } from 'twind'

// Set a className
element.className = cx`
  underline
  /* multi
    line
    comment
  */
  hover:focus:!{
    sm:{italic why}
    lg:-{px}
    -mx-1
  }
  // Position
  !top-1 !-bottom-2
  text-{xl black}
`
```

### `shortcut`

TDB

### `css`

TDB

### `style`

TDB

### `extract(html, tw)`

Used for static HTML processing (usually to provide SSR support for your javascript-powered web apps) — powered by [consume(html, tw)](#consumehtml-tw)

**Note**: Consider using [inline](#inlinehtml-tw) instead.

**Note**: This clears the Twind instance before processing the HTML.

```js
import { setup, extract, tw } from 'twind'

// can be in a different file — but should be called at least once
setup({
  /* config */
})

function render() {
  const { html, css } = extract(renderApp(), tw)

  // inject as last element into the head
  return html.replace('</head>', `<style data-twind>${css}</style></head>`)
}
```

## Low-Level API

### `twind`

TDB

### `consume(html, tw)`

Used for static HTML processing (usually to provide SSR support for your javascript-powered web apps)

1. parse the markup and process element classes with the provided Twind instance
2. update the class attributes _if_ necessary
3. return the HTML string with the final element classes

```js
import { setup, consume, stringify, tw } from 'twind'

// can be in a different file — but should be called at least once
setup({
  /* config */
})

function render() {
  const html = renderApp()

  // remember global classes
  const restore = tw.snapshot()

  // generated markup
  const markup = consume(html)

  // create CSS
  const css = stringify(tw.target)

  // restore global classes
  restore()

  // inject as last element into the head
  return markup.replace('</head>', `<style data-twind>${css}</style></head>`)
}
```
