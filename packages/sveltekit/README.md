# @twind/sveltekit

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

Seamless integration of Twind into [SvelteKit](https://kit.svelte.dev/)

## Installation

Install from npm:

```sh
npm install @twind/sveltekit@next
```

## Usage

Please see [examples/sveltekit](https://github.com/tw-in-js/twind/tree/next/examples/sveltekit) for detailed usage example.

**`src/routes/__layout.svelte`**

```html
<script type="module">
  import { setup } from 'twind'
  // import { setup } from 'twind/core'

  import twindConfig from '../twind.config'

  setup(twindConfig)
</script>
```

**`src/hooks`** — [SvelteKit › Hooks](https://kit.svelte.dev/docs#hooks)

enable for server-side rendering of twind styles

```js
import { withTwind } from '@twind/sveltekit'
import { tw } from 'twind'
// import { tw } from 'twind/core'

export const handle = withTwind(tw)
```

If your have other handles use the [`sequence` helper](https://kit.svelte.dev/docs#modules-sveltejs-kit-hooks):

```js
import { sequence } from '@sveltejs/kit/hooks'

export const handle = sequence(withTwind(tw), ...otherHandles)
```

## API

### `withTwind(tw)`

TBD
