# @sites/cdn.twind.style

## 1.1.1

### Patch Changes

- create dedicated worker and deno bundles, and downgrade module to es2019 (fixes [#426](https://github.com/tw-in-js/twind/issues/426)) ([`02ea227a`](https://github.com/tw-in-js/twind/commit/02ea227afffe474cde5e843c3519f0836ee18f8a))

## 1.1.0

### Minor Changes

- add discover tab to twind.run to explore available utilities and variants ([#420](https://github.com/tw-in-js/twind/pull/420))

### Patch Changes

- update vite, vitest, sveltekit, and typescript ([`5183718b`](https://github.com/tw-in-js/twind/commit/5183718ba54d927818a5c6e67efa59eb9a98246e))

## 1.0.1

### Patch Changes

- introduce new @twind/core package to prevent issue with existing code that imports from CDNs without a version ([`4cab9d2f`](https://github.com/tw-in-js/twind/commit/4cab9d2fc573dd2a91cc6667510ff1b7b890854b))

- default to latest version ([`4cab9d2f`](https://github.com/tw-in-js/twind/commit/4cab9d2fc573dd2a91cc6667510ff1b7b890854b))

- fix latest tag resolution ([`4cab9d2f`](https://github.com/tw-in-js/twind/commit/4cab9d2fc573dd2a91cc6667510ff1b7b890854b))

## 1.0.0

### Patch Changes

- create cdn.twind.style worker as proxy to jsdelivr ([`a7ca73ec`](https://github.com/tw-in-js/twind/commit/a7ca73ecd9f4fa667a42086c39334a05849e555d))
