---
'@twind/preset-tailwind': patch
---

prevent adding `content` property to defaults

Previously the defaults for `blur`, `ordinal`, `ring`, `shadow`, `snap-x`, `touch-pan-x`, and `transform`, would include `content:var(--tw-content)` for **all** elements, including the pseudo elements `::before`, `::after`, and `::backdrop`, causing a shift in layout.
