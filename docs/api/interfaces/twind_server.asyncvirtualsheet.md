# Interface: AsyncVirtualSheet

[twind/server](../modules/twind_server.md).AsyncVirtualSheet

## Hierarchy

* [*Sheet*](twind.sheet.md)

  ↳ **AsyncVirtualSheet**

## Properties

### disable

• **disable**: () => *void*

#### Type declaration:

▸ (): *void*

**Returns:** *void*

Defined in: [src/server/index.ts:23](https://github.com/gojutin/twind/blob/8f04bb3/src/server/index.ts#L23)

Defined in: [src/server/index.ts:23](https://github.com/gojutin/twind/blob/8f04bb3/src/server/index.ts#L23)

___

### enable

• **enable**: () => *void*

#### Type declaration:

▸ (): *void*

**Returns:** *void*

Defined in: [src/server/index.ts:22](https://github.com/gojutin/twind/blob/8f04bb3/src/server/index.ts#L22)

Defined in: [src/server/index.ts:22](https://github.com/gojutin/twind/blob/8f04bb3/src/server/index.ts#L22)

___

### init

• **init**: [*SheetInit*](twind.sheetinit.md)

Overrides: [Sheet](twind.sheet.md).[init](twind.sheet.md#init)

Defined in: [src/server/index.ts:20](https://github.com/gojutin/twind/blob/8f04bb3/src/server/index.ts#L20)

___

### insert

• **insert**: (`rule`: *string*, `index`: *number*) => *void*

#### Type declaration:

▸ (`rule`: *string*, `index`: *number*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`rule` | *string* |
`index` | *number* |

**Returns:** *void*

Defined in: [src/types/twind.ts:61](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L61)

Inherited from: [Sheet](twind.sheet.md).[insert](twind.sheet.md#insert)

Defined in: [src/types/twind.ts:61](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L61)

___

### reset

• **reset**: () => *void*

#### Type declaration:

▸ (): *void*

**Returns:** *void*

Defined in: [src/server/index.ts:21](https://github.com/gojutin/twind/blob/8f04bb3/src/server/index.ts#L21)

Defined in: [src/server/index.ts:21](https://github.com/gojutin/twind/blob/8f04bb3/src/server/index.ts#L21)

___

### target

• `Readonly` **target**: readonly *string*[]

Overrides: [Sheet](twind.sheet.md).[target](twind.sheet.md#target)

Defined in: [src/server/index.ts:19](https://github.com/gojutin/twind/blob/8f04bb3/src/server/index.ts#L19)
