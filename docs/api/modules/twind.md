# Module: twind

[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev/docs/modules/twind.html)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc?icon=github&label)](https://github.com/tw-in-js/twind/tree/main/src)
[![Module Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/twind/twind.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/twind.js 'brotli module size')
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/twind.d.ts)

## `tw` function

It is possible to invoke the `tw` function in a multitude of different ways. It can take any number of arguments, each of which can be an Object, Array, Boolean, Number, String or Template Literal. This ability is inspired heavily by the [clsx](https://npmjs.com/clsx) library by [Luke Edwards](https://github.com/lukeed).

```js
// Template literals
tw`bg-gray-200 rounded`
//=> bg-gray-200 rounded
tw`bg-gray-200 ${false && 'rounded'}`
//=> bg-gray-200

// Strings
tw('bg-gray-200', true && 'rounded', 'underline')
//=> bg-gray-200 rounded underline

// Object syntax
tw({ 'bg-gray-200': true, rounded: false, underline: isTrue() })
//=> bg-gray-200 underline
tw({ 'bg-gray-200': true }, { rounded: false }, null, { underline: true })
//=> bg-gray-200 underline
tw({ hover: ['bg-red-500', 'p-3'] }, 'm-1')
// => hover:bg-red-500 hover:p-3 m-1

// Arrays
tw(['bg-gray-200', 0, false, 'rounded'])
//=> bg-gray-200 rounded
tw(['bg-gray-200'], ['', 0, false, 'rounded'], [['underline']])
//=> bg-gray-200 rounded underline

// Variadic
tw('bg-gray-200', [
  1 && 'rounded',
  { underline: false, 'text-black': null },
  ['text-lg', ['shadow-lg']],
])
//=> bg-gray-200 rounded text-lg shadow-lg
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

> 💡 See {@page Styling with Twind} and {@page Thinking in Groups} for more syntax examples.

### Inline Plugins

Sometimes developers might want to break out of the defined Tailwind grammar and insert arbitrary CSS rules. Although this slightly defeats the purpose of using Tailwind and is not actively encouraged, we realize that is often necessary and so have provided an escape hatch for developers.

```js
tw`
  text-sm
  ${() => ({ '&::after': { content: '"🌈"' } })}
`
```

In the above example a class is generate for an `::after` pseudo element. Something that isn't possible within the confides of the Tailwind API nor possible to denote using a style attribute on an element.

> 💡 The above example is for exploratory purposes. Consider using [twind/css](twind_css.md) for optimal performance.
>
> ```js
> tw`
>   text-sm
>   ${css({
>     '&::after': { content: '"😊"' },
>   })}
> `
> ```

For a further explanation on this mechanism see [Plugins](https://twind.dev/docs/handbook/advanced/plugins.html#inline-plugins).

## `apply` function

As a component author, one often wants to re-use Tailwind directive styles for defining a component and allow users of the component to override styles using Tailwind rules. The created component can be used as a base for child components and override or add some styles using Tailwind rules.

[apply](twind.md#apply) generates one style object, e.g., one CSS class, combining all Tailwind rules by deep merging rules in order of declaration.

> 💡 `apply` accepts the same arguments as [tw](#tw-function).

```js
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

<details><summary>Using <code>apply</code> within <code>preflight</code></summary>

Use Tailwind rules within <code>[setup](twind.md#setup)({ [preflight](../interfaces/twind.configuration.md#preflight) })</code>.

```js
setup({
  preflight: {
    body: apply('bg-gray-900 text-white'),
  },
})
```

</details>

<details><summary><code>CSS</code> can be used within <code>apply</code></summary>

[twind/css](twind_css.md) can be used to define additional styles.

```js
const btn = apply`
  py-2 px-4
  ${css({
    borderColor: 'black',
  })}
`
```

</details>

<details><summary>Using within <code>CSS</code></summary>

`apply` can be used with `css`:

```js
const prose = css(
  apply`text-gray-700 dark:text-gray-300`,
  {
    p: apply`my-5`,
    h1: apply`text-black dark:text-white`,
  },
  {
    h1: {
      fontWeight: '800',
      fontSize: '2.25em',
      marginTop: '0',
      marginBottom: '0.8888889em',
      lineHeight: '1.1111111',
    },
  },
)
```

Using template literal syntax:

```js
const prose = css`
  ${apply`text-gray-700 dark:text-gray-300`}

  p {
    ${apply`my-5`}
  }

  h1 {
    ${apply`text-black dark:text-white`}
    font-weight: 800;
    font-size: 2.25em;
    margin-top: 0;
    margin-bottom: 0.8888889em;
    line-height: 1.1111111;
  }
`
```

</details>

<details><summary>Using Tailwind directives with <code>animation</code> from <code>twind/css</code></summary>

```js
const motion = animation('.6s ease-in-out infinite', {
  '0%': apply`scale-100`,
  '50%': apply`scale-125 rotate-45`,
  '100%': apply`scale-100 rotate-0`,
})

const bounce = animation(
  '1s ease infinite',
  keyframes`
  from, 20%, 53%, 80%, to {
    ${apply`transform-gpu translate-x-0`}
  }
  40%, 43% {
    ${apply`transform-gpu -translate-x-7`}
  }
  70% {
    ${apply`transform-gpu -translate-x-3.5`}
  },
  90% {
    ${apply`transform-gpu -translate-x-1`}
  }
`,
)
```

</details>

<details><summary>A React button component</summary>

```js
import { tw } from 'twind'

const variantMap = {
  success: 'green',
  primary: 'blue',
  warning: 'yellow',
  info: 'gray',
  danger: 'red',
}

const sizeMap = {
  sm: apply`text-xs py(2 md:1) px-2`,
  md: apply`text-sm py(3 md:2) px-2`,
  lg: apply`text-lg py-2 px-4`,
  xl: apply`text-xl py-3 px-6`,
}

const baseStyles = apply`
  w(full md:auto)
  text(sm white uppercase)
  px-4
  border-none
  transition-colors
  duration-300
`

function Button({
  size = 'md',
  variant = 'primary',
  round = false,
  disabled = false,
  className,
  children,
}) {
  // Collect all styles into one class
  const instanceStyles = apply`
    ${baseStyles}
    bg-${variantMap[variant]}(600 700(hover:& focus:&)))
    ${sizeMap[size]}
    rounded-${round ? 'full' : 'lg'}
    ${disabled && 'bg-gray-400 text-gray-100 cursor-not-allowed'}
  `

  // Allow passed classNames to override instance styles
  return <button className={tw(instanceStyles, className)}>{children}</button>
}

render(
  <Button variant="info" className="text-lg rounded-md">
    Click me
  </Button>,
)
```

</details>

> 💡 The {@page Defining Components} guide explains how `apply` can be used.

## `setup` function

Understandably developers will more often than not want to customize the out of the box experience. It is possible to achieve this with the [setup](twind.md#setup) function. Doing so will ultimately change the behavior of calling the `tw` function, making it appropriate for your particular use case.

> 💡 To use `tw` you **do not** need to call `setup`.

```js
import { setup, strict, voidSheet } from 'twind'

setup({
  preflight: false, // do not include base style reset (default: use tailwind preflight)
  mode: strict, // throw errors for invalid rules (default: warn)
  hash: true, // hash all generated class names (default: false)
  theme: {}, // define custom theme values (default: tailwind theme)
  darkMode: 'class', // use a different dark mode strategy (default: 'media')
  sheet: voidSheet, // use custom sheet (default: cssomSheet in a browser or no-op)
})
```

The setup function is a named export of the Twind and accepts an config object as an argument.

See [the configuration guide](/handbook/configuration) for more information.

## Table of contents

### Interfaces

- [Apply](../interfaces/twind.apply.md)
- [CSSCustomProperties](../interfaces/twind.csscustomproperties.md)
- [CSSProperties](../interfaces/twind.cssproperties.md)
- [CSSPseudos](../interfaces/twind.csspseudos.md)
- [CSSRules](../interfaces/twind.cssrules.md)
- [CSSRulesThunk](../interfaces/twind.cssrulesthunk.md)
- [Configuration](../interfaces/twind.configuration.md)
- [Context](../interfaces/twind.context.md)
- [Directive](../interfaces/twind.directive.md)
- [DirectiveHandler](../interfaces/twind.directivehandler.md)
- [InlineDirective](../interfaces/twind.inlinedirective.md)
- [Instance](../interfaces/twind.instance.md)
- [Mode](../interfaces/twind.mode.md)
- [Preflight](../interfaces/twind.preflight.md)
- [Rule](../interfaces/twind.rule.md)
- [Sheet](../interfaces/twind.sheet.md)
- [SheetConfig](../interfaces/twind.sheetconfig.md)
- [SheetInit](../interfaces/twind.sheetinit.md)
- [TW](../interfaces/twind.tw.md)
- [TWCallable](../interfaces/twind.twcallable.md)
- [Theme](../interfaces/twind.theme.md)
- [ThemeColorObject](../interfaces/twind.themecolorobject.md)
- [ThemeConfiguration](../interfaces/twind.themeconfiguration.md)
- [ThemeContainer](../interfaces/twind.themecontainer.md)
- [ThemeHelper](../interfaces/twind.themehelper.md)
- [ThemeResolver](../interfaces/twind.themeresolver.md)
- [ThemeSectionResolverContext](../interfaces/twind.themesectionresolvercontext.md)
- [TokenGrouping](../interfaces/twind.tokengrouping.md)

## Type aliases

### CSSAtKeyframes

Ƭ **CSSAtKeyframes**: *Record*<string, [*CSSProperties*](../interfaces/twind.cssproperties.md) \| (`context`: [*Context*](../interfaces/twind.context.md)) => [*CSSProperties*](../interfaces/twind.cssproperties.md)\>

Defined in: [src/types/twind.ts:219](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L219)

___

### CSSAtMedia

Ƭ **CSSAtMedia**: *Record*<string, [*CSSRules*](../interfaces/twind.cssrules.md)\>

Defined in: [src/types/twind.ts:217](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L217)

___

### CSSAtSupports

Ƭ **CSSAtSupports**: *Record*<string, [*CSSRules*](../interfaces/twind.cssrules.md)\>

Defined in: [src/types/twind.ts:218](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L218)

___

### CSSSimplePseudos

Ƭ **CSSSimplePseudos**: { [K in CSS.SimplePseudos as \`&${string & K}\`]?: CSSRules}

Pseudo class
watch out for ':root' - that could use '*' instead

Defined in: [src/types/twind.ts:210](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L210)

___

### DarkMode

Ƭ **DarkMode**: *media* \| *class* \| *false*

Defined in: [src/types/twind.ts:79](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L79)

___

### Falsy

Ƭ **Falsy**: ** \| *0* \| *0* \| *false* \| *null* \| *undefined* \| *void*

Defined in: [src/types/util.ts:1](https://github.com/gojutin/twind/blob/8f04bb3/src/types/util.ts#L1)

___

### Hasher

Ƭ **Hasher**: (`value`: *string*) => *string*

#### Type declaration:

▸ (`value`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *string* |

**Returns:** *string*

Defined in: [src/types/twind.ts:77](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L77)

___

### MaybeArray

Ƭ **MaybeArray**<T\>: T \| readonly T[]

#### Type parameters:

Name |
:------ |
`T` |

Defined in: [src/types/util.ts:3](https://github.com/gojutin/twind/blob/8f04bb3/src/types/util.ts#L3)

___

### MaybeThunk

Ƭ **MaybeThunk**<T\>: T \| (`context`: [*Context*](../interfaces/twind.context.md)) => T

#### Type parameters:

Name |
:------ |
`T` |

Defined in: [src/types/twind.ts:36](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L36)

___

### Plugin

Ƭ **Plugin**: *string* \| [*CSSRules*](../interfaces/twind.cssrules.md) \| [*DirectiveHandler*](../interfaces/twind.directivehandler.md)

Defined in: [src/types/twind.ts:146](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L146)

___

### Plugins

Ƭ **Plugins**: *Record*<string, [*Plugin*](twind.md#plugin) \| undefined\>

Defined in: [src/types/twind.ts:148](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L148)

___

### Prefixer

Ƭ **Prefixer**: (`property`: *string*, `value`: *string*, `important?`: *boolean*) => *string*

#### Type declaration:

▸ (`property`: *string*, `value`: *string*, `important?`: *boolean*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`property` | *string* |
`value` | *string* |
`important?` | *boolean* |

**Returns:** *string*

Defined in: [src/types/twind.ts:75](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L75)

___

### ReportInfo

Ƭ **ReportInfo**: { `id`: *LATE_SETUP_CALL*  } \| { `id`: *UNKNOWN_DIRECTIVE* ; `rule`: *string*  } \| { `id`: *UNKNOWN_THEME_VALUE* ; `key`: *string* \| *undefined*  } \| { `css`: *string* ; `error`: Error ; `id`: *INJECT_CSS_ERROR*  }

Defined in: [src/types/twind.ts:121](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L121)

___

### SheetInitCallback

Ƭ **SheetInitCallback**<T\>: (`value?`: T) => T

#### Type parameters:

Name | Default |
:------ | :------ |
`T` | *unknown* |

#### Type declaration:

▸ (`value?`: T): T

#### Parameters:

Name | Type |
:------ | :------ |
`value?` | T |

**Returns:** T

Defined in: [src/types/twind.ts:66](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L66)

___

### ThemeColor

Ƭ **ThemeColor**: *string* \| [*ThemeColorObject*](../interfaces/twind.themecolorobject.md)

Defined in: [src/types/theme.ts:100](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L100)

___

### ThemeFontSize

Ƭ **ThemeFontSize**: *string* \| [size: string, lineHeight: string] \| [size: string, options: object]

Defined in: [src/types/theme.ts:102](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L102)

___

### ThemeOutline

Ƭ **ThemeOutline**: [outline: string, offset: string]

Defined in: [src/types/theme.ts:107](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L107)

___

### ThemeScreen

Ƭ **ThemeScreen**: [*MaybeArray*](twind.md#maybearray)<[*ThemeScreenValue*](twind.md#themescreenvalue)\>

Defined in: [src/types/theme.ts:93](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L93)

___

### ThemeScreenValue

Ƭ **ThemeScreenValue**: *string* \| { `raw`: *string*  } \| { `max?`: *string* ; `min`: *string*  } \| { `max`: *string* ; `min?`: *string*  }

Defined in: [src/types/theme.ts:87](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L87)

___

### ThemeSection

Ƭ **ThemeSection**<T\>: [*ThemeSectionRecord*](twind.md#themesectionrecord)<T\> \| [*ThemeSectionResolver*](twind.md#themesectionresolver)<T\>

#### Type parameters:

Name | Default |
:------ | :------ |
`T` | *string* |

Defined in: [src/types/theme.ts:79](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L79)

___

### ThemeSectionRecord

Ƭ **ThemeSectionRecord**<T\>: *Record*<string, T \| undefined\>

#### Type parameters:

Name | Default |
:------ | :------ |
`T` | *string* |

Defined in: [src/types/theme.ts:72](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L72)

___

### ThemeSectionResolver

Ƭ **ThemeSectionResolver**<T\>: (`theme`: [*ThemeResolver*](../interfaces/twind.themeresolver.md), `context`: [*ThemeSectionResolverContext*](../interfaces/twind.themesectionresolvercontext.md)) => [*ThemeSectionRecord*](twind.md#themesectionrecord)<T\>

#### Type parameters:

Name | Default |
:------ | :------ |
`T` | *string* |

#### Type declaration:

▸ (`theme`: [*ThemeResolver*](../interfaces/twind.themeresolver.md), `context`: [*ThemeSectionResolverContext*](../interfaces/twind.themesectionresolvercontext.md)): [*ThemeSectionRecord*](twind.md#themesectionrecord)<T\>

#### Parameters:

Name | Type |
:------ | :------ |
`theme` | [*ThemeResolver*](../interfaces/twind.themeresolver.md) |
`context` | [*ThemeSectionResolverContext*](../interfaces/twind.themesectionresolvercontext.md) |

**Returns:** [*ThemeSectionRecord*](twind.md#themesectionrecord)<T\>

Defined in: [src/types/theme.ts:74](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L74)

___

### ThemeSectionType

Ƭ **ThemeSectionType**<T\>: T *extends* [*ThemeSection*](twind.md#themesection)<*infer* R\> ? [*Unwrap*](twind.md#unwrap)<R\> : *Exclude*<T, [*ThemeSectionResolver*](twind.md#themesectionresolver)<T\>\>

#### Type parameters:

Name |
:------ |
`T` |

Defined in: [src/types/theme.ts:55](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L55)

___

### Token

Ƭ **Token**: *string* \| [*TokenGrouping*](../interfaces/twind.tokengrouping.md) \| [*InlineDirective*](../interfaces/twind.inlinedirective.md) \| [*Token*](twind.md#token)[] \| [*Falsy*](twind.md#falsy) \| [*TypescriptCompat*](twind.md#typescriptcompat)

Defined in: [src/types/twind.ts:203](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L203)

___

### TypescriptCompat

Ƭ **TypescriptCompat**: *boolean* \| *number*

Defined in: [src/types/twind.ts:201](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L201)

___

### Unwrap

Ƭ **Unwrap**<T\>: T *extends* *string*[] ? *string* : T *extends* *Record*<string, *infer* R\> ? R : T

#### Type parameters:

Name |
:------ |
`T` |

Defined in: [src/types/theme.ts:53](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L53)

## Variables

### silent

• `Const` **silent**: [*Mode*](../interfaces/twind.mode.md)

Defined in: [src/twind/modes.ts:39](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/modes.ts#L39)

___

### strict

• `Const` **strict**: [*Mode*](../interfaces/twind.mode.md)

Defined in: [src/twind/modes.ts:35](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/modes.ts#L35)

___

### tw

• **tw**: [*TW*](../interfaces/twind.tw.md)

___

### warn

• `Const` **warn**: [*Mode*](../interfaces/twind.mode.md)

Defined in: [src/twind/modes.ts:33](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/modes.ts#L33)

## Functions

### apply

▸ `Const`**apply**(`strings`: *TemplateStringsArray*, ...`interpolations`: [*Token*](twind.md#token)[]): [*Directive*](../interfaces/twind.directive.md)<[*CSSRules*](../interfaces/twind.cssrules.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`strings` | *TemplateStringsArray* |
`...interpolations` | [*Token*](twind.md#token)[] |

**Returns:** [*Directive*](../interfaces/twind.directive.md)<[*CSSRules*](../interfaces/twind.cssrules.md)\>

Defined in: [src/twind/apply.ts:14](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/apply.ts#L14)

▸ `Const`**apply**(...`tokens`: [*Token*](twind.md#token)[]): [*Directive*](../interfaces/twind.directive.md)<[*CSSRules*](../interfaces/twind.cssrules.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`...tokens` | [*Token*](twind.md#token)[] |

**Returns:** [*Directive*](../interfaces/twind.directive.md)<[*CSSRules*](../interfaces/twind.cssrules.md)\>

Defined in: [src/twind/apply.ts:14](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/apply.ts#L14)

___

### autoprefix

▸ `Const`**autoprefix**(`property`: *string*, `value`: *string*, `important?`: *boolean*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`property` | *string* |
`value` | *string* |
`important?` | *boolean* |

**Returns:** *string*

Defined in: [src/twind/prefix.ts:8](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/prefix.ts#L8)

___

### create

▸ `Const`**create**(`config?`: [*Configuration*](../interfaces/twind.configuration.md)): [*Instance*](../interfaces/twind.instance.md)

#### Parameters:

Name | Type |
:------ | :------ |
`config?` | [*Configuration*](../interfaces/twind.configuration.md) |

**Returns:** [*Instance*](../interfaces/twind.instance.md)

Defined in: [src/twind/instance.ts:5](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/instance.ts#L5)

___

### cssomSheet

▸ `Const`**cssomSheet**(`options?`: [*SheetConfig*](../interfaces/twind.sheetconfig.md)<CSSStyleSheet\>): [*Sheet*](../interfaces/twind.sheet.md)<CSSStyleSheet\>

Creates an sheet which inserts style rules through the CSS Object Model.

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*SheetConfig*](../interfaces/twind.sheetconfig.md)<CSSStyleSheet\> |

**Returns:** [*Sheet*](../interfaces/twind.sheet.md)<CSSStyleSheet\>

Defined in: [src/twind/sheets.ts:10](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/sheets.ts#L10)

___

### directive

▸ `Const`**directive**<Data, T\>(`factory`: (`data`: Data, `context`: [*Context*](../interfaces/twind.context.md)) => [*MaybeThunk*](twind.md#maybethunk)<T\>, `data`: Data): [*Directive*](../interfaces/twind.directive.md)<T\>

Returns an optimized and cached function for use with `tw`.

`tw` caches rules based on the function identity. This helper caches
the function based on the data.

#### Type parameters:

Name |
:------ |
`Data` |
`T` |

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`factory` | (`data`: Data, `context`: [*Context*](../interfaces/twind.context.md)) => [*MaybeThunk*](twind.md#maybethunk)<T\> | to use when the directive is invoked   |
`data` | Data | to use    |

**Returns:** [*Directive*](../interfaces/twind.directive.md)<T\>

Defined in: [src/twind/directive.ts:38](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/directive.ts#L38)

___

### hash

▸ `Const`**hash**(`value`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *string* |

**Returns:** *string*

Defined in: [src/internal/util.ts:117](https://github.com/gojutin/twind/blob/8f04bb3/src/internal/util.ts#L117)

___

### mode

▸ `Const`**mode**(`report`: (`message`: *string*) => *void*): [*Mode*](../interfaces/twind.mode.md)

#### Parameters:

Name | Type |
:------ | :------ |
`report` | (`message`: *string*) => *void* |

**Returns:** [*Mode*](../interfaces/twind.mode.md)

Defined in: [src/twind/modes.ts:5](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/modes.ts#L5)

___

### noprefix

▸ `Const`**noprefix**(`property`: *string*, `value`: *string*, `important?`: *boolean*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`property` | *string* |
`value` | *string* |
`important?` | *boolean* |

**Returns:** *string*

Defined in: [src/twind/prefix.ts:5](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/prefix.ts#L5)

___

### setup

▸ **setup**(`options?`: [*Configuration*](../interfaces/twind.configuration.md)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`options?` | [*Configuration*](../interfaces/twind.configuration.md) |

**Returns:** *void*

Defined in: [src/types/twind.ts:33](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L33)

___

### theme

▸ `Const`**theme**<Section\>(`section`: Section): (`context`: [*Context*](../interfaces/twind.context.md)) => *Record*<string, [*ThemeSectionType*](twind.md#themesectiontype)<[*Theme*](../interfaces/twind.theme.md)[Section]\>\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Section` | *colors* \| *spacing* \| *durations* \| *screens* \| *animation* \| *backgroundColor* \| *backgroundImage* \| *backgroundOpacity* \| *borderColor* \| *borderOpacity* \| *borderRadius* \| *borderWidth* \| *boxShadow* \| *container* \| *divideColor* \| *divideOpacity* \| *divideWidth* \| *fill* \| *flex* \| *fontFamily* \| *fontSize* \| *fontWeight* \| *gap* \| *gradientColorStops* \| *height* \| *inset* \| *keyframes* \| *letterSpacing* \| *lineHeight* \| *margin* \| *maxHeight* \| *maxWidth* \| *minHeight* \| *minWidth* \| *opacity* \| *order* \| *outline* \| *padding* \| *placeholderColor* \| *placeholderOpacity* \| *ringColor* \| *ringOffsetColor* \| *ringOffsetWidth* \| *ringOpacity* \| *ringWidth* \| *rotate* \| *scale* \| *skew* \| *space* \| *stroke* \| *strokeWidth* \| *textColor* \| *textOpacity* \| *transitionDelay* \| *transitionDuration* \| *transitionProperty* \| *transitionTimingFunction* \| *translate* \| *width* \| *zIndex* |

#### Parameters:

Name | Type |
:------ | :------ |
`section` | Section |

**Returns:** *function*

Defined in: [src/twind/theme.ts:91](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/theme.ts#L91)

▸ `Const`**theme**<Section\>(`keypath`: \`${Section}.${string}\`): (`context`: [*Context*](../interfaces/twind.context.md)) => *undefined* \| [*ThemeSectionType*](twind.md#themesectiontype)<[*Theme*](../interfaces/twind.theme.md)[Section]\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Section` | *colors* \| *spacing* \| *durations* \| *screens* \| *animation* \| *backgroundColor* \| *backgroundImage* \| *backgroundOpacity* \| *borderColor* \| *borderOpacity* \| *borderRadius* \| *borderWidth* \| *boxShadow* \| *container* \| *divideColor* \| *divideOpacity* \| *divideWidth* \| *fill* \| *flex* \| *fontFamily* \| *fontSize* \| *fontWeight* \| *gap* \| *gradientColorStops* \| *height* \| *inset* \| *keyframes* \| *letterSpacing* \| *lineHeight* \| *margin* \| *maxHeight* \| *maxWidth* \| *minHeight* \| *minWidth* \| *opacity* \| *order* \| *outline* \| *padding* \| *placeholderColor* \| *placeholderOpacity* \| *ringColor* \| *ringOffsetColor* \| *ringOffsetWidth* \| *ringOpacity* \| *ringWidth* \| *rotate* \| *scale* \| *skew* \| *space* \| *stroke* \| *strokeWidth* \| *textColor* \| *textOpacity* \| *transitionDelay* \| *transitionDuration* \| *transitionProperty* \| *transitionTimingFunction* \| *translate* \| *width* \| *zIndex* |

#### Parameters:

Name | Type |
:------ | :------ |
`keypath` | \`${Section}.${string}\` |

**Returns:** *function*

Defined in: [src/twind/theme.ts:91](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/theme.ts#L91)

▸ `Const`**theme**<Section\>(`keypath`: \`${Section}.${string}\`, `defaultValue`: *NonNullable*<[*ThemeSectionType*](twind.md#themesectiontype)<[*Theme*](../interfaces/twind.theme.md)[Section]\>\>): (`context`: [*Context*](../interfaces/twind.context.md)) => *NonNullable*<[*ThemeSectionType*](twind.md#themesectiontype)<[*Theme*](../interfaces/twind.theme.md)[Section]\>\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Section` | *colors* \| *spacing* \| *durations* \| *screens* \| *animation* \| *backgroundColor* \| *backgroundImage* \| *backgroundOpacity* \| *borderColor* \| *borderOpacity* \| *borderRadius* \| *borderWidth* \| *boxShadow* \| *container* \| *divideColor* \| *divideOpacity* \| *divideWidth* \| *fill* \| *flex* \| *fontFamily* \| *fontSize* \| *fontWeight* \| *gap* \| *gradientColorStops* \| *height* \| *inset* \| *keyframes* \| *letterSpacing* \| *lineHeight* \| *margin* \| *maxHeight* \| *maxWidth* \| *minHeight* \| *minWidth* \| *opacity* \| *order* \| *outline* \| *padding* \| *placeholderColor* \| *placeholderOpacity* \| *ringColor* \| *ringOffsetColor* \| *ringOffsetWidth* \| *ringOpacity* \| *ringWidth* \| *rotate* \| *scale* \| *skew* \| *space* \| *stroke* \| *strokeWidth* \| *textColor* \| *textOpacity* \| *transitionDelay* \| *transitionDuration* \| *transitionProperty* \| *transitionTimingFunction* \| *translate* \| *width* \| *zIndex* |

#### Parameters:

Name | Type |
:------ | :------ |
`keypath` | \`${Section}.${string}\` |
`defaultValue` | *NonNullable*<[*ThemeSectionType*](twind.md#themesectiontype)<[*Theme*](../interfaces/twind.theme.md)[Section]\>\> |

**Returns:** *function*

Defined in: [src/twind/theme.ts:91](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/theme.ts#L91)

▸ `Const`**theme**<Section\>(`section`: Section, `key`: *string* \| *string*[]): (`context`: [*Context*](../interfaces/twind.context.md)) => *undefined* \| [*ThemeSectionType*](twind.md#themesectiontype)<[*Theme*](../interfaces/twind.theme.md)[Section]\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Section` | *colors* \| *spacing* \| *durations* \| *screens* \| *animation* \| *backgroundColor* \| *backgroundImage* \| *backgroundOpacity* \| *borderColor* \| *borderOpacity* \| *borderRadius* \| *borderWidth* \| *boxShadow* \| *container* \| *divideColor* \| *divideOpacity* \| *divideWidth* \| *fill* \| *flex* \| *fontFamily* \| *fontSize* \| *fontWeight* \| *gap* \| *gradientColorStops* \| *height* \| *inset* \| *keyframes* \| *letterSpacing* \| *lineHeight* \| *margin* \| *maxHeight* \| *maxWidth* \| *minHeight* \| *minWidth* \| *opacity* \| *order* \| *outline* \| *padding* \| *placeholderColor* \| *placeholderOpacity* \| *ringColor* \| *ringOffsetColor* \| *ringOffsetWidth* \| *ringOpacity* \| *ringWidth* \| *rotate* \| *scale* \| *skew* \| *space* \| *stroke* \| *strokeWidth* \| *textColor* \| *textOpacity* \| *transitionDelay* \| *transitionDuration* \| *transitionProperty* \| *transitionTimingFunction* \| *translate* \| *width* \| *zIndex* |

#### Parameters:

Name | Type |
:------ | :------ |
`section` | Section |
`key` | *string* \| *string*[] |

**Returns:** *function*

Defined in: [src/twind/theme.ts:91](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/theme.ts#L91)

▸ `Const`**theme**<Section\>(`section`: Section, `key`: *string* \| *string*[], `defaultValue`: *NonNullable*<[*ThemeSectionType*](twind.md#themesectiontype)<[*Theme*](../interfaces/twind.theme.md)[Section]\>\>): (`context`: [*Context*](../interfaces/twind.context.md)) => *NonNullable*<[*ThemeSectionType*](twind.md#themesectiontype)<[*Theme*](../interfaces/twind.theme.md)[Section]\>\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Section` | *colors* \| *spacing* \| *durations* \| *screens* \| *animation* \| *backgroundColor* \| *backgroundImage* \| *backgroundOpacity* \| *borderColor* \| *borderOpacity* \| *borderRadius* \| *borderWidth* \| *boxShadow* \| *container* \| *divideColor* \| *divideOpacity* \| *divideWidth* \| *fill* \| *flex* \| *fontFamily* \| *fontSize* \| *fontWeight* \| *gap* \| *gradientColorStops* \| *height* \| *inset* \| *keyframes* \| *letterSpacing* \| *lineHeight* \| *margin* \| *maxHeight* \| *maxWidth* \| *minHeight* \| *minWidth* \| *opacity* \| *order* \| *outline* \| *padding* \| *placeholderColor* \| *placeholderOpacity* \| *ringColor* \| *ringOffsetColor* \| *ringOffsetWidth* \| *ringOpacity* \| *ringWidth* \| *rotate* \| *scale* \| *skew* \| *space* \| *stroke* \| *strokeWidth* \| *textColor* \| *textOpacity* \| *transitionDelay* \| *transitionDuration* \| *transitionProperty* \| *transitionTimingFunction* \| *translate* \| *width* \| *zIndex* |

#### Parameters:

Name | Type |
:------ | :------ |
`section` | Section |
`key` | *string* \| *string*[] |
`defaultValue` | *NonNullable*<[*ThemeSectionType*](twind.md#themesectiontype)<[*Theme*](../interfaces/twind.theme.md)[Section]\>\> |

**Returns:** *function*

Defined in: [src/twind/theme.ts:91](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/theme.ts#L91)

___

### voidSheet

▸ `Const`**voidSheet**(): [*Sheet*](../interfaces/twind.sheet.md)<*null*\>

An sheet placeholder which performs no operations. Useful for avoiding errors in a non-browser environment.

**Returns:** [*Sheet*](../interfaces/twind.sheet.md)<*null*\>

Defined in: [src/twind/sheets.ts:25](https://github.com/gojutin/twind/blob/8f04bb3/src/twind/sheets.ts#L25)
