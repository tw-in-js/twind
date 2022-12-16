---
'@example/with-remix': patch
'@twind/core': patch
'@twind/with-remix': patch
'@twind/with-react': patch
---

add `@twind/with-react` package with support for React v18 streamed responses (fixes #409)

- the `@twind/with-remix` package is deprecated in favor of the `@twind/with-react` package
- added a Remix with React v18 and [renderToPipeableStream](https://reactjs.org/docs/react-dom-server.html#rendertopipeablestream) example: [examples/with-remix_react-v18](https://github.com/tw-in-js/twind/tree/main/examples/with-remix_react-v18) (related to #400 & #408)
