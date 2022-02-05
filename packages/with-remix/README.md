# @twind/with-remix [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/with-remix/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/with-remix/v/next) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23next?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/next)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

Seamless integration of [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind) with [Remix](https://remix.run)

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [Remix](https://github.com/tw-in-js/twind/tree/next/examples/with-remix)

## Installation

Install from npm:

```sh
npm install twind@next @twind/with-remix@next
```

## Usage

Please see [examples/with-remix](https://github.com/tw-in-js/twind/tree/next/examples/with-remix) for detailed usage example.

### `twind.config.js`

```js
import { defineConfig } from 'twind'

export default defineConfig({
  /* config */
})
```

`@twind/with-remix` will use hashed class names in production by default. If you don't want this, you can use the `hash` config option:

```js
export default defineConfig({
  hash: false,
  /* config */
})
```

### `app/root.jsx`

```diff
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from 'remix'
import type { MetaFunction } from 'remix'

+ import install from '@twind/with-remix'
+ import config from '../twind.config'
+ install(config)

export const meta: MetaFunction = () => {
  return { title: 'New Remix App' }
}
```

### `app/entry.server.jsx`

Enable server-side rendering of Twind styles.

```diff
import { renderToString } from 'react-dom/server'
import { RemixServer } from 'remix'
import type { EntryContext } from 'remix'

+ import inline from '@twind/with-remix/server'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  let markup = renderToString(<RemixServer context={remixContext} url={request.url} />)

+  // Add twind styles to the markup
+  markup = inline(markup)

  responseHeaders.set('Content-Type', 'text/html')

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
```
