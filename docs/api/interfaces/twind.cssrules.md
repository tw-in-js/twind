# Interface: CSSRules

[twind](../modules/twind.md).CSSRules

See: https://drafts.csswg.org/css-nesting/#nest-selector

```
"& > * + *": {
  marginLeft: 16
},

// In a comma-separated list, each individual selector shall start with "&"
"&:focus, &:active": {
  outline: "solid"
},

// Self-references are also supported
"& + &": {
  color: "green"
}
```

## Indexable

▪ [key: *string*]: [*CSSProperties*](twind.cssproperties.md) \| [*CSSAtMedia*](../modules/twind.md#cssatmedia) \| [*CSSAtSupports*](../modules/twind.md#cssatsupports) \| [*CSSAtKeyframes*](../modules/twind.md#cssatkeyframes) \| [*CSSRules*](twind.cssrules.md) \| *string* \| *string*[] \| [*Falsy*](../modules/twind.md#falsy) \| [*CSSRulesThunk*](twind.cssrulesthunk.md)

Global defaults

```
"& > * + *": {
  marginLeft: 16
},

// In a comma-separated list, each individual selector shall start with "&"
"&:focus, &:active": {
  outline: "solid"
},

// Self-references are also supported
"& + &": {
  color: "green"
}
```
