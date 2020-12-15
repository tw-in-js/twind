# Grouping

One specific advantage of doing CSS in JS is that we are not limited to the restrictions of a class name as input. Becuase the compiler is just a function, it can take almost any form of input (strings, array, objects or arguments) and turn it into meaningful output.

A painpoint commonly felt when using utility CSS classes generally is that it can result is some long and unweildly lines of code which are quite hard for humans hard to parse.

Below is an example of some reasonably contrived button styles. The amount of rules applied to this element has been exaggerated for demonstrative purposes, however it is not uncommon for a single element to have tens of rules applied to it and so any savings we can make here are massively exaggerated when applied at scale.

```html
<button
  class="shadow-xl m-auto border-2 border-black border-opacity-50 border-dashed px-4 md:px-6 py-3 md:py-4 space-x-2 md:space-x-4 transform transition-all delay-300 duration-500 hover:scale-110 hover:rotate-5 animate-pulse absolute top-0 left-0 rounded-full"
></button>
```

The option to pass a template literal as input to the compiler made it convenient to embed domain specific syntax that extends the capabilities of Tailwind and try help reduce the amount of repetition often required when trying to apply styles over with multiple breakpoints.

## Directive grouping

The first grouping syntax works by factoring out common directive prefixes. Below is an example of a rule set without directive grouping and the equivolent rule set with `border` factored out.

```js
tw`border-2 border-black border-opacity-50 border-dashed`
tw`border(2 black opacity-50 dashed)`
```

This reduced repetition in this rule set by about 20% but the output is still the same!

## Variant Grouping

The second grouping syntax works by factoring out common variants. Both responsive and pseudo variants are supported in various combinations.

> Note how rules within tagged template literals are able to span multiple lines

```js
tw`
  bg-red-500 shadow-xs
  sm:(
    bg-red-600
    shadow-sm
  )
  md:(bg-red-700 shadow)
  lg:(bg-red-800 shadow-xl)
`
```

## Mixed Groupings

It is possible to nest directive groups inside of responsive groups and vice versa, however it is important to note that nesting reponsive variants inside of responsive variants doesn't make sense and is not permitted.

```js
tw`sm:(border(2 black opacity-50 hover:dashed))`
tw`border(md:(2 black opacity-50 hover:dashed))`
// => sm:border-2 sm:border-black sm:border-opacity-50 sm:hover:border-dashed
```

Thanks to some ordering logic in the compiler, both of the above groupings will be interpretted the same. That is to say, that directive groupings always get expanded before variant groupings.

Some directives like `ring` need to be applied themselves as well as being a prefix. In this case you can use the reserved `&` character which is replaced literally with the current prefix:

```js
bw`ring(& ping-700 offset(4 ping-200))`)
// => ring ring-ping-700 ring-offset-4 ring-offset-on-ping-200
```
