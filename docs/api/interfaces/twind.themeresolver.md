# Interface: ThemeResolver

[twind](../modules/twind.md).ThemeResolver

## Callable

▸ **ThemeResolver**<Section\>(`section`: Section): *Record*<string, [*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Section` | *colors* \| *spacing* \| *durations* \| *screens* \| *animation* \| *backgroundColor* \| *backgroundImage* \| *backgroundOpacity* \| *borderColor* \| *borderOpacity* \| *borderRadius* \| *borderWidth* \| *boxShadow* \| *container* \| *divideColor* \| *divideOpacity* \| *divideWidth* \| *fill* \| *flex* \| *fontFamily* \| *fontSize* \| *fontWeight* \| *gap* \| *gradientColorStops* \| *height* \| *inset* \| *keyframes* \| *letterSpacing* \| *lineHeight* \| *margin* \| *maxHeight* \| *maxWidth* \| *minHeight* \| *minWidth* \| *opacity* \| *order* \| *outline* \| *padding* \| *placeholderColor* \| *placeholderOpacity* \| *ringColor* \| *ringOffsetColor* \| *ringOffsetWidth* \| *ringOpacity* \| *ringWidth* \| *rotate* \| *scale* \| *skew* \| *space* \| *stroke* \| *strokeWidth* \| *textColor* \| *textOpacity* \| *transitionDelay* \| *transitionDuration* \| *transitionProperty* \| *transitionTimingFunction* \| *translate* \| *width* \| *zIndex* |

#### Parameters:

Name | Type |
:------ | :------ |
`section` | Section |

**Returns:** *Record*<string, [*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>\>

Defined in: [src/types/theme.ts:5](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L5)

▸ **ThemeResolver**<Section\>(`keypath`: \`${Section}.${string}\`): *undefined* \| [*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Section` | *colors* \| *spacing* \| *durations* \| *screens* \| *animation* \| *backgroundColor* \| *backgroundImage* \| *backgroundOpacity* \| *borderColor* \| *borderOpacity* \| *borderRadius* \| *borderWidth* \| *boxShadow* \| *container* \| *divideColor* \| *divideOpacity* \| *divideWidth* \| *fill* \| *flex* \| *fontFamily* \| *fontSize* \| *fontWeight* \| *gap* \| *gradientColorStops* \| *height* \| *inset* \| *keyframes* \| *letterSpacing* \| *lineHeight* \| *margin* \| *maxHeight* \| *maxWidth* \| *minHeight* \| *minWidth* \| *opacity* \| *order* \| *outline* \| *padding* \| *placeholderColor* \| *placeholderOpacity* \| *ringColor* \| *ringOffsetColor* \| *ringOffsetWidth* \| *ringOpacity* \| *ringWidth* \| *rotate* \| *scale* \| *skew* \| *space* \| *stroke* \| *strokeWidth* \| *textColor* \| *textOpacity* \| *transitionDelay* \| *transitionDuration* \| *transitionProperty* \| *transitionTimingFunction* \| *translate* \| *width* \| *zIndex* |

#### Parameters:

Name | Type |
:------ | :------ |
`keypath` | \`${Section}.${string}\` |

**Returns:** *undefined* \| [*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>

Defined in: [src/types/theme.ts:6](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L6)

▸ **ThemeResolver**<Section\>(`keypath`: \`${Section}.${string}\`, `defaultValue`: *NonNullable*<[*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>\>): *NonNullable*<[*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Section` | *colors* \| *spacing* \| *durations* \| *screens* \| *animation* \| *backgroundColor* \| *backgroundImage* \| *backgroundOpacity* \| *borderColor* \| *borderOpacity* \| *borderRadius* \| *borderWidth* \| *boxShadow* \| *container* \| *divideColor* \| *divideOpacity* \| *divideWidth* \| *fill* \| *flex* \| *fontFamily* \| *fontSize* \| *fontWeight* \| *gap* \| *gradientColorStops* \| *height* \| *inset* \| *keyframes* \| *letterSpacing* \| *lineHeight* \| *margin* \| *maxHeight* \| *maxWidth* \| *minHeight* \| *minWidth* \| *opacity* \| *order* \| *outline* \| *padding* \| *placeholderColor* \| *placeholderOpacity* \| *ringColor* \| *ringOffsetColor* \| *ringOffsetWidth* \| *ringOpacity* \| *ringWidth* \| *rotate* \| *scale* \| *skew* \| *space* \| *stroke* \| *strokeWidth* \| *textColor* \| *textOpacity* \| *transitionDelay* \| *transitionDuration* \| *transitionProperty* \| *transitionTimingFunction* \| *translate* \| *width* \| *zIndex* |

#### Parameters:

Name | Type |
:------ | :------ |
`keypath` | \`${Section}.${string}\` |
`defaultValue` | *NonNullable*<[*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>\> |

**Returns:** *NonNullable*<[*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>\>

Defined in: [src/types/theme.ts:10](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L10)

▸ **ThemeResolver**<Section\>(`section`: Section, `key`: *string* \| *string*[]): *undefined* \| [*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Section` | *colors* \| *spacing* \| *durations* \| *screens* \| *animation* \| *backgroundColor* \| *backgroundImage* \| *backgroundOpacity* \| *borderColor* \| *borderOpacity* \| *borderRadius* \| *borderWidth* \| *boxShadow* \| *container* \| *divideColor* \| *divideOpacity* \| *divideWidth* \| *fill* \| *flex* \| *fontFamily* \| *fontSize* \| *fontWeight* \| *gap* \| *gradientColorStops* \| *height* \| *inset* \| *keyframes* \| *letterSpacing* \| *lineHeight* \| *margin* \| *maxHeight* \| *maxWidth* \| *minHeight* \| *minWidth* \| *opacity* \| *order* \| *outline* \| *padding* \| *placeholderColor* \| *placeholderOpacity* \| *ringColor* \| *ringOffsetColor* \| *ringOffsetWidth* \| *ringOpacity* \| *ringWidth* \| *rotate* \| *scale* \| *skew* \| *space* \| *stroke* \| *strokeWidth* \| *textColor* \| *textOpacity* \| *transitionDelay* \| *transitionDuration* \| *transitionProperty* \| *transitionTimingFunction* \| *translate* \| *width* \| *zIndex* |

#### Parameters:

Name | Type |
:------ | :------ |
`section` | Section |
`key` | *string* \| *string*[] |

**Returns:** *undefined* \| [*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>

Defined in: [src/types/theme.ts:15](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L15)

▸ **ThemeResolver**<Section\>(`section`: Section, `key`: *string* \| *string*[], `defaultValue`: *NonNullable*<[*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>\>): *NonNullable*<[*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Section` | *colors* \| *spacing* \| *durations* \| *screens* \| *animation* \| *backgroundColor* \| *backgroundImage* \| *backgroundOpacity* \| *borderColor* \| *borderOpacity* \| *borderRadius* \| *borderWidth* \| *boxShadow* \| *container* \| *divideColor* \| *divideOpacity* \| *divideWidth* \| *fill* \| *flex* \| *fontFamily* \| *fontSize* \| *fontWeight* \| *gap* \| *gradientColorStops* \| *height* \| *inset* \| *keyframes* \| *letterSpacing* \| *lineHeight* \| *margin* \| *maxHeight* \| *maxWidth* \| *minHeight* \| *minWidth* \| *opacity* \| *order* \| *outline* \| *padding* \| *placeholderColor* \| *placeholderOpacity* \| *ringColor* \| *ringOffsetColor* \| *ringOffsetWidth* \| *ringOpacity* \| *ringWidth* \| *rotate* \| *scale* \| *skew* \| *space* \| *stroke* \| *strokeWidth* \| *textColor* \| *textOpacity* \| *transitionDelay* \| *transitionDuration* \| *transitionProperty* \| *transitionTimingFunction* \| *translate* \| *width* \| *zIndex* |

#### Parameters:

Name | Type |
:------ | :------ |
`section` | Section |
`key` | *string* \| *string*[] |
`defaultValue` | *NonNullable*<[*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>\> |

**Returns:** *NonNullable*<[*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>\>

Defined in: [src/types/theme.ts:19](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L19)
