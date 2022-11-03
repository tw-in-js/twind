# @twind/cdn [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/cdn/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/cdn/v/next) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23cdn?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/cdn)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

Twind CDN is a drop-in replacement for [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn) that is almost 5.5 times smaller (96.4kb vs 17.6kB) without any build step right in the browser or any other environment like Node.js, deno, workers, ...

> Visit [twind.style](https://twind.style) for a full documentation or explore [the examples](https://github.com/tw-in-js/twind/tree/next/examples#readme).

The following presets are included out-of-the-box:

- [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix)
- [@twind/preset-tailwind](https://github.com/tw-in-js/twind/tree/next/packages/preset-tailwind)

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [Twind CDN](https://github.com/tw-in-js/twind/tree/next/examples/using-twind-cdn)

## 📦 Installation

Add this line to your `index.html`:

```html
<head>
  <script src="https://cdn.twind.style" crossorigin></script>
</head>
```

To configure Twind add a script block _after_ the previous one (optional):

```html
<script>
  twind.install({
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
    twind.install({
      presets: [twind.presetExt()],
      // ...
    })
  </script>
</head>
```

## 🙇 Usage

### `twind.install([config [, isProduction ]])`

Can be called as many times as you want.

```html
<script>
  twind.setup({
    // ...
  })
</script>
```

## 💬 Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable use [Github Discussions](https://github.com/tw-in-js/twind/discussions).

To ask questions and discuss with other Twind users in real time use [Discord Chat](https://chat.twind.style).

## 🧱 Contribute

See the [Contributing Guide](../../CONTRIBUTING.md) for information on how to contribute to this project.

## 📜 Changelog

[The Changelog for this package is available on GitHub.](https://github.com/tw-in-js/twind/tree/next/packages/cdn/CHANGELOG.md)

## ⚖️ License

The [MIT license](https://github.com/tw-in-js/twind/blob/main/LICENSE) governs your use of Twind.
