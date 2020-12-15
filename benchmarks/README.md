# Benchmarks

> Run `yarn install`

The following benchmarks are available:

- `yarn bench css`: benchmark [`css()` function](https://emotion.sh/docs/@emotion/css)

  ```
  # Object Styles
  tw: tw-14pys1e
  otion: _1r5gb7q _17egndr _1cw4hmo _9gfcjl _vdgfbm _1qsuvl4 _1y5pc60 _1osl5h8 _807wit _sv3kep _ol9ofu _eeqxny _1uim63f _1aq9rcw _twccl2 _jwtbbb
  goober: go1683933151
  emotion: css-nr9dlk
  twind x 997,210 ops/sec ±0.66% (91 runs sampled)
  otion@0.6.2 x 52,671 ops/sec ±0.53% (96 runs sampled)
  goober@2.0.18 x 125,558 ops/sec ±0.51% (92 runs sampled)
  emotion@11.0.0 x 159,011 ops/sec ±0.89% (95 runs sampled)

  Fastest is: twind

  # Template Literal Styles
  tw: inline-block rounded py-2 my-2 mx-4 w-44 bg-transparent text-white border-2 border-solid border-white hover:text-black focus:border-2 focus:border-dashed focus:border-black text-sm md:text-base lg:text-lg
  goober: go3227344850
  emotion: css-du3o4a
  twind x 43,500 ops/sec ±0.70% (96 runs sampled)
  goober@2.0.18 x 144,038 ops/sec ±0.70% (95 runs sampled)
  emotion@11.0.0 x 224,263 ops/sec ±0.51% (97 runs sampled)

  Fastest is: emotion@11.0.0
  ```
