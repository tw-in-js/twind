import type { Theme } from './theme'

// type LengthUnit =
// | 'ch'
// | 'em'
// | 'ex'
// | 'rem'
// | 'vh'
// | 'vw'
// | 'vmin'
// | 'vmax'
// | 'px'
// | 'cm'
// | 'mm'
// | 'pc'
// | 'pt'

export type InterpolateKind =
  | `theme(${keyof Theme})`
  | `range(${number},${number},${number})`
  // | 'percentage' // `${NonNegativeNumber}%`
  // | `length` // `${NonNegativeNumber}${LengthUnit}`
  // | `length-percentage`
  | `string` // NonEmptyString
  | `number` // NonNegativeNumber
  | `nonzero` // PositiveNumber
export type Interpolate<Kind extends InterpolateKind> = `{{${Kind}}}`

export type FromTheme<Section extends keyof Theme> = Interpolate<`theme(${Section})`>
export type NonEmptyString = Interpolate<'string'>
export type Range<
  From extends number,
  To extends number,
  Step extends number = 1
> = Interpolate<`range(${From},${To},${Step})`>

export type Negatable<Value extends string> = Value | `-${Value}`

export type SimplePseudoClasses =
  | 'active'
  | 'any-link'
  | 'autofill'
  | 'checked'
  | 'default'
  | 'disabled'
  | 'empty'
  | 'enabled'
  | 'first-child'
  | 'first-of-type'
  | 'focus'
  | 'focus-visible'
  | 'focus-within'
  | 'future'
  | 'hover'
  | 'in-range'
  | 'indeterminate'
  | 'invalid'
  | 'last-child'
  | 'last-of-type'
  | 'link'
  | 'local-link'
  | 'only-child'
  | 'only-of-type'
  | 'optional'
  | 'out-of-range'
  | 'past'
  | 'paused'
  | 'placeholder-shown'
  | 'playing'
  | 'read-only'
  | 'read-write'
  | 'required'
  | 'target'
  | 'target-within'
  | 'user-invalid'
  | 'valid'
  | 'visited'

export type SimplePseudoElements =
  | 'after'
  | 'before'
  | 'cue'
  | 'cue-region'
  | 'file-selector-button'
  | 'first-letter'
  | 'first-line'
  | 'marker'
  | 'placeholder'
  | 'selection'
  | 'target-text'

export type CoreVariants =
  | 'dark'
  | 'sticky'
  | 'motion-reduce'
  | 'motion-safe'
  | 'first'
  | 'last'
  | 'even'
  | 'odd'
  | 'children'
  | 'siblings'
  | 'sibling'
  | 'override'

export type Empty = never | '' | 'DEFAULT'

export type Join<
  Prefix extends string | never,
  Suffix extends string | never,
  Separator extends string = '-'
> = Suffix extends Empty
  ? Prefix extends Empty
    ? never
    : Prefix
  : Prefix extends Empty
  ? Suffix
  : Prefix extends Suffix
  ? never
  : Suffix extends `-${infer S}`
  ? `-${Prefix}${Separator}${S}`
  : `${Prefix}${Separator}${Suffix}`

export type Corners = 't' | 'r' | 'b' | 'l' | 'tl' | 'tr' | 'bl' | 'br'
export type Edges = 'x' | 'y' | 't' | 'r' | 'b' | 'l' | 'tl' | 'tr' | 'tb' | 'bl' | 'br' | 'lr'
export type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'none'

export interface CorePlugins {
  group: '' | NonEmptyString

  // LAYOUT
  // ------
  container: ''
  box: 'border' | 'content'

  // Display
  block: ''
  inline: '' | 'block' | 'flex' | 'grid'
  flow: 'root'
  contents: ''
  hidden: ''

  float: 'right' | 'left' | 'none'
  clear: 'right' | 'left' | 'both' | 'none'
  object: // ObjectFit
  | 'contain'
    | 'cover'
    | 'fill'
    | 'none'
    | 'scale-down'
    // ObjectPosition
    | Join<'' | 'left' | 'right' | 'center', '' | 'bottom' | 'top' | 'center'>
    | FromTheme<'objectPosition'>

  overflow: Join<'' | 'x' | 'y', 'auto' | 'hidden' | 'visible' | 'scroll'> | 'ellipsis' | 'clip'
  overscroll: Join<'' | 'x' | 'y', 'auto' | 'contain' | 'none'>

  // Position
  static: ''
  fixed: ''
  absolute: ''
  relative: ''
  sticky: ''

  // Top / Right / Bottom / Left
  inset: Negatable<Join<'' | 'x' | 'y', FromTheme<'inset'>>>
  top: Negatable<FromTheme<'inset'>>
  right: Negatable<FromTheme<'inset'>>
  bottom: Negatable<FromTheme<'inset'>>
  left: Negatable<FromTheme<'inset'>>

  // Visibility
  visible: ''
  invisible: ''

  z: Negatable<FromTheme<'zIndex'>>

  // FLEXBOX
  // -------
  flex:
    | ''
    | 'nowrap'
    | Join<'row' | 'col' | 'wrap', '' | 'reverse'>
    | Join<'grow', '' | '0' | FromTheme<'flexGrow'> | Interpolate<'number'>>
    | Join<'shrink', '' | '0' | FromTheme<'flexShrink'> | Interpolate<'number'>>
    | FromTheme<'flex'>

  order: FromTheme<'order'>

  // GRID
  // -------
  grid:
    | ''
    | Join<
        'cols',
        'none' | Range<1, 12> | Interpolate<'nonzero'> | FromTheme<'gridTemplateColumns'>
      >
    | Join<'rows', 'none' | Range<1, 6> | Interpolate<'nonzero'> | FromTheme<'gridTemplateRows'>>
    | Join<'flow', Join<'row' | 'col', '' | 'dense'> | 'dense'>

  col:
    | Join<'span', Range<1, 12> | Interpolate<'nonzero'>>
    | Join<'start', 'auto' | Range<1, 13> | Interpolate<'nonzero'> | FromTheme<'gridColumnStart'>>
    | Join<'end', 'auto' | Range<1, 13> | Interpolate<'nonzero'> | FromTheme<'gridColumnEnd'>>
    | FromTheme<'gridColumn'>

  row:
    | Join<'span', Range<1, 12> | Interpolate<'nonzero'>>
    | Join<'start', 'auto' | Range<1, 13> | Interpolate<'nonzero'> | FromTheme<'gridRowStart'>>
    | Join<'end', 'auto' | Range<1, 13> | Interpolate<'nonzero'> | FromTheme<'gridRowEnd'>>
    | FromTheme<'gridRow'>

  auto:
    | Join<'cols', 'auto' | FromTheme<'gridAutoColumns'>>
    | Join<'rows', 'auto' | FromTheme<'gridAutoRows'>>

  gap: Join<'' | 'x' | 'y', FromTheme<'gap'>>

  // BOX ALIGNMENT
  // -------------
  justify:
    | 'start'
    | 'end'
    | 'center'
    | 'between'
    | 'around'
    | 'evenly'
    | Join<'items' | 'self', 'auto' | 'start' | 'end' | 'center' | 'stretch'>

  content: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  items: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  self: 'auto' | 'start' | 'end' | 'center' | 'stretch'

  place:
    | Join<'content', 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'stretch'>
    | Join<'items' | 'self', 'auto' | 'start' | 'end' | 'center' | 'stretch'>

  // SPACING
  // -------
  p: FromTheme<'padding'>
  py: FromTheme<'padding'>
  px: FromTheme<'padding'>
  pt: FromTheme<'padding'>
  pr: FromTheme<'padding'>
  pb: FromTheme<'padding'>
  pl: FromTheme<'padding'>

  m: Negatable<FromTheme<'margin'>>
  my: Negatable<FromTheme<'margin'>>
  mx: Negatable<FromTheme<'margin'>>
  mt: Negatable<FromTheme<'margin'>>
  mr: Negatable<FromTheme<'margin'>>
  mb: Negatable<FromTheme<'margin'>>
  ml: Negatable<FromTheme<'margin'>>

  space: Negatable<Join<'x' | 'y', FromTheme<'space'>>> | Join<'x' | 'y', 'reverse'>

  // SIZING
  // ------
  w: FromTheme<'width'>
  min: Join<'w', FromTheme<'minWidth'>> | Join<'h', FromTheme<'minHeight'>>
  max: Join<'w', FromTheme<'maxWidth'>> | Join<'h', FromTheme<'maxHeight'>>
  h: FromTheme<'height'>

  // TYPOGRAPHY
  // ----------
  font: FromTheme<'fontFamily'> | FromTheme<'fontWeight'> | 'italic' | 'not-italic'
  text:
    | FromTheme<'fontSize'>
    | 'left'
    | 'right'
    | 'center'
    | 'justify'
    | FromTheme<'textColor'>
    | Join<'opacity', FromTheme<'textOpacity'>>
    | 'underline'
    | 'no-underline'
    | 'line-through'
    | 'uppercase'
    | 'lowercase'
    | 'capitalize'
    | 'normal-case'
  antialiased: ''
  'subpixel-antialiased': ''
  italic: ''
  'not-italic': ''
  'normal-nums': ''
  ordinal: ''
  'slashed-zero': ''
  'lining-nums': ''
  'oldstyle-nums': ''
  'proportional-nums': ''
  'tabular-nums': ''
  'diagonal-fractions': ''
  'stacked-fractions': ''
  tracking: FromTheme<'letterSpacing'>
  leading: FromTheme<'lineHeight'>
  list:
    | 'inside'
    | 'outside'
    | 'none'
    | 'disc'
    | 'circle'
    | 'sqaure'
    | 'decimal'
    | 'decimal-leading-zero'
    | Join<'lower' | 'upper', 'roman' | 'greek' | 'alpha' | 'latin'>
    | FromTheme<'listStyleType'>
  // | 'arabic-indic'
  // | 'armenian'
  // | 'bengali'
  // | 'cjk-earthly-branch'
  // | 'devanagari'
  // | 'georgian'
  // | 'gujarati'
  // | 'gurmukhi'
  // | 'kannada'
  // | 'khmer'
  // | 'lao'
  // | 'malayalam'
  // | 'oriya'
  // | 'telugu'
  // | 'thai'

  placeholder: FromTheme<'placeholderColor'> | Join<'opacity', FromTheme<'placeholderOpacity'>>
  underline: ''
  'no-underline': ''
  'line-through': ''
  uppercase: ''
  lowercase: ''
  capitalize: ''
  'normal-case': ''
  truncate: ''
  align: 'baseline' | 'top' | 'middle' | 'bottom' | 'text-top' | 'text-bottom' | 'sub' | 'super'
  whitespace: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces'
  break: 'normal' | 'words' | 'all'

  // BACKGROUNDS
  // -----------
  bg:
    | 'fixed'
    | 'local'
    | 'scroll'
    | Join<'clip', 'border' | 'padding' | 'content' | 'text'>
    | FromTheme<'backgroundColor'>
    | Join<'opacity', FromTheme<'backgroundOpacity'>>
    | Join<'' | 'left' | 'right' | 'center', '' | 'bottom' | 'top' | 'center'>
    | FromTheme<'backgroundPosition'>
    | 'no-repeat'
    | Join<'repeat', '' | 'x' | 'y' | 'round' | 'space'>
    | Join<'gradient-to', Corners>
    | FromTheme<'backgroundImage'>
    | FromTheme<'backgroundSize'>
  from: FromTheme<'gradientColorStops'>
  via: FromTheme<'gradientColorStops'>
  to: FromTheme<'gradientColorStops'>

  // BORDERS
  // -------
  rounded: Join<'' | Corners, FromTheme<'borderRadius'>>
  border:
    | Join<'' | Edges, FromTheme<'borderWidth'>>
    | FromTheme<'borderColor'>
    | Join<'opacity', FromTheme<'borderOpacity'>>
    | BorderStyle
    | 'collapse'
    | 'separate'
  divide:
    | Join<'x' | 'y', 'reverse' | FromTheme<'divideWidth'>>
    | FromTheme<'divideColor'>
    | Join<'opacity', FromTheme<'divideOpacity'>>
    | BorderStyle
  ring:
    | 'inset'
    | FromTheme<'ringWidth'>
    | FromTheme<'ringColor'>
    | Join<'opacity', FromTheme<'ringOpacity'>>
    | Join<'offset', FromTheme<'ringOffsetWidth'> | FromTheme<'ringOffsetColor'>>

  // EFFECTS
  // -------
  shadow: FromTheme<'boxShadow'>
  opacity: FromTheme<'opacity'>

  // TABLES
  // ------
  table:
    | ''
    | 'caption'
    | 'cell'
    | 'column'
    | Join<'column' | 'footer' | 'header' | 'row', 'group'>
    | 'row'
    | 'auto'
    | 'fixed'

  // TRANSITIONS AND ANIMATION
  // -------------------------
  transition: FromTheme<'transitionProperty'>
  duration: FromTheme<'durations'>
  ease: FromTheme<'transitionTimingFunction'>
  delay: FromTheme<'transitionDelay'>
  animate: FromTheme<'animation'>

  // TRANSFORMS
  // ----------
  transform: '' | 'gpu' | 'none'
  origin: 'center' | Join<'' | 'top' | 'bottom', '' | 'right' | 'left'>
  rotate: Negatable<FromTheme<'rotate'>>
  scale: Join<'' | 'x' | 'y', FromTheme<'scale'>>
  skew: Negatable<Join<'' | 'x' | 'y', FromTheme<'skew'>>>
  translate: Negatable<Join<'' | 'x' | 'y', FromTheme<'translate'>>>

  // INTERACTIVITY
  // -------------
  appearance: 'none' | 'auto' | 'menulist-button' | 'textfield'
  cursor:
    | FromTheme<'cursor'>
    | 'auto'
    | 'default'
    | 'pointer'
    | 'wait'
    | 'text'
    | 'move'
    | 'help'
    | 'not-allowed'
    | 'none'
    | 'context-menu'
    | 'progress'
    | 'cell'
    | 'crosshair'
    | 'vertical-text'
    | 'alias'
    | 'copy'
    | 'no-drop'
    | 'e-resize'
    | 'n-resize'
    | 'ne-resize'
    | 'nw-resize'
    | 's-resize'
    | 'se-resize'
    | 'sw-resize'
    | 'w-resize'
    | 'ew-resize'
    | 'ns-resize'
    | 'nesw-resize'
    | 'nwse-resize'
    | 'col-resize'
    | 'row-resize'
    | 'all-scroll'
    | 'zoom-in'
    | 'zoom-out'
    | 'grab'
    | 'grabbing'
  outline: FromTheme<'outline'>
  'pointer-events': 'auto' | 'none'
  resize: 'none' | 'x' | 'y' | ''
  select: 'none' | 'auto' | 'text' | 'contain' | 'all'

  // SVG
  // ---
  fill: FromTheme<'fill'>
  stroke: FromTheme<'stroke'> | FromTheme<'strokeWidth'>

  // ACCESSIBILITY
  // -------------
  'sr-only': ''
  'not-sr-only': ''
}

export type ToString<T> = T extends string ? T : T extends number ? `${T}` : never

export type JoinFromObject<T, Separator extends string = '-'> = {
  [P in keyof T]: Join<ToString<P>, ToString<T[P]>, Separator>
}[keyof T]

/* eslint-disable @typescript-eslint/no-empty-interface */

/** For adding additional variants */
export interface Variants {}

/** For adding additional plugins */
export interface Plugins {}

/* eslint-enable @typescript-eslint/no-empty-interface */

export type CoreCompletionTokens =
  | `${FromTheme<'screens'>}:`
  | `${'' | 'not-'}${SimplePseudoClasses}:`
  | `${Join<'group', '' | Interpolate<'string'>>}-${SimplePseudoClasses}:`
  | `${SimplePseudoElements}::`
  | `${CoreVariants}:`

export type UserCompletionTokens =
  | { [K in keyof Variants]: `${ToString<K>}:` }[keyof Variants]
  | JoinFromObject<CorePlugins & Plugins>

export type CompletionTokens = CoreCompletionTokens | UserCompletionTokens

// const x: CompletionTokens = ''
// console.log(x)
