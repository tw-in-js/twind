# @twind/sveltekit

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

Seamless integration of Twind into [SvelteKit](https://kit.svelte.dev/)

## Installation

Install from npm:

```sh
# Using npm
npm install @twind/sveltekit@next

# Using Yarn
yarn add @twind/sveltekit@next
```

## Usage

Please see [examples/sveltekit](https://github.com/tw-in-js/twind/tree/next/examples/sveltekit) for detailed usage example.

**`src/hooks`**

```js
import { withTwind } from '@twind/sveltekit'

/* import twind instance */
import { tw } from 'twind'
// import { tw } from '@twind/runtime'
// import { tw } from './your/twind'

export const handle = withTwind(tw)

/* If you have other handles use the `sequence` helper */
// import { sequence } from '@sveltejs/kit/hooks';
// export const handle = sequence(withTwind(tw), ...otherHandles)
```

**`src/routes/__layout.svelte`**

when using with [twind](https://www.npmjs.com/package/twind) or [@twind/runtime](https://www.npmjs.com/package/@twind/runtime):

```html
<script type="module">
  import { browser } from '$app/env'

  import { setup } from 'twind'
  // import { setup } from '@twind/runtime'

  import twindConfig from '../twind.config'

  setup(twindConfig)

  // optional — remove server-side generated style element
  // after `setup` twind has taken over and the SSR styles are no longer used
  if (browser) {
    document.querySelector('style[data-twind]')?.remove()
  }
</script>
```

when using with [@twind/core](https://www.npmjs.com/package/@twind/core):

TBD

## API

### `withTwind(tw)`

TBD
