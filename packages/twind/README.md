# twind

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

Twind v1 is a complete rewrite aiming to be compatible with Tailwind v3 classes

---

Tailwind right in the browser without any build step.

## Usage

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

Incase you are not using SSR to inject the pre-computed styles apply the following pattern to prevent [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content):

```html
<body class="!block" style="display: none">
  <!-- ... -->
</body>
```

**Script tag without a build step**

Add this line to your `index.html`:

```html
<head>
  <!-- ... -->
  <script src="https://cdn.jsdelivr.net/npm/twind@next" crossorigin></script>
  <!-- ... -->
</head>
```

To configure Twind add a script block _after_ the previous one (optional):

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

**Presets**

- [@twind/preset.autoprefix](https://www.npmjs.com/package/@twind/preset-autoprefix)
- [@twind/preset-tailwind](https://www.npmjs.com/package/@twind/preset-tailwind)

**API**

- everything from [@twind/core](https://www.npmjs.com/package/@twind/core#api)
- `tw` from [@twind/runtime](https://www.npmjs.com/package/@twind/runtime#tw)
- [`twind.setup`](#setupconfig--sheet--target)

### `twind/cdn`

A drop-in replacement for Tailwind CSS Play CDN that is almost 6 times smaller (96.4kb vs 16.9kB).

```js
import { setup } from 'twind/play-cdn'
```

```html
<script src="https://cdn.jsdelivr.net/npm/twind@next/cdn.global.js" crossorigin></script>
```

**Presets**

- [@twind/preset.autoprefix](https://www.npmjs.com/package/@twind/preset-autoprefix)
- [@twind/preset-tailwind](https://www.npmjs.com/package/@twind/preset-tailwind)

**API**

- `tw` from [@twind/runtime](https://www.npmjs.com/package/@twind/runtime#tw)
- [`twind.setup`](#setupconfig--sheet--target)

### `twind/core`

```js
import { setup } from 'twind/core'
```

```html
<script src="https://cdn.jsdelivr.net/npm/twind@next/core.global.js" crossorigin></script>
```

**Presets**

None

**API**

- everything from [@twind/core](https://www.npmjs.com/package/@twind/core#api)
- `tw` from [@twind/runtime](https://www.npmjs.com/package/@twind/runtime#tw)
- [`twind.setup`](#setupconfig--sheet--target)

## API

### `setup(config [, sheet [, target]])`

Can be called as many times as you want.
