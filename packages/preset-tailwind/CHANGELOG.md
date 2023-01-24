# @twind/preset-tailwind

## 1.1.4

### Patch Changes

- prevent invalid default rule in legacy browsers ([`ccc9c9a9`](https://github.com/tw-in-js/twind/commit/ccc9c9a959c8b61b7429c3539e709e7b39cc3ae8))

## 1.1.3

### Patch Changes

- prevent adding `content` property to defaults ([`b7c1636c`](https://github.com/tw-in-js/twind/commit/b7c1636cec002124ed8fcfd0dd269a3109e1af93))

  Previously the defaults for `blur`, `ordinal`, `ring`, `shadow`, `snap-x`, `touch-pan-x`, and `transform`, would include `content:var(--tw-content)` for **all** elements, including the pseudo elements `::before`, `::after`, and `::backdrop`, causing a shift in layout.

## 1.1.2

### Patch Changes

- do not replace window and document for deno bundles ([`5fd4bb08`](https://github.com/tw-in-js/twind/commit/5fd4bb082857c6f5504a23a641a2b61a33e7db88))

## 1.1.1

### Patch Changes

- create dedicated worker and deno bundles, and downgrade module to es2019 (fixes [#426](https://github.com/tw-in-js/twind/issues/426)) ([`02ea227a`](https://github.com/tw-in-js/twind/commit/02ea227afffe474cde5e843c3519f0836ee18f8a))

- bump @twind/core peerDependency to latest ([`a26657cf`](https://github.com/tw-in-js/twind/commit/a26657cf025aa7ad207372b30034d81417ad41c7))

- ensure that all functions from the internal context are destructurable (fixes [#423](https://github.com/tw-in-js/twind/issues/423)) ([`c832b338`](https://github.com/tw-in-js/twind/commit/c832b33849690545e7a4dffbdada2f5b97f6aa08))

## 1.1.0

### Minor Changes

- allow to omit the default color palette ([#419](https://github.com/tw-in-js/twind/pull/419))

- use fixed value for default ring color ([`f194c5b8`](https://github.com/tw-in-js/twind/commit/f194c5b8e13bdc0dd66ec7c0df9dbc20d869e14a))

- automatically add `content: ''` to `before` and `after` variant styles (closes #405, related to #414) ([`58c87006`](https://github.com/tw-in-js/twind/commit/58c870060e13e95ac50bcd8b98de441126dafb05))

- support labeled groups and peers ([`6e64c33f`](https://github.com/tw-in-js/twind/commit/6e64c33f8f69155979cc4a90a74e695a484bcc9d))

- Add support for configuring default font-feature-settings for a font-family ([`b24af095`](https://github.com/tw-in-js/twind/commit/b24af09537c889eda791f675499f73acb37e7fb0))

- Add `fill-none` and `stroke-none` utilities ([`622b08dc`](https://github.com/tw-in-js/twind/commit/622b08dc4d74448abd78041586f5888bd82bb655))

- Add `min-*` and `max-*` variants ([`20428cf4`](https://github.com/tw-in-js/twind/commit/20428cf4d27d563456e3fa76b79f8a867a353fb8))

- Add new `collapse` utility for `visibility: collapse` ([`cb70ab66`](https://github.com/tw-in-js/twind/commit/cb70ab6609bc7a017bd80aeefcda8a6a5526997c))

- Add `aria-*` and `data-*` variants ([`7f72cb0e`](https://github.com/tw-in-js/twind/commit/7f72cb0ea61925fe5a9fca067656fd76f7df2f52))

- add `break-keep` utility ([`3818a19a`](https://github.com/tw-in-js/twind/commit/3818a19ab31f0a92de87e6f8e3cc44a45cc6c0e2))

- Add negative value support for `outline-offset` ([`ab7220ef`](https://github.com/tw-in-js/twind/commit/ab7220ef7a780e7f4cdf325f17527c5865ef2d28))

- Remove invalid `outline-hidden` utility ([`6fd10056`](https://github.com/tw-in-js/twind/commit/6fd100563c76135f8e281c804ee4bd1cae97bbde))

- add `supports-*` variant ([`9254d208`](https://github.com/tw-in-js/twind/commit/9254d20855db6c4b1ce3e114f28d4af1d307ac51))

### Patch Changes

- escape hashed animation names (fixes [#293](https://github.com/tw-in-js/twind/issues/293)) ([`28b83c74`](https://github.com/tw-in-js/twind/commit/28b83c74b024ddc7f3fc736171b6e844dbcbbb86))

- add `only` variant ([`88bebcf5`](https://github.com/tw-in-js/twind/commit/88bebcf570292b1f2d624de04a513045f6fe6498))

- fix autocomplete for `place-*` utilities ([`bf5f6785`](https://github.com/tw-in-js/twind/commit/bf5f67852f4323314bef24546cb7e2a3ab850675))

- fix arbitrary utilities generation ([`eef016b9`](https://github.com/tw-in-js/twind/commit/eef016b907d73b2a954c33548ee1c513dec94375))

## 1.0.3

### Patch Changes

- Updated dependencies [[`8eb316c6`](https://github.com/tw-in-js/twind/commit/8eb316c6e2736c1c8fde76d0d9b967261a411ced)]:
  - @twind/core@1.0.3

## 1.0.2

### Patch Changes

- Updated dependencies [[`0ba8cca0`](https://github.com/tw-in-js/twind/commit/0ba8cca0c5c18dcad7831ae3107c55eedeadc8e1), [`0ba8cca0`](https://github.com/tw-in-js/twind/commit/0ba8cca0c5c18dcad7831ae3107c55eedeadc8e1), [`0ba8cca0`](https://github.com/tw-in-js/twind/commit/0ba8cca0c5c18dcad7831ae3107c55eedeadc8e1)]:
  - @twind/core@1.0.2

## 1.0.1

### Patch Changes

- introduce new @twind/core package to prevent issue with existing code that imports from CDNs without a version ([`4cab9d2f`](https://github.com/tw-in-js/twind/commit/4cab9d2fc573dd2a91cc6667510ff1b7b890854b))

- Updated dependencies [[`4cab9d2f`](https://github.com/tw-in-js/twind/commit/4cab9d2fc573dd2a91cc6667510ff1b7b890854b), [`4cab9d2f`](https://github.com/tw-in-js/twind/commit/4cab9d2fc573dd2a91cc6667510ff1b7b890854b)]:
  - @twind/core@1.0.1

## 1.0.0

### Patch Changes

- big documentation update ([`a63ca2cb`](https://github.com/tw-in-js/twind/commit/a63ca2cbf450d8a6f72f4d60f5856cee88d16911))

- support arbitrary variants in `group:` and `peer:` ([`2ac8e695`](https://github.com/tw-in-js/twind/commit/2ac8e6950ad37bac0eb88116448bee8738388f59))

- fix: `underline-offset-*` classes ([`9cff65de`](https://github.com/tw-in-js/twind/commit/9cff65de91d9525cbd5fd04cd2c4618089440317))

  closes #389

- ensure to re-use defined variants in peer and group classes ([`c5294b03`](https://github.com/tw-in-js/twind/commit/c5294b036cf2292278f11f8467b48cb784554915))

- add `[hidden]` to preflight ([`f1c81c9f`](https://github.com/tw-in-js/twind/commit/f1c81c9fdb4154f55598a7cb5a979dc94d92204b))

- initial intellisense support ([`2ac8e695`](https://github.com/tw-in-js/twind/commit/2ac8e6950ad37bac0eb88116448bee8738388f59))

- add overflow rule tests ([`e404e844`](https://github.com/tw-in-js/twind/commit/e404e844c2c0c91a056802d99079ad8ec49c5810))

- Updated dependencies [[`fe891f9c`](https://github.com/tw-in-js/twind/commit/fe891f9c7990a041e0eccaff9a4f58d0834d46d2), [`a63ca2cb`](https://github.com/tw-in-js/twind/commit/a63ca2cbf450d8a6f72f4d60f5856cee88d16911), [`e2c17a2e`](https://github.com/tw-in-js/twind/commit/e2c17a2e8087875f1725e3b07bc32218d2f0c2c0), [`d481948b`](https://github.com/tw-in-js/twind/commit/d481948b0513a59cc3495d5e31f0437c9690d59b), [`a61e0d1d`](https://github.com/tw-in-js/twind/commit/a61e0d1d4a31be6f398b57ceefffdb04b6bceccf), [`e6acbea2`](https://github.com/tw-in-js/twind/commit/e6acbea2f48e3c6441e0cf71cd069f48500ca493), [`2ac8e695`](https://github.com/tw-in-js/twind/commit/2ac8e6950ad37bac0eb88116448bee8738388f59), [`0705e419`](https://github.com/tw-in-js/twind/commit/0705e41946e191974da76c2b27019755520d9c0a)]:
  - twind@1.0.0
