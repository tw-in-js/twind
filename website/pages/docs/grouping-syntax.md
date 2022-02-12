---
title: Grouping Syntax
next: ./reference.md
---

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
