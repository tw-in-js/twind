---
'@twind/core': patch
---

fix: for unnamed rules apply the condition in normal order; otherwise `&..` is applied before there is a selector
