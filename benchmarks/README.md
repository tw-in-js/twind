# Benchmarks

> Run `yarn install`

The following benchmarks are available:

- `yarn bench css`: benchmark [`css()` function](https://emotion.sh/docs/@emotion/css)

  ```
  # Object Styles
  twind/css (static): tw-14pys1e
  twind/css (dynamic): tw-14pys1e
  twind inline plugin (static): tw-14pys1e
  twind inline plugin (dynamic): tw-14pys1e
  otion: _1r5gb7q _17egndr _1cw4hmo _9gfcjl _vdgfbm _1qsuvl4 _1y5pc60 _1osl5h8 _807wit _sv3kep _ol9ofu _eeqxny _1uim63f _1aq9rcw _twccl2 _jwtbbb
  goober: go1683933151
  emotion: css-nr9dlk
  twind/css (static) x 951,579 ops/sec ±0.43% (93 runs sampled)
  twind/css (dynamic) x 182,527 ops/sec ±0.46% (96 runs sampled)
  twind inline plugin (static) x 945,944 ops/sec ±0.82% (91 runs sampled)
  twind inline plugin (dynamic) x 16,463 ops/sec ±0.54% (92 runs sampled)
  otion@0.6.2 x 54,416 ops/sec ±0.25% (97 runs sampled)
  goober@2.0.18 x 125,199 ops/sec ±0.68% (83 runs sampled)
  emotion@11.0.0 x 156,258 ops/sec ±1.22% (90 runs sampled)

  Fastest is: twind/css (static)

  # Template Literal Styles
  twind: inline-block rounded py-2 my-2 mx-4 w-44 bg-transparent text-white border-2 border-solid border-white hover:text-black focus:border-2 focus:border-dashed focus:border-black text-sm md:text-base lg:text-lg
  goober: go3227344850
  emotion: css-du3o4a
  twind x 403,080 ops/sec ±1.41% (88 runs sampled)
  goober@2.0.18 x 143,202 ops/sec ±0.90% (95 runs sampled)
  emotion@11.0.0 x 224,368 ops/sec ±0.52% (93 runs sampled)

  Fastest is: twind
  ```
