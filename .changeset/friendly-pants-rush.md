---
'@twind/preset-tailwind': patch
'twind': patch
---

allow CSS to be used in preflight and rules

```js
setup({
  preflight: css`
    body {
      background: theme(colors.gray.100);
    }
  `,

  rules: [
    [
      // bg-red, bg-#ccc, bg-transparent
      'bg-',
      ({ $$ }) =>
        css`
          background-color: ${$$};
        `,
    ],
  ],
})
```
