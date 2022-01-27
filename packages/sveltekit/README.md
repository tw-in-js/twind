# @twind/sveltekit [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/sveltekit/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/sveltekit) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23sveltekit?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/sveltekit)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

Seamless integration of [twind](https://www.npmjs.com/package/twind) for [SvelteKit](https://kit.svelte.dev)

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [SvelteKit](https://github.com/tw-in-js/twind/tree/next/examples/with-sveltekit)

## Installation

Install from npm:

```sh
npm install twind@next @twind/sveltekit@next
```

## Usage

Please see [examples/sveltekit](https://github.com/tw-in-js/twind/tree/next/examples/sveltekit) for detailed usage example.

**`src/routes/__layout.svelte`**

```html
<script type="module">
  import { setup } from '@twind/sveltekit'
  import twindConfig from '../twind.config'
  setup(twindConfig)
</script>
```

**`src/twind.config.js`**

```js
import { defineConfig } from 'twind'
// import { defineConfig } from '@twind/tailwind'

export default defineConfig({
  /* config */
})
```

`@twind/sveltekit` will use hashed class names in production by default. If you don't want this, you can use the `hash` config option:

```js
export default defineConfig({
  hash: false,
  /* config */
})
```

**`src/hooks`** — [SvelteKit › Hooks](https://kit.svelte.dev/docs#hooks)

enable for server-side rendering of Twind styles

```js
import { withTwind } from '@twind/sveltekit/hooks'

export const handle = withTwind()
```

If your have other handles use the [`sequence` helper](https://kit.svelte.dev/docs#modules-sveltejs-kit-hooks):

```js
import { sequence } from '@sveltejs/kit/hooks'

export const handle = sequence(withTwind(), ...otherHandles)
```

Using a custom Twind instance:

```js
import { withTwind } from '@twind/sveltekit'
import { tw } from './custom/twind/instance'

export const handle = withTwind(tw)
```

## API

### `withTwind([tw])`

TBD
