---
section: Configuration
title: Rules
excerpt: Rules are responsible for generating CSS declarations for a given class name.
next: ./variants.md
---

<details>
<summary><strong>Cheat Sheet</strong></summary>

```js
defineConfig({
  rules: [
    // Static CSS declaration rule
    ['hidden', { display: 'none' }],

    // Dynamic CSS declaration rule
    ['m-(\\d+)', (match) => ({ margin: `${match[1] / 4}rem` })],

    // Static CSS property rule
    // .table-auto { table-layout: auto }
    // .table-fixed { table-layout: fixed }
    ['table-(auto|fixed)', 'tableLayout'],

    // Static alias rule
    // shortcut to multiple utilities
    ['card', 'py-2 px-4 font-semibold rounded-lg shadow-md'],

    // Dynamic alias rule
    ['card-', ({ $$ }) => `bg-${$$}-400 text-${$$}-100 py-2 px-4 rounded-lg`],

    // Single utility alias — need to use `~(...)` as it would be otherwise recognized as a CSS property
    ['red', '~(text-red-100)'],

    // Static alias rule using apply
    ['btn-green', '@(bg-green-500 hover:bg-green-700 text-white)'],

    // Dynamic alias rule using apply
    ['btn-', ({ $$ }) => `@(bg-${$$}-400 text-${$$}-100 py-2 px-4 rounded-lg)`],

    // Static rule with css helper
    [
      'target-new-tab',
      css`
        target-name: new;
        target-new: tab;
      `,
    ],

    // Dynamic rule with css helper
    [
      'target-new-(tab|window)',
      ({ 1: $1 }) => css`
        target-name: new;
        target-new: ${$1};
      `,
    ],

    // Style rule
    // `box?color=coral` -> `.box\\?color\\=coral{background-color:coral}`
    // `box?rounded` -> `.box\\?rounded{border-radius:0.25rem}`
    // `box?color=coral&rounded` -> `.box\\?color\\=coral\\&rounded{background-color:coral;border-radius:0.25rem}`
    // `box?color=purple&rounded=md` -> `.box\\?color\\=purple\\&rounded\\=md{background-color:purple;border-radius:0.375rem}`
    [
      'box\\?(.+)',
      style({
        props: {
          color: {
            coral: css({
              backgroundColor: 'coral',
            }),
            purple: css`
              background-color: purple;
            `,
          },
          rounded: {
            '': 'rounded',
            md: 'rounded-md',
          },
        },
      }),
    ],
  ],
})
```

</details>

The `rules` option is an array of rule declarations. A rule declaration consist of pattern and an resolver. When twind encounters a class name that matches the pattern it will call the resolver function with the match and the current context. The order of the rules is important for cases where several rules match — first matching with a result wins.

The pattern is a regular expression or a regular expression like string that is used to match the utility name. If a string is used it will be converted to a regular expression using `new RegExp(string)`. Therefore special regular expression characters like `.` or `?` need to be escaped. There are some additional rules for the string to regular expression conversion:

- the string will always treated as a _starts with_ eg prefixing it with `^`
- if it contains `$` or ends with a `-` the remaining string will be available in the match object as `$$`
- if it does not contains `$` or end with a `-` it will be treated as a _ends with_ eg suffixing it with `$`

For example:

- `underline` -> `/^underline$/` matching `underline`
- `text-` -> `/^text-/` matching `text-<...>`
- `ring($|-)` -> `/^ring($|-)/` matching `ring` and `ring-<...>`

> **Note**
> The API for defining rules is heavily inspired by [unocss](https://github.com/unocss/unocss).

Twind ensures that the styles are in generated in a predictable order.

<details>
<summary><strong>More about Twinds implicit style ordering</strong></summary>

_Please note that the order in the generated CSS is in reverse because the last declaration wins._

- dark - Flag for dark mode rules.
- layer - similar to [the `@layer` CSS at-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
  - overrides: for utilities that should be applied last. used by `css` helper
  - utilities: for small, single-purpose classes - default layer for all rules
  - aliases: for shortcut and apply rules. used by `shortcut` and `apply` helpers
  - components: is for class-based styles that you want to be able to override with utilities. used by `style` helper
  - base: for things like reset rules or default styles applied to plain HTML elements. used by `injectGlobal` helper
  - defaults: for css properties defaults
- screens: a responsive variation of a rule - Flag for screen variants. They may not always have a `min-width` to be detected by _Responsive_ below.
- responsive: Based on extracted `min-width` value
- at-rules - Based on the count of special chars (`-:,`) within the at-rule.
- Pseudo and group variants - Ensures predictable order of pseudo classes.
- number of declarations - Allows single declaration styles to overwrite styles from multi declaration styles.
- greatest precedence of properties - Ensure shorthand properties are inserted before longhand properties; eg longhand override shorthand
- name comparison

</details>

## Static Property Rules

Static property rules are used to map a class name to a CSS property. The following example creates a `table-` utility that can be parametrized with `auto` or `fixed`.

```js
rules: [
  ['table-(auto|fixed)', 'tableLayout'],
],
```

The corresponding CSS declarations will be generated as follows:

```css
.table-auto {
  table-layout: auto;
}
.table-fixed {
  table-layout: fixed;
}
```

## Static Rules

Static rules are mapping a class name to an CSS declaration object.

```js
rules: [
  ['m-1', { margin: '0.25rem' }],
],
```

## Dynamic Rules

Dynamic Rules allow to generate CSS declarations based on the match. The following example creates a margin utility that can be parametrized with a number eg `m-0`, `m-1`, ...

```js
rules: [
  // using string pattern
  ['m-(\\d+)', (match) => ({ margin: `${match[1] / 4}rem` })],

  // using regular expression
  [/^m-(\d+)$/, (match) => ({ margin: `${match[1] / 4}rem` })],
],
```

The first argument of the resolver function is the match result. It provides several useful properties:

- `$_: string` — the input string
- `0: string` — the matched string
- `1: string` … `9: string` — the matched groups
- `$$: string` — the substring following the most recent match
- `dark: boolean` — `true` if the current context is dark mode

The second argument is the context. It provides several useful properties to help you write your rules. The most important ones is `theme` which is a function to access the current theme.

The resolver function can return:

- a CSS declaration object
- a falsy value to skip the rule and try other rules
- a string of class names eg a [Dynamic Alias Rule](#dynamic-alias-rules)

## Static Alias Rules

Alias rules are the simplest type of rules. They are used to create a shortcut for multiple utilities. The following example creates a `card` utility that is a shortcut for `py-2 px-4 font-semibold rounded-lg shadow-md`.

```js
rules: [
  ['card', 'py-2 px-4 font-semibold rounded-lg shadow-md'],
],
```

## Dynamic Alias Rules

Dynamic alias rules are similar to static alias rules but allow to use the matched value in the generated class names. This is useful when you want to generate a set of classes based on a given value. The following example creates a `card-` utility that can be parametrized with a color eg `card-blue`.

```js
rules: [
  ['card-', ({ $$ }) => `bg-${$$}-400 text-${$$}-100 py-2 px-4 rounded-lg`],
],
```

## Style Rules

Style rules are used to complex styles based on the `style` helper. They must have prefix and its parameters are passed as a query string. The following example creates a `box` utility that can be parametrized with a `color` eg `box?color=blue` and `rounded`.

```js
rules: [
  // `box?color=coral` -> `.box\\?color\\=coral{background-color:coral}`
  // `box?rounded` -> `.box\\?rounded{border-radius:0.25rem}`
  // `box?color=coral&rounded` -> `.box\\?color\\=coral\\&rounded{background-color:coral;border-radius:0.25rem}`
  // `box?color=purple&rounded=md` -> `.box\\?color\\=purple\\&rounded\\=md{background-color:purple;border-radius:0.375rem}`
  [
    'box\\?(.+)',
    style({
      props: {
        color: {
          coral: css({
            backgroundColor: 'coral',
          }),
          purple: css`
            background-color: purple;
          `,
        },
        rounded: {
          '': 'rounded',
          md: 'rounded-md',
        },
      },
    }),
  ],

  // label?prop=value&other=propValue
  // if the style does not require a property
  ['label(\\?.+)?', style(/* ... */)],

  // if the style requires at least one property
  ['label\\?(.+)', style(/* ... */)],
]
```

## Further Reading

There are some more options and helpers available to create rules. You can find more examples in the official presets:

- [@twind/preset-ext/src/rules.ts](https://github.com/tw-in-js/twind/blob/next/packages/preset-ext/src/rules.ts)
- [@twind/preset-line-clamp/src/rules.ts](https://github.com/tw-in-js/twind/blob/next/packages/preset-line-clamp/src/rules.ts)
- [@twind/preset-tailwind/src/rules.ts](https://github.com/tw-in-js/twind/blob/next/packages/preset-tailwind/src/rules.ts)
