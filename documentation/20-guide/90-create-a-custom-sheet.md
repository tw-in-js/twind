# Create a custom sheet

```js
import type { Sheet } from 'twind'

// https://github.com/tw-in-js/twind/blob/next/packages/twind/src/sheets.ts#L9
function createStyleElement(
  // 1. look for existing style element — usually from SSR
  // 2. append to document.head — this assumes that document.head has at least one child node
  referenceNode = document.querySelector('style[data-twind]') || (document.head.lastChild as Node),
): HTMLStyleElement {
  // insert new style element after existing element which allows to override styles
  return (referenceNode.parentNode as Node).insertBefore(
    document.createElement('style'),
    referenceNode.nextSibling,
  )
}

export function dom(target = createStyleElement()): Sheet<HTMLStyleElement> {
  return {
    target,

    clear() {
      // remove all added nodes
      while (target.childNodes.length) {
        target.removeChild(target.lastChild as Node)
      }
    },

    destroy() {
      target.remove()
    },

    insert(css, index) {
      target.insertBefore(document.createTextNode(css), target.childNodes[index] || null)
    },
  }
}
```
