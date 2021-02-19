# Interface: VirtualSheet

[twind/sheets](../modules/twind_sheets.md).VirtualSheet

A sheet that collects styles into an array.

## Hierarchy

* [*Sheet*](twind.sheet.md)<string[]\>

* [*Storage*](twind_sheets.storage.md)

  ↳ **VirtualSheet**

## Properties

### init

• **init**: [*SheetInit*](twind.sheetinit.md)

Register a function that should be called to create a new state.

Overrides: [Storage](twind_sheets.storage.md).[init](twind_sheets.storage.md#init)

Defined in: [src/sheets/index.ts:64](https://github.com/gojutin/twind/blob/8f04bb3/src/sheets/index.ts#L64)

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

• **reset**: (`snapshot?`: *unknown*[]) => *unknown*[]

Creates a snapshot of the current state, invokes all init callbacks to create a fresh state
and returns the snaphot.

#### Type declaration:

▸ (`snapshot?`: *unknown*[]): *unknown*[]

#### Parameters:

Name | Type |
:------ | :------ |
`snapshot?` | *unknown*[] |

**Returns:** *unknown*[]

Defined in: [src/sheets/index.ts:39](https://github.com/gojutin/twind/blob/8f04bb3/src/sheets/index.ts#L39)

Inherited from: [Storage](twind_sheets.storage.md).[reset](twind_sheets.storage.md#reset)

Defined in: [src/sheets/index.ts:39](https://github.com/gojutin/twind/blob/8f04bb3/src/sheets/index.ts#L39)

___

### target

• `Readonly` **target**: *string*[]

Inherited from: [Sheet](twind.sheet.md).[target](twind.sheet.md#target)

Defined in: [src/types/twind.ts:59](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L59)
