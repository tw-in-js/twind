For _Library Mode_ SSR: `inline` and `extract` are expecting all styles to be in the html and are clearing the `tw` instance before parsing the HTML. After the clearing all styles added by a `tw` call are gone. We do this to only include the used classes. You could replace `inline` with the following code:

**EDITED:** previous version used `extract

```js
import { tw, consume, stringify } from 'twind'

function render() {
  const html = consume(renderApp(), tw)
  const css = stringify(tw.target)

  // inject as last element into the head
  return html.replace('</head>', `<style data-twind>${css}</style></head>`)
}
```

```js
  if (firstRun && typeof document != 'undefined') {
    // first run in browser

    // If they body was hidden autofocus the first element
    if (!document.activeElement) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      ;(document.querySelector('[autofocus]') as HTMLElement | null)?.focus()
    }
  }
```
