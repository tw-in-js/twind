# @twind/sveltekit

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

Seamless integration of [twind](https://www.npmjs.com/package/twind) for [SvelteKit](https://kit.svelte.dev)

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [SvelteKit](https://github.com/tw-in-js/twind/tree/next/examples/sveltekit)

## Installation

Install from npm:

```sh
npm install twind @twind/sveltekit@next
```

## Usage

Please see [examples/sveltekit](https://github.com/tw-in-js/twind/tree/next/examples/sveltekit) for detailed usage example.

**`src/routes/__layout.svelte`**

```html
<script type="module">
  import { setup } from 'twind'
  // import { setup } from '@twind/tailwind'

  import twindConfig from '../twind.config'

  setup(twindConfig)
</script>
```

**`src/hooks`** — [SvelteKit › Hooks](https://kit.svelte.dev/docs#hooks)

enable for server-side rendering of Twind styles

```js
import { withTwind } from '@twind/sveltekit'

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
