# Browser Support

The module will currently run in [all browsers](https://browserslist.dev/?q=PjAlLCBub3QgQ2hyb21lIDwzNiwgbm90IEVkZ2UgPDEyLCBub3QgRmlyZWZveCA8MjAsIG5vdCBPcGVyYSA8MjUsIG5vdCBTYWZhcmkgPDgsIG5vdCBpT1MgPDgsIG5vdCBPcGVyYU1vYmlsZSA8PSAxMi4xLCBub3QgaWUgPD0gMTEsIG5vdCBJRV9Nb2IgPD0gMTE%3D) that support [Math.imul](https://caniuse.com/mdn-javascript_builtins_math_imul), [Map](https://caniuse.com/mdn-javascript_builtins_map), [Set](https://caniuse.com/mdn-javascript_builtins_set) and [WeakMap](https://caniuse.com/mdn-javascript_builtins_weakmap) (eg Chrome >=36, Edge >=12, Firefox >=20, Opera >=25, Safari >=8, iOS >=8) are supported. Additionally all LTS versions of Node.js are supported.

> If you still have to support IE11 you need to provide a [polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul#Polyfill) for `Math.imul`. IE 11 already supports `Map`, `Set` and `WeakMap` - no polyfills needed for these.

Some new tailwind features use [CSS Variables (Custom Properties)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) which are [**not** available in legacy browsers](https://caniuse.com/css-variables) (Chrome <49, IE, Edge <16, Firefox <31, Opera <36, Safari <9.1, iOS <9.3). For IE 11 you can try the [CSS Variables Polyfill](https://github.com/nuxodin/ie11CustomProperties).

We included fallbacks for the following directives which mimic [Tailwind v1](https://v1.tailwindcss.com/) behavior:

- Color Opacity
  - [border-opacity-\*](https://tailwindcss.com/docs/border-opacity)
  - [bg-opacity-\*](https://tailwindcss.com/docs/background-opacity)
  - [text-opacity-\*](https://tailwindcss.com/docs/text-opacity)
  - [placeholder-opacity-\*](https://tailwindcss.com/docs/placeholder-opacity)
- Reversing Children Order
  - [divide-\*-reverse](https://tailwindcss.com/docs/divide-width#reversing-children-order)
  - [space-\*-reverse](https://tailwindcss.com/docs/space#reversing-children-order)
- `rotate`, `scale` , `skew` and `translate` can only be used alone

  > `rotate-45` works but when using `rotate-45 scale-150` only one of both is applied. In that case you must use `transform`: `transform rotate-45 scale-150`

Some directive only work with CSS Variables and are not supported in legacy browsers:

- [Ring](https://tailwindcss.com/docs/ring-width)

<hr/>

Continue to [Contributing](./contributing.md)
