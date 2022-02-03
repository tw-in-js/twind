# @example/sveltekit

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
