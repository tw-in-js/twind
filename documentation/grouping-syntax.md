---
section: Getting Started
title: Grouping Syntax
excerpt: Twind provides a terse syntax for grouping related classes together in an intuitive way.
next: ./reference.md
---

In an effort to help reduce repetition and improve readability, Twind provides a domain specific grouping syntax that can be used in strings or template literals.

Let's see how we can use grouping to improve readability and save a few characters in the process.


**Thinking in Groups**

On common complain of Tailwind (and utility classes) is long and unwieldy class names in markup:

```html index.html
 <button
   type="button"
   class="
     w-full sm:w-auto inline-flex items-center px-4 py-2
     text-sm text-white font-medium
     border border-transparent rounded-md shadow-sm
     bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-800
     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
     transition-colors duration-300
   "
 >
   Button text
 </button>
```

---

**Same prefix classes**

These classes can be grouped using directive grouping:

```html index.html focusLines[4,5] /w-(full sm:auto)/ /text-(sm white)/
<button
  type="button"
  class="
    w-(full sm:auto) inline-flex items-center px-4 py-2
    text-(sm white) font-medium
    border border-transparent rounded-md shadow-sm
    bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-800
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
    transition-colors duration-300
  "
>
  Button text
</button>
```

---

**Same variant classes**

The `focus` variant classes can be grouped using variant grouping:

```html index.html focusLines[8]
<button
  type="button"
  class="
    w-(full sm:auto) inline-flex items-center px-4 py-2
    text-(sm white) font-medium
    border border-transparent rounded-md shadow-sm
    bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-800
    focus:(outline-none ring-2 ring-offset-2 ring-indigo-500)
    transition-colors duration-300
  "
>
  Button text
</button>
```

---

**Mixed classes**

The background classes can be grouped using a combination of directive and variant (mixed) grouping:

```html index.html focusLines[7] /bg-indigo-(600 hover:700 focus:800)/
<button
  type="button"
  class="
    w-(full sm:auto) inline-flex items-center px-4 py-2
    text-(sm white) font-medium
    border border-transparent rounded-md shadow-sm
    bg-indigo-(600 hover:700 focus:800)
    focus:(outline-none ring-(2 offset-2 indigo-500))
    transition-colors duration-300
  "
>
  Button text
</button>
```

As you can see, grouping saved a few characters. For some people, the grouped classes may improve readability. Other people may prefer the Tailwind style. Grouping is fully opt-in, highly expressive, and can be used as little or as much as you'd like.

## Directive Grouping

The first grouping syntax works by factoring out common directive prefixes. Below is an example of a rule set without directive grouping and the equivalent rule set with `border` factored out.

```js
// Before directive grouping
cx`border-2 border-black border-opacity-50 border-dashed`

// After directive grouping
cx`border-(2 black opacity-50 dashed)`
```

This reduced repetition in this rule set by about 20% but the output is still the same!

## Variant Grouping

The second grouping syntax works by factoring out common variants. Both responsive and pseudo variants are supported in various combinations.

> Note how rules within tagged template literals are able to span multiple lines

```js
// Before variant grouping
cx`bg-red-500 shadow-xs sm:bg-red-600 sm:shadow-sm md:bg-red-700 md:shadow lg:bg-red-800 lg:shadow-xl`

// After variant grouping
cx`
  bg-red-500 shadow-xs
  sm:(
    bg-red-600
    shadow-sm
  )
  md:(bg-red-700 shadow)
  lg:(bg-red-800 shadow-xl)
`

cx`w(1/2 sm:1/3 lg:1/6) p-2`
// => w-1/2 sm:w-1/3 lg:w-1/6 p-2
```

## Mixed Groupings

It is possible to nest directive groups inside of responsive groups and vice versa, however it is important to note that nesting responsive variants inside of responsive variants doesn't make sense and is not permitted.

```js
cx`sm:(border-(2 black opacity-50 hover:dashed))`
// => sm:border-2 sm:border-black sm:border-opacity-50 sm:hover:border-dashed

cx`border-(md:(2 black opacity-50 hover:dashed))`
// => sm:border-2 sm:border-black sm:border-opacity-50 sm:hover:border-dashed

cx`divide-(y-2 blue-500 opacity(75 md:50))`
// => divide-y-2 divide-blue-500 divide-opacity-75 md:divide-opacity-50

// Negated values can be used within the braces and will be applied to the directive:
cx`rotate-(-3 hover:6 md:(3 hover:-6))`
// => -rotate-3 hover:rotate-6 md:rotate-3 md:hover:-rotate-6"
```

Thanks to some ordering logic in the compiler, both of the above groupings will result in the same output. That is to say more generally, that directive groupings always get expanded before variant groupings.

## Self Reference

Some directives like `ring` need to be applied themselves as well as being a prefix. In this case you can use the reserved `&` character which is replaced literally with the current prefix:

```js app.js highlight=2:4 focus=1,3-4
cx`ring(& pink-700 offset(4 pink-200))`
// => ring ring-pink-700 ring-offset-4 ring-offset-pink-200

cx`bg-blue-500(hover:& focus:& active:&) rounded-full`
// => hover:bg-blue-500 **focus:bg-blue-500** active:bg-blue-500 rounded-full
```
