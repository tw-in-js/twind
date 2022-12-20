# @example/sveltekit

## 1.0.3

### Patch Changes

- create dedicated worker and deno bundles, and downgrade module to es2019 (fixes [#426](https://github.com/tw-in-js/twind/issues/426)) ([`02ea227a`](https://github.com/tw-in-js/twind/commit/02ea227afffe474cde5e843c3519f0836ee18f8a))

## 1.0.2

### Patch Changes

- update vite, vitest, sveltekit, and typescript ([`5183718b`](https://github.com/tw-in-js/twind/commit/5183718ba54d927818a5c6e67efa59eb9a98246e))

## 1.0.1

### Patch Changes

- introduce new @twind/core package to prevent issue with existing code that imports from CDNs without a version ([`4cab9d2f`](https://github.com/tw-in-js/twind/commit/4cab9d2fc573dd2a91cc6667510ff1b7b890854b))

## 1.0.0

### Patch Changes

- big documentation update ([`a63ca2cb`](https://github.com/tw-in-js/twind/commit/a63ca2cbf450d8a6f72f4d60f5856cee88d16911))

## 0.0.1-next.4

### Patch Changes

- follow sveltkit hooks convention for importing; use dom sheet during development and hash class names in production ([#252](https://github.com/tw-in-js/twind/pull/252))

## 0.0.1-next.3

### Patch Changes

- `inline` can accept an options object with a `minify` to minify the resulting CSS before injecting it ([#251](https://github.com/tw-in-js/twind/pull/251))

## 0.0.1-next.2

### Patch Changes

- perf: optimize observe to only handle changes on element with class attribute ([`88eeb077`](https://github.com/tw-in-js/twind/commit/88eeb07798e70860c840278ac97e7a2ba6ee8366))

* revert: remove dom sheet ([`6d50cf5f`](https://github.com/tw-in-js/twind/commit/6d50cf5f7bd8fb79caf02a81c30060c8abf2382e))

## 0.0.1-next.1

### Patch Changes

- add sveltekit integration (@twind/with-sveltekit) with example ([#245](https://github.com/tw-in-js/twind/pull/245))
