# @twind/cdn [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/cdn/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/cdn) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23cdn?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/cdn)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

Twind v1 is a complete rewrite aiming to be compatible with Tailwind v3.

---

Twind CDN is a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn) that is almost 5.5 times smaller (96.4kb vs 17.6kB) without any build step right in the browser or any other environment like Node.js, deno, workers, ...

The following presets are included out-of-the-box:

- [@twind/preset-autoprefix](https://www.npmjs.com/package/@twind/preset-autoprefix)
- [@twind/preset-tailwind](https://www.npmjs.com/package/@twind/preset-tailwind)

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [Twind CDN](https://github.com/tw-in-js/twind/tree/next/examples/twind-cdn)

## Usage

Add this line to your `index.html`:

```html
<head>
  <script src="https://cdn.jsdelivr.net/npm/@twind/cdn@next" crossorigin></script>
</head>
```

To configure Twind add a script block _after_ the previous one (optional):

```html
<script>
  twind.setup({
    /* options */
  })
</script>
```

To add other presets add their ids to the script `src` attribute:

```html
<head>
  <script
    src="https://cdn.jsdelivr.net/combine/npm/@twind/cdn@next,npm/@twind/preset-ext@next"
    crossorigin
  ></script>
  <script>
    twind.setup({
      presets: [twind.presetExt()],
      // ...
    })
  </script>
</head>
```

## API

### `twind.setup([config])`

Can be called as many times as you want.

```html
<script>
  twind.setup({
    // ...
  })
</script>
```
