# twind

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

Twind v1 is a complete rewrite aiming to be compatible with Tailwind v3 classes

---

Tailwind right in the browser without any build step.

## Bundler Usage

```sh
npm i twind@next
```

```js
import { setup } from 'twind'

// You must call setup atleast once, but can call it multiple times
setup({
  /* options */
})
```

Incase you are not using SSR to inject the pre-computed styles apply the following pattern to prevent FOUC:

```html
<body class="!block" style="display: none">
  <!-- ... -->
</body>
```

## CDN Usage

Add this line to your `index.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/twind@next"></script>
```

To configure Twind (optional):

```html
<script>
  twind.setup({
    presets: [
      // custom presets...
    ],
    theme: {
      extend: {
        colors: {
          clifford: '#da373d',
        },
      },
    },
    rules: [
      // custom rules...
    ],
    // ...
  })
</script>
```

By default, [@twind/autoprefix](https://www.npmjs.com/package/@twind/preset-autoprefix) and [@twind/preset-tailwind](https://www.npmjs.com/package/@twind/preset-tailwind) will be applied.

[Try it live](https://stackblitz.com/edit/twind-v1-example?file=index.html)

### CDN Builds

#### Core

Without any preset:

```html
<script src="https://cdn.jsdelivr.net/npm/twind@next/core.global.js"></script>
```

#### Tailwind

With [@twind/autoprefix](https://www.npmjs.com/package/@twind/preset-autoprefix) and [@twind/preset-tailwind](https://www.npmjs.com/package/@twind/preset-tailwind):

```html
<script src="https://cdn.jsdelivr.net/npm/twind@next"></script>
```

#### Ext

With [@twind/autoprefix](https://www.npmjs.com/package/@twind/preset-autoprefix) and [@twind/preset-ext](https://www.npmjs.com/package/@twind/preset-ext):

```html
<script src="https://cdn.jsdelivr.net/npm/twind@next/ext.global.js"></script>
```

## API

Everything from [@twind/core](https://www.npmjs.com/package/@twind/core) is available.

### setup

Can be called as many times as you want.

### `tw` (from [@twind/runtime](https://www.npmjs.com/package/@twind/runtime))

TDB

### cx (from [@twind/core](https://www.npmjs.com/package/@twind/core))

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

### `shortcut` (from [@twind/core](https://www.npmjs.com/package/@twind/core))

TDB

### `style` (from [@twind/core](https://www.npmjs.com/package/@twind/core))

TDB
