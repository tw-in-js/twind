# Architecture Decision Record

Here is a high level overview of decisions that were made when designing the API and ultimately had an impact in shaping the implementation. Including but not limited to type information

<details><summary>Table Of Contents (Click To Expand)</summary>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Taxomony](#taxomony)
- [Architecture](#architecture)
- [API](#api)
  - [tw](#tw)
  - [setup](#setup)
- [Browser Support](#browser-support)
- [Phases](#phases)
  - [Parse](#parse)
  - [Translate](#translate)
  - [Decorate](#decorate)
  - [Serialize](#serialize)
- [Selector Ordering](#selector-ordering)
  - [Inject](#inject)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Taxomony

- `token`: things that can be passed to `tw` (string, array, object, falsey values)
- `rules`: `rule`, `group`
- `rule`: `variants`, `directive`, `inline-directive`
- `directive`: `negate`, `plugin`, `params`
- `negate`: should a theme value be negated
- `plugin`: `utility`, `component`
- `params`: parameters for plugins; usually the key in the theme

## Architecture

**Phases** (details below)

0. **setup** override and extend the theme available to the compiler
1. **parse** rules as a string, array, object or variadic arguments
2. **translate** each rule into css objects using plugins
3. **decorate** recursively applying variant rules to the css objects
4. **serialize** convert css objects into css declarations with precedence and hash
5. **inject** css rules into the DOM and maintain a record of injected rules

Feature evaluation based on:

- Size limit
- Performance budget

## API

```js
type Falsy = '' | 0 | -0 | false | null | undefined

interface TokenGrouping extends Record<string, Token> {}

interface InlineDirective {
  (context: Context): CSSRules | string | Falsy
}

type Token = string | InlineDirective | TokenGrouping | Token[] | Falsy

interface Context {
  /** allow composition */
  tw: TW

  /** access to theme values */
  theme(section: string): ThemeSection
  theme(section: string, key: string | string[]): string | undefined
  theme(section: string, key: string | string[], defaultValue: string): string

  /** create unique identifier (group, custom properties) */
  tag(key: string): string
}
```

### tw

> Converts rules into CSS class names and injects them into the DOM

- exposed as named export
- supports
  - tagged template where replacements can be interpolations can be strings, array, objects, functions, falsey
  - variadic strings, array, objects, functions, falsey

```js
interface TW {
  (strings: string[], ...replacements: Token[]): string
  (...rules: Token[]): string
}
```

### setup

> Customize the theme which defines the behavior of the compiler

- default to dev settings
  - with example for recommended prod settings
- setup can be called only once
  - warn setup called after tw

```js
interface Setup {
  preflight?: boolean | Preflight | CSSRules
  mode?: Mode | 'strict' | 'warn' | 'silent'
  theme?: Partial<Theme> & {extends?: Partial<Theme>}
  hash?: boolean | Hasher
  plugins?: Record<string, string | CSSRules | Plugin>
  sheet?: Sheet
  prefix?: boolean | Prefix
}
```

#### preflight

> Add global styles before first rule is injected

- defaults to tailwind preflight
- boolean `false` to disable
- function to use a different reset

```js
interface Preflight {
  (preflight: CSSRules, context: Context): CSSRules | undefined;
}
```

#### mode

> customize error logging behavior

- **warn** error messages get logged to the console
- **strict** errors throw and cause the program to crash
- **play** errors fall through are not reported

```js
interface Mode {
  /**
   * Notify error (missing plugin, duplicate directives? )
   *
   * Why id?
   * - can generate an url with more info
   * - reduce bundle size by omitting large error messages
   */
  report(info: {id: string}, context: Context): void

  /** Called for unknown theme values */
  unknown(
    section: string,
    key: string,
    optional: boolean,
    context: Context,
  ): string | undefined
}
```

#### hash

> **default**: `false`

- boolean

#### theme

> **default**: tailwind

- A tailwind compatible theme object that overwrites or extends the default

#### plugins

> **default**: core plugins

Plugins are searched for by name using the longest prefix before a dash (`"-"'`). The name and the remaining parts (splitted by a dash) are provided as first argument to the plugin function. For example if the directive is `bg-gradient-to-t` the following order applies:

| Plugin             | Params                    |
| ------------------ | ------------------------- |
| `bg-gradient-to-t` | `[]`                      |
| `bg-gradient-to`   | `["t"]`                   |
| `bg-gradient`      | `["to", "t"]`             |
| `bg`               | `["gradient", "to", "t"]` |

**Arguments**

1. params
2. context
3. id

**Return Types**

- CSSRules: css rules to inject (must use `&` for nested selectors)
- string: class name to use
  - `group` and `lead` return a marker class name that should be used as is
- falsy: no result -> `mode.unknown()` then `mode.report()`

```js
interface Plugin {
  /**
   * Creates CSSRules based on `parts`
   */
  (params: string[], context: Context, id: string): CSSRules | string | Falsy;
}
```

**Examples**

```js
const plugins = {
  block: { display: 'block' },

  placeholder: (params, { theme }) => {
    const value = theme('placeholderColor', params)

    return (
      value && {
        '&::placholder': {
          color: value,
        },
      }
    )
  },

  rotate: (params, { theme }) => {
    const value = theme('rotate', tail(params))

    return (
      value && {
        '--tw-rotate': value,
        transform: [
          `rotate(${value})`,
          `translateX(var(--tw-translate-x),0)) translateY(var(--tw-translate-y),0) rotate(var(--tw-rotate,0))`,
        ],
      }
    )
  },

  /** use tag to create marker class */
  group: (params, { tag }) => tag('group'),

  /** use tw to compose */
  card: (params, { tw }) => tw`max-w-md mx-auto bg-white`,
}
```

#### sheet

> insert CSS rules into runtime
> **default**: based on environment

```js
interface Sheet {
  insert(rule: string, index: number): void;
}
```

#### prefix

> CSS prefixing
> **default**: based on [style-vendorizer](https://github.com/kripod/style-vendorizer)

- boolean
- function

```js
interface Prefixer {
  (property: string, value: string, important?: boolean): string;
}
```

## Browser Support

- IE11: section how to make it work
- document used modern APIs which need to be polyfilled
  - Math.imul
- reset as extra package
- fallbacks included with deprection notice

## Phases

### Parse

> parse tokens in rules

```js
interface Parse {
  (strings: string[], replacements: Token[]): Rule[]
  (...rules: Token[]): Rule[]
}

type Token = string | Falsy | Record<string, Token> | Token[]

interface Rule {
  /** ["sm", "dark", "hover"] */
  variants: string[]

  /** "text-sm", "-rotate-45" */
  directive: string
}
```

```ebnf
character = letter | digit;
identifier = character, { character };
whitespace = ' ' | '\t' | [ '\r' ], '\n';

(*
- "h-full bg-purple-500 rotate-3 scale-95"
- "w(1/2 sm:1/3 lg:1/6) p-2"
- "divide(y-2 blue-500 opacity(75 md:50))"
- "ring(& ping-700 offset(4 ping-200))"
- "rotate(-3 hover:6 md:(3 hover:-6))"
*)
rules =
    { whitespace },
    group | rule,
    { { whitespace }-, group | rule },
    { whitespace } ;

group = variantGroup | directiveGroup;

variantGroup =
    { variant, ":" }-,
    '(',
        { rules }-,
    ')';

directiveGroup =
    { variant, ":" },
    plugin,
    '(',
        { "&" | rules }-,
    ')';

rule = { variant, ":" }, directive;

variant = identifier;

directive = [ "-" ], plugin, { "-", params };

plugin = identifier, { "-", identifier };

params = param, { "-", param };

param = identifier | "_" | "/" | ".";
```

### Translate

> translate rules into CSSRules using plugins

- no on-colors - maybe as plugin

**Why CSSRules?**

- can be typed with [csstype](https://www.npmjs.com/package/csstype)
- allow to implement advanced directives like `container`, `placeholder`, `divide`, `prose`, ...
- allows to add global default custom properties - this may lead to allow automatic integration tests comparing our result with the ones from tailwind

```js
interface Translate {
  (rule: Rule, context: Context): CSSRules
}

import * as CSS from 'csstype'

interface CSSProperties extends CSS.PropertiesFallback, CSS.PropertiesHyphenFallback {}

interface CSSRules extends CSSProperties {
  /** @media, @supports, @keyframes, ... */
  [`@${string}`]: CSSRules

  /** pseudo class
   * maybe -> could be implement using '&:'
   * watch out for ':root' -> that could use '*' instead
   */
  [`:${string}`]: CSSRules

  /** maybe allow '&' everywhere */
  [`${string}&${string}`]: CSSRules

  /** global defaults */
  '*': CSSProperties
}
```

### Decorate

> add variant rules to the css object (basicly wrapping it again and again)

### Serialize

> convert css object into css declarations with precedence and hash

## Selector Ordering

> This section describes the internal ordering of the generated CSS rules.

Twind creates, except for a few exceptions, one CSS rule with a single class as selector per directive. This means they have all the same specificity.

> If two declarations have the same weight, origin, and specificity, the latter specified wins.

Some directives depend on each other. For example the [`via-<color>`](https://tailwindcss.com/docs/gradient-color-stops#middle-color) must be declared after the [`from-<color>`](https://tailwindcss.com/docs/gradient-color-stops#from-color) directive. As a result twind has to ensure that all CSS rules are in a specific order.

The following rules apply to deterministically sort the injected CSS rules:

- media queries are sorted in a mobile first manner using the `min-width` value
- dark mode rules
- other at-rules - based on `-:;,#(` counting
- pseudo classes and variants are sorted in the following order: `first`, `last`, `odd`, `even`, `link`, `visited`, `empty`, `checked`, `group-hover`, `group-focus`, `focus-within`, `hover`, `focus`, `focus-visible`, `active`, `disabled`, others - meaning that `active` overrides `focus` and `hover` for example (see [When do the :hover, :focus, and :active pseudo-classes apply?](https://bitsofco.de/when-do-the-hover-focus-and-active-pseudo-classes-apply/#orderofstyleshoverthenfocusthenactive)
- greatest precedence of properties (ignoring vendor prefixed and custom properties) based on `-` counting - shorthand properties are inserted first eg longhand properties override shorthands.
- number of declarations (descending) - this allows single declaration styles to overwrite styles from multi declaration styles

### Inject

> insert CSSRules into the enviroment returning a string with class names

- not atomic
- position based on precedence
- hash class names and CSS custom properties

```js
interface Inject {
  /** we need the parsed rule for class name generation and precedence calculation */
  (css: CSSRules, rule: Rule | undefined, context: Context): string;
}
```
