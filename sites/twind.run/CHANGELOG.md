# @sites/twind.run

## 1.1.1

### Patch Changes

- create dedicated worker and deno bundles, and downgrade module to es2019 (fixes [#426](https://github.com/tw-in-js/twind/issues/426)) ([`02ea227a`](https://github.com/tw-in-js/twind/commit/02ea227afffe474cde5e843c3519f0836ee18f8a))

- patch all occurences of `1 .toString` using pnpm instead of relying on built-time patching ([`8861034c`](https://github.com/tw-in-js/twind/commit/8861034c48287e35953ad2bd5b5ab3d1b0793b9d))

## 1.1.0

### Minor Changes

- add discover tab to twind.run to explore available utilities and variants ([#420](https://github.com/tw-in-js/twind/pull/420))

### Patch Changes

- update vite, vitest, sveltekit, and typescript ([`5183718b`](https://github.com/tw-in-js/twind/commit/5183718ba54d927818a5c6e67efa59eb9a98246e))

- support observing shadow dom (fixes [#421](https://github.com/tw-in-js/twind/issues/421)) ([`1e16652d`](https://github.com/tw-in-js/twind/commit/1e16652d4d7a5aae72390e0ceef29519a5e18d4d))

- add radix-ui example to twind.run ([#419](https://github.com/tw-in-js/twind/pull/419))

## 1.0.2

### Patch Changes

- no version range check because pre-release versions would not match ([`5d16c8a7`](https://github.com/tw-in-js/twind/commit/5d16c8a7597da5cb7b7ab570eae9ab6273e04a77))

- adjust description ([`21a8cc6f`](https://github.com/tw-in-js/twind/commit/21a8cc6f2fea691536fdd9540c7a48db2bdd4c28))

- try to fix prettier not working in safari ([`651b84d4`](https://github.com/tw-in-js/twind/commit/651b84d4e0c4fceeb6a30ba714c471da0d3b75da))

- add labels to new issue links ([`65dad262`](https://github.com/tw-in-js/twind/commit/65dad262de40904d82b6b756302c9a5bb65ff404))

## 1.0.1

### Patch Changes

- introduce new @twind/core package to prevent issue with existing code that imports from CDNs without a version ([`4cab9d2f`](https://github.com/tw-in-js/twind/commit/4cab9d2fc573dd2a91cc6667510ff1b7b890854b))

- publish main branch ([`4cab9d2f`](https://github.com/tw-in-js/twind/commit/4cab9d2fc573dd2a91cc6667510ff1b7b890854b))

## 1.0.0

### Patch Changes

- big documentation update ([`a63ca2cb`](https://github.com/tw-in-js/twind/commit/a63ca2cbf450d8a6f72f4d60f5856cee88d16911))
