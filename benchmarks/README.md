# Benchmarks

> Run `yarn install`

The following benchmarks are available:

- `yarn bench css`: benchmark [`css()` function](https://emotion.sh/docs/@emotion/css)

  ```
  # Object Styles
  twind (inline static): tw-14pys1e
  twind (inline dynamic): tw-14pys1e
  twind (css): tw-1vylbwv
  otion: _1r5gb7q _17egndr _1cw4hmo _9gfcjl _vdgfbm _1qsuvl4 _1y5pc60 _1osl5h8 _807wit _sv3kep _ol9ofu _eeqxny _1uim63f _1aq9rcw _twccl2 _jwtbbb
  goober: go1683933151
  emotion: css-nr9dlk
  twind (inline static) x 485,390 ops/sec ±0.46% (91 runs sampled)
  twind (inline dynamic) x 15,648 ops/sec ±0.82% (93 runs sampled)
  twind (css) x 50,278 ops/sec ±0.76% (90 runs sampled)
  otion@0.6.2 x 51,948 ops/sec ±1.49% (92 runs sampled)
  goober@2.0.18 x 107,875 ops/sec ±1.05% (71 runs sampled)
  emotion@11.1.3 x 162,630 ops/sec ±0.61% (90 runs sampled)

  Fastest is: twind (inline static)

  # Template Literal Styles
  twind (tw): inline-block rounded py-2 my-2 mx-4 w-44 bg-transparent text-white border-2 border-solid border-white hover:text-black focus:border-2 focus:border-dashed focus:border-black text-sm md:text-base lg:text-lg
  twind (apply): tw-1x659hu
  twind (css): tw-1vylbwv
  goober: go3227344850
  emotion: css-du3o4a
  twind (tw) x 276,789 ops/sec ±0.34% (94 runs sampled)
  twind (apply) x 111,319 ops/sec ±0.50% (94 runs sampled)
  twind (css) x 102,938 ops/sec ±0.32% (93 runs sampled)
  goober@2.0.18 x 141,827 ops/sec ±0.44% (96 runs sampled)
  emotion@11.1.3 x 227,533 ops/sec ±0.46% (98 runs sampled)

  Fastest is: twind (tw)
  ```
