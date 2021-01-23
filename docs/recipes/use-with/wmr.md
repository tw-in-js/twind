## [WMR](https://github.com/preactjs/wmr)

> 💡 The [tw-in-js/example-wmr](https://github.com/tw-in-js/example-wmr) repository uses this setup.

```js
/* public/twind.config.js */
export default {
  /* Shared config */
}
```

```js
/* public/index.js */
import hydrate from 'preact-iso/hydrate'

import { setup } from 'twind'
// Or if you are using twind/shim
// import { setup } from 'twind/shim'

import twindConfig from './twind.config'

if (typeof window !== 'undefined') {
  setup(twindConfig)
}

export function App() {
  /* Your app */
}

hydrate(<App />)

export async function prerender(data) {
  const { default: prerender } = await import('./prerender')

  return prerender(<App {...data} />)
  // Or if you are using twind/shim
  // return prerender(<App {...data} />, { shim: true })
}
```

```js
/* public/prerender.js */
import prerender from 'preact-iso/prerender'

import { setup } from 'twind'
import { asyncVirtualSheet, getStyleTagProperties, shim } from 'twind/server'

import twindConfig from './twind.config'

const sheet = asyncVirtualSheet()

setup({ ...twindConfig, sheet })

export default async (app, options = {}) => {
  sheet.reset()

  const result = await prerender(app)

  if (options.shim) {
    result.html = shim(result.html)
  }

  const { id, textContent } = getStyleTagProperties(sheet)

  result.html = `<style id="${id}">${textContent}</style>${result.html}`

  return result
}
```
