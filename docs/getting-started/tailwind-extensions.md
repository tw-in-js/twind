Tailwind provides a [comprehensive list of variants and directives](https://tailwindcss.com). We have added some additional features that we found useful to have.

> 💡 You can click on each summary to reveal more details.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Syntax](#syntax)
  - [Custom syntax for grouping directives and variants](#custom-syntax-for-grouping-directives-and-variants)
  - [Using exclamation point (`!`) after a directive to override any other declarations](#using-exclamation-point--after-a-directive-to-override-any-other-declarations)
- [Variants](#variants)
  - [Every variant can be applied to every directive](#every-variant-can-be-applied-to-every-directive)
  - [Dark mode is always available](#dark-mode-is-always-available)
  - [Most pseudo classes can be uses as variant or `group-*` variant](#most-pseudo-classes-can-be-uses-as-variant-or-group--variant)
  - [`siblings:*` - General sibling combinator (`& ~ *`)](#siblings---general-sibling-combinator---)
  - [`sibling:*` - Adjacent sibling combinator (`& + *`)](#sibling---adjacent-sibling-combinator---)
  - [`children:*` - Child combinator (`& > *`)](#children---child-combinator---)
  - [`override:*` - Increase the specificity of rules](#override---increase-the-specificity-of-rules)
- [Directives](#directives)
  - [Some directives support all CSS values](#some-directives-support-all-css-values)
  - [`text-underline`, `text-uppercase`, ...](#text-underline-text-uppercase-)
  - [`font-italic` and `font-no-italic`](#font-italic-and-font-no-italic)
  - [`bg-gradient-to-*` is built-in](#bg-gradient-to--is-built-in)
  - [`border` and `divide` allow to combine positions](#border-and-divide-allow-to-combine-positions)
  - [`rotate`, `scale` , `skew` and `translate` provide a fallback for IE 11](#rotate-scale--skew-and-translate-provide-a-fallback-for-ie-11)
  - [Theme values are automatically negated](#theme-values-are-automatically-negated)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Syntax

### Custom syntax for grouping directives and variants

Having control over the interpreter affords us the possibility of defining terse syntax for {@page Thinking in Groups | grouping responsive and pseudo variants} as well as directives with common prefixes. This massively reduces repetition and improves comprehension.

```js
// Before directive grouping
tw`border-2 border-black border-opacity-50 border-dashed`
// After directive grouping
tw`border(2 black opacity-50 dashed)`

// With variants
tw`sm:(border(2 black opacity-50 hover:dashed))`
// => sm:border-2 sm:border-black sm:border-opacity-50 sm:hover:border-dashed

tw`w(1/2 sm:1/3 lg:1/6) p-2`
// => w-1/2 sm:w-1/3 lg:w-1/6 p-2
```

### Using exclamation point (`!`) after a directive to override any other declarations

Directives may end with exclamation point (`text-center!`) to be marked as [important](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity#The_!important_exception):

```html
<div class="children:text-red-500">
  <p>And here is a red paragraph!</p>
  <p class="text-purple-500">And this is a red paragraph!</p>
  <p class="text-purple-500!">This is not purple!</p>
</div>
```

> 🚀 [live and interactive demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPGRpdiBjbGFzcz0iY2hpbGRyZW46dGV4dC1yZWQtNTAwIj4KICAgIDxwPkFuZCBoZXJlIGlzIGEgcmVkIHBhcmFncmFwaCE8L3A+CiAgICA8cCBjbGFzcz0idGV4dC1wdXJwbGUtNTAwIj5BbmQgdGhpcyBpcyBhIHJlZCBwYXJhZ3JhcGghPC9wPgogICAgPHAgY2xhc3M9InRleHQtcHVycGxlLTUwMCEiPlRoaXMgaXMgbm90IHB1cnBsZSE8L3A+CiAgPC9kaXY+CmAK)

## Variants

### Every variant can be applied to every directive

Because Twind is generating CSS during runtime there is no to need restrict the usage of variants.

### Dark mode is always available

Please see {@page Setup} for details.

### Most pseudo classes can be uses as variant or `group-*` variant

Unknown variants (not listed in [core variants](https://github.com/tw-in-js/twind/blob/main/src/twind/variants.ts)) are assumed to be [pseudo classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes).

_Advanced_ pseudo classes (those that take parameters like `:is(header)`) are not supported out of the box as they use `(...)` which is parsed as {@page Thinking in Groups | a variant or directive grouping}. You can define an alias for those during {@page Setup | setup}:

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

### `siblings:*` - General sibling combinator (`& ~ *`)

Matches elements that are following the element this is applied on (though not necessarily immediately), and are children of the same parent element ([MDN - General sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/General_sibling_combinator)).

```html
<p>This is not red.</p>
<p class="siblings:text-red-500">Here is a paragraph.</p>
<p>And here is a red paragraph!</p>
<p>And this is a red paragraph!</p>
```

> 🚀 [live and interactive demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPHA+VGhpcyBpcyBub3QgcmVkLjwvcD4KICA8cCBjbGFzcz0ic2libGluZ3M6dGV4dC1yZWQtNTAwIj5IZXJlIGlzIGEgcGFyYWdyYXBoLjwvcD4KICA8cD5BbmQgaGVyZSBpcyBhIHJlZCBwYXJhZ3JhcGghPC9wPgogIDxwPkFuZCB0aGlzIGlzIGEgcmVkIHBhcmFncmFwaCE8L3A+CmA=)

### `sibling:*` - Adjacent sibling combinator (`& + *`)

Matches the element that immediately follows the element this is applied on, and is a children of the same parent element ([MDN - Adjacent sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_combinator)).

```html
<p>This is not red.</p>
<p class="sibling:text-red-500">Here is a paragraph.</p>
<p>And here is a red paragraph!</p>
<p>This is not red!</p>
```

> 🚀 [live and interactive demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPHA+VGhpcyBpcyBub3QgcmVkLjwvcD4KICA8cCBjbGFzcz0ic2libGluZzp0ZXh0LXJlZC01MDAiPkhlcmUgaXMgYSBwYXJhZ3JhcGguPC9wPgogIDxwPkFuZCBoZXJlIGlzIGEgcmVkIHBhcmFncmFwaCE8L3A+CiAgPHA+VGhpcyBpcyBub3QgcmVkITwvcD4KYA==)

### `children:*` - Child combinator (`& > *`)

Matches direct children of the element this is applied on ([MDN - Child combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Child_combinator)).

```html
<div class="children:(border my-2)">
  <p>This paragraph has <em>emphasized text</em> in it.</p>
  <p>This paragraph has <em>emphasized text</em> in it.</p>
</div>
```

> 🚀 [live and interactive demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPHA+VGhpcyBpcyBub3QgcmVkLjwvcD4KICA8cCBjbGFzcz0ic2libGluZ3M6dGV4dC1yZWQtNTAwIj5IZXJlIGlzIGEgcGFyYWdyYXBoLjwvcD4KICA8cD5BbmQgaGVyZSBpcyBhIHJlZCBzcGFuITwvcD4KICA8cD5BbmQgdGhpcyBpcyBhIHJlZCBzcGFuITwvcD4KYA==)

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

### `override:*` - Increase the specificity of rules

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

> 🚀 [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgdHcgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZCcKCmNvbnN0IHNoYXJlZCA9IHR3YHRleHQoeGwgY2VudGVyIGJsdWUtNjAwKSB1bmRlcmxpbmVgCmNvbnN0IHNwZWNpYWwgPSB0d2Ake3NoYXJlZH0gb3ZlcnJpZGU6KHRleHQtcHVycGxlLTYwMCBuby11bmRlcmxpbmUpYAoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPHAgY2xhc3M9IiR7c2hhcmVkfSI+Q29tbW9uIFN0eWxlczwvcD4KICA8cCBjbGFzcz0iJHtzcGVjaWFsfSI+U3BlY2lhbCBTdHlsZXM8L3A+CmAK)

## Directives

### Some directives support all CSS values

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

### `text-underline`, `text-uppercase`, ...

This allows grouping of text directives: `text(lg red-500 capitalize underline)`

- `text-underline`
- `text-no-underline`
- `text-line-through`
- `text-uppercase`
- `text-lowercase`
- `text-capitalize`

### `font-italic` and `font-no-italic`

This allows grouping of font directives: `font(sans italic bold)`

- `font-italic`
- `font-no-italic`

### `bg-gradient-to-*` is built-in

Every permutation of `t`op, `r`righ, `l`eft, and `b`ottom is handled by twind (like `bg-gradient-to-tr`). You can add new gradients but they should not use one of those keys:

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

> 🚀 [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgc2V0dXAgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKc2V0dXAoewogIHRoZW1lOiB7CiAgICBleHRlbmQ6IHsKICAgICAgYmFja2dyb3VuZEltYWdlOiAodGhlbWUpID0+ICh7CiAgICAgICAgLy8gVXNlIGEgb3duIGdyYWRpZW50CiAgICAgICAgJ2dyYWRpZW50LXJhZGlhbCc6IGByYWRpYWwtZ3JhZGllbnQoJHt0aGVtZSgnY29sb3JzLmJsdWUuNTAwJyl9LCAke3RoZW1lKCdjb2xvcnMucmVkLjUwMCcpfSk7YCwKICAgICAgICAvLyBJbnRlZ3JhdGUgd2l0aCBncmFkaWVudCBjb2xvcnMgc3RvcHMgKGZyb20tKiwgdmlhLSosIHRvLSopCiAgICAgICAgJ2dyYWRpZW50LTE1JzogJ2xpbmVhci1ncmFkaWVudCguMTV0dXJuLCB2YXIoLS10dy1ncmFkaWVudC1zdG9wcyx2YXIoLS10dy1ncmFkaWVudC1mcm9tLHRyYW5zcGFyZW50KSx2YXIoLS10dy1ncmFkaWVudC10byx0cmFuc3BhcmVudCkpKScsCiAgICAgIH0pCiAgICB9LAogIH0sCn0pCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYAogIDxkaXYgY2xhc3M9ImNoaWxkcmVuOihoLTMyIG15LTQpIj4KICAgIDxkaXYgY2xhc3M9ImJnLWdyYWRpZW50LXJhZGlhbCI+PC9kaXY+CiAgCiAgICA8ZGl2IGNsYXNzPSJiZy1ncmFkaWVudC0xNSBmcm9tLWdyZWVuLTQwMCB0by1ibHVlLTUwMCI+PC9kaXY+CiAgPC9kaXY+CmAK)

### `border` and `divide` allow to combine positions

Every permutation of `t`op, `r`righ, `l`eft, and `b`ottom is allowed:

- `tr` - `top` & `right`
- `brl` - `bottom`, `right` and `left`

> 💡 `x` and `y` can not be combined.

### `rotate`, `scale` , `skew` and `translate` provide a fallback for IE 11

Please note that `transform rotate-45` works but when using `transform rotate-45 scale-150` only one of both is applied.

### Theme values are automatically negated

There is no need to provided negated values in the theme. As soon as Twind detects a negated directive like `-mx-2` it negates the theme value.

<hr/>

Continue to {@page CSS in JS}
