# Interface: Mode

[twind](../modules/twind.md).Mode

## Properties

### unknown

• **unknown**: <Section\>(`section`: Section, `key`: *undefined* \| *string*[], `optional`: *boolean*, `context`: [*Context*](twind.context.md)) => *undefined* \| *void* \| [*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>

Called for unknown theme values

#### Type declaration:

▸ <Section\>(`section`: Section, `key`: *undefined* \| *string*[], `optional`: *boolean*, `context`: [*Context*](twind.context.md)): *undefined* \| *void* \| [*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Section` | *colors* \| *spacing* \| *durations* \| *screens* \| *animation* \| *backgroundColor* \| *backgroundImage* \| *backgroundOpacity* \| *borderColor* \| *borderOpacity* \| *borderRadius* \| *borderWidth* \| *boxShadow* \| *container* \| *divideColor* \| *divideOpacity* \| *divideWidth* \| *fill* \| *flex* \| *fontFamily* \| *fontSize* \| *fontWeight* \| *gap* \| *gradientColorStops* \| *height* \| *inset* \| *keyframes* \| *letterSpacing* \| *lineHeight* \| *margin* \| *maxHeight* \| *maxWidth* \| *minHeight* \| *minWidth* \| *opacity* \| *order* \| *outline* \| *padding* \| *placeholderColor* \| *placeholderOpacity* \| *ringColor* \| *ringOffsetColor* \| *ringOffsetWidth* \| *ringOpacity* \| *ringWidth* \| *rotate* \| *scale* \| *skew* \| *space* \| *stroke* \| *strokeWidth* \| *textColor* \| *textOpacity* \| *transitionDelay* \| *transitionDuration* \| *transitionProperty* \| *transitionTimingFunction* \| *translate* \| *width* \| *zIndex* |

#### Parameters:

Name | Type |
:------ | :------ |
`section` | Section |
`key` | *undefined* \| *string*[] |
`optional` | *boolean* |
`context` | [*Context*](twind.context.md) |

**Returns:** *undefined* \| *void* \| [*ThemeSectionType*](../modules/twind.md#themesectiontype)<[*Theme*](twind.theme.md)[Section]\>

Defined in: [src/types/twind.ts:129](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L129)

Defined in: [src/types/twind.ts:129](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L129)

## Methods

### report

▸ **report**(`info`: [*ReportInfo*](../modules/twind.md#reportinfo), `context`: [*Context*](twind.context.md)): *void*

Notify error (missing plugin, duplicate directives? )

Why id?
- can generate an url with more info
- reduce bundle size by omitting large error messages

#### Parameters:

Name | Type |
:------ | :------ |
`info` | [*ReportInfo*](../modules/twind.md#reportinfo) |
`context` | [*Context*](twind.context.md) |

**Returns:** *void*

Defined in: [src/types/twind.ts:143](https://github.com/gojutin/twind/blob/8f04bb3/src/types/twind.ts#L143)
