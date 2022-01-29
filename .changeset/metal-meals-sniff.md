---
'twind': patch
---

BREAKING: changed the definition of shortcuts within config.rules

The new format should be more readable and clear about what is happening.

```js
// defineConfig is optional but helps with type inference
defineConfig({
  rules: [
    /* Some aliases */
    // shortcut: styles are generated as defined by twind — same as if they where used alone
    // shortcut to multiple utilities
    ['card', 'py-2 px-4 font-semibold rounded-lg shadow-md'],

    // dynamic shortcut — `$$` is everything after the match eg `btn-red` -> `red`
    ['card-', ({ $$ }) => `bg-${$$}-400 text-${$$}-100 py-2 px-4 rounded-lg`],

    // single utility alias — need to use `~(...)` as it would be otherwise recognized as a CSS property
    ['red', '~(text-red-100)'],

    // apply: styles are generated in order they are declared
    // apply to multiple utilities
    ['btn-green', '@(bg-green-500 hover:bg-green-700 text-white)'],

    // dynamic apply
    ['btn-', ({ $$ }) => `@(bg-${$$}-400 text-${$$}-100 py-2 px-4 rounded-lg)`],

    /* Some rules */
    ['hidden', { display: 'none' }],

    // Table Layout
    // .table-auto { table-layout: auto }
    // .table-fixed { table-layout: fixed }
    ['table-(auto|fixed)', 'tableLayout'],

    // dynamic
    ['table-', (match, context) => /* ... */],
],
})
```
