---
'twind': patch
---

allow `css()`, `cx()`, and `style()` to be used for rule definition

```js
defineConfig({
  rules: [
    // Using css
    [
      'target-new-tab',
      css`
        target-name: new;
        target-new: tab;
      `,
    ],
    // dynamic
    [
      'target-new-(tab|window)',
      ({ 1: $1 }) => css`
        target-name: new;
        target-new: ${$1};
      `,
    ],

    // Using cx
    ['highlight(-rounded)?', ({ 1: rounded }) => cx({ 'bg-yellow-200': true, rounded })],

    // Using style
    // `box?color=coral` -> `.box\\?color\\=coral{background-color:coral}`
    // `box?rounded` -> `.box\\?rounded{border-radius:0.25rem}`
    // `box?color=coral&rounded` -> `.box\\?color\\=coral\\&rounded{background-color:coral;border-radius:0.25rem}`
    // `box?color=purple&rounded=md` -> `.box\\?color\\=purple\\&rounded\\=md{background-color:purple;border-radius:0.375rem}`
    [
      'box\\?(.+)',
      style({
        props: {
          color: {
            coral: css({
              backgroundColor: 'coral',
            }),
            purple: css`
              background-color: purple;
            `,
          },
          rounded: {
            '': 'rounded',
            md: 'rounded-md',
          },
        },
      }),
    ],
  ],
})
```
