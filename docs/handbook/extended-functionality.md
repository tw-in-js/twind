---
title: Extended Functionality
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: See a list of all the features of Twind beyond Tailwind
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

Tailwind provides a comprehensive list of variants and utility classes. Twind supports all Tailwind variants/classes, and we've added a few more for your convenience.

## Variants

Variants are special keywords recognized by the compiler used to apply styles to HTML element(s) based on pseudo states, viewport sizes, dark mode, or other states. Variants are used by prefixing class names or groupings and are denoted with a trailing colon. (e.g. `md:text-blue-500` or `md:(text-blue-500)`)

Tailwind provides a default configuration, and requires that you explicitly associate certain variants to styles as you need them. This is not the case with Twind. Twind support all Tailwind variants out of the box with no configuration required.

```html
<p class="text-blue-500 md:text-red-500">Hello Twind!</p>
```

#### Every variant can be applied to every directive

Because Twind is generating CSS during runtime there is no to need restrict the usage of variants.

#### Dark mode is always available

[View docs for dark mode](/handbook/configuration#dark-mode)

#### Most pseudo classes can be used as variant or `group-*` variant

Unknown variants (not listed in [core variants](https://github.com/tw-in-js/twind/blob/main/src/twind/variants.ts)) are assumed to be [pseudo classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes).

_Advanced_ pseudo classes (those that take parameters like `:is(header)`) are not supported out of the box as they use `(...)` which is parsed as a variant or directive. You can define an alias for those in your [configuration](configuration):

```js
setup({
  variants: {
    'is-header': '&:is(header)',
  },
})

tw`is-header:font-bold`
// => .is-header\:font-bold:is(header) { ... }
```

> 🙋 If you have an idea how we could support these within the parser please [open an issue](https://github.com/tw-in-js/twind/issues) for discussions.

#### Negating styles with the `not-` pseudo-class prefix.

Most Twind rules can be prefixed with the `not-`prefix, which represents a non-match to the rule. For instance, `not-hover:uppercase` would apply the uppercase style any time the element is not being hovered.

Here are some other examples using the `not-` prefix, with the derived CSS selector:

| Class name                       | Selector                                                  |
| -------------------------------- | --------------------------------------------------------- |
| not-focus:invalid:border-red-500 | .not-focus\\:invalid\\:border-red-500:not(:focus):invalid |
| invalid:not-focus:border-red-500 | .invalid\\:not-focus\\:border-red-500:invalid:not(:focus) |
| not-disabled:focus:font-bold     | .not-disabled\\:focus\\:font-bold:not(:disabled):focus    |
| not-last-child:mb-5              | .not-last-child\\:mb-5:not(:last-child)                   |

Core and user defined variants are not expanded and stay as is:

```js
setup({
  variants: {
    'not-logged-in': 'body:not(.logged-in) &',
  },
})

tw`not-logged-in:hidden`
// => `body:not(.logged-in) .not-logged-in\\:hidden`
```

#### Named groups to support nested groups

Named groups allow to nest groups within each other and target specific groups by their name. The group names are ad-hoc meaning there is no special configuration required.

Here is an example using the shim

```html
<div class="group-x bg-white hover:bg-blue-500 ...">
  <p class="text-gray-900 group-x-hover:text-white ...">New Project</p>
  <div class="group-y bg-gray-100 hover:bg-green-500 ...">
    <p class="text-gray-500 group-y-hover:text-white ...">
      Create a new project from a variety of starting templates.
    </p>
  </div>
</div>
```

#### [Pseudo Elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements) are supported using double colon

Pseudo Elements can be used and are identified by a double colon:

```html
<p class="first-line::(uppercase text-blue-500)">
  Styles will only be applied to the first line of this paragraph. After that, all text will be
  styled like normal. See what I mean?
</p>
```

`::before` and `::after` are often used together with [content property](https://developer.mozilla.org/en-US/docs/Web/CSS/content). The [@twind/content](https://github.com/tw-in-js/twind-content) extension helps in these cases:

```js
import { content } from '@twind/content'

tw`${content('"✅"')}`
// => .tw-xxxx { content: "✅" }

tw`before::${content('"✅"')}`
// => .tw-xxxx::before { content: "✅" }

tw`before::${content('attr(data-content)')}`
// => .tw-xxxx::before { content: attr(data-content) }

tw`after::${content('" (" attr(href) " )"')}`
// => .tw-xxxx::after { content: " (" attr(href) " )" }
```

> 💡 Please a look at the documentation of [@twind/content](https://github.com/tw-in-js/twind-content) for more examples.

#### `siblings:*` - General sibling combinator (`& ~ *`)

Matches elements that are following the element this is applied on (though not necessarily immediately), and are children of the same parent element ([MDN - General sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/General_sibling_combinator)).

```html
<p>This is not red.</p>
<p class="siblings:text-red-500">Here is a paragraph.</p>
<p>And here is a red paragraph!</p>
<p>And this is a red paragraph!</p>
```

<DemoLink href="https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPHA+VGhpcyBpcyBub3QgcmVkLjwvcD4KICA8cCBjbGFzcz0ic2libGluZ3M6dGV4dC1yZWQtNTAwIj5IZXJlIGlzIGEgcGFyYWdyYXBoLjwvcD4KICA8cD5BbmQgaGVyZSBpcyBhIHJlZCBwYXJhZ3JhcGghPC9wPgogIDxwPkFuZCB0aGlzIGlzIGEgcmVkIHBhcmFncmFwaCE8L3A+CmA=" />

#### `sibling:*` - Adjacent sibling combinator (`& + *`)

Matches the element that immediately follows the element this is applied on, and is a children of the same parent element ([MDN - Adjacent sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_combinator)).

```html
<p>This is not red.</p>
<p class="sibling:text-red-500">Here is a paragraph.</p>
<p>And here is a red paragraph!</p>
<p>This is not red!</p>
```

<DemoLink href="https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPHA+VGhpcyBpcyBub3QgcmVkLjwvcD4KICA8cCBjbGFzcz0ic2libGluZzp0ZXh0LXJlZC01MDAiPkhlcmUgaXMgYSBwYXJhZ3JhcGguPC9wPgogIDxwPkFuZCBoZXJlIGlzIGEgcmVkIHBhcmFncmFwaCE8L3A+CiAgPHA+VGhpcyBpcyBub3QgcmVkITwvcD4KYA==" />

#### `children:*` - Child combinator (`& > *`)

Matches direct children of the element this is applied on ([MDN - Child combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Child_combinator)).

```html
<div class="children:(border my-2)">
  <p>This paragraph has <em>emphasized text</em> in it.</p>
  <p>This paragraph has <em>emphasized text</em> in it.</p>
</div>
```

<DemoLink href="https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPHA+VGhpcyBpcyBub3QgcmVkLjwvcD4KICA8cCBjbGFzcz0ic2libGluZ3M6dGV4dC1yZWQtNTAwIj5IZXJlIGlzIGEgcGFyYWdyYXBoLjwvcD4KICA8cD5BbmQgaGVyZSBpcyBhIHJlZCBzcGFuITwvcD4KICA8cD5BbmQgdGhpcyBpcyBhIHJlZCBzcGFuITwvcD4KYA==" />

Please note that [some CSS properties are inherited](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) and therefore all children will have those styles applied. Here is an (_incomplete_) list of directives that use [inherited CSS properties](https://stackoverflow.com/questions/5612302/which-css-properties-are-inherited) where the style would be inherited by all children and not only the direct children:

- `border-collapse`
- `border-separate`
- `cursor-*`
- `font-*`
- `invisible`
- `leading-*`
- `list-*`
- `text-*`
- `tracking-*`
- `visible`
- `whitespace-*`

> 🙋 If you find any incorrect or missing directive then please [open an issue](https://github.com/tw-in-js/twind/issues).

#### `override:*` - Increase the specificity of rules

When using components that have some default styles it happens that one wants to override a rule. Consider the following example:

```js
const shared = tw`text(xl center blue-600) underline`
const special = tw`${shared} text-purple-600 no-underline`
// => text-xl text-center text-blue-600 underline text-purple-600 no-underline
```

One can not be sure that the `text-purple-600` would be correctly applied as the order of classes does not matter. Only the [specificity](https://specificity.keegan.st/).

To support these cases Twind includes the `override` variant which uses a little trick to increase the specificity: `.class-name.class-name` is more specific than just `.class-name`

The above example should be re-written to:

```js
const shared = tw`text(xl center blue-600) underline`
const special = tw`${shared} override:(text-purple-600 no-underline)`
```

<DemoLink href="https://esm.codes/#aW1wb3J0IHsgdHcgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZCcKCmNvbnN0IHNoYXJlZCA9IHR3YHRleHQoeGwgY2VudGVyIGJsdWUtNjAwKSB1bmRlcmxpbmVgCmNvbnN0IHNwZWNpYWwgPSB0d2Ake3NoYXJlZH0gb3ZlcnJpZGU6KHRleHQtcHVycGxlLTYwMCBuby11bmRlcmxpbmUpYAoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPHAgY2xhc3M9IiR7c2hhcmVkfSI+Q29tbW9uIFN0eWxlczwvcD4KICA8cCBjbGFzcz0iJHtzcGVjaWFsfSI+U3BlY2lhbCBTdHlsZXM8L3A+CmAK" />

## Utilities

#### Arbitrary style values using square bracket syntax

While not generally recommended, there are times when you will need to break out of the Twind constraints for one-off styles like a slight rotation, relative positioning, custom font size, etc. Twind provides a square bracket syntax, which allows you to define these arbitrary styles without ever leaving your HTML:

```html
<p class="relative -top-[-8px]">Hello Twind!</p>
```

:::tip
Square bracket syntax will work almost anywhere that you could apply a theme value, including with variants: `md:top-[-80px]`
:::

Here are some other examples of using the square bracket syntax to provide arbitrary CSS values:

```
bg-[#0f0]
bg-[#ff0000]
bg-[#0000ffcc]
bg-[hsl(0,100%,50%)]
bg-[hsla(0,100%,50%,0.3)]
bg-[rgb(123,123,123)]
bg-[rgba(123,123,123,var(--tw-bg-opacity))]
bg-opacity-[0.11]
border-[#f00]
border-[2.5px]
duration-[2s]
grid-cols-[200px,repeat(auto-fill,minmax(15%,100px)),300px]
grid-cols-[minmax(100px,max-content)repeat(auto-fill,200px)20%]
grid-cols-[repeat(auto-fit,minmax(150px,1fr))]
flex-[30%]
ring-[#1da1f2]
ring-[7px]
ring-offset-[#1da1f2]
ring-offset-[7px]
rotate-[0.5turn]
rotate-[23deg]
rotate-[2.3rad]
rotate-[401grad]
rotate-[1.5turn]
rounded-[33%]
scale-[2]
scale-x-[1.15]
skew-[30deg]
skew-x-[1.07rad]
space-x-[20cm]
space-x-[calc(20%-1cm)]
text-[#1da1f2]
text-[2.23rem]
text-[6px]
text-[calc(1vw+1vh+.5vmin)]
top-[-123px]
top-[123px]
transition-[font-size,color,width]
translate-[3in]
translate-y-[2px]
w-[3.23rem]
w-[calc(100%+1rem)]
w-[clamp(23ch,50%,46ch)]
```

#### Some directives support all CSS values

- `align-*` - [vertical-align](https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align)
- `appearance-*` - [appearance](https://developer.mozilla.org/en-US/docs/Web/CSS/appearance)
- `clear-*` - [clear](https://developer.mozilla.org/en-US/docs/Web/CSS/clear)
- `cursor-*` - [cursor](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)
- `float-*` - [float](https://developer.mozilla.org/en-US/docs/Web/CSS/float)
- `list-*` - [list-style-type](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type)
- `object-*` - [object-position](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position); using a dash as separator: `object-right-top`
- `origin-*` - [transform-origin](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-origin); using a dash as separator: `origin-top-left`
- `overflow-*` - [overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)
- `pointer-events-*` - [pointer-events](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events)
- `select-*` - [user-select](https://developer.mozilla.org/en-US/docs/Web/CSS/user-select)
- `whitespace-*` - [white-space](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)

#### `text-underline`, `text-uppercase`, ...

This allows grouping of text directives: `text(lg red-500 capitalize underline)`

- `text-underline`
- `text-no-underline`
- `text-line-through`
- `text-uppercase`
- `text-lowercase`
- `text-capitalize`

#### `font-italic` and `font-no-italic`

This allows grouping of font directives: `font(sans italic bold)`

- `font-italic`
- `font-no-italic`

#### `bg-gradient-to-*` is built-in

Every permutation of `t`op, `r`ight, `l`eft, and `b`ottom is handled by twind (like `bg-gradient-to-tr`). You can add new gradients but they should not use one of those keys:

```js
setup({
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        // Use a own gradient
        'gradient-radial': `radial-gradient(${theme('colors.blue.500')}, ${theme(
          'colors.red.500',
        )});`,
        // Integrate with gradient colors stops (from-*, via-*, to-*)
        'gradient-15':
          'linear-gradient(.15turn, var(--tw-gradient-stops,var(--tw-gradient-from,transparent),var(--tw-gradient-to,transparent)))',
      }),
    },
  },
})

tw`bg-gradient-radial`

tw`bg-gradient-15 from-green-400 to-blue-500`
```

<DemoLink href="https://esm.codes/#aW1wb3J0IHsgc2V0dXAgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKc2V0dXAoewogIHRoZW1lOiB7CiAgICBleHRlbmQ6IHsKICAgICAgYmFja2dyb3VuZEltYWdlOiAodGhlbWUpID0+ICh7CiAgICAgICAgLy8gVXNlIGEgb3duIGdyYWRpZW50CiAgICAgICAgJ2dyYWRpZW50LXJhZGlhbCc6IGByYWRpYWwtZ3JhZGllbnQoJHt0aGVtZSgnY29sb3JzLmJsdWUuNTAwJyl9LCAke3RoZW1lKCdjb2xvcnMucmVkLjUwMCcpfSk7YCwKICAgICAgICAvLyBJbnRlZ3JhdGUgd2l0aCBncmFkaWVudCBjb2xvcnMgc3RvcHMgKGZyb20tKiwgdmlhLSosIHRvLSopCiAgICAgICAgJ2dyYWRpZW50LTE1JzogJ2xpbmVhci1ncmFkaWVudCguMTV0dXJuLCB2YXIoLS10dy1ncmFkaWVudC1zdG9wcyx2YXIoLS10dy1ncmFkaWVudC1mcm9tLHRyYW5zcGFyZW50KSx2YXIoLS10dy1ncmFkaWVudC10byx0cmFuc3BhcmVudCkpKScsCiAgICAgIH0pCiAgICB9LAogIH0sCn0pCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYAogIDxkaXYgY2xhc3M9ImNoaWxkcmVuOihoLTMyIG15LTQpIj4KICAgIDxkaXYgY2xhc3M9ImJnLWdyYWRpZW50LXJhZGlhbCI+PC9kaXY+CiAgCiAgICA8ZGl2IGNsYXNzPSJiZy1ncmFkaWVudC0xNSBmcm9tLWdyZWVuLTQwMCB0by1ibHVlLTUwMCI+PC9kaXY+CiAgPC9kaXY+CmAK" />

#### `border` and `divide` allow to combine positions

Every permutation of `t`op, `r`righ, `l`eft, and `b`ottom is allowed:

- `tr` - `top` & `right`
- `brl` - `bottom`, `right` and `left`

> 💡 `x` and `y` can not be combined.

#### `rotate`, `scale` , `skew` and `translate` provide a fallback for IE 11

Please note that `transform rotate-45` works but when using `transform rotate-45 scale-150` only one of both is applied.

#### Theme values are automatically negated

There is no need to provided negated values in the theme. As soon as Twind detects a negated directive like `-mx-2` it negates the theme value.

## Extension Packages

- [@twind/aspect-ratio](https://github.com/tw-in-js/twind-aspect-ratio): a composable API for giving elements a fixed aspect ratio
- [@twind/content](https://github.com/tw-in-js/twind-content): a [CSS content property](https://developer.mozilla.org/en-US/docs/Web/CSS/content) directive
- [@twind/forms](https://github.com/tw-in-js/twind-forms): a basic reset for form styles that makes form elements easy to override with utilities
- [@twind/line-clamp](https://github.com/tw-in-js/twind-line-clamp): utilities for visually truncating text after a fixed number of lines
- [@twind/typography](https://github.com/tw-in-js/typography): a set of `prose` classes you can use to add beautiful typographic defaults to any vanilla HTML you don't control (like HTML rendered from Markdown, or pulled from a CMS).

While Twind strives to maintain feature parity with Tailwind, we've added several variants, directives, and utilities for your convenience. This document includes a complete list of all features beyond Tailwind that Twind has to offer with links to the corresponding documentation.

## Syntax

- Custom grouping syntax for directives and variants [View Docs](grouping-syntax)
- Overwrite styles with the `important!` directive [View Docs](overwriting-styles)

## Extension Packages

- [@twind/aspect-ratio](https://github.com/tw-in-js/twind-aspect-ratio): a composable API for giving elements a fixed aspect ratio
- [@twind/content](https://github.com/tw-in-js/twind-content): a [CSS content property](https://developer.mozilla.org/en-US/docs/Web/CSS/content) directive
- [@twind/forms](https://github.com/tw-in-js/twind-forms): a basic reset for form styles that makes form elements easy to override with utilities
- [@twind/line-clamp](https://github.com/tw-in-js/twind-line-clamp): utilities for visually truncating text after a fixed number of lines
- [@twind/typography](https://github.com/tw-in-js/typography): a set of `prose` classes you can use to add beautiful typographic defaults to any vanilla HTML you don't control (like HTML rendered from Markdown, or pulled from a CMS).
