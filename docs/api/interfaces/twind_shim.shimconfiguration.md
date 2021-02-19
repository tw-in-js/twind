# Interface: ShimConfiguration

[twind/shim](../modules/twind_shim.md).ShimConfiguration

Options for [setup](../modules/twind_shim.md#setup).

## Hierarchy

* [*Configuration*](twind.configuration.md)

  ↳ **ShimConfiguration**

## Properties

### darkMode

• `Optional` **darkMode**: *undefined* \| *false* \| *media* \| *class*

Determines the dark mode strategy (default: `"media"`).

Inherited from: [Configuration](twind.configuration.md).[darkMode](twind.configuration.md#darkmode)

Defined in: [src/types/twind.ts:85](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L85)

___

### hash

• `Optional` **hash**: *undefined* \| *boolean* \| [*Hasher*](../modules/twind.md#hasher)

Inherited from: [Configuration](twind.configuration.md).[hash](twind.configuration.md#hash)

Defined in: [src/types/twind.ts:116](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L116)

___

### mode

• `Optional` **mode**: *undefined* \| [*Mode*](twind.mode.md) \| *strict* \| *warn* \| *silent*

Inherited from: [Configuration](twind.configuration.md).[mode](twind.configuration.md#mode)

Defined in: [src/types/twind.ts:118](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L118)

___

### nonce

• `Optional` **nonce**: *undefined* \| *string*

Sets a cryptographic nonce (number used once) on the enclosing `<style>` tag when generating a page on demand.

Useful for enforcing a [Content Security Policy (CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP).

Inherited from: [Configuration](twind.configuration.md).[nonce](twind.configuration.md#nonce)

Defined in: [src/types/twind.ts:105](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L105)

___

### plugins

• `Optional` **plugins**: *undefined* \| *Record*<string, undefined \| string \| [*CSSRules*](twind.cssrules.md) \| [*DirectiveHandler*](twind.directivehandler.md)\>

Inherited from: [Configuration](twind.configuration.md).[plugins](twind.configuration.md#plugins)

Defined in: [src/types/twind.ts:89](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L89)

___

### prefix

• `Optional` **prefix**: *undefined* \| *boolean* \| [*Prefixer*](../modules/twind.md#prefixer)

Auto-prefixer method for CSS property–value pairs.

Inherited from: [Configuration](twind.configuration.md).[prefix](twind.configuration.md#prefix)

Defined in: [src/types/twind.ts:114](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L114)

___

### preflight

• `Optional` **preflight**: *undefined* \| *boolean* \| [*CSSRules*](twind.cssrules.md) \| [*Preflight*](twind.preflight.md)

Called right before the first rule is injected.

Inherited from: [Configuration](twind.configuration.md).[preflight](twind.configuration.md#preflight)

Defined in: [src/types/twind.ts:111](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L111)

___

### sheet

• `Optional` **sheet**: *undefined* \| [*Sheet*](twind.sheet.md)<unknown\>

Style insertion methodology to be used.

Inherited from: [Configuration](twind.configuration.md).[sheet](twind.configuration.md#sheet)

Defined in: [src/types/twind.ts:108](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L108)

___

### target

• `Optional` **target**: *undefined* \| HTMLElement

The root element to shim (default: `document.documentElement`).

Defined in: [src/shim/index.ts:18](https://github.com/gojutin/twind/blob/8f04bb3/src/shim/index.ts#L18)

___

### theme

• `Optional` **theme**: *undefined* \| [*ThemeConfiguration*](twind.themeconfiguration.md)

Inherited from: [Configuration](twind.configuration.md).[theme](twind.configuration.md#theme)

Defined in: [src/types/twind.ts:87](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L87)

___

### variants

• `Optional` **variants**: *undefined* \| *Record*<string, string\>

```js
{
  ':new-variant': '& .selector',
}
```

Inherited from: [Configuration](twind.configuration.md).[variants](twind.configuration.md#variants)

Defined in: [src/types/twind.ts:98](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L98)
