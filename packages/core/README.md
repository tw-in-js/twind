# @twind/core

Minimal implementation of a tailwind-compatible CSS-in-JS framework.

**This package does not contain any Tailwindcss rules. These are defined in [@twind/preset-tailwind](../preset-tailwind).**

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

## Installation

Install from npm:

```sh
# Using npm
npm install @twind/core@next

# Using Yarn
yarn add @twind/core@next
```

## Usage

```js
import { twind, cssom, observe } from '@twind/core'

const tw = observe(
  twind(
    {
      theme: {
        /* .. */
      },
      rules: [
        /* ... */
      ],
    },
    cssom(),
  ),
)
```

## API

### `twind`

TDB

### `cx`

```js
import { cx } from '@twind/core'

// Set a className
element.className = cx`
  underline
  /* multi
    line
    comment
  */
  hover:focus:!{
    sm:{italic why}
    lg:-{px}
    -mx-1
  }
  // Position
  !top-1 !-bottom-2
  text-{xl black}
`
```

### `shortcut`

TDB

### `style`

TDB

### `consume`

Used for static HTML processing (usually to provide SSR support for your javascript-powered web apps)

1. parse the markup and process element classes with the provided Twind instance
2. update the class attributes _if_ necessary
3. return the HTML string with the final element classes

```js
import { twind, virtual, consume} from '@twind/core'

// can be re-used
const tw = twind({ /* config */, virtual()}

function render() {
  const html = app()

  // clear all styles
  tw.clear()

  // generated markup
  const markup = comsume(html, tw)

  // create CSS
  const css = tw.target.join('')

  // inject as last element into the head
  return markup.replace('</head>', `<style id="tw">${css}</style></head>`)
}
```
