# Interface: Rule

[twind](../modules/twind.md).Rule

## Properties

### $

• **$**: *string*

The id is the tailwind rule including variants, negate and directive

Initialy this is set to an empty string.

This is used to cache the id of static rules (from template literals).

Defined in: [src/types/twind.ts:181](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L181)

___

### d

• **d**: *string* \| [*InlineDirective*](twind.inlinedirective.md)

The directive: `"text-sm"`, `"rotate-45"`

Defined in: [src/types/twind.ts:166](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L166)

___

### i

• **i**: *undefined* \| *boolean*

Is this rule marked as important: `"stroke-4!"` =\> `true`

Defined in: [src/types/twind.ts:172](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L172)

___

### n

• **n**: *undefined* \| *boolean*

Is this rule negated: `"-rotate-45"` =\> `true`

Defined in: [src/types/twind.ts:169](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L169)

___

### v

• **v**: *string*[]

The variants: `[":sm", ":dark", ":hover"]`

Defined in: [src/types/twind.ts:161](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L161)
