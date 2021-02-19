# Interface: CSSFactory<T, I, R\>

[twind/css](../modules/twind_css.md).CSSFactory

## Type parameters

Name |
:------ |
`T` |
`I` |
`R` |

## Callable

▸ **CSSFactory**(`strings`: *TemplateStringsArray*, ...`interpolations`: readonly [*MaybeThunk*](../modules/twind.md#maybethunk)<[*MaybeArray*](../modules/twind.md#maybearray)<undefined \| *null* \| string \| number \| *false* \| void \| I\>\>[]): [*Directive*](twind.directive.md)<R\>

#### Parameters:

Name | Type |
:------ | :------ |
`strings` | *TemplateStringsArray* |
`...interpolations` | readonly [*MaybeThunk*](../modules/twind.md#maybethunk)<[*MaybeArray*](../modules/twind.md#maybearray)<undefined \| *null* \| string \| number \| *false* \| void \| I\>\>[] |

**Returns:** [*Directive*](twind.directive.md)<R\>

Defined in: [src/css/index.ts:23](https://github.com/gojutin/twind/blob/8f04bb3/src/css/index.ts#L23)

▸ **CSSFactory**(`tokens`: [*MaybeThunk*](../modules/twind.md#maybethunk)<[*MaybeArray*](../modules/twind.md#maybearray)<undefined \| *null* \| *false* \| void \| ** \| *0* \| T\>\>): [*Directive*](twind.directive.md)<R\>

#### Parameters:

Name | Type |
:------ | :------ |
`tokens` | [*MaybeThunk*](../modules/twind.md#maybethunk)<[*MaybeArray*](../modules/twind.md#maybearray)<undefined \| *null* \| *false* \| void \| ** \| *0* \| T\>\> |

**Returns:** [*Directive*](twind.directive.md)<R\>

Defined in: [src/css/index.ts:27](https://github.com/gojutin/twind/blob/8f04bb3/src/css/index.ts#L27)

▸ **CSSFactory**(...`tokens`: readonly [*MaybeThunk*](../modules/twind.md#maybethunk)<undefined \| *null* \| *false* \| void \| ** \| *0* \| T\>[]): [*Directive*](twind.directive.md)<R\>

#### Parameters:

Name | Type |
:------ | :------ |
`...tokens` | readonly [*MaybeThunk*](../modules/twind.md#maybethunk)<undefined \| *null* \| *false* \| void \| ** \| *0* \| T\>[] |

**Returns:** [*Directive*](twind.directive.md)<R\>

Defined in: [src/css/index.ts:28](https://github.com/gojutin/twind/blob/8f04bb3/src/css/index.ts#L28)
