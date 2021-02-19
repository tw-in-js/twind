# Interface: Storage

[twind/sheets](../modules/twind_sheets.md).Storage

Allows to reset and snaphot the current state of an sheet and
in extension the internal mutable state (caches, ...) of `tw`.

## Hierarchy

* **Storage**

  ↳ [*VirtualSheet*](twind_sheets.virtualsheet.md)

## Properties

### init

• **init**: [*SheetInit*](twind.sheetinit.md)

Register a function that should be called to create a new state.

Defined in: [src/sheets/index.ts:33](https://github.com/gojutin/twind/blob/8f04bb3/src/sheets/index.ts#L33)

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

Defined in: [src/sheets/index.ts:39](https://github.com/gojutin/twind/blob/8f04bb3/src/sheets/index.ts#L39)
