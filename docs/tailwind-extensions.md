# Tailwind Extensions

Tailwind provides a [comprehensive list of variants and directives](https://tailwindcss.com). We have added some additional features that we found useful to have.

> You can click on each summary to reveal more details.

<details><summary>Table Of Contents (Click To Expand)</summary>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Syntax](#syntax)
- [Variants](#variants)
- [Directives](#directives)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Syntax

<details><summary>Custom syntax for grouping directives and variants</summary>

Having control over the interpreter affords us the possibility of defining terse syntax for [grouping responsive and pseudo variants](./grouping.md) as well as directives with common prefixes. This massively reduces repetition and improves comprehension.

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

</details>

<details><summary>Using exclamation point (<code>!</code>) after a directive to override any other declarations</summary>

Directives may end with exclamation point (`text-center!`) to be marked as [important](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity#The_!important_exception):

```html
<div class="children:text-red-500">
  <p>And here is a red paragraph!</p>
  <p class="text-purple-500">And this is a red paragraph!</p>
  <p class="text-purple-500!">This is not purple!</p>
</div>
```

> [live and interactive demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPGRpdiBjbGFzcz0iY2hpbGRyZW46dGV4dC1yZWQtNTAwIj4KICAgIDxwPkFuZCBoZXJlIGlzIGEgcmVkIHBhcmFncmFwaCE8L3A+CiAgICA8cCBjbGFzcz0idGV4dC1wdXJwbGUtNTAwIj5BbmQgdGhpcyBpcyBhIHJlZCBwYXJhZ3JhcGghPC9wPgogICAgPHAgY2xhc3M9InRleHQtcHVycGxlLTUwMCEiPlRoaXMgaXMgbm90IHB1cnBsZSE8L3A+CiAgPC9kaXY+CmAK)

</details>

## Variants

<details><summary>Every variant can be applied to every directive</summary>

Because twind is generating CSS during runtime there is no to need restrict the usage of variants.

</details>

<details><summary>Dark mode is always available</summary>

Please see [Installation - Dark Mode](./setup.md#dark-mode) for details.

</details>

<details><summary>Most pseudo classes can be uses as variant or <code>group-*</code> variant</summary>

Unknown variants (not listed in [core variants](https://github.com/tw-in-js/twind/blob/main/src/twind/variants.ts)) are assumed to be [pseudo classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes).

_Advanced_ pseudo classes (those that take parameters like `:is(header)`) are not supported out of the box as they use `(...)` which is parsed as [a variant or directive grouping](./grouping.md). You can define an alias for those during [setup](./setup.md):

```js
setup({
  variants: {
    ':is-header': '&:is(header)',
  },
})

tw`is-header:font-bold`
// => .is-header\:font-bold:is(header) { ... }
```

> If you have an idea how we could support these within the parser please [open an issue](https://github.com/tw-in-js/twind/issues) for discussions.

</details>

<details><summary><code>siblings:*</code> - General sibling combinator (<code>& ~ *</code>)</summary>

Matches elements that are following the element this is applied on (though not necessarily immediately), and are children of the same parent element ([MDN - General sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/General_sibling_combinator)).

```html
<p>This is not red.</p>
<p class="siblings:text-red-500">Here is a paragraph.</p>
<p>And here is a red paragraph!</p>
<p>And this is a red paragraph!</p>
```

> [live and interactive demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPHA+VGhpcyBpcyBub3QgcmVkLjwvcD4KICA8cCBjbGFzcz0ic2libGluZ3M6dGV4dC1yZWQtNTAwIj5IZXJlIGlzIGEgcGFyYWdyYXBoLjwvcD4KICA8cD5BbmQgaGVyZSBpcyBhIHJlZCBwYXJhZ3JhcGghPC9wPgogIDxwPkFuZCB0aGlzIGlzIGEgcmVkIHBhcmFncmFwaCE8L3A+CmA=)

</details>

<details><summary><code>sibling:*</code> - Adjacent sibling combinator (<code>& + *</code>)</summary>

Matches the element that immediately follows the element this is applied on, and is a children of the same parent element ([MDN - Adjacent sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_combinator)).

```html
<p>This is not red.</p>
<p class="sibling:text-red-500">Here is a paragraph.</p>
<p>And here is a red paragraph!</p>
<p>This is not red!</p>
```

> [live and interactive demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPHA+VGhpcyBpcyBub3QgcmVkLjwvcD4KICA8cCBjbGFzcz0ic2libGluZzp0ZXh0LXJlZC01MDAiPkhlcmUgaXMgYSBwYXJhZ3JhcGguPC9wPgogIDxwPkFuZCBoZXJlIGlzIGEgcmVkIHBhcmFncmFwaCE8L3A+CiAgPHA+VGhpcyBpcyBub3QgcmVkITwvcD4KYA==)

</details>

<details><summary><code>children:*</code> - Child combinator (<code>& > *</code>)</summary>

Matches direct children of the element this is applied on ([MDN - Child combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Child_combinator)).

```html
<div class="children:(border my-2)">
  <p>This paragraph has <em>emphasized text</em> in it.</p>
  <p>This paragraph has <em>emphasized text</em> in it.</p>
</div>
```

> [live and interactive demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPHA+VGhpcyBpcyBub3QgcmVkLjwvcD4KICA8cCBjbGFzcz0ic2libGluZ3M6dGV4dC1yZWQtNTAwIj5IZXJlIGlzIGEgcGFyYWdyYXBoLjwvcD4KICA8cD5BbmQgaGVyZSBpcyBhIHJlZCBzcGFuITwvcD4KICA8cD5BbmQgdGhpcyBpcyBhIHJlZCBzcGFuITwvcD4KYA==)

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

> If you find any incorrect or missing directive then please [open an issue](https://github.com/tw-in-js/twind/issues).

</details>

## Directives

<details><summary><code>text-underline</code>, <code>text-uppercase</code>, ...</summary>
  
This allows grouping of text directives: `text(lg red-500 capitalize underline)`

- `text-underline`
- `text-no-underline`
- `text-line-through`
- `text-uppercase`
- `text-lowercase`
- `text-capitalize`

</details>

<details><summary><code>font-italic</code> and <code>font-no-italic</code> </summary>

This allows grouping of font directives: `font(sans italic bold)`

- `font-italic`
- `font-no-italic`

</details>

<details><summary><code>bg-gradient-to-*</code> is built-in</summary>

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

> [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgc2V0dXAgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKc2V0dXAoewogIHRoZW1lOiB7CiAgICBleHRlbmQ6IHsKICAgICAgYmFja2dyb3VuZEltYWdlOiAodGhlbWUpID0+ICh7CiAgICAgICAgLy8gVXNlIGEgb3duIGdyYWRpZW50CiAgICAgICAgJ2dyYWRpZW50LXJhZGlhbCc6IGByYWRpYWwtZ3JhZGllbnQoJHt0aGVtZSgnY29sb3JzLmJsdWUuNTAwJyl9LCAke3RoZW1lKCdjb2xvcnMucmVkLjUwMCcpfSk7YCwKICAgICAgICAvLyBJbnRlZ3JhdGUgd2l0aCBncmFkaWVudCBjb2xvcnMgc3RvcHMgKGZyb20tKiwgdmlhLSosIHRvLSopCiAgICAgICAgJ2dyYWRpZW50LTE1JzogJ2xpbmVhci1ncmFkaWVudCguMTV0dXJuLCB2YXIoLS10dy1ncmFkaWVudC1zdG9wcyx2YXIoLS10dy1ncmFkaWVudC1mcm9tLHRyYW5zcGFyZW50KSx2YXIoLS10dy1ncmFkaWVudC10byx0cmFuc3BhcmVudCkpKScsCiAgICAgIH0pCiAgICB9LAogIH0sCn0pCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYAogIDxkaXYgY2xhc3M9ImNoaWxkcmVuOihoLTMyIG15LTQpIj4KICAgIDxkaXYgY2xhc3M9ImJnLWdyYWRpZW50LXJhZGlhbCI+PC9kaXY+CiAgCiAgICA8ZGl2IGNsYXNzPSJiZy1ncmFkaWVudC0xNSBmcm9tLWdyZWVuLTQwMCB0by1ibHVlLTUwMCI+PC9kaXY+CiAgPC9kaXY+CmAK)

</details>

<details><summary><code>border</code> and <code>divide</code> allow to combine positions</summary>

Every permutation of `t`op, `r`righ, `l`eft, and `b`ottom is allowed:

- `tr` - `top` & `right`
- `brl` - `bottom`, `right` and `left`

> **Note** `x` and `y` can not be combined.

</details>

<details><summary><code>rotate</code>, <code>scale</code> , <code>skew</code> and <code>translate</code> provide a fallback for IE 11</summary>

Please note that `transform rotate-45` works but when using `transform rotate-45 scale-150` only one of both is applied.

</details>

<details><summary><code>appearance-*</code>: supports all values</summary>

See [MDN - appearance](https://developer.mozilla.org/en-US/docs/Web/CSS/appearance) for a reference of possible values.

</details>

<hr/>

Continue to [CSS-in-JS](./css-in-js.md)
