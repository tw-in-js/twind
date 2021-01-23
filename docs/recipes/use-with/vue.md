## Vue

To be written...

## Server Side Rendering

```js
// createBundleRenderer works the same
import { createRenderer } from 'vue-server-renderer'

import { setup } from 'twind'
import { asyncVirtualSheet, getStyleTag } from 'twind/server'

import { createApp } from './app'

const sheet = asyncVirtualSheet()

setup({ ...sharedOptions, sheet })

const renderer = createRenderer({
  /* options */
})

async function ssr() {
  // 1. Reset the sheet for a new rendering
  sheet.reset()

  // 2. Render the app
  const body = await renderer.renderToString(createApp())

  // 3. Create the style tag with all generated CSS rules
  const styleTag = getStyleTag(sheet)

  // 4. Generate the response html
  return `<!DOCTYPE html>
    <html lang="en">
      <head>${styleTag}</head>
      <body>${body}</body>
    </html>
  `
}
```
