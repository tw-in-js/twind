# Basic Usage

Despite the module being very flexible and powerful, it was our intention to keep the surface API as minimal as possible. We appreciate that this module is likely to be used by developers & designers alike and so we try provide sensible defaults out of the box, with little to no need for [customization](./customization.md).

> Note that examples are given in vanilla JS but the module is compatible with all popular frameworks

Getting started with the library requires no configuration, build step or even installation if you use [skypack](https://skypack.dev/) or [unpkg](https://unpkg.com/) (see the [Installation](./installation.md) guide for more information).

```js
import { tw } from 'twind'

document.body.innerHTML = `
  <main class="${tw`bg-black text-white`}">
    <h1 class="${tw`text-xl`}">This is Tailwind in JS!</h1>
  </main>
`
```

Using the exported `tw` function without any setup results in the compilation of the rules like `bg-black text-white` and `text-xl` exactly as specified in the [Tailwind documentation](https://tailwincss.com/docs). For convnience the default [tailwind theme](https://github.com/tailwindlabs/tailwindcss/blob/v1/stubs/defaultConfig.stub.js) is used along with the preflight [base styles](https://tailwindcss.com/docs/preflight) if neither are provided by the developer.

Calling the `tw` function like in the example above results in the shorthand rules to be interpreted, normalized and compiled into CSS rules which get added to a stylesheet in the head of the document. The function will return a string consisting of all the class names that were processed and apply them to the element itself much like any other CSS-in-JS libaray.

## Function Signature

It is possible to invoke the `tw` function in a multitude of different ways. It can take any number of arguments, each of which can be an Object, Array, Boolean, Number, String or Template Literal. This ability is inspired heavily by the [clsx](https://npmjs.com/clsx) library by [Luke Edwards](https://github.com/lukeed).

> Note any falsey values are always discarded as well as standalone boolean and number values

### Template Literal (recommended)

> See [Grouping](./grouping.md) for more syntax examples.

```js
tw`bg-gray-200 rounded`
//=> bg-gray-200 rounded
tw`bg-gray-200 ${false && 'rounded'}`
//=> bg-gray-200
tw`bg-gray-200 ${[false && 'rounded', 'block']}`
//=> bg-gray-200 block
tw`bg-gray-200 ${{ rounded: false, underline: isTrue() }}`
//=> bg-gray-200 underline
tw`bg-${randomColor()}`
//=> bg-blue-500
tw`hover:${({ tw }) => tw`underline`}`
//=> hover:underline
```

### Strings

```js
tw('bg-gray-200', true && 'rounded', 'underline')
//=> bg-gray-200 rounded underline
```

### Objects

```js
tw({ 'bg-gray-200': true, rounded: false, underline: isTrue() })
//=> bg-gray-200 underline
tw({ 'bg-gray-200': true }, { rounded: false }, null, { underline: true })
//=> bg-gray-200 underline
```

### Arrays

```js
tw(['bg-gray-200', 0, false, 'rounded'])
//=> bg-gray-200 rounded
tw(['bg-gray-200'], ['', 0, false, 'rounded'], [['underline']])
//=> bg-gray-200 rounded underline
```

### Variadic

```js
tw('bg-gray-200', [
  1 && 'rounded',
  { underline: false, 'text-black': null },
  ['text-lg', ['shadow-lg']],
])
//=> bg-gray-200 rounded text-lg shadow-lg
```

## Inline Plugins

Sometimes developers might want to break out of the defined Tailwind grammar and insert arbritary CSS rules. Although this slightly defeats the purpose of using Tailwind and is not actively encouraged, we realise that is often necessary and so have provided an escape hatch for developers.

```js
tw`
  text-sm
  ${() => ({ '&::after': { content: '🌈' } })}
`
```

In the above example a class is generate for an `::after` pseudo element. Something that isn't possible withing the confides of the Tailwind API nor possible to denote using a style attribute on an element.

For a further explanation on this mechanism see [Plugins](./plugins.md).

<hr/>

Continue to [Customization](./customization.md)
