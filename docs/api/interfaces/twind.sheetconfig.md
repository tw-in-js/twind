# Interface: SheetConfig<T\>

[twind](../modules/twind.md).SheetConfig

## Type parameters

Name | Default |
:------ | :------ |
`T` | *unknown* |

## Properties

### nonce

• `Optional` **nonce**: *undefined* \| *string*

Sets a cryptographic nonce (number used once) on the enclosing `<style>` tag when generating a page on demand.

Useful for enforcing a [Content Security Policy (CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP).

Defined in: [src/types/twind.ts:52](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L52)

___

### target

• `Optional` **target**: *undefined* \| T

Target to insert rules into.

Defined in: [src/types/twind.ts:55](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L55)
