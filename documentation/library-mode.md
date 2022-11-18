---
section: Advanced
title: Library Mode
excerpt: Instead of the default _shim_ mode, twind can be used in _library_ mode.
next: ./intellisense.md
---

This mode _may_ be useful for component libraries that do not want to expose the twind API to their users. Instead a own twind instance is created and used to generate the styles.

## Recommended Pattern

```js title="twind.js"
import {
  twind,
  virtual,
  cssom,
  tx as tx$,
  injectGlobal as injectGlobal$,
  keyframes as keyframes$,
} from '@twind/core'

import config from './twind.config'

export const tw = /* #__PURE__ */ twind(
  config,
  // support SSR and use a different selector to not get the twind default style sheet
  typeof document === 'undefined' ? virtual() : cssom('style[data-library]'),
)
export const tx = /* #__PURE__ */ tx$.bind(tw)
export const injectGlobal = /* #__PURE__ */ injectGlobal$.bind(tw)
export const keyframes = /* #__PURE__ */ keyframes$.bind(tw)
```

It is then recommended to use the `tw` instance to generate the styles. It is only advised to use `observe` if used within a [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM). Otherwise different twind instances may interfere with each other.

TODO: example using a shared stylesheet for several custom element instances
