# twind

## 1.0.0-next.11

### Patch Changes

- rename `@twind/preset-mini` to `@twind/preset-ext` ([`d9e8c3a1`](https://github.com/tw-in-js/twind/commit/d9e8c3a12fddb85de4b7f5b0a02a9a9ddcd9c6f8))

- Updated dependencies [[`8d846cf2`](https://github.com/tw-in-js/twind/commit/8d846cf2b8c5e4d8042c41ab1079109230c92612), [`b2c7f824`](https://github.com/tw-in-js/twind/commit/b2c7f8249a15acc434601c55b0b0b0af2bc5dfa9), [`3e76ea1b`](https://github.com/tw-in-js/twind/commit/3e76ea1ba46b076920ae4029272d64c3a3b21e6b), [`9ac89873`](https://github.com/tw-in-js/twind/commit/9ac89873517e03960f7af8784efe441172b3cbb1), [`a5f112fa`](https://github.com/tw-in-js/twind/commit/a5f112fa4c3dd2ce63334d5111ba04468750911b)]:
  - @twind/core@1.0.0-next.10
  - @twind/preset-tailwind@1.0.0-next.10
  - @twind/preset-autoprefix@1.0.0-next.10
  - @twind/preset-ext@1.0.0-next.10
  - @twind/runtime@1.0.0-next.10

## 1.0.0-next.10

### Patch Changes

- BREAKING: a twind instance is now callable `tw('...')` instead of `tw.inject('...')` ([#239](https://github.com/tw-in-js/twind/pull/239))

* setup github actions for auto release ([#239](https://github.com/tw-in-js/twind/pull/239))

* Updated dependencies [[`56b9adef`](https://github.com/tw-in-js/twind/commit/56b9adef3f8779ad649d89fc69db321a9b8ee71e), [`f618afd7`](https://github.com/tw-in-js/twind/commit/f618afd7c82e372dd64da03eda8ee6f86d70d174), [`bec4218d`](https://github.com/tw-in-js/twind/commit/bec4218d9fe6f8c214aea5100379454c6b11583f), [`37164d82`](https://github.com/tw-in-js/twind/commit/37164d822506a9d201f9d463f5c867368fddc89e), [`e284b0f4`](https://github.com/tw-in-js/twind/commit/e284b0f43c97d53a81fee15ac15406c8db0e694e)]:
  - @twind/core@1.0.0-next.9
  - @twind/preset-mini@1.0.0-next.9
  - @twind/preset-tailwind@1.0.0-next.9
  - @twind/runtime@1.0.0-next.9
  - @twind/preset-autoprefix@1.0.0-next.9

## 1.0.0-next.9

### Patch Changes

- adding stitches like style helper ([`7360f15a`](https://github.com/tw-in-js/twind/commit/7360f15a828ccd136a0eb40bbe6ccd629b145361))

- Updated dependencies [[`cc3c4fee`](https://github.com/tw-in-js/twind/commit/cc3c4fee9d5b572faf46838a0287d30b9eb0045f), [`7360f15a`](https://github.com/tw-in-js/twind/commit/7360f15a828ccd136a0eb40bbe6ccd629b145361), [`be5def30`](https://github.com/tw-in-js/twind/commit/be5def30416835d8100f6c0c3e88b38ab8171487)]:
  - @twind/preset-mini@1.0.0-next.8
  - @twind/preset-tailwind@1.0.0-next.8
  - @twind/core@1.0.0-next.8
  - @twind/preset-autoprefix@1.0.0-next.8
  - @twind/runtime@1.0.0-next.8

## 1.0.0-next.8

### Patch Changes

- revert to observing document.documentElement and describe a solution to prevent FOUC ([`2a9f1685`](https://github.com/tw-in-js/twind/commit/2a9f1685843b50b741dbe0338f4cf068603411c8))

* re-order args for setup to simplify providing an alternative sheet like `dom()` for enhanced debugging ([`a7b25242`](https://github.com/tw-in-js/twind/commit/a7b252425e3f38ce2b5d2097e63d23cca5c6c4f2))

* Updated dependencies [[`2a9f1685`](https://github.com/tw-in-js/twind/commit/2a9f1685843b50b741dbe0338f4cf068603411c8), [`a7b25242`](https://github.com/tw-in-js/twind/commit/a7b252425e3f38ce2b5d2097e63d23cca5c6c4f2)]:
  - @twind/core@1.0.0-next.7
  - @twind/runtime@1.0.0-next.7
  - @twind/preset-autoprefix@1.0.0-next.7
  - @twind/preset-mini@1.0.0-next.7
  - @twind/preset-tailwind@1.0.0-next.7

## 1.0.0-next.7

### Patch Changes

- allow twind and @twind/runime package to be used outside of a DOM environment ([`d8705f9d`](https://github.com/tw-in-js/twind/commit/d8705f9d3b812f2aa71c6d19efdbc743f90cffcb))

* extract runtime into own package with re-worked autoinit using MutationObserver ([`aa96aef4`](https://github.com/tw-in-js/twind/commit/aa96aef4037d773c1880bfed0c07a7952a668412))

* Updated dependencies [[`184d96ff`](https://github.com/tw-in-js/twind/commit/184d96ffb934e621bb07f8ccbf809a6a14675298), [`a3d09cf4`](https://github.com/tw-in-js/twind/commit/a3d09cf40db55fb980441500121bf1820ea2a3ae), [`d8705f9d`](https://github.com/tw-in-js/twind/commit/d8705f9d3b812f2aa71c6d19efdbc743f90cffcb), [`aa96aef4`](https://github.com/tw-in-js/twind/commit/aa96aef4037d773c1880bfed0c07a7952a668412), [`881e1e16`](https://github.com/tw-in-js/twind/commit/881e1e16005cecd1930cdb988f6983c2b1aff516)]:
  - @twind/core@1.0.0-next.6
  - @twind/preset-mini@1.0.0-next.6
  - @twind/preset-tailwind@1.0.0-next.6
  - @twind/runtime@1.0.0-next.6
  - @twind/preset-autoprefix@1.0.0-next.6

## 1.0.0-next.6

### Patch Changes

- Updated dependencies [[`d68ce341`](https://github.com/tw-in-js/twind/commit/d68ce3413ae29b6ea7cd88d3c094e59876d7e5d5), [`2c5792f9`](https://github.com/tw-in-js/twind/commit/2c5792f9c2c1295a7d0aac094e9aa760999f5cc0)]:
  - @twind/core@1.0.0-next.5
  - @twind/preset-tailwind@1.0.0-next.5
  - @twind/preset-autoprefix@1.0.0-next.5
  - @twind/preset-mini@1.0.0-next.5

## 1.0.0-next.5

### Patch Changes

- add `apply` as known from twind v0.16 ([`230a57ba`](https://github.com/tw-in-js/twind/commit/230a57ba6c6d77ae73ffc6b6a426b9c28ba8c908))

- Updated dependencies [[`af822490`](https://github.com/tw-in-js/twind/commit/af822490d0a02a2fc227b8bc19471141a5586de2), [`bda8c19c`](https://github.com/tw-in-js/twind/commit/bda8c19c9abb80678225b5c947db87e1a4f07aa6), [`3382dd0b`](https://github.com/tw-in-js/twind/commit/3382dd0be26fcedba466d1ac011f76403ece278d), [`230a57ba`](https://github.com/tw-in-js/twind/commit/230a57ba6c6d77ae73ffc6b6a426b9c28ba8c908)]:
  - @twind/core@1.0.0-next.4
  - @twind/preset-tailwind@1.0.0-next.4
  - @twind/preset-mini@1.0.0-next.4
  - @twind/preset-autoprefix@1.0.0-next.4

## 1.0.0-next.4

### Patch Changes

- ensure there is config object when called from setTimeout

- Updated dependencies []:
  - @twind/core@1.0.0-next.3
  - @twind/preset-autoprefix@1.0.0-next.3
  - @twind/preset-mini@1.0.0-next.3
  - @twind/preset-tailwind@1.0.0-next.3

## 1.0.0-next.3

### Patch Changes

- expose `tw` and `apply` for twind v0.16 compatibility ([`79c63ef9`](https://github.com/tw-in-js/twind/commit/79c63ef9ed3dda9f3bfafde977016b3b75db7c4c))

* expose setup function to configure twind ([`79c63ef9`](https://github.com/tw-in-js/twind/commit/79c63ef9ed3dda9f3bfafde977016b3b75db7c4c))

- BREAKING: renamed umd bundles to global (`twind.global.js`) and there are plain IIFEs ([`79c63ef9`](https://github.com/tw-in-js/twind/commit/79c63ef9ed3dda9f3bfafde977016b3b75db7c4c))

- Updated dependencies [[`79c63ef9`](https://github.com/tw-in-js/twind/commit/79c63ef9ed3dda9f3bfafde977016b3b75db7c4c)]:
  - @twind/core@1.0.0-next.2
  - @twind/preset-autoprefix@1.0.0-next.2
  - @twind/preset-mini@1.0.0-next.2
  - @twind/preset-tailwind@1.0.0-next.2

## 1.0.0-next.1

### Patch Changes

- Initial publish of twind v1 preview ([`179b9653`](https://github.com/tw-in-js/twind/commit/179b9653de661a62a661c80d5506ae68f7964aba))

- Updated dependencies [[`179b9653`](https://github.com/tw-in-js/twind/commit/179b9653de661a62a661c80d5506ae68f7964aba)]:
  - @twind/core@1.0.0-next.1
  - @twind/preset-autoprefix@1.0.0-next.1
  - @twind/preset-tailwind@1.0.0-next.1
