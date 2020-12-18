# Grouping

Unlike Tailwind, Twind is not limited to the restrictions of a class name strings as input. The compiler is just a function and has been designed to be able to inerpret input in almost any form – strings, array, objects, template literals or variadic arguments – turn it into meaningful output.

One painpoint commonly felt when using utility CSS is long and unwieldily lines of code consisting of class names, often denoting styles at various breakpoints, which are quite hard to comprehend.

It is not uncommon for a single element to have tens of rules applied to it like below:

```html
<button
  class="shadow-xl m-auto border-2 border-black border-opacity-50 border-dashed px-4 md:px-6 py-3 md:py-4 space-x-2 md:space-x-4 transform transition-all delay-300 duration-500 hover:scale-110 hover:rotate-5 animate-pulse absolute top-0 left-0 rounded-full"
></button>
```

However, when using Twind we have the option to pass a template literal as input to the compiler. This made it convenient to invent a domain specific syntax that extends the capabilities of Tailwind and helps reduce repetition.

## Directive grouping

The first grouping syntax works by factoring out common directive prefixes. Below is an example of a rule set without directive grouping and the equivalent rule set with `border` factored out.

```js
// Before directive grouping
tw`border-2 border-black border-opacity-50 border-dashed`
// After directing grouping
tw`border(2 black opacity-50 dashed)`
```

This reduced repetition in this rule set by about 20% but the output is still the same!

## Variant Grouping

The second grouping syntax works by factoring out common variants. Both responsive and pseudo variants are supported in various combinations.

> Note how rules within tagged template literals are able to span multiple lines

```js
// Before variant grouping
tw`bg-red-500 shadow-xs sm:bg-red-600 sm:shadow-sm md:bg-red-700 md:shadow lg:bg-red-800 lg:shadow-xl`
// After variant grouping
tw`
  bg-red-500 shadow-xs
  sm:(
    bg-red-600
    shadow-md
  )
  md:(bg-red-700 shadow)
  lg:(bg-red-800 shadow-xl)
`
```

## Mixed Groupings

It is possible to nest directive groups inside of responsive groups and vice versa, however it is important to note that nesting responsive variants inside of responsive variants doesn't make sense and is not permitted.

```js
tw`sm:(border(2 black opacity-50 hover:dashed))`
// => sm:border-2 sm:border-black sm:border-opacity-50 sm:hover:border-dashed
tw`border(md:(2 black opacity-50 hover:dashed))`
// => sm:border-2 sm:border-black sm:border-opacity-50 sm:hover:border-dashed
```

Thanks to some ordering logic in the compiler, both of the above groupings will result in the same output. That is to say more generally, that directive groupings always get expanded before variant groupings.

## Self Reference

Some directives like `ring` need to be applied themselves as well as being a prefix. In this case you can use the reserved `&` character which is replaced literally with the current prefix:

```js
bw`ring(& ping-700 offset(4 ping-200))`)
// => ring ring-ping-700 ring-offset-4 ring-offset-ping-200
```

## Inherited Groups

It is possible to define arbritarty styles by providing a functiion. Like all other directives these will inherit any active grouping.

```js
tw`
  hover:${() => ({ '&::after': { content: '🌈' } })}
`
```

In the above example, the `after` pseudo element will only be applied upon hover.

<hr/>

Continue to [Plugins](./plugins.md)
