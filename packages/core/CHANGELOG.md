# @twind/core

## 1.0.0-next.14

### Patch Changes

- be less strict about interpolations values ([#245](https://github.com/tw-in-js/twind/pull/245))

* golf: refactor sheets — always use a dedicated style element ([#245](https://github.com/tw-in-js/twind/pull/245))

- support any target for stringify ([#245](https://github.com/tw-in-js/twind/pull/245))

* add `stringify` helper to convert as `sheet.target` to a string; this makes `extract` isomorphic ([#245](https://github.com/tw-in-js/twind/pull/245))

- use `data-twind` to locate SSR style element ([#245](https://github.com/tw-in-js/twind/pull/245))

## 1.0.0-next.13

### Patch Changes

- BREAKING(preset authors): removed `preset()` helper to simplify config merging — What needs to change? instead calling preset, return your preset ([#244](https://github.com/tw-in-js/twind/pull/244))

* remove auto string conversion for style selector; this wouldn't have worked with `css()` anyway ([#244](https://github.com/tw-in-js/twind/pull/244))

- add `comsume(html, tw)` to process static HTML ([#244](https://github.com/tw-in-js/twind/pull/244))

* BREAKING: rename `config.tag` to `config.hash` as it better reflects what it does ([#244](https://github.com/tw-in-js/twind/pull/244))

- feat: support array property value which act as fallbacks for browser taht do not support a specific syntax or value ([#244](https://github.com/tw-in-js/twind/pull/244))

* only update class attributes if the class names within are different (ignore order) ([#244](https://github.com/tw-in-js/twind/pull/244))

- fix: ensure nullish values are not converted to array with one nullish element ([#244](https://github.com/tw-in-js/twind/pull/244))

* feat: `@layer ...` values can be arrays; this allows the same selector several times ([#244](https://github.com/tw-in-js/twind/pull/244))

- add `extract(html, tw)` to simplify SSR use case ([#244](https://github.com/tw-in-js/twind/pull/244))

* fix: for unnamed rules apply the condition in normal order; otherwise `&..` is applied before there is a selector ([#244](https://github.com/tw-in-js/twind/pull/244))

## 1.0.0-next.12

### Patch Changes

- introduce `twind/cdn`: a bore bones Tailwind CSS replacement — no additional exports like (`cx`, `style` or `css`) ([`9bc26949`](https://github.com/tw-in-js/twind/commit/9bc26949dd729b7002bc27032bb2f999e766546d))

## 1.0.0-next.11

### Patch Changes

- adjust rule ordering to fix `m-5 mr-3 mx-1` (previously generated `mx-1 m-5 mr-3`) ([#241](https://github.com/tw-in-js/twind/pull/241))

* BREAKING: the match object passed to rules and variants is now a RegExpExecArray with one additional property ([`dc778be0`](https://github.com/tw-in-js/twind/commit/dc778be038180c8f0409adc044305d565d35493f))

- golf: short names within `context`; should not affect most users ([#241](https://github.com/tw-in-js/twind/pull/241))

* fix: ensure proper pseudo-class ordering ([#241](https://github.com/tw-in-js/twind/pull/241))

- ensure base and overrides (css) layers are kept in the order the rules are declared ([#241](https://github.com/tw-in-js/twind/pull/241))

## 1.0.0-next.10

### Patch Changes

- support inline named shortcuts (`PrimaryButton~(bg-red-500 text-white ...)` -> `PrimaryButton#asdadf`) ([#240](https://github.com/tw-in-js/twind/pull/240))

* BREAKING: renamed `apply` to `shortcut` as it better reflect what it does ([#240](https://github.com/tw-in-js/twind/pull/240))

- simplify creation of named shortcuts: `shortcut.PrimaryButton\`bg-red-500 text-white\``or`shortcut.PrimaryButton('...', [...], {...})` ([#240](https://github.com/tw-in-js/twind/pull/240))

* golf: shave of some bytes by using short property names within `TwindRule` ([#240](https://github.com/tw-in-js/twind/pull/240))

- fix: style inherits styles from parent ([#240](https://github.com/tw-in-js/twind/pull/240))

## 1.0.0-next.9

### Patch Changes

- BREAKING: a twind instance is now callable `tw('...')` instead of `tw.inject('...')` ([#239](https://github.com/tw-in-js/twind/pull/239))

* if `config.tag` is `true` or a custom `tag` function is provided the generated class names are tagged ([#239](https://github.com/tw-in-js/twind/pull/239))

- setup github actions for auto release ([#239](https://github.com/tw-in-js/twind/pull/239))

* align `tw` with `cx` and `apply`; it now accepts any number of arguments ans can be used as tagged template literal ([`37164d82`](https://github.com/tw-in-js/twind/commit/37164d822506a9d201f9d463f5c867368fddc89e))

- golf: short properties in ConvertedRule ([#239](https://github.com/tw-in-js/twind/pull/239))

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
