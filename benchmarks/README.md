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

- `yarn bench styled`: benchmark [`styled()` function](https://emotion.sh/docs/styled)

  ```
  # Object Styles
  twind: <div color="black" random="0.2416930362369536" class="tw-1ys3ex2 tw-14ssw6o"></div>
  goober: <div color="black" random="0.9613646689851119" class="go3955375025" data-reactroot=""></div>
  emotion: <style data-emotion="css 1rcabg1">.css-1rcabg1{display:inline-block;border-radius:3px;padding:0.5rem 0;margin:0.5rem 1rem;width:11rem;background:transparent;color:white;border:2px solid white;font-size:0.875rem;line-height:1.25rem;}.css-1rcabg1:hover{color:black;opacity:1;}.css-1rcabg1:focus{border:2px dashed black;}@media (min-width: 768px){.css-1rcabg1{font-size:1rem;line-height:1.5rem;}}@media (min-width: 1280px){.css-1rcabg1{font-size:1.125rem;line-height:1.75rem;}}</style><div color="black" class="css-1rcabg1"></div>
  styled-components: <div color="black" class="sc-bdfBwQ kIZhoG"></div>
  twind x 51,628 ops/sec ±0.63% (89 runs sampled)
  goober@2.0.18 x 40,069 ops/sec ±0.43% (96 runs sampled)
  emotion@11.0.0 x 35,349 ops/sec ±1.01% (93 runs sampled)
  styled-components@5.2.1 x 38,284 ops/sec ±0.48% (93 runs sampled)

  Fastest is: twind

  # Template Literal Styles
  twind: <div color="black" random="0.7099076646992102" class="tw-1g0ngli inline-block rounded py-2 my-2 mx-4 w-44 bg-transparent text-white border-2 border-solid border-white hover:text-black hover:opacity-100 focus:border-2 focus:border-dashed focus:border-black text-sm md:text-base lg:text-lg"></div>
  goober: <div color="black" random="0.30976624968405986" class="go602841230" data-reactroot=""></div>
  emotion: <style data-emotion="css 1j1rmlp">.css-1j1rmlp{display:inline-block;border-radius:3px;padding:0.5rem 0;margin:0.5rem 1rem;width:11rem;background:transparent;color:white;border:2px solid white;font-size:0.875rem;line-height:1.25rem;}.css-1j1rmlp:hover{color:black;opacity:1;}.css-1j1rmlp:focus{border:2px dashed black;}@media (min-width: 768px){.css-1j1rmlp{font-size:1rem;line-height:1.5rem;}}@media (min-width: 1280px){.css-1j1rmlp{font-size:1.125rem;line-height:1.75rem;}}</style><div color="black" class="css-1j1rmlp"></div>
  styled-components: <div color="black" class="sc-gsTCUz bzdKjA"></div>
  twind x 57,657 ops/sec ±0.56% (90 runs sampled)
  goober@2.0.18 x 44,305 ops/sec ±0.51% (93 runs sampled)
  emotion@11.0.0 x 35,793 ops/sec ±0.72% (92 runs sampled)
  styled-components@5.2.1 x 56,204 ops/sec ±0.42% (95 runs sampled)

  Fastest is: twind
  ```
