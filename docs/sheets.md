# twind/sheets

This module provides two additional sheets: [domSheet](#dom-sheet) and [virtualSheet](#virtual-sheet)

## DOM Sheet

This sheet uses DOM Text nodes to insert the CSS rules into the stylesheet.
Using DOM manipulation makes this way slower than the default sheet but allows to see the generated CSS in to DOM.
Most modern browser display CSS rules from the speedy default sheet using their CSS inspector.

> In production it is advised to use speedy default sheet.

```js
import { setup } from 'twind'
import { domSheet } from 'twind/sheets'

setup({ ...sharedOptions, sheet: domSheet() })
```

## Virtual Sheet

The virtual sheet collects style rules into an array. This is most useful during (see blow) and [server side rendering (SSR)](./ssr.md).

Additionally it provides an API to reset, save and restore the current internal state of its `tw` function.

> The example below uses [uvu](https://github.com/lukeed/uvu). Please adjust the test code to your testing framework.

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
