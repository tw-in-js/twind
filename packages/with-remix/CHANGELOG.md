# @twind/with-remix

## 1.1.3

### Patch Changes

- do not replace window and document for deno bundles ([`5fd4bb08`](https://github.com/tw-in-js/twind/commit/5fd4bb082857c6f5504a23a641a2b61a33e7db88))

## 1.1.2

### Patch Changes

- create dedicated worker and deno bundles, and downgrade module to es2019 (fixes [#426](https://github.com/tw-in-js/twind/issues/426)) ([`02ea227a`](https://github.com/tw-in-js/twind/commit/02ea227afffe474cde5e843c3519f0836ee18f8a))

- add `@twind/with-react` package with support for React v18 streamed responses (fixes [#409](https://github.com/tw-in-js/twind/issues/409)) ([`6521e678`](https://github.com/tw-in-js/twind/commit/6521e678821f05de8cd3a87b0176083efee43405))

  - the `@twind/with-remix` package is deprecated in favor of the `@twind/with-react` package
  - added a Remix with React v18 and [renderToPipeableStream](https://reactjs.org/docs/react-dom-server.html#rendertopipeablestream) example: [examples/with-remix_react-v18](https://github.com/tw-in-js/twind/tree/main/examples/with-remix_react-v18) (related to #400 & #408)

- enable typedoc for subpath exports ([`984eb515`](https://github.com/tw-in-js/twind/commit/984eb5159b134cb439d5338605c522d9701e81c7))

## 1.1.1

### Patch Changes

- revert relying on export condition for detection production environment ([`269fb67d`](https://github.com/tw-in-js/twind/commit/269fb67d6708cb732dd350f81f0865010481d6d2))

## 1.1.0

### Minor Changes

- do not use `process.env.NODE_ENV` to detect production environment — instead use import condition ([`e9d8dccf`](https://github.com/tw-in-js/twind/commit/e9d8dccfaa919cc5b1b080cc2e05d65d53f44b67))

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

- Updated dependencies [[`fe891f9c`](https://github.com/tw-in-js/twind/commit/fe891f9c7990a041e0eccaff9a4f58d0834d46d2), [`a63ca2cb`](https://github.com/tw-in-js/twind/commit/a63ca2cbf450d8a6f72f4d60f5856cee88d16911), [`e2c17a2e`](https://github.com/tw-in-js/twind/commit/e2c17a2e8087875f1725e3b07bc32218d2f0c2c0), [`d481948b`](https://github.com/tw-in-js/twind/commit/d481948b0513a59cc3495d5e31f0437c9690d59b), [`a61e0d1d`](https://github.com/tw-in-js/twind/commit/a61e0d1d4a31be6f398b57ceefffdb04b6bceccf), [`e6acbea2`](https://github.com/tw-in-js/twind/commit/e6acbea2f48e3c6441e0cf71cd069f48500ca493), [`2ac8e695`](https://github.com/tw-in-js/twind/commit/2ac8e6950ad37bac0eb88116448bee8738388f59), [`0705e419`](https://github.com/tw-in-js/twind/commit/0705e41946e191974da76c2b27019755520d9c0a)]:
  - twind@1.0.0

## 1.0.0-next.39

### Patch Changes

- Updated dependencies [[`774e2bb4`](https://github.com/tw-in-js/twind/commit/774e2bb4c7a019d76e55296e9af75fedc77bd054), [`a3b1bcba`](https://github.com/tw-in-js/twind/commit/a3b1bcba6269bc4a51b63041689baf58f6222b7f), [`0e2aa5c4`](https://github.com/tw-in-js/twind/commit/0e2aa5c4f07e5bca3bea37f864773f665935a263), [`9b5e3297`](https://github.com/tw-in-js/twind/commit/9b5e3297470f9d2bdbd4f540d819ee0f42e63595), [`0a63948e`](https://github.com/tw-in-js/twind/commit/0a63948e9f6c5f1bb8088ae6e21dc4bf215ee9e8), [`b2b7e40d`](https://github.com/tw-in-js/twind/commit/b2b7e40d39406b8d04f72cac6c980775e64df6c4), [`bdc0a7a1`](https://github.com/tw-in-js/twind/commit/bdc0a7a1c353990d0ef009af181f79c1134bfcec), [`f74163ba`](https://github.com/tw-in-js/twind/commit/f74163ba7310ece8d2de4a80586d19df419bfa86)]:
  - twind@1.0.0-next.39

## 1.0.0-next.38

### Patch Changes

- Updated dependencies [[`b212b52f`](https://github.com/tw-in-js/twind/commit/b212b52fbd53e9ecb38d97589ca2f717445ed185), [`782f93df`](https://github.com/tw-in-js/twind/commit/782f93df6abb1ebd24ef6c45dc08de602e198107), [`fe88051d`](https://github.com/tw-in-js/twind/commit/fe88051deb3176d014ba527471b1345c47bfb28e), [`77954405`](https://github.com/tw-in-js/twind/commit/7795440566fc95a424a7f6210998dd1d16ef216f)]:
  - twind@1.0.0-next.38

## 1.0.0-next.37

### Patch Changes

- Updated dependencies [[`08c66ee8`](https://github.com/tw-in-js/twind/commit/08c66ee8f7f80a6c998a380acc4f44280aef3280)]:
  - twind@1.0.0-next.37

## 1.0.0-next.36

### Patch Changes

- Updated dependencies [[`28cbaef5`](https://github.com/tw-in-js/twind/commit/28cbaef54f226e7542e9197b0dab69e55f588806), [`43d61076`](https://github.com/tw-in-js/twind/commit/43d610769152aef2943383b3a2574b9be01acc49), [`80ce410a`](https://github.com/tw-in-js/twind/commit/80ce410a60892ba70fa8805a37aa89f0dbc13c7d), [`39b45125`](https://github.com/tw-in-js/twind/commit/39b451256c10bd6f82f45015effbefb41aee8a76), [`2f8f69d2`](https://github.com/tw-in-js/twind/commit/2f8f69d27531fad4346af57f0fef3f473d2c6ee3), [`9fc5baec`](https://github.com/tw-in-js/twind/commit/9fc5baeca6031d27ac81402b0e614d01c3cd20e7), [`aaad7e44`](https://github.com/tw-in-js/twind/commit/aaad7e4426068a55b00e23df2e084cfc8a46b2ca), [`ae979d12`](https://github.com/tw-in-js/twind/commit/ae979d12fe01cfed32c44eea23ef8a9f2d983eae), [`fc9b0c27`](https://github.com/tw-in-js/twind/commit/fc9b0c277f26e0fc1aad693bd13a80d50b27c71c), [`346efc4e`](https://github.com/tw-in-js/twind/commit/346efc4e84042d043e17bac8d829f0408279448e), [`8bbc2a42`](https://github.com/tw-in-js/twind/commit/8bbc2a426054cedc705392eb51aebf0029547d67), [`8dfd105b`](https://github.com/tw-in-js/twind/commit/8dfd105bf0b10d82e3d024b6a318a4b7e6064d90)]:
  - twind@1.0.0-next.36

## 1.0.0-next.35

### Patch Changes

- add remix example ([`98688bcb`](https://github.com/tw-in-js/twind/commit/98688bcb33ec48f4dd8ea61166467f256e4422da))

- Updated dependencies [[`009594c6`](https://github.com/tw-in-js/twind/commit/009594c65fb7d0f1da0203c6b6c26bd258ee46d0)]:
  - twind@1.0.0-next.35
