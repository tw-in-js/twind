# @twind/with-sveltekit [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/with-sveltekit/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/with-sveltekit/v/next) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23sveltekit?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/sveltekit)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

Seamless integration of [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind) with [SvelteKit](https://kit.svelte.dev)

> Visit [twind.style](https://twind.style) for a full documentation or explore [the examples](https://github.com/tw-in-js/twind/tree/next/examples#readme).

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [SvelteKit](https://github.com/tw-in-js/twind/tree/next/examples/with-sveltekit)

## 📦 Installation

Install from npm:

```sh
npm install twind@next @twind/with-sveltekit@next
```

## 🙇 Usage

Please see [examples/with-sveltekit](https://github.com/tw-in-js/twind/tree/next/examples/with-sveltekit) for detailed usage example.

### `src/twind.config.js`

```js
import { defineConfig } from 'twind'

export default defineConfig({
  /* config */
})
```

`@twind/with-sveltekit` will use hashed class names in production by default. If you don't want this, you can use the `hash` config option:

```js
export default defineConfig({
  hash: false,
  /* config */
})
```

### `src/routes/+layout.js`[^1]

```js
import install from '@twind/with-sveltekit'
import config from '../twind.config'

install(config)

// Optional: add a load function
// https://kit.svelte.dev/docs/routing#layout-layout-js
```

### `src/hooks.server.js`[^2]

Enable server-side rendering of Twind styles.

```js
import handleTwind from '@twind/with-sveltekit/hooks'

export const handle = handleTwind()
```

If you have other handlers use the [`sequence` helper](https://kit.svelte.dev/docs/modules#sveltejs-kit-hooks):

```js
import { sequence } from '@sveltejs/kit/hooks'

export const handle = sequence(handleTwind(), ...otherHandlers)
```

## 💬 Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable use [Github Discussions](https://github.com/tw-in-js/twind/discussions).

To ask questions and discuss with other Twind users in real time use [Discord Chat](https://chat.twind.style).

## 🧱 Contribute

See the [Contributing Guide](../../CONTRIBUTING.md) for information on how to contribute to this project.

## 📜 Changelog

[The Changelog for this package is available on GitHub.](https://github.com/tw-in-js/twind/tree/next/packages/with-sveltekit/CHANGELOG.md)

## ⚖️ License

The [MIT license](https://github.com/tw-in-js/twind/blob/main/LICENSE) governs your use of Twind.

[^1]: [SvelteKit › Routing › `+layout.js`](https://kit.svelte.dev/docs/routing#layout-layout-js)
[^2]: [SvelteKit › Hooks › `handle`](https://kit.svelte.dev/docs/hooks#server-hooks-handle)
