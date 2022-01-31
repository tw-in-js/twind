---
'@twind/preset-ext': patch
'@twind/preset-tailwind': patch
'twind': patch
---

merge multiple group and peer classes

`peer-disabled:peer-first-child:group-hover:group-focus:focus:hover:space-x-4`

↓ ↓ ↓ ↓ ↓ ↓

```css
.peer:first-child:disabled
  ~ .group:focus:hover
  .peer-disabled\\:peer-first-child\\:group-hover\\:group-focus\\:focus\\:hover\\:space-x-4:focus:hover
  > :not([hidden])
  ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
  margin-right: calc(1rem * var(--tw-space-x-reverse));
}
```
