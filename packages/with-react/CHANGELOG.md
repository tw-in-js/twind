# @twind/with-react

## 1.1.3

## 1.1.2

### Patch Changes

- do not replace window and document for deno bundles ([`5fd4bb08`](https://github.com/tw-in-js/twind/commit/5fd4bb082857c6f5504a23a641a2b61a33e7db88))

## 1.1.1

### Patch Changes

- create dedicated worker and deno bundles, and downgrade module to es2019 (fixes [#426](https://github.com/tw-in-js/twind/issues/426)) ([`02ea227a`](https://github.com/tw-in-js/twind/commit/02ea227afffe474cde5e843c3519f0836ee18f8a))

- add `@twind/with-react` package with support for React v18 streamed responses (fixes [#409](https://github.com/tw-in-js/twind/issues/409)) ([`6521e678`](https://github.com/tw-in-js/twind/commit/6521e678821f05de8cd3a87b0176083efee43405))

  - the `@twind/with-remix` package is deprecated in favor of the `@twind/with-react` package
  - added a Remix with React v18 and [renderToPipeableStream](https://reactjs.org/docs/react-dom-server.html#rendertopipeablestream) example: [examples/with-remix_react-v18](https://github.com/tw-in-js/twind/tree/main/examples/with-remix_react-v18) (related to #400 & #408)
