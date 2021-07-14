---
title: Grouping Syntax
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: The Twind compiler provides a terse syntax for grouping related classes together in an intuitive way.
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

Twind is not limited to strings as class names. Twind ships a compiler that runs when your app runs. This is unlike Tailwind, which generates CSS in a build step that is required before you run your app. This compiler is a function that is designed to interpret almost any form: strings, arrays, objects, template literals, or a mix of any of these.

On common complain of Tailwind (and utility classes) is long and unwieldy class names in markup:

```html
<button
  class="shadow-xl m-auto border-2 border-black border-opacity-50 border-dashed px-4 md:px-6 py-3 md:py-4 space-x-2 md:space-x-4 transform hover:scale-110 hover:rotate-5 animate-pulse absolute top-0 left-0 rounded-full"
></button>
```

In an effort to help reduce repetition and improve readability, Twind provides a domain specific grouping syntax that can be used in strings or template literals.

## Thinking in Groups

Take a look at this button implemented in Tailwind. It requires quite a few classes to achieve the desired functionality:

```html
<button
  class="w-full sm:w-auto text-lg uppercase text-gray-100 bg-purple-800 hover:bg-purple-700 focus:bg-purple-700 focus-visible:ring-4 ring-purple-400 px-6 py-2 rounded-full transition-colors duration-300"
>
  Click Me
</button>
```

Let's see how we can use grouping to improve readability and save a few characters in the process.

**The width classes**

These classes can be grouped using directive grouping:

Before: `w-full sm:w-auto`

After: `w(full sm:auto)`

**The text classes**

Twind conveniently provides a `text-uppercase` class, which allows us to group all of the text-related classes together also using directive grouping:

Before: `text-lg uppercase text-gray-100`

After: `text(lg uppercase gray-100)`

**The background classes**

The background classes can be grouped in several combinations. Here are a couple options:

1. Using a combination of directive and variant (mixed) grouping:

   Before: `bg-purple-800 hover:bg-purple-700 focus:bg-purple-700`

   After: `bg(purple-800 hover:purple-700 focus:purple-700)`

2. Using a combination of mixed grouping and self-referencing:

   Before: `bg-purple-800 hover:bg-purple-700 focus:bg-purple-700`

   After: `bg-purple(800 700(hover:& focus:&))`

**The ring classes**

The ring classes can be combined using mixed grouping:

Before: `focus-visible:ring-4 ring-purple-400`

After: `ring(purple-400 focus-visible:4)`

And finally, all together:

Before

```html
<button
  class="w-full sm:w-auto text-lg uppercase text-gray-100 bg-purple-800 hover:bg-purple-700 focus:bg-purple-700 focus-visible:ring-4 ring-purple-400 px-6 py-2 rounded-full transition-colors duration-300"
>
  Click Me
</button>
```

After

```html
<button
  class="w(full sm:auto) text(lg uppercase gray-100) bg-purple(800 700(hover:& focus:&)) ring(purple-400 focus-visible:4)) px-6 py-2 rounded-full transition-colors duration-300"
>
  Click Me
</button>
```

As you can see, grouping saved a few characters. For some people, the grouped classes may improve readability. Other people may prefer the Tailwind style. Grouping is fully opt-in, highly expressive, and can be used as little or as much as you'd like.

## Directive Grouping

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
    shadow-sm
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
