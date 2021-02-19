# Interface: ThemeHelper

[twind](../modules/twind.md).ThemeHelper

## Callable

▸ **ThemeHelper**<Section\>(`section`: Section): (`context`: [*Context*](twind.context.md)) => *Record*<string, [*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Section` | *colors* \| *spacing* \| *durations* \| *screens* \| *animation* \| *backgroundColor* \| *backgroundImage* \| *backgroundOpacity* \| *borderColor* \| *borderOpacity* \| *borderRadius* \| *borderWidth* \| *boxShadow* \| *container* \| *divideColor* \| *divideOpacity* \| *divideWidth* \| *fill* \| *flex* \| *fontFamily* \| *fontSize* \| *fontWeight* \| *gap* \| *gradientColorStops* \| *height* \| *inset* \| *keyframes* \| *letterSpacing* \| *lineHeight* \| *margin* \| *maxHeight* \| *maxWidth* \| *minHeight* \| *minWidth* \| *opacity* \| *order* \| *outline* \| *padding* \| *placeholderColor* \| *placeholderOpacity* \| *ringColor* \| *ringOffsetColor* \| *ringOffsetWidth* \| *ringOpacity* \| *ringWidth* \| *rotate* \| *scale* \| *skew* \| *space* \| *stroke* \| *strokeWidth* \| *textColor* \| *textOpacity* \| *transitionDelay* \| *transitionDuration* \| *transitionProperty* \| *transitionTimingFunction* \| *translate* \| *width* \| *zIndex* |

#### Parameters:

Name | Type |
:------ | :------ |
`section` | Section |

**Returns:** *function*

Defined in: [src/types/theme.ts:28](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L28)

▸ **ThemeHelper**<Section\>(`keypath`: \`${Section}.${string}\`): (`context`: [*Context*](twind.context.md)) => *undefined* \| [*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Section` | *colors* \| *spacing* \| *durations* \| *screens* \| *animation* \| *backgroundColor* \| *backgroundImage* \| *backgroundOpacity* \| *borderColor* \| *borderOpacity* \| *borderRadius* \| *borderWidth* \| *boxShadow* \| *container* \| *divideColor* \| *divideOpacity* \| *divideWidth* \| *fill* \| *flex* \| *fontFamily* \| *fontSize* \| *fontWeight* \| *gap* \| *gradientColorStops* \| *height* \| *inset* \| *keyframes* \| *letterSpacing* \| *lineHeight* \| *margin* \| *maxHeight* \| *maxWidth* \| *minHeight* \| *minWidth* \| *opacity* \| *order* \| *outline* \| *padding* \| *placeholderColor* \| *placeholderOpacity* \| *ringColor* \| *ringOffsetColor* \| *ringOffsetWidth* \| *ringOpacity* \| *ringWidth* \| *rotate* \| *scale* \| *skew* \| *space* \| *stroke* \| *strokeWidth* \| *textColor* \| *textOpacity* \| *transitionDelay* \| *transitionDuration* \| *transitionProperty* \| *transitionTimingFunction* \| *translate* \| *width* \| *zIndex* |

#### Parameters:

Name | Type |
:------ | :------ |
`keypath` | \`${Section}.${string}\` |

**Returns:** *function*

Defined in: [src/types/theme.ts:31](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L31)

▸ **ThemeHelper**<Section\>(`keypath`: \`${Section}.${string}\`, `defaultValue`: *NonNullable*<[*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>\>): (`context`: [*Context*](twind.context.md)) => *NonNullable*<[*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Section` | *colors* \| *spacing* \| *durations* \| *screens* \| *animation* \| *backgroundColor* \| *backgroundImage* \| *backgroundOpacity* \| *borderColor* \| *borderOpacity* \| *borderRadius* \| *borderWidth* \| *boxShadow* \| *container* \| *divideColor* \| *divideOpacity* \| *divideWidth* \| *fill* \| *flex* \| *fontFamily* \| *fontSize* \| *fontWeight* \| *gap* \| *gradientColorStops* \| *height* \| *inset* \| *keyframes* \| *letterSpacing* \| *lineHeight* \| *margin* \| *maxHeight* \| *maxWidth* \| *minHeight* \| *minWidth* \| *opacity* \| *order* \| *outline* \| *padding* \| *placeholderColor* \| *placeholderOpacity* \| *ringColor* \| *ringOffsetColor* \| *ringOffsetWidth* \| *ringOpacity* \| *ringWidth* \| *rotate* \| *scale* \| *skew* \| *space* \| *stroke* \| *strokeWidth* \| *textColor* \| *textOpacity* \| *transitionDelay* \| *transitionDuration* \| *transitionProperty* \| *transitionTimingFunction* \| *translate* \| *width* \| *zIndex* |

#### Parameters:

Name | Type |
:------ | :------ |
`keypath` | \`${Section}.${string}\` |
`defaultValue` | *NonNullable*<[*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>\> |

**Returns:** *function*

Defined in: [src/types/theme.ts:35](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L35)

▸ **ThemeHelper**<Section\>(`section`: Section, `key`: *string* \| *string*[]): (`context`: [*Context*](twind.context.md)) => *undefined* \| [*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Section` | *colors* \| *spacing* \| *durations* \| *screens* \| *animation* \| *backgroundColor* \| *backgroundImage* \| *backgroundOpacity* \| *borderColor* \| *borderOpacity* \| *borderRadius* \| *borderWidth* \| *boxShadow* \| *container* \| *divideColor* \| *divideOpacity* \| *divideWidth* \| *fill* \| *flex* \| *fontFamily* \| *fontSize* \| *fontWeight* \| *gap* \| *gradientColorStops* \| *height* \| *inset* \| *keyframes* \| *letterSpacing* \| *lineHeight* \| *margin* \| *maxHeight* \| *maxWidth* \| *minHeight* \| *minWidth* \| *opacity* \| *order* \| *outline* \| *padding* \| *placeholderColor* \| *placeholderOpacity* \| *ringColor* \| *ringOffsetColor* \| *ringOffsetWidth* \| *ringOpacity* \| *ringWidth* \| *rotate* \| *scale* \| *skew* \| *space* \| *stroke* \| *strokeWidth* \| *textColor* \| *textOpacity* \| *transitionDelay* \| *transitionDuration* \| *transitionProperty* \| *transitionTimingFunction* \| *translate* \| *width* \| *zIndex* |

#### Parameters:

Name | Type |
:------ | :------ |
`section` | Section |
`key` | *string* \| *string*[] |

**Returns:** *function*

Defined in: [src/types/theme.ts:40](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L40)

▸ **ThemeHelper**<Section\>(`section`: Section, `key`: *string* \| *string*[], `defaultValue`: *NonNullable*<[*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>\>): (`context`: [*Context*](twind.context.md)) => *NonNullable*<[*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>\>

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

**Returns:** *function*

Defined in: [src/types/theme.ts:44](https://github.com/gojutin/twind/blob/8f04bb3/src/types/theme.ts#L44)
