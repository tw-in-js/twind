# Interface: Configuration

[twind](../modules/twind.md).Configuration

## Hierarchy

* **Configuration**

  ↳ [*ShimConfiguration*](twind_shim.shimconfiguration.md)

## Properties

### darkMode

• `Optional` **darkMode**: *undefined* \| *false* \| *media* \| *class*

Determines the dark mode strategy (default: `"media"`).

Defined in: [src/types/twind.ts:85](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L85)

___

### hash

• `Optional` **hash**: *undefined* \| *boolean* \| [*Hasher*](../modules/twind.md#hasher)

Defined in: [src/types/twind.ts:116](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L116)

___

### mode

• `Optional` **mode**: *undefined* \| [*Mode*](twind.mode.md) \| *strict* \| *warn* \| *silent*

Defined in: [src/types/twind.ts:118](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L118)

___

### nonce

• `Optional` **nonce**: *undefined* \| *string*

Sets a cryptographic nonce (number used once) on the enclosing `<style>` tag when generating a page on demand.

Useful for enforcing a [Content Security Policy (CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP).

Defined in: [src/types/twind.ts:105](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L105)

___

### plugins

• `Optional` **plugins**: *undefined* \| *Record*<string, undefined \| string \| [*CSSRules*](twind.cssrules.md) \| [*DirectiveHandler*](twind.directivehandler.md)\>

Defined in: [src/types/twind.ts:89](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L89)

___

### prefix

• `Optional` **prefix**: *undefined* \| *boolean* \| [*Prefixer*](../modules/twind.md#prefixer)

Auto-prefixer method for CSS property–value pairs.

Defined in: [src/types/twind.ts:114](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L114)

___

### preflight

• `Optional` **preflight**: *undefined* \| *boolean* \| [*CSSRules*](twind.cssrules.md) \| [*Preflight*](twind.preflight.md)

Called right before the first rule is injected.

Defined in: [src/types/twind.ts:111](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L111)

___

### sheet

• `Optional` **sheet**: *undefined* \| [*Sheet*](twind.sheet.md)<unknown\>

Style insertion methodology to be used.

Defined in: [src/types/twind.ts:108](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L108)

___

### theme

• `Optional` **theme**: *undefined* \| [*ThemeConfiguration*](twind.themeconfiguration.md)

Defined in: [src/types/twind.ts:87](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L87)

___

### variants

• `Optional` **variants**: *undefined* \| *Record*<string, string\>

```js
{
  ':new-variant': '& .selector',
}
```

Defined in: [src/types/twind.ts:98](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L98)
