[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev/api/modules/twind_sheets.html)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc%2Fsheets?icon=github&label)](https://github.com/tw-in-js/twind/tree/v0.16/src/sheets)
[![Module Size](https://flat.badgen.net/badgesize/brotli/https://cdn.jsdelivr.net/npm/twind/sheets/sheets.min.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/sheets/sheets.js 'brotli module size')
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/sheets/sheets.d.ts)

This module provides [virtualSheet](#virtual-sheet) and [domSheet](#dom-sheet) which can be used with <code>{@link twind.setup | setup}({ {@link twind.Configuration.sheet | sheet} })</code>.

## Virtual Sheet

The virtual sheet collects style rules into an array. This is most useful during testing and {@page Extract Styles aka SSR | server side rendering (SSR)}.

Additionally it provides an API to reset the current internal state of its `tw` function.

### Using for Static Extraction a.k.a. Server Side Rendering (SSR)

> 💡 You can find detailed instructions and example in the {@page Extract Styles aka SSR | Server Side Rendering (SSR) guide}.

The following example assumes your app is using the `tw` named export from `twind`
but the same logic can be applied to custom instances.

```js
import { setup } from 'twind'
import { virtualSheet, getStyleTag } from 'twind/sheets'

const sheet = virtualSheet()

setup({ ...sharedOptions, sheet })

function ssr() {
  // 1. Reset the sheet for a new rendering
  sheet.reset()

  // 2. Render the app
  const body = renderTheApp()

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

### Using in tests

> 💡 The example below uses [uvu](https://github.com/lukeed/uvu). Please adjust the test code to your testing framework.

```js
import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { create } from 'twind'
import { virtualSheet } from 'twind/sheets'

const test = suite('using virtual sheet')

// Setup code to be run once before all tests
test.before((context) => {
  context.sheet = virtualSheet()

  const instance = create({
    sheet: context.sheet,
    // Fail tests on unknown rules or theme values
    mode: 'strict',
    // Prevent preflight rules to be added into sheet
    preflight: false,
    // Do not prefix properties and values
    prefix: false,
  })

  context.tw = instance.tw
})

// Clear the state before each test
test.before.each(({ sheet }) => {
  sheet.reset()
})

test('render one rule', ({ tw, sheet }) => {
  assert.is(tw`text(center)`, 'text-center')
  assert.equal(sheet.target, '.text-center{text-align:center}')
})
```

## DOM Sheet

This sheet uses DOM Text nodes to insert the CSS rules into the stylesheet. Using DOM manipulation makes this way slower than the {@link twind.cssomSheet | default sheet} but allows to see the generated CSS in to DOM. Most modern browser display CSS rules from the speedy default sheet using their CSS inspector.

> 💡 In production it is advised to use {@link twind.cssomSheet | speedy default sheet}.

If the `domSheet` is passed no `target` it looks for an style element with the id `__twind`. If no such element is found it will create one and append it to the `document.head`.

```js
import { setup } from 'twind'
import { domSheet } from 'twind/sheets'

setup({ ...sharedOptions, sheet: domSheet() })
```

## Custom Sheet Implementation

In case the builtin sheet implementations do not solve your use case, you can create your own:

```js
import { setup } from 'twind'

const customSheet = (target = []) => ({
  target,
  insert: (rule, index) => {
    // rule: the CSS rule to insert
    // index: the rule's position
    target.splice(index, 0, rule)
  },
})

setup({ ...sharedOptions, sheet: customSheet() })
```
