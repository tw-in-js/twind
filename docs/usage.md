# Basic Usage

Despite the module being very flexible and powerful, it was our intention to keep the surface API as minimal as possible. We appreciate that this module is likely to be used by developers & designers alike and so we try provide sensible defaults out of the box, with little need for customization.

> Note that examples are given in vanilla JS but the module is compatible with all popular frameworks

Getting started with the library requires no configuration, setup (or even installation if you use [skypack](https://skypack.dev/) or [unpkg](https://unpkg.com/)):

```js
import { tw } from '@tw-in-js/core'

document.body.innerHTML = `
  <main class=${tw('bg-black text-white')}>
    <h1 class=${tw('text-xl')}>This is Tailwind in JS!</h1>
  </main>
`
```

Using the `tw` function exported by the module without any further configuration, results in the compilation of the rules `bg-black text-white` and `text-xl` exactly as specified in the [Tailwind documentation](https://tailwincss.com/docs). It is possible to modify the behavior of the compiler by providing a custom theme file but when none is passed then the default Tailwind theme is used.

Calling the `tw` function results in the passed rules to be interpreted, normalized, compiled into CSS and added to a stylesheet in the head of the document.

## Function Signature

It is possible to invoke the `tw` function in a multitude of different ways. It can take any number of arguments, each of which can be an Object, Array, Boolean, Number, String or inline plugins. This feature is inspired heavily by the [clsx](https://npmjs.com/clsx) library by [Luke Edwards](https://github.com/lukeed).

> Note any falsey values are always discarded as well as standalone boolean and number values

### Template Literal

```js
bw`bg-gray-200 rounded`
//=> bg-gray-200 rounded
bw`bg-gray-200 ${false && 'rounded'}`
//=> bg-gray-200
bw`bg-gray-200 ${[false && 'rounded', 'block']}`
//=> bg-gray-200 block
bw`bg-gray-200 ${{ rounded: false, underline: isTrue() }}`
//=> bg-gray-200 underline
```

### Strings

```js
bw('bg-gray-200', true && 'rounded', 'underline')
//=> bg-gray-200 rounded underline
```

### Objects

```js
bw({ 'bg-gray-200': true, rounded: false, underline: isTrue() })
//=> bg-gray-200 underline
bw({ 'bg-gray-200': true }, { rounded: false }, null, { underline: true })
//=> bg-gray-200 underline
```

### Arrays

```js
bw(['bg-gray-200', 0, false, 'rounded'])
//=> bg-gray-200 rounded
bw(['bg-gray-200'], ['', 0, false, 'rounded'], [['underline']])
//=> bg-gray-200 rounded underline
```

### Mixture

```js
bw('bg-gray-200', [
  1 && 'rounded',
  { underline: false, 'text-black': null },
  ['text-lg', ['shadow-lg']],
])
//=> bg-gray-200 rounded text-lg shadow-lg
```
