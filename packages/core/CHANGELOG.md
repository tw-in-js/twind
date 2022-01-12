# @twind/core

## 1.0.0-next.8

### Patch Changes

- adding stitches like style helper ([`7360f15a`](https://github.com/tw-in-js/twind/commit/7360f15a828ccd136a0eb40bbe6ccd629b145361))

* reduce exported types, rename `@label` to `label`, rename some layers ([`be5def30`](https://github.com/tw-in-js/twind/commit/be5def30416835d8100f6c0c3e88b38ab8171487))

## 1.0.0-next.7

### Patch Changes

- revert to observing document.documentElement and describe a solution to prevent FOUC ([`2a9f1685`](https://github.com/tw-in-js/twind/commit/2a9f1685843b50b741dbe0338f4cf068603411c8))

* re-order args for setup to simplify providing an alternative sheet like `dom()` for enhanced debugging ([`a7b25242`](https://github.com/tw-in-js/twind/commit/a7b252425e3f38ce2b5d2097e63d23cca5c6c4f2))

## 1.0.0-next.6

### Patch Changes

- observe document.body instead of document.documentElement (fixes [#172](https://github.com/tw-in-js/twind/issues/172)) ([`184d96ff`](https://github.com/tw-in-js/twind/commit/184d96ffb934e621bb07f8ccbf809a6a14675298))

* fix selector generation ([`a3d09cf4`](https://github.com/tw-in-js/twind/commit/a3d09cf40db55fb980441500121bf1820ea2a3ae))

## 1.0.0-next.5

### Patch Changes

- observe: remove hidden attribute from body alongside html (fixes [#172](https://github.com/tw-in-js/twind/issues/172)) ([`d68ce341`](https://github.com/tw-in-js/twind/commit/d68ce3413ae29b6ea7cd88d3c094e59876d7e5d5))

* support negative order ([`2c5792f9`](https://github.com/tw-in-js/twind/commit/2c5792f9c2c1295a7d0aac094e9aa760999f5cc0))

## 1.0.0-next.4

### Patch Changes

- `cx` expands groups ([`af822490`](https://github.com/tw-in-js/twind/commit/af822490d0a02a2fc227b8bc19471141a5586de2))

* revert to parenthesis grouping syntax ([`bda8c19c`](https://github.com/tw-in-js/twind/commit/bda8c19c9abb80678225b5c947db87e1a4f07aa6))

- add `apply` as known from twind v0.16 ([`230a57ba`](https://github.com/tw-in-js/twind/commit/230a57ba6c6d77ae73ffc6b6a426b9c28ba8c908))

## 1.0.0-next.3

### Patch Changes

- fix invalid offset calculation for cssom sheet if rules failed to insert

## 1.0.0-next.2

### Patch Changes

- BREAKING: renamed umd bundles to global (`twind.global.js`) and there are plain IIFEs ([`79c63ef9`](https://github.com/tw-in-js/twind/commit/79c63ef9ed3dda9f3bfafde977016b3b75db7c4c))

## 1.0.0-next.1

### Patch Changes

- Initial publish of twind v1 preview ([`179b9653`](https://github.com/tw-in-js/twind/commit/179b9653de661a62a661c80d5506ae68f7964aba))
