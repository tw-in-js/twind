> 💡 If you are unfamiliar with the Tailwind CSS shorthand syntax please read the [Tailwind documentation](https://tailwindcss.com/docs) about [Utility-First](https://tailwindcss.com/docs/utility-first), [Responsive Design](https://tailwindcss.com/docs/responsive-design) and [Hover, Focus, & Other States](https://tailwindcss.com/docs/hover-focus-and-other-states).

```js
import { tw } from 'twind'

document.body.innerHTML = `
  <main class="${tw`h-screen bg-purple-400 flex items-center justify-center`}">
    <h1 class="${tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}">This is Twind!</h1>
  </main>
`
```

> 🚀 [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgdHcgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZCcKCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYAogIDxtYWluIGNsYXNzPSIke3R3YGgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJgfSI+CiAgICA8aDEgY2xhc3M9IiR7dHdgZm9udC1ib2xkIHRleHQoY2VudGVyIDV4bCB3aGl0ZSBzbTpncmF5LTgwMCBtZDpwaW5rLTcwMClgfSI+VGhpcyBpcyBUd2luZCE8L2gxPgogIDwvbWFpbj4KYA==)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [The tw function](#the-tw-function)
- [The apply function](#the-apply-function)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## The tw function

Calling the {@link twind.tw | tw} function results in the shorthand rules to be interpreted, normalized and compiled into CSS rules which get added to a stylesheet in the head of the document. The function will return a string consisting of all the class names that were processed. These class names can then be applied to the element itself much like any other CSS-in-JS library.

```js
tw`bg-gray-200 rounded`
//=> bg-gray-200 rounded
tw`bg-gray-200 ${false && 'rounded'}`
//=> bg-gray-200
```

<details><summary>Show me more examples</summary>

```js
tw`bg-gray-200 ${[false && 'rounded', 'block']}`
//=> bg-gray-200 block
tw`bg-gray-200 ${{ rounded: false, underline: isTrue() }}`
//=> bg-gray-200 underline
tw`bg-${randomColor()}`
//=> bg-blue-500
tw`hover:${({ tw }) => tw`underline`}`
//=> hover:underline
tw`bg-${'fuchsia'}) sm:${'underline'} lg:${false && 'line-through'} text-${[
  'underline',
  'center',
]} rounded-${{ lg: false, xl: true }})`
// => bg-fuchsia sm:underline text-underline text-center rounded-xl

tw`text-${'gray'}-100 bg-${'red'}(600 hover:700 ${'focus'}:800)`
// => text-gray-100 bg-red-600 hover:bg-red-700 focus:bg-red-800
```

</details>

It is possible to invoke the {@link twind.tw | tw} function in a multitude of different ways. It can take any number of arguments, each of which can be an Object, Array, Boolean, Number, String or Template Literal. This ability is inspired heavily by the [clsx](https://npmjs.com/clsx) library by [Luke Edwards](https://github.com/lukeed).

> Note any falsey values are always discarded as well as standalone boolean and number values

```js
// Strings
tw('bg-gray-200', true && 'rounded', 'underline')
//=> bg-gray-200 rounded underline

// Objects
tw({ 'bg-gray-200': true, rounded: false, underline: isTrue() })
//=> bg-gray-200 underline

// Arrays
tw(['bg-gray-200', 0, false, 'rounded'])
//=> bg-gray-200 rounded

// Mixed
tw('bg-gray-200', [
  1 && 'rounded',
  { underline: false, 'text-black': null },
  ['text-lg', ['shadow-lg']],
])
//=> bg-gray-200 rounded text-lg shadow-lg
```

<details><summary>Show me more examples</summary>

```js
tw({ 'bg-gray-200': true }, { rounded: false }, null, { underline: true })
//=> bg-gray-200 underline

tw({ hover: ['bg-red-500', 'p-3'] }, 'm-1')
// => hover:bg-red-500 hover:p-3 m-1

tw(['bg-gray-200'], ['', 0, false, 'rounded'], [['underline']])
//=> bg-gray-200 rounded underline

tw({
  sm: ['hover:rounded', 'active:rounded-full'],
  md: { rounded: true, hover: 'bg-white' },
  lg: {
    'rounded-full': true,
    hover: 'bg-white text-black active:(underline shadow)',
  },
})
// sm:hover:rounded sm:active:rounded-full md:rounded md:hover:bg-white lg:rounded-full lg:hover:bg-white lg:hover:text-black lg:hover:active:underline lg:hover:active:shadow
```

</details>

## The apply function

Use {@link twind.apply | apply} to inline any existing utility classes into a single CSS class.

This is useful when you find a common utility pattern in your HTML that you'd like to extract to a new component.

```js
import { apply } from 'twind'

const btn = apply`inline-block bg-gray-500 text-base`
// => generates on CSS class with all declarations of the above rules when used

const btnBlock = apply`${btn} block`
// => generates on CSS class with all declarations of btn & block

<button class={tw`${btn}`}>gray-500</button>
// => tw-XXXXX

<button class={tw`${btn} bg-red-500 text-lg`}>red-500 large</button>
// => tw-XXXX bg-red-500 text-lg

<button class={tw`${btnBlock}`}>block button</button>
// => tw-YYYY
```

The component styles are added **before** the utility classes to the stylesheet which allows utilities to override component styles.

For more examples see the {@page Defining Components} guide.

> 💡 Another way to extract common component styles is by {@page Plugins | using an alias plugin}.

<hr/>

Continue to {@page Thinking in Groups}
