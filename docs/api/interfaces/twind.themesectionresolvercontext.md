# Interface: ThemeSectionResolverContext

[twind](../modules/twind.md).ThemeSectionResolverContext

## Properties

### breakpoints

• `Readonly` **breakpoints**: (`records`: *Record*<string, undefined \| string \| { `raw`: *string*  } \| { `max?`: *undefined* \| *string* ; `min`: *string*  } \| { `max`: *string* ; `min?`: *undefined* \| *string*  } \| readonly [*ThemeScreenValue*](../modules/twind.md#themescreenvalue)[]\>) => *Record*<string, undefined \| string\>

#### Type declaration:

▸ (`records`: *Record*<string, undefined \| string \| { `raw`: *string*  } \| { `max?`: *undefined* \| *string* ; `min`: *string*  } \| { `max`: *string* ; `min?`: *undefined* \| *string*  } \| readonly [*ThemeScreenValue*](../modules/twind.md#themescreenvalue)[]\>): *Record*<string, undefined \| string\>

#### Parameters:

Name | Type |
:------ | :------ |
`records` | *Record*<string, undefined \| string \| { `raw`: *string*  } \| { `max?`: *undefined* \| *string* ; `min`: *string*  } \| { `max`: *string* ; `min?`: *undefined* \| *string*  } \| readonly [*ThemeScreenValue*](../modules/twind.md#themescreenvalue)[]\> |

**Returns:** *Record*<string, undefined \| string\>

Defined in: [src/types/theme.ts:67](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L67)

Defined in: [src/types/theme.ts:67](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L67)

___

### negative

• `Readonly` **negative**: (`records`: *Record*<string, undefined \| string\>) => *Record*<string, undefined \| string\>

No-op function as negated values are automatically infered and do _not_ not to be in the theme.

#### Type declaration:

▸ (`records`: *Record*<string, undefined \| string\>): *Record*<string, undefined \| string\>

#### Parameters:

Name | Type |
:------ | :------ |
`records` | *Record*<string, undefined \| string\> |

**Returns:** *Record*<string, undefined \| string\>

Defined in: [src/types/theme.ts:63](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L63)

Defined in: [src/types/theme.ts:63](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L63)
