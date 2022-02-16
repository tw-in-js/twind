---
'twind': patch
---

feat: preserve classes created by explicit `tw` calls during SSR

Previously `inline` and `extract` cleared the `tw` instance before parsing the html assuming that all classes are available via `class` attributes. That led to missing styles from `injectGlobal` or explicit `tw` calls.

This change introduces a `snaphot` method on `tw` and sheet instances which allows to preserve the classes that are created by explicit `tw` calls.

**Default Mode** _(nothing changed here)_

```js
import { inline } from 'twind'

function render() {
  return inline(renderApp())
}
```

**Library Mode**

```js
import { tw, stringify } from 'twind'

function render() {
  // remember global classes
  const restore = tw.snapshot()

  // generated html
  const html = renderApp()

  // create CSS
  const css = stringify(tw.target)

  // restore global classes
  restore()

  // inject as last element into the head
  return html.replace('</head>', `<style data-twind>${css}</style></head>`)
}
```
