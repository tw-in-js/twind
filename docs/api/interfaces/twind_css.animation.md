# Interface: Animation

[twind/css](../modules/twind_css.md).Animation

```js
const bounce = animation('1s ease infinite', {
  'from, 20%, 53%, 80%, to': {
    transform: 'translate3d(0,0,0)',
  },
  '40%, 43%': {
    transform: 'translate3d(0, -30px, 0)',
  },
  '70%': {
    transform: 'translate3d(0, -15px, 0)',
  },
  '90%': {
    transform: 'translate3d(0, -4px, 0)',
  }
})
```

## Callable

▸ **Animation**(`value`: *string* \| [*CSSRules*](twind.cssrules.md) \| (`context`: [*Context*](twind.context.md)) => *string*): [*CSSFactory*](twind_css.cssfactory.md)<Record<string, [*CSSProperties*](twind.cssproperties.md) \| (`context`: [*Context*](twind.context.md)) => [*CSSProperties*](twind.cssproperties.md)\>, [*CSSProperties*](twind.cssproperties.md) \| Record<string, [*CSSProperties*](twind.cssproperties.md) \| (`context`: [*Context*](twind.context.md)) => [*CSSProperties*](twind.cssproperties.md)\>, [*CSSRules*](twind.cssrules.md)\>

```js
const bounce = animation('1s ease infinite', {
  'from, 20%, 53%, 80%, to': {
    transform: 'translate3d(0,0,0)',
  },
  '40%, 43%': {
    transform: 'translate3d(0, -30px, 0)',
  },
  '70%': {
    transform: 'translate3d(0, -15px, 0)',
  },
  '90%': {
    transform: 'translate3d(0, -4px, 0)',
  }
})
```

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *string* \| [*CSSRules*](twind.cssrules.md) \| (`context`: [*Context*](twind.context.md)) => *string* |

**Returns:** [*CSSFactory*](twind_css.cssfactory.md)<Record<string, [*CSSProperties*](twind.cssproperties.md) \| (`context`: [*Context*](twind.context.md)) => [*CSSProperties*](twind.cssproperties.md)\>, [*CSSProperties*](twind.cssproperties.md) \| Record<string, [*CSSProperties*](twind.cssproperties.md) \| (`context`: [*Context*](twind.context.md)) => [*CSSProperties*](twind.cssproperties.md)\>, [*CSSRules*](twind.cssrules.md)\>

Defined in: [src/css/index.ts:205](https://github.com/gojutin/twind/blob/8f04bb3/src/css/index.ts#L205)

▸ **Animation**(`value`: *string* \| [*CSSRules*](twind.cssrules.md) \| (`context`: [*Context*](twind.context.md)) => *string*, `waypoints`: *Record*<string, [*CSSProperties*](twind.cssproperties.md) \| (`context`: [*Context*](twind.context.md)) => [*CSSProperties*](twind.cssproperties.md)\> \| [*Directive*](twind.directive.md)<string\>): [*Directive*](twind.directive.md)<[*CSSRules*](twind.cssrules.md)\>

```js
const bounce = animation('1s ease infinite', {
  'from, 20%, 53%, 80%, to': {
    transform: 'translate3d(0,0,0)',
  },
  '40%, 43%': {
    transform: 'translate3d(0, -30px, 0)',
  },
  '70%': {
    transform: 'translate3d(0, -15px, 0)',
  },
  '90%': {
    transform: 'translate3d(0, -4px, 0)',
  }
})
```

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *string* \| [*CSSRules*](twind.cssrules.md) \| (`context`: [*Context*](twind.context.md)) => *string* |
`waypoints` | *Record*<string, [*CSSProperties*](twind.cssproperties.md) \| (`context`: [*Context*](twind.context.md)) => [*CSSProperties*](twind.cssproperties.md)\> \| [*Directive*](twind.directive.md)<string\> |

**Returns:** [*Directive*](twind.directive.md)<[*CSSRules*](twind.cssrules.md)\>

Defined in: [src/css/index.ts:210](https://github.com/gojutin/twind/blob/8f04bb3/src/css/index.ts#L210)
