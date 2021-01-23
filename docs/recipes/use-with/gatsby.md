## Gatsby

> ❗ This has not been tested yet.

```js
/* gatsby-ssr.js */

const { setup } = require('twind')
const { asyncVirtualSheet, getStyleTagProperties } = require('twind/server')

const sheet = asyncVirtualSheet()

setup({ ...sharedOptions, sheet })

exports.wrapPageElement = ({ element }) => {
  sheet.reset()

  return element
}

exports.onRenderBody = ({ setHeadComponents, pathname }) => {
  const { id, textContent } = getStyleTagProperties(sheet)

  const styleProps = {
    id,
    dangerouslySetInnerHTML: {
      __html: textContent,
    },
  }

  setHeadComponents([
    React.createElement('style', {
      id,
      dangerouslySetInnerHTML: {
        __html: textContent,
      },
    }),
  ])
}
```
