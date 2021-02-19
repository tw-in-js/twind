# Interface: TwindObserver

[twind/observe](../modules/twind_observe.md).TwindObserver

Provides the ability to watch for changes being made to the DOM tree.

## Methods

### disconnect

▸ **disconnect**(): [*TwindObserver*](twind_observe.twindobserver.md)

Stops observer from observing any mutations.

**Returns:** [*TwindObserver*](twind_observe.twindobserver.md)

Defined in: [src/observe/index.ts:25](https://github.com/gojutin/twind/blob/8f04bb3/src/observe/index.ts#L25)

___

### observe

▸ **observe**(`target`: Node): [*TwindObserver*](twind_observe.twindobserver.md)

Observe an additional element.

#### Parameters:

Name | Type |
:------ | :------ |
`target` | Node |

**Returns:** [*TwindObserver*](twind_observe.twindobserver.md)

Defined in: [src/observe/index.ts:30](https://github.com/gojutin/twind/blob/8f04bb3/src/observe/index.ts#L30)
