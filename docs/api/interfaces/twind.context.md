# Interface: Context

[twind](../modules/twind.md).Context

## Properties

### css

• `Readonly` **css**: (`rule`: *string* \| [*Rule*](twind.rule.md)[]) => [*CSSRules*](twind.cssrules.md)

#### Type declaration:

▸ (`rule`: *string* \| [*Rule*](twind.rule.md)[]): [*CSSRules*](twind.cssrules.md)

#### Parameters:

Name | Type |
:------ | :------ |
`rule` | *string* \| [*Rule*](twind.rule.md)[] |

**Returns:** [*CSSRules*](twind.cssrules.md)

Defined in: [src/types/twind.ts:28](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L28)

Defined in: [src/types/twind.ts:28](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L28)

___

### tag

• `Readonly` **tag**: (`key`: *string*) => *string*

Create unique identifier (group, custom properties)

#### Type declaration:

▸ (`key`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`key` | *string* |

**Returns:** *string*

Defined in: [src/types/twind.ts:26](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L26)

Defined in: [src/types/twind.ts:26](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L26)

___

### theme

• `Readonly` **theme**: [*ThemeResolver*](twind.themeresolver.md)

Access to theme values

Defined in: [src/types/twind.ts:23](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L23)

___

### tw

• `Readonly` **tw**: [*TWCallable*](twind.twcallable.md)

Allow composition

Defined in: [src/types/twind.ts:20](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L20)
