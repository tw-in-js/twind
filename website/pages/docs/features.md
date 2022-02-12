---
title: Features
next: ./grouping-syntax.md
---

- grouping syntax
- inline shortcut: `~` to apply/merge utilities -> `~(text(5xl,red-700),bg-red-100)`
- comments (single and multiline)
- styles (the generated CSS rules) are sorted predictably and stable — no matter in which order the rules are injected

- `shortcuts` vs `apply`

  `shortcut` is a way to group a known design — I develop a component with utilities and then extract it into a shortcut. In that case, I want the order to be as they were when I designed it with utilities.

  `apply` is re-using utilities, but _apply_ them in the order you have declared them.

  Short summary:

  - `shortcut`: `p-2 p-0` -> `p-2` wins
  - `apply`: `p-2 p-0` -> `p-0` wins
