# @twind/sveltekit

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

Manages a single Twind instance which observes the DOM.

## Installation

Install from npm:

```sh
# Using npm
npm install @twind/runtime@next

# Using Yarn
yarn add @twind/runtime@next
```

## Usage

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

## API

### `withTwind(tw)`

TBD
