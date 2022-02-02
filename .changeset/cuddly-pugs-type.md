---
'twind': patch
---

add animation helper

```js
import { animation, keyframes } from 'twind'

const fadeIn = animation(
  '1s ease-out',
  keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `,
)
```
