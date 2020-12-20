# Tailwind Extensions

The following is a list of directives we have added or support additional features:

- `children` (`& > *`) and `siblings` (`& ~ *`) variants
- [every pseudo class](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) can be used as a variant or `group-*` variant
- `text-underline`, `text-no-underline`, `text-line-through`, `text-uppercase`, `text-lowercase` and `text-capitalize`: this allows grouping of text directives like `text(lg red-500 capitalize underline)`
- `font-italic` and `font-no-italic`: this allows grouping of font directives like `font(sans italic bold)`
- `appearance-*`: supports [all values](https://developer.mozilla.org/en-US/docs/Web/CSS/appearance)
- `bg-gradient-to-*` is built-in, no need to configure these
- `border` and `divide` allow to combine positions (`t`op, `r`righ, `l`eft, `b`ottom)

  - `tr` - `top` & `right`
  - `brl` - `bottom`, `right` and `left`

  > **Note** `x` and `y` can not be combined.

- `rotate`, `scale` , `skew` and `translate` provide a fallback for IE 11

  > `transform rotate-45` works but when using `transform rotate-45 scale-150` only one of both is applied.

<hr/>

Continue to [CSS in JS](./css.md)
