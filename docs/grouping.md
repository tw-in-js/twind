# Grouping

> If you are unfamiliar with the Tailwind CSS shorthand syntax please read the [Tailwind documentation](https://tailwindcss.com/docs) about [Utility-First](https://tailwindcss.com/docs/utility-first), [Responsive Design](https://tailwindcss.com/docs/responsive-design) and [Hover, Focus, & Other States](https://tailwindcss.com/docs/hover-focus-and-other-states).

Unlike Tailwind, Twind is not limited to the restrictions of a class name strings as input. The compiler is just a function and has been designed to be able to interpret input in almost any form – strings, array, objects, template literals or variadic arguments – turn it into meaningful output.

One painpoint commonly felt when using utility CSS is long and unwieldily lines of code consisting of class names, often denoting styles at various breakpoints, which are quite hard to comprehend.

It is not uncommon for a single element to have tens of rules applied to it like below:

```html
<button
  class="shadow-xl m-auto border-2 border-black border-opacity-50 border-dashed px-4 md:px-6 py-3 md:py-4 space-x-2 md:space-x-4 transform hover:scale-110 hover:rotate-5 animate-pulse absolute top-0 left-0 rounded-full"
></button>
```

However, when using Twind we have the option to pass a template literal as input to the compiler. This made it convenient to invent a domain specific syntax that extends the capabilities of Tailwind and helps reduce repetition.

<details><summary>Table Of Contents (Click To Expand)</summary>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

  - [Directive grouping](#directive-grouping)
  - [Variant Grouping](#variant-grouping)
  - [Mixed Groupings](#mixed-groupings)
  - [Self Reference](#self-reference)
  - [Inherited Groups](#inherited-groups)
  - [Thinking in Groups](#thinking-in-groups)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Directive grouping

The first grouping syntax works by factoring out common directive prefixes. Below is an example of a rule set without directive grouping and the equivalent rule set with `border` factored out.

```js
// Before directive grouping
tw`border-2 border-black border-opacity-50 border-dashed`
// After directive grouping
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

tw`w(1/2 sm:1/3 lg:1/6) p-2`
// => w-1/2 sm:w-1/3 lg:w-1/6 p-2
```

<details><summary>Show me more examples</summary>

```js
// Grouping across string boundaries
tw('hover:(', 'bg-red-500', 'p-3', ')', 'm-1')
// => hover:bg-red-500 hover:p-3 m-1

tw('hover:(bg-red-500', 'p-3)', 'm-1')
// => hover:bg-red-500 hover:p-3 m-1

tw`bg-${'red'}(600 700(hover:& focus:&))`
// => bg-red-600 hover:bg-red-700 focus:bg-red-700
```

</details>

## Mixed Groupings

It is possible to nest directive groups inside of responsive groups and vice versa, however it is important to note that nesting responsive variants inside of responsive variants doesn't make sense and is not permitted.

```js
tw`sm:(border(2 black opacity-50 hover:dashed))`
// => sm:border-2 sm:border-black sm:border-opacity-50 sm:hover:border-dashed
tw`border(md:(2 black opacity-50 hover:dashed))`
// => sm:border-2 sm:border-black sm:border-opacity-50 sm:hover:border-dashed

tw`divide(y-2 blue-500 opacity(75 md:50))`
// => divide-y-2 divide-blue-500 divide-opacity-75 md:divide-opacity-50

// Negated values can be used within the braces and will be applied to the directive:
tw`rotate(-3 hover:6 md:(3 hover:-6))`
// => -rotate-3 hover:rotate-6 md:rotate-3 md:hover:-rotate-6"
```

Thanks to some ordering logic in the compiler, both of the above groupings will result in the same output. That is to say more generally, that directive groupings always get expanded before variant groupings.

## Self Reference

Some directives like `ring` need to be applied themselves as well as being a prefix. In this case you can use the reserved `&` character which is replaced literally with the current prefix:

```js
tw`ring(& pink-700 offset(4 pink-200))`)
// => ring ring-pink-700 ring-offset-4 ring-offset-pink-200

tw`bg-blue-500(hover:& focus:& active:&) rounded-full`
// => hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-500 rounded-full
```

## Inherited Groups

It is possible to define arbitrary styles by providing a function. Like all other directives these will inherit any active grouping.

```js
tw`
  hover:${css({ '&::after': { content: '"🌈"' } })}

  hover:${({ tw }) => ({
    sm: tw`underline`,
    lg: 'no-underline line-through',
  })}

  sm:${['rounded']}
`
// => hover:tw-xxx sm:hover:underline lg:hover:no-underline lg:hover:line-through sm:rounded
```

In the above example, the `after` pseudo element will only be applied upon hover.


## Thinking in Groups

Take a look at this button implemented in Tailwind. It requires quite a few classes to achieve the desired functionality:

```html
  <button class="w-full sm:w-auto text-lg uppercase text-gray-100 bg-purple-800 hover:bg-purple-700 focus:bg-purple-700 focus-visible:ring-4 ring-purple-400 px-6 py-2 rounded-full transition-colors duration-300">
    Click Me
  </button>
  ```

Let's see how we can use grouping to improve readability and save a few characters in the process. 

**The width classes** 

These classes can be grouped using directive grouping:

Before: `w-full sm:w-auto`

After: `w(full sm:auto)`

**The text classes**

Twind convienently provides a `text-uppercase` class, which allows us to group all of the text-related classes together also using directive grouping:

Before: `text-lg uppercase text-gray-100`

After: `text(lg uppercase gray-100)`

**The background classes**

The background classes can be grouped in several combinations. Here are a couple options:

1. Using a combination of directive and variant (mixed) grouping:

    Before: `bg-purple-800 hover:bg-purple-700 focus:bg-purple-700`

    After: `bg(purple-800 hover:(purple-700) focus:(purple-700))`

2. Using a combination of mixed grouping and self-referencing:

    Before: `bg-purple-800 hover:bg-purple-700 focus:bg-purple-700`

    After: `bg(purple(800 700(hover:& focus:&)))`

**The ring classes**

The ring classes can be combined using mixed grouping:

Before: `focus-visible:ring-4 ring-purple-400`

After: `ring(purple-400 focus-visible:(4))`

And finally, all together:

Before
```html
  <button class="w-full sm:w-auto text-lg uppercase text-gray-100 bg-purple-800 hover:bg-purple-700 focus:bg-purple-700 focus-visible:ring-4 ring-purple-400 px-6 py-2 rounded-full transition-colors duration-300">
    Click Me
  </button>
  ```

After
```html
  <button class="w(full sm:auto) text(lg uppercase gray-100) bg(purple(800 700(hover:& focus:&))) ring(purple-400 focus-visible:(4)) px-6 py-2 rounded-full transition-colors duration-300">
    Click Me
  </button>
  ```

  As you can see, grouping saved a few characters. For some people, the grouped classes may improve readability. Other people may prefer the Tailwind style. Grouping is fully opt-in, highly expressive, and can be used as little or as much as you'd like.

<hr/>

Continue to [Tailwind Extensions](./tailwind-extensions.md)
