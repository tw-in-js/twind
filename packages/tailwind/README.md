# @twind/tailwind

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

The full [Tailwind CSS](https://tailwindcss.com) experience without any build step right in the browser or any other environment like Node.js, deno, workers, ...

The following presets are included out-of-the-box:

- [@twind/preset-autoprefix](https://www.npmjs.com/package/@twind/preset-autoprefix)
- [@twind/preset-tailwind](https://www.npmjs.com/package/@twind/preset-tailwind)

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [Basic](https://github.com/tw-in-js/twind/tree/next/examples/basic)
- [SvelteKit](https://github.com/tw-in-js/twind/tree/next/examples/sveltekit)
- [Tailwind Forms](https://github.com/tw-in-js/twind/tree/next/examples/tailwind-forms)

## Usage

```sh
npm install twind@next @twind/tailwind@next
```

```js
import { setup } from '@twind/tailwind'

// You must call setup at least once, but can call it multiple times
setup({
  /* options */
  /* config */
})
```

To add other presets add them to the `presets` array:

```js
import { setup } from '@twind/tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'

setup({
  presets: [presetTailwindForms(/* options */)],
  // ...
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
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind@next,npm/@twind/tailwind@next"
    crossorigin
  ></script>
</head>
```

To configure Twind add a script block _after_ the previous one (optional):

```html
<script>
  twind.setup({
    /* options */
    /* config */
  })
</script>
```

> If you are not using any Twind API (like `cx`, `css`, ...) you can use the optimized [@twind/cdn](https://www.npmjs.com/package/@twind/cdn) package.

To add other presets add their ids to the script `src` attribute:

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/twind@next,npm/@twind/tailwind@next,npm/@twind/preset-tailwind-forms@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      /* options */
      presets: [twind.presetTailwindForms(/* options */)],
      /* config */
    })
  </script>
</head>
```

</details>

## API

> If you are using the `script` tag these methods are available via the `twind` global object (eg `twind.setup`).

The following options from [@twind/preset-tailwind](https://www.npmjs.com/package/@twind/preset-tailwind) are available:

- `darkMode: 'media' | 'class' = 'media'` — whether to use dark mode media queries or class names

- `enablePreflight: boolean = true` — whether to enable the [preflight](https://tailwindcss.com/docs/preflight)

### `setup([config [, sheet [, target]]])`

Initializes Twind and can be called as many times as you want.

```js
import { setup } from '@twind/tailwind'

const tw = setup({
  // this are the defaults
  darkMode: 'media',
  enablePreflight: true,
  /* config */
})
// -> tw === import { tw } from 'twind'
```

### `defineConfig([config])`

Used to define the configuration within `twind.config.{js,ts,mjs,cjs}`.

```js
import { defineConfig } from '@twind/tailwind'

export default defineConfig({
  // this are the defaults
  darkMode: 'media',
  enablePreflight: true,
  /* config */
})
```

Then use the following script to initialize Twind:

```js
// not setup using '@twind/tailwind' as that would add the built-in presets twice
import { setup } from 'twind'
import config from './twind.config'

setup({
  /* config */
})
```
