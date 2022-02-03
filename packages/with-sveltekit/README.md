# @twind/with-sveltekit [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/with-sveltekit/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/with-sveltekit/v/next) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23sveltekit?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/sveltekit)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

Seamless integration of [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind) for [SvelteKit](https://kit.svelte.dev)

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [SvelteKit](https://github.com/tw-in-js/twind/tree/next/examples/with-sveltekit)

## Installation

Install from npm:

```sh
npm install twind@next @twind/with-sveltekit@next
```

## Usage

Please see [examples/with-sveltekit](https://github.com/tw-in-js/twind/tree/next/examples/with-sveltekit) for detailed usage example.

### `src/twind.config.js`

```js
import { defineConfig } from 'twind'
// import { defineConfig } from '@twind/tailwind'

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

### `src/routes/__layout.svelte`

```html
<script context="module">
  import { setup } from '@twind/with-sveltekit'
  import config from '../twind.config'
  setup(config)
</script>
```

### `src/hooks`[^1]

Enable server-side rendering of Twind styles.

```js
import { withTwind } from '@twind/with-sveltekit/hooks'

export const handle = withTwind()
```

If you have other handlers use the [`sequence` helper](https://kit.svelte.dev/docs#modules-sveltejs-kit-hooks):

```js
import { sequence } from '@sveltejs/kit/hooks'

export const handle = sequence(withTwind(), ...otherHandlers)
```

[^1]: [SvelteKit › Hooks](https://kit.svelte.dev/docs#hooks)
