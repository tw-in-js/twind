# Architecture Decision Record

Here is a high level overview of decisions that were made when designing the API and ultimately had an impact in shaping the implementation. Including but not limited to type information

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
  preflight?: boolean | Preflight
  mode?: Mode
  theme?: Partial<Theme> & {extends?: Partial<Theme>}
  hash?: boolean | Hasher
  plugins?: Record<string, string | CSSRules | Plugin>
  injector?: Injector
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

#### injector

> insert CSS rules into runtime
> **default**: based on enviroment

- dom
- collect - for testing in @tw-in-js/test
- ssr - move to @tw-in-js/server

```js
interface Injector {
  insert(rule: string, index: number): void
  delete(index: number): void
}
```

#### prefix

> CSS prefixing
> **default**: based on tiny-css-prefixer

- boolean
- function

```js
interface Prefixer {
  (property: string, value: string): string;
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

## Organization

Github & npm: `tw-in-js`

- @tw-in-js/core
- @tw-in-js/typography
- @tw-in-js/examples
- @tw-in-js/typescript-plugin

## Development

- typescript
- es2020 syntax, transpile with esbuild
- snowpack preview

## Tailwind Differences

- `group-*` variant works for **every** pseudo class
  This allows to use `group-focus-with` or `group-active`
- automatically infers negated values - they do _not_ need to be in the theme config
- `bg-gradient-to-*` is built-in, no need to configure these
- `text-underline`, `text-no-underline`, `text-line-through`, `text-uppercase`, `text-lowercase` and `text-capitalize`: this allows grouping of text directives like `text(lg red-500 capitalize underline)`
- `font-italic` and `font-no-italic`: this allows grouping of font directives like `font(sans italic bold)`
- `border` and `divide` allow to combine positions (`t`op, `r`righ, `l`eft, `b`ottom)

  - `tr` - `top` & `right`
  - `brl` - `bottom`, `right` and `left`

  > **Note** `x` and `y` can not be combined.

- `rotate`, `scale` , `skew` and `translate` provide a fallback for IE 11

  > `transform rotate-45` works but when using `transform rotate-45 scale-150` only one of both is applied.

### IE 11 compatibility

> Some new tailwind features use [CSS Variables (Custom Properties)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) and are therefore not compatible with [IE 11](https://caniuse.com/css-variables).

tw-in-js includes fallbacks for the following directives which mimic [Tailwind v1](https://v1.tailwindcss.com/) behavior:

- Color Opacity
  - [border-opacity-\*](https://tailwindcss.com/docs/border-opacity)
  - [bg-opacity-\*](https://tailwindcss.com/docs/background-opacity)
  - [text-opacity-\*](https://tailwindcss.com/docs/text-opacity)
  - [placeholder-opacity-\*](https://tailwindcss.com/docs/placeholder-opacity)
- Reversing Children Order
  - [divide-\*-reverse](https://tailwindcss.com/docs/divide-width#reversing-children-order)
  - [space-\*-reverse](https://tailwindcss.com/docs/space#reversing-children-order)
- `rotate`, `scale` , `skew` and `translate` can only be used alone

  > `rotate-45` works but when using `rotate-45 scale-150` only one of both is applied. In that case you must use `transform`: `transform rotate-45 scale-150`

Some directive only work with CSS Variables and are not supported in IE 11:

- [Ring](https://tailwindcss.com/docs/ring-width)
