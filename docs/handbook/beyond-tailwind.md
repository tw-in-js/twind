---
title: Additional Features
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

While Twind strives to maintain feature parity with Tailwind, we've added several variants, directives, and utilities for your convenience. This document includes a complete list of all features beyond Tailwind that Twind has to offer with links to the corresponding documentation.

## Syntax

- Custom grouping syntax for directives and variants [View Docs](grouping-syntax)
- Overwrite styles with the `important!` directive [View Docs](overwriting-styles)

## Variants

[View docs on extended variants and directives](extended-variants-directives.md)

- Every variant can be applied to every directive
- Dark mode is always available
- Most pseudo classes can be uses as variant or `group-*` variant
- Unknown variants (not listed in [core variants](https://github.com/tw-in-js/twind/blob/main/src/twind/variants.ts)) are assumed to be [pseudo classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)
- Advanced\_ pseudo classes (those that take parameters like `:is(header)`) are not supported out of the box as they use `(...)` which is parsed as a variant or directive.
- Nested groups are supported by named groups
- [Pseudo Elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements) are supported using double colon
- `siblings:*` - General sibling combinator (`& ~ *`)
- `sibling:*` - Adjacent sibling combinator (`& + *`)
- `children:*` - Child combinator (`& > *`)
- `override:*` - Increase the specificity of rules

## Directives

- Some directives support all CSS values
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
- `text-underline`
- `text-no-underline`
- `text-line-through`
- `text-uppercase`
- `text-lowercase`
- `text-capitalize`
- `font-italic`
- `font-no-italic`
- `bg-gradient-to-*` is built-in
- `border` and `divide` allow to combine positions
- Every permutation of `t`op, `r`righ, `l`eft, and `b`ottom is allowed (`x` and `y` can not be combined)
- `rotate`, `scale` , `skew` and `translate` provide a fallback for IE 11
- Theme values are automatically negated

## Extension Packages

- [@twind/aspect-ratio](https://github.com/tw-in-js/twind-aspect-ratio): a composable API for giving elements a fixed aspect ratio
- [@twind/content](https://github.com/tw-in-js/twind-content): a [CSS content property](https://developer.mozilla.org/en-US/docs/Web/CSS/content) directive
- [@twind/forms](https://github.com/tw-in-js/twind-forms): a basic reset for form styles that makes form elements easy to override with utilities
- [@twind/line-clamp](https://github.com/tw-in-js/twind-line-clamp): utilities for visually truncating text after a fixed number of lines
- [@twind/typography](https://github.com/tw-in-js/typography): a set of `prose` classes you can use to add beautiful typographic defaults to any vanilla HTML you don't control (like HTML rendered from Markdown, or pulled from a CMS).
