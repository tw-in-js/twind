# Benchmarks

> Run `yarn install`

The following benchmarks are available:

- `yarn bench css`: benchmark [`css()` function](https://emotion.sh/docs/@emotion/css)

  ```
  # Object Styles
  twind (static): tw-11wt74w
  twind (dynamic): tw-11wt74w
  twind (css): tw-1fygejv
  otion: _1r5gb7q _17egndr _1cw4hmo _9gfcjl _vdgfbm _1qsuvl4 _1y5pc60 _1osl5h8 _807wit _sv3kep _ol9ofu _eeqxny _1uim63f _1aq9rcw _twccl2 _jwtbbb
  goober: go1683933151
  emotion: css-nr9dlk
  twind (static) x 4,157,870 ops/sec ±0.61% (91 runs sampled)
  twind (dynamic) x 27,569 ops/sec ±0.33% (94 runs sampled)
  twind (css) x 203,990 ops/sec ±0.32% (94 runs sampled)
  otion@0.6.2 x 53,592 ops/sec ±0.85% (96 runs sampled)
  goober@2.0.30 x 842,430 ops/sec ±1.10% (88 runs sampled)
  emotion@11.1.3 x 162,460 ops/sec ±0.75% (90 runs sampled)

  Fastest is: twind (static)

  # Template Literal Styles
  twind (tw): inline-block rounded py-2 my-2 mx-4 w-44 bg-transparent text-white border-2 border-solid border-white hover:text-black focus:border-2 focus:border-dashed focus:border-black text-sm md:text-base lg:text-lg
  twind (apply): tw-1m1idym
  twind (css): tw-1fygejv
  goober: go3227344850
  emotion: css-du3o4a
  twind (static) x 3,651,611 ops/sec ±0.61% (93 runs sampled)
  twind (tw) x 400,438 ops/sec ±0.35% (84 runs sampled)
  twind (apply) x 342,725 ops/sec ±0.37% (96 runs sampled)
  twind (css) x 270,020 ops/sec ±0.53% (95 runs sampled)
  goober@2.0.30 x 632,419 ops/sec ±0.59% (95 runs sampled)
  emotion@11.1.3 x 229,990 ops/sec ±0.17% (99 runs sampled)

  Fastest is: twind (static)
  ```
