/**
 * @module @twind/preset-tailwind/rules
 */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import type {
  MatchResult,
  Rule,
  MaybeArray,
  CSSProperties,
  CSSObject,
  CSSBase,
  ThemeMatchResult,
  ThemeRuleResolver,
  ColorFromThemeValue,
  AutocompleteProvider,
} from '@twind/core'

import { DEV } from 'distilt/env'

import {
  mql,
  match,
  matchTheme,
  matchColor,
  toColorValue,
  toCSS,
  asArray,
  arbitrary,
  withAutocomplete,
} from '@twind/core'

import type { TailwindTheme } from './types'

// indirection wrapper to remove autocomplete functions from production bundles
function withAutocomplete$(
  rule: Rule<TailwindTheme>,
  autocomplete: AutocompleteProvider<TailwindTheme> | false,
): Rule<TailwindTheme> {
  if (DEV) {
    return withAutocomplete(rule, autocomplete)
  }

  return rule
}

const rules: Rule<TailwindTheme>[] = [
  /* arbitrary properties: [paint-order:markers] */
  match('\\[([-\\w]+):(.+)]', ({ 1: $1, 2: $2 }, context) => ({
    '@layer overrides': {
      '&': {
        [$1]: arbitrary(`[${$2}]`, '', context),
      },
    },
  })),

  /* Styling based on parent and peer state */
  withAutocomplete$(
    match('(group|peer)([~/][^-[]+)?', ({ input }, { h }) => [{ c: h(input) }]),
    DEV && (() => ['group', 'peer']),
  ),

  /* LAYOUT */
  matchTheme('aspect-', 'aspectRatio'),

  match('container', (_, { theme }) => {
    const { screens = theme('screens'), center, padding } = theme('container')

    const rules = {
      width: '100%',
      marginRight: center && 'auto',
      marginLeft: center && 'auto',
      ...paddingFor('xs'),
    } as CSSObject

    for (const screen in screens) {
      const value = screens[screen]

      if (typeof value == 'string') {
        rules[mql(value)] = {
          '&': {
            maxWidth: value,
            ...paddingFor(screen),
          },
        }
      }
    }

    return rules

    function paddingFor(screen: string): CSSProperties | undefined {
      const value =
        padding && (typeof padding == 'string' ? padding : padding[screen] || padding.DEFAULT)

      if (value) {
        return {
          paddingRight: value,
          paddingLeft: value,
        }
      }
    }
  }),

  // Content
  matchTheme('content-', 'content', ({ _ }) => ({
    '--tw-content': _,
    content: 'var(--tw-content)',
  })),

  // Box Decoration Break
  match('(?:box-)?decoration-(slice|clone)', 'boxDecorationBreak'),

  // Box Sizing
  match('box-(border|content)', 'boxSizing', ({ 1: $1 }) => $1 + '-box'),

  // Display
  match('hidden', { display: 'none' }),

  // Table Layout
  match('table-(auto|fixed)', 'tableLayout'),

  match(
    [
      '(block|flex|table|grid|inline|contents|flow-root|list-item)',
      '(inline-(block|flex|table|grid))',
      '(table-(caption|cell|column|row|(column|row|footer|header)-group))',
    ],
    'display',
  ),

  // Floats
  '(float)-(left|right|none)',

  // Clear
  '(clear)-(left|right|none|both)',

  // Overflow
  '(overflow(?:-[xy])?)-(auto|hidden|clip|visible|scroll)',

  // Isolation
  '(isolation)-(auto)',

  // Isolation
  match('isolate', 'isolation'),

  // Object Fit
  match('object-(contain|cover|fill|none|scale-down)', 'objectFit'),

  // Object Position
  matchTheme('object-', 'objectPosition'),
  match('object-(top|bottom|center|(left|right)(-(top|bottom))?)', 'objectPosition', spacify),

  // Overscroll Behavior
  match('overscroll(-[xy])?-(auto|contain|none)', ({ 1: $1 = '', 2: $2 }) => ({
    [('overscroll-behavior' + $1) as 'overscroll-behavior-x']: $2 as 'auto',
  })),

  // Position
  match('(static|fixed|absolute|relative|sticky)', 'position'),

  // Top / Right / Bottom / Left
  matchTheme('-?inset(-[xy])?(?:$|-)', 'inset', ({ 1: $1, _ }) => ({
    top: $1 != '-x' && _,
    right: $1 != '-y' && _,
    bottom: $1 != '-x' && _,
    left: $1 != '-y' && _,
  })),

  matchTheme('-?(top|bottom|left|right)(?:$|-)', 'inset'),

  // Visibility
  match('(visible|collapse)', 'visibility'),
  match('invisible', { visibility: 'hidden' }),

  // Z-Index
  matchTheme('-?z-', 'zIndex'),

  /* FLEXBOX */
  // Flex Direction
  match('flex-((row|col)(-reverse)?)', 'flexDirection', columnify),

  match('flex-(wrap|wrap-reverse|nowrap)', 'flexWrap'),
  matchTheme('(flex-(?:grow|shrink))(?:$|-)' /*, 'flex-grow' | flex-shrink */),
  matchTheme('(flex)-' /*, 'flex' */),
  matchTheme('grow(?:$|-)', 'flexGrow'),
  matchTheme('shrink(?:$|-)', 'flexShrink'),
  matchTheme('basis-', 'flexBasis'),

  matchTheme('-?(order)-' /*, 'order' */),
  withAutocomplete$('-?(order)-(\\d+)', DEV && (() => range({ end: 12 }))),

  /* GRID */
  // Grid Template Columns
  matchTheme('grid-cols-', 'gridTemplateColumns'),
  withAutocomplete$(
    match('grid-cols-(\\d+)', 'gridTemplateColumns', gridTemplate),
    DEV && (() => range({ end: 6 })),
  ),

  // Grid Column Start / End
  matchTheme('col-', 'gridColumn'),
  withAutocomplete$(
    match('col-(span)-(\\d+)', 'gridColumn', span),
    DEV && (() => range({ end: 12 })),
  ),

  matchTheme('col-start-', 'gridColumnStart'),
  withAutocomplete$(
    match('col-start-(auto|\\d+)', 'gridColumnStart'),
    DEV && (({ 1: $1 }) => ($1 === 'auto' ? [''] : range({ end: 13 }))),
  ),

  matchTheme('col-end-', 'gridColumnEnd'),
  withAutocomplete$(
    match('col-end-(auto|\\d+)', 'gridColumnEnd'),
    DEV && (({ 1: $1 }) => ($1 === 'auto' ? [''] : range({ end: 13 }))),
  ),

  // Grid Template Rows
  matchTheme('grid-rows-', 'gridTemplateRows'),
  withAutocomplete$(
    match('grid-rows-(\\d+)', 'gridTemplateRows', gridTemplate),
    DEV && (() => range({ end: 6 })),
  ),

  // Grid Row Start / End
  matchTheme('row-', 'gridRow'),
  withAutocomplete$(match('row-(span)-(\\d+)', 'gridRow', span), DEV && (() => range({ end: 6 }))),

  matchTheme('row-start-', 'gridRowStart'),
  withAutocomplete$(
    match('row-start-(auto|\\d+)', 'gridRowStart'),
    DEV && (({ 1: $1 }) => ($1 === 'auto' ? [''] : range({ end: 7 }))),
  ),

  matchTheme('row-end-', 'gridRowEnd'),
  withAutocomplete$(
    match('row-end-(auto|\\d+)', 'gridRowEnd'),
    DEV && (({ 1: $1 }) => ($1 === 'auto' ? [''] : range({ end: 7 }))),
  ),

  // Grid Auto Flow
  match('grid-flow-((row|col)(-dense)?)', 'gridAutoFlow', (match) => spacify(columnify(match))),
  match('grid-flow-(dense)', 'gridAutoFlow'),

  // Grid Auto Columns
  matchTheme('auto-cols-', 'gridAutoColumns'),

  // Grid Auto Rows
  matchTheme('auto-rows-', 'gridAutoRows'),

  // Gap
  matchTheme('gap-x(?:$|-)', 'gap', 'columnGap'),
  matchTheme('gap-y(?:$|-)', 'gap', 'rowGap'),
  matchTheme('gap(?:$|-)', 'gap'),

  /* BOX ALIGNMENT */
  // Justify Items
  // Justify Self
  withAutocomplete$(
    '(justify-(?:items|self))-',
    DEV &&
      (({ 1: $1 }) =>
        $1.endsWith('-items-')
          ? ['start', 'end', 'center', 'stretch']
          : /* '-self-' */ ['auto', 'start', 'end', 'center', 'stretch']),
  ),

  // Justify Content
  withAutocomplete$(
    match('justify-', 'justifyContent', convertContentValue),
    DEV && (() => ['start', 'end', 'center', 'between', 'around', 'evenly']),
  ),

  // Align Content
  // Align Items
  // Align Self
  withAutocomplete$(
    match('(content|items|self)-', (match) => ({
      [('align-' + match[1]) as 'align-content']: convertContentValue(match),
    })),
    DEV &&
      (({ 1: $1 }) =>
        $1 == 'content'
          ? ['center', 'start', 'end', 'between', 'around', 'evenly', 'stretch', 'baseline']
          : $1 == 'items'
          ? ['start', 'end', 'center', 'stretch', 'baseline']
          : /* $1 == 'self' */ ['auto', 'start', 'end', 'center', 'stretch', 'baseline']),
  ),

  // Place Content
  // Place Items
  // Place Self
  withAutocomplete$(
    match('(place-(content|items|self))-', ({ 1: $1, $$ }) => ({
      [$1 as 'place-content']: ('wun'.includes($$[3]) ? 'space-' : '') + $$,
    })),
    DEV &&
      (({ 2: $2 }) =>
        $2 == 'content'
          ? ['center', 'start', 'end', 'between', 'around', 'evenly', 'stretch', 'baseline']
          : $2 == 'items'
          ? ['start', 'end', 'center', 'stretch', 'baseline']
          : /* $2 == 'self' */ ['auto', 'start', 'end', 'center', 'stretch', 'baseline']),
  ),

  /* SPACING */
  // Padding
  matchTheme('p([xytrbl])?(?:$|-)', 'padding', edge('padding')),

  // Margin
  matchTheme('-?m([xytrbl])?(?:$|-)', 'margin', edge('margin')),

  // Space Between
  matchTheme('-?space-(x|y)(?:$|-)', 'space', ({ 1: $1, _ }) => ({
    '&>:not([hidden])~:not([hidden])': {
      [`--tw-space-${$1}-reverse`]: '0',
      ['margin-' +
      { y: 'top', x: 'left' }[
        $1 as 'y' | 'x'
      ]]: `calc(${_} * calc(1 - var(--tw-space-${$1}-reverse)))`,
      ['margin-' +
      { y: 'bottom', x: 'right' }[$1 as 'y' | 'x']]: `calc(${_} * var(--tw-space-${$1}-reverse))`,
    },
  })),

  match('space-(x|y)-reverse', ({ 1: $1 }) => ({
    '&>:not([hidden])~:not([hidden])': {
      [`--tw-space-${$1}-reverse`]: '1',
    },
  })),

  /* SIZING */
  // Width
  matchTheme('w-', 'width'),

  // Min-Width
  matchTheme('min-w-', 'minWidth'),

  // Max-Width
  matchTheme('max-w-', 'maxWidth'),

  // Height
  matchTheme('h-', 'height'),

  // Min-Height
  matchTheme('min-h-', 'minHeight'),

  // Max-Height
  matchTheme('max-h-', 'maxHeight'),

  /* TYPOGRAPHY */
  // Font Weight
  matchTheme('font-', 'fontWeight'),

  // Font Family
  matchTheme('font-', 'fontFamily', ({ _ }) => {
    _ = asArray(_)

    if (typeof _[1] == 'string') {
      return { fontFamily: join(_ as MaybeArray<string>) }
    }

    return {
      fontFamily: join(_[0]),
      ...(_[1] as { fontFeatureSettings?: string }),
    }
  }),

  // Font Smoothing
  match('antialiased', {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  }),

  match('subpixel-antialiased', {
    WebkitFontSmoothing: 'auto',
    MozOsxFontSmoothing: 'auto',
  }),

  // Font Style
  match('italic', 'fontStyle'),
  match('not-italic', { fontStyle: 'normal' }),

  // Font Variant Numeric
  match(
    '(ordinal|slashed-zero|(normal|lining|oldstyle|proportional|tabular)-nums|(diagonal|stacked)-fractions)',
    ({ 1: $1, 2: $2 = '', 3: $3 }) =>
      // normal-nums
      $2 == 'normal'
        ? { fontVariantNumeric: 'normal' }
        : {
            [('--tw-' +
              ($3 // diagonal-fractions, stacked-fractions
                ? 'numeric-fraction'
                : 'pt'.includes($2[0]) // proportional-nums, tabular-nums
                ? 'numeric-spacing'
                : $2 // lining-nums, oldstyle-nums
                ? 'numeric-figure'
                : // ordinal, slashed-zero
                  $1)) as 'numeric-spacing']: $1,
            fontVariantNumeric:
              'var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)',
            ...asDefaults({
              '--tw-ordinal': 'var(--tw-empty,/*!*/ /*!*/)',
              '--tw-slashed-zero': 'var(--tw-empty,/*!*/ /*!*/)',
              '--tw-numeric-figure': 'var(--tw-empty,/*!*/ /*!*/)',
              '--tw-numeric-spacing': 'var(--tw-empty,/*!*/ /*!*/)',
              '--tw-numeric-fraction': 'var(--tw-empty,/*!*/ /*!*/)',
            }),
          },
  ),

  // Letter Spacing
  matchTheme('tracking-', 'letterSpacing'),

  // Line Height
  matchTheme('leading-', 'lineHeight'),

  // List Style Position
  match('list-(inside|outside)', 'listStylePosition'),

  // List Style Type
  matchTheme('list-', 'listStyleType'),
  withAutocomplete$(match('list-', 'listStyleType'), DEV && (() => ['none', 'disc', 'decimal'])),

  // Placeholder Opacity
  matchTheme('placeholder-opacity-', 'placeholderOpacity', ({ _ }) => ({
    ['&::placeholder']: { '--tw-placeholder-opacity': _ },
  })),

  // Placeholder Color
  matchColor('placeholder-', { property: 'color', selector: '&::placeholder' }),

  // Text Alignment
  match('text-(left|center|right|justify|start|end)', 'textAlign'),

  match('text-(ellipsis|clip)', 'textOverflow'),

  // Text Opacity
  matchTheme('text-opacity-', 'textOpacity', '--tw-text-opacity'),

  // Text Color
  matchColor('text-', { property: 'color' }),

  // Font Size
  matchTheme('text-', 'fontSize', ({ _ }) =>
    typeof _ == 'string'
      ? { fontSize: _ }
      : {
          fontSize: _[0],
          ...(typeof _[1] == 'string' ? { lineHeight: _[1] } : _[1]),
        },
  ),

  // Text Indent
  matchTheme('indent-', 'textIndent'),

  // Text Decoration
  match('(overline|underline|line-through)', 'textDecorationLine'),
  match('no-underline', { textDecorationLine: 'none' }),

  // Text Underline offset
  matchTheme('underline-offset-', 'textUnderlineOffset'),

  // Text Decoration Color
  matchColor('decoration-', {
    section: 'textDecorationColor',
    opacityVariable: false,
    opacitySection: 'opacity',
  }),

  // Text Decoration Thickness
  matchTheme('decoration-', 'textDecorationThickness'),

  // Text Decoration Style
  withAutocomplete$(
    match('decoration-', 'textDecorationStyle'),
    DEV && (() => ['solid', 'double', 'dotted', 'dashed', 'wavy']),
  ),

  // Text Transform
  match('(uppercase|lowercase|capitalize)', 'textTransform'),
  match('normal-case', { textTransform: 'none' }),

  // Text Overflow
  match('truncate', {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),

  // Vertical Alignment
  withAutocomplete$(
    match('align-', 'verticalAlign'),
    DEV &&
      (() => ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom', 'sub', 'super']),
  ),

  // Whitespace
  withAutocomplete$(
    match('whitespace-', 'whiteSpace'),
    DEV && (() => ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap']),
  ),

  // Word Break
  match('break-normal', { wordBreak: 'normal', overflowWrap: 'normal' }),
  match('break-words', { overflowWrap: 'break-word' }),
  match('break-all', { wordBreak: 'break-all' }),
  match('break-keep', { wordBreak: 'keep-all' }),

  // Caret Color
  matchColor('caret-', {
    // section: 'caretColor',
    opacityVariable: false,
    opacitySection: 'opacity',
  }),

  // Accent Color
  matchColor('accent-', {
    // section: 'accentColor',
    opacityVariable: false,
    opacitySection: 'opacity',
  }),

  // Gradient Color Stops
  match(
    'bg-gradient-to-([trbl]|[tb][rl])',
    'backgroundImage',
    ({ 1: $1 }) => `linear-gradient(to ${position($1, ' ')},var(--tw-gradient-stops))`,
  ),

  matchColor(
    'from-',
    {
      section: 'gradientColorStops',
      opacityVariable: false,
      opacitySection: 'opacity',
    },
    ({ _ }) => ({
      '--tw-gradient-from': _.value,
      '--tw-gradient-to': _.color({ opacityValue: '0' }),
      '--tw-gradient-stops': `var(--tw-gradient-from),var(--tw-gradient-to)`,
    }),
  ),
  matchColor(
    'via-',

    {
      section: 'gradientColorStops',
      opacityVariable: false,
      opacitySection: 'opacity',
    },
    ({ _ }) => ({
      '--tw-gradient-to': _.color({ opacityValue: '0' }),
      '--tw-gradient-stops': `var(--tw-gradient-from),${_.value},var(--tw-gradient-to)`,
    }),
  ),
  matchColor('to-', {
    section: 'gradientColorStops',
    property: '--tw-gradient-to',
    opacityVariable: false,
    opacitySection: 'opacity',
  }),

  /* BACKGROUNDS */
  // Background Attachment
  match('bg-(fixed|local|scroll)', 'backgroundAttachment'),

  // Background Origin
  match('bg-origin-(border|padding|content)', 'backgroundOrigin', ({ 1: $1 }) => $1 + '-box'),

  // Background Repeat
  match(['bg-(no-repeat|repeat(-[xy])?)', 'bg-repeat-(round|space)'], 'backgroundRepeat'),

  // Background Blend Mode
  withAutocomplete$(
    match('bg-blend-', 'backgroundBlendMode'),
    DEV &&
      (() => [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity',
      ]),
  ),

  // Background Clip
  match(
    'bg-clip-(border|padding|content|text)',
    'backgroundClip',
    ({ 1: $1 }) => $1 + ($1 == 'text' ? '' : '-box'),
  ),

  // Background Opacity
  matchTheme('bg-opacity-', 'backgroundOpacity', '--tw-bg-opacity'),

  // Background Color
  // bg-${backgroundColor}/${backgroundOpacity}
  matchColor('bg-', { section: 'backgroundColor' }),

  // Background Image
  // supported arbitrary types are: length, color, angle, list
  matchTheme('bg-', 'backgroundImage'),

  // Background Position
  matchTheme('bg-', 'backgroundPosition'),
  match('bg-(top|bottom|center|(left|right)(-(top|bottom))?)', 'backgroundPosition', spacify),

  // Background Size
  matchTheme('bg-', 'backgroundSize'),

  /* BORDERS */
  // Border Radius
  matchTheme('rounded(?:$|-)', 'borderRadius'),
  matchTheme('rounded-([trbl]|[tb][rl])(?:$|-)', 'borderRadius', ({ 1: $1, _ }) => {
    const corners = (
      {
        t: ['tl', 'tr'],
        r: ['tr', 'br'],
        b: ['bl', 'br'],
        l: ['bl', 'tl'],
      } as const
    )[$1] || [$1, $1]

    return {
      [`border-${position(corners[0])}-radius` as 'border-top-left-radius']: _,
      [`border-${position(corners[1])}-radius` as 'border-top-right-radius']: _,
    }
  }),

  // Border Collapse
  match('border-(collapse|separate)', 'borderCollapse'),

  // Border Opacity
  matchTheme('border-opacity(?:$|-)', 'borderOpacity', '--tw-border-opacity'),

  // Border Style
  match('border-(solid|dashed|dotted|double|none)', 'borderStyle'),

  // Border Spacing
  matchTheme('border-spacing(-[xy])?(?:$|-)', 'borderSpacing', ({ 1: $1, _ }) => ({
    ...asDefaults({
      '--tw-border-spacing-x': '0',
      '--tw-border-spacing-y': '0',
    }),
    [('--tw-border-spacing' + ($1 || '-x')) as '--tw-border-spacing-x']: _,
    [('--tw-border-spacing' + ($1 || '-y')) as '--tw-border-spacing-y']: _,
    'border-spacing': 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)',
  })),

  // Border Color
  matchColor('border-([xytrbl])-', { section: 'borderColor' }, edge('border', 'Color')),
  matchColor('border-'),

  // Border Width
  matchTheme('border-([xytrbl])(?:$|-)', 'borderWidth', edge('border', 'Width')),
  matchTheme('border(?:$|-)', 'borderWidth'),

  // Divide Opacity
  matchTheme('divide-opacity(?:$|-)', 'divideOpacity', ({ _ }) => ({
    '&>:not([hidden])~:not([hidden])': { '--tw-divide-opacity': _ },
  })),

  // Divide Style
  match('divide-(solid|dashed|dotted|double|none)', ({ 1: $1 }) => ({
    '&>:not([hidden])~:not([hidden])': { borderStyle: $1 },
  })),

  // Divide Width
  match('divide-([xy]-reverse)', ({ 1: $1 }) => ({
    '&>:not([hidden])~:not([hidden])': { ['--tw-divide-' + $1]: '1' },
  })),

  matchTheme('divide-([xy])(?:$|-)', 'divideWidth', ({ 1: $1, _ }) => {
    const edges = (
      {
        x: 'lr',
        y: 'tb',
      } as const
    )[$1 as 'x' | 'y']

    return {
      '&>:not([hidden])~:not([hidden])': {
        [`--tw-divide-${$1}-reverse`]: '0',
        [`border-${position(
          edges[0],
        )}Width`]: `calc(${_} * calc(1 - var(--tw-divide-${$1}-reverse)))`,
        [`border-${position(edges[1])}Width`]: `calc(${_} * var(--tw-divide-${$1}-reverse))`,
      },
    }
  }),

  // Divide Color
  matchColor('divide-', {
    // section: $0.replace('-', 'Color') -> 'divideColor'
    property: 'borderColor',
    // opacityVariable: '--tw-border-opacity',
    // opacitySection: section.replace('Color', 'Opacity') -> 'divideOpacity'
    selector: '&>:not([hidden])~:not([hidden])',
  }),

  // Ring Offset Opacity
  matchTheme('ring-opacity(?:$|-)', 'ringOpacity', '--tw-ring-opacity'),

  // Ring Offset Color
  matchColor('ring-offset-', {
    // section: 'ringOffsetColor',
    property: '--tw-ring-offset-color',
    opacityVariable: false,
    // opacitySection: section.replace('Color', 'Opacity') -> 'ringOffsetOpacity'
  }),

  // Ring Offset Width
  matchTheme('ring-offset(?:$|-)', 'ringOffsetWidth', '--tw-ring-offset-width'),

  // Ring Inset
  match('ring-inset', { '--tw-ring-inset': 'inset' }),

  // Ring Color
  matchColor('ring-', {
    // section: 'ringColor',
    property: '--tw-ring-color',
    // opacityVariable: '--tw-ring-opacity',
    // opacitySection: section.replace('Color', 'Opacity') -> 'ringOpacity'
  }),

  // Ring Width
  matchTheme('ring(?:$|-)', 'ringWidth', ({ _ }, { theme }) => ({
    ...asDefaults({
      '--tw-ring-offset-shadow': '0 0 #0000',
      '--tw-ring-shadow': '0 0 #0000',
      '--tw-shadow': '0 0 #0000',
      '--tw-shadow-colored': '0 0 #0000',
      // Within own declaration to have the defaults above to be merged with defaults from shadow
      '&': {
        '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-ring-offset-width': theme('ringOffsetWidth', '', '0px'),
        '--tw-ring-offset-color': toColorValue(theme('ringOffsetColor', '', '#fff')),
        '--tw-ring-color': toColorValue(theme('ringColor', '', '#93c5fd'), {
          opacityVariable: '--tw-ring-opacity',
        }),
        '--tw-ring-opacity': theme('ringOpacity', '', '0.5'),
      },
    }),
    '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
    '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${_} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
    boxShadow: `var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)`,
  })),

  /* EFFECTS */
  // Box Shadow Color
  matchColor(
    'shadow-',
    {
      section: 'boxShadowColor',
      opacityVariable: false,
      opacitySection: 'opacity',
    },
    ({ _ }) => ({
      '--tw-shadow-color': _.value,
      '--tw-shadow': 'var(--tw-shadow-colored)',
    }),
  ),

  // Box Shadow
  matchTheme('shadow(?:$|-)', 'boxShadow', ({ _ }) => ({
    ...asDefaults({
      '--tw-ring-offset-shadow': '0 0 #0000',
      '--tw-ring-shadow': '0 0 #0000',
      '--tw-shadow': '0 0 #0000',
      '--tw-shadow-colored': '0 0 #0000',
    }),
    '--tw-shadow': join(_),
    // replace all colors with reference to --tw-shadow-colored
    // this matches colors after non-comma char (keyword, offset) before comma or the end
    '--tw-shadow-colored': (join(_) as string).replace(
      /([^,]\s+)(?:#[a-f\d]+|(?:(?:hsl|rgb)a?|hwb|lab|lch|color|var)\(.+?\)|[a-z]+)(,|$)/g,
      '$1var(--tw-shadow-color)$2',
    ),
    boxShadow: `var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)`,
  })),

  // Opacity
  matchTheme('(opacity)-' /*, 'opacity' */),

  // Mix Blend Mode
  withAutocomplete$(
    match('mix-blend-', 'mixBlendMode'),
    DEV &&
      (() => [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity',
      ]),
  ),

  /* FILTERS */
  ...filter(),
  ...filter('backdrop-'),

  /* TRANSITIONS AND ANIMATION */
  // Transition Property
  matchTheme('transition(?:$|-)', 'transitionProperty', (match, { theme }) => ({
    transitionProperty: join(match),
    transitionTimingFunction:
      match._ == 'none' ? undefined : join(theme('transitionTimingFunction', '')),
    transitionDuration: match._ == 'none' ? undefined : join(theme('transitionDuration', '')),
  })),

  // Transition Duration
  matchTheme('duration(?:$|-)', 'transitionDuration', 'transitionDuration', join),

  // Transition Timing Function
  matchTheme('ease(?:$|-)', 'transitionTimingFunction', 'transitionTimingFunction', join),

  // Transition Delay
  matchTheme('delay(?:$|-)', 'transitionDelay', 'transitionDelay', join),

  matchTheme('animate(?:$|-)', 'animation', (match, { theme, h, e }) => {
    const animation: string = join(match)

    // Try to auto inject keyframes
    const parts = animation.split(' ')
    const keyframeValues = theme('keyframes', parts[0]) as CSSBase

    if (keyframeValues) {
      return {
        [('@keyframes ' + (parts[0] = e(h(parts[0])))) as '@keyframes xxx']: keyframeValues,
        animation: parts.join(' '),
      }
    }

    return { animation }
  }),

  /* TRANSFORMS */
  // Transform
  '(transform)-(none)',
  match('transform', tranformDefaults),
  match('transform-(cpu|gpu)', ({ 1: $1 }) => ({
    '--tw-transform': transformValue($1 == 'gpu'),
  })),

  // Scale
  matchTheme(
    'scale(-[xy])?-',
    'scale',
    ({ 1: $1, _ }) =>
      ({
        [('--tw-scale' + ($1 || '-x')) as '--tw-scale-x']: _,
        [('--tw-scale' + ($1 || '-y')) as '--tw-scale-y']: _,
        ...tranformDefaults(),
      } as CSSObject),
  ),

  // Rotate
  matchTheme('-?(rotate)-', 'rotate', transform),

  // Translate
  matchTheme('-?(translate-[xy])-', 'translate', transform),

  // Skew
  matchTheme('-?(skew-[xy])-', 'skew', transform),

  // Transform Origin
  match('origin-(center|((top|bottom)(-(left|right))?)|left|right)', 'transformOrigin', spacify),

  /* INTERACTIVITY */
  // Appearance
  withAutocomplete$('(appearance)-', DEV && (() => ['auto', 'none'])),

  // Columns
  matchTheme('(columns)-' /*, 'columns' */),
  withAutocomplete$('(columns)-(\\d+)', DEV && (() => range({ end: 12 }))),

  // Break Before, After and Inside
  withAutocomplete$(
    '(break-(?:before|after|inside))-',
    DEV &&
      (({ 1: $1 }) =>
        $1.endsWith('-inside-')
          ? ['auto', 'avoid', 'avoid-page', 'avoid-column']
          : /* before || after */ [
              'auto',
              'avoid',
              'all',
              'avoid-page',
              'page',
              'left',
              'right',
              'column',
            ]),
  ),

  // Cursor
  matchTheme('(cursor)-' /*, 'cursor' */),
  withAutocomplete$(
    '(cursor)-',
    DEV &&
      (() => [
        'alias',
        'all-scroll',
        'auto',
        'cell',
        'col-resize',
        'context-menu',
        'copy',
        'crosshair',
        'default',
        'e-resize',
        'ew-resize',
        'grab',
        'grabbing',
        'help',
        'move',
        'n-resize',
        'ne-resize',
        'nesw-resize',
        'no-drop',
        'none',
        'not-allowed',
        'ns-resize',
        'nw-resize',
        'nwse-resize',
        'pointer',
        'progress',
        'row-resize',
        's-resize',
        'se-resize',
        'sw-resize',
        'text',
        'vertical-text',
        'w-resize',
        'wait',
        'zoom-in',
        'zoom-out',
      ]),
  ),

  // Scroll Snap Type
  match('snap-(none)', 'scroll-snap-type'),
  match('snap-(x|y|both)', ({ 1: $1 }) => ({
    ...asDefaults({
      '--tw-scroll-snap-strictness': 'proximity',
    }),
    'scroll-snap-type': $1 + ' var(--tw-scroll-snap-strictness)',
  })),
  match('snap-(mandatory|proximity)', '--tw-scroll-snap-strictness'),

  // Scroll Snap Align
  match('snap-(?:(start|end|center)|align-(none))', 'scroll-snap-align'),

  // Scroll Snap Stop
  match('snap-(normal|always)', 'scroll-snap-stop'),

  match('scroll-(auto|smooth)', 'scroll-behavior'),

  // Scroll Margin
  // Padding
  matchTheme('scroll-p([xytrbl])?(?:$|-)', 'padding', edge('scroll-padding')),

  // Margin
  matchTheme<TailwindTheme, 'scrollMargin'>(
    '-?scroll-m([xytrbl])?(?:$|-)',
    'scroll-margin',
    edge('scroll-margin'),
  ),

  // Touch Action
  match('touch-(auto|none|manipulation)', 'touch-action'),
  match('touch-(pinch-zoom|pan-(?:(x|left|right)|(y|up|down)))', ({ 1: $1, 2: $2, 3: $3 }) => ({
    ...asDefaults({
      '--tw-pan-x': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-pan-y': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-pinch-zoom': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-touch-action': 'var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)',
    }),
    // x, left, right -> pan-x
    // y, up, down -> pan-y
    // -> pinch-zoom
    [`--tw-${$2 ? 'pan-x' : $3 ? 'pan-y' : $1}` as '--tw-pan-x']: $1,
    'touch-action': 'var(--tw-touch-action)',
  })),

  // Outline Style
  match('outline-none', {
    outline: '2px solid transparent',
    'outline-offset': '2px',
  }),
  match('outline', { outlineStyle: 'solid' }),
  match('outline-(dashed|dotted|double)', 'outlineStyle'),

  // Outline Offset
  matchTheme('-?(outline-offset)-' /*, 'outlineOffset'*/),

  // Outline Color
  matchColor('outline-', {
    opacityVariable: false,
    opacitySection: 'opacity',
  }),

  // Outline Width
  matchTheme('outline-', 'outlineWidth'),

  // Pointer Events
  withAutocomplete$('(pointer-events)-', DEV && (() => ['auto', 'none'])),

  // Will Change
  matchTheme('(will-change)-' /*, 'willChange' */),
  withAutocomplete$('(will-change)-', DEV && (() => ['auto', 'contents', 'transform'])),

  // Resize
  [
    'resize(?:-(none|x|y))?',
    'resize',
    ({ 1: $1 }) => ({ x: 'horizontal', y: 'vertical' }[$1] || $1 || 'both'),
  ],

  // User Select
  match('select-(none|text|all|auto)', 'userSelect'),

  /* SVG */
  // Fill, Stroke
  matchColor('fill-', { section: 'fill', opacityVariable: false, opacitySection: 'opacity' }),
  matchColor('stroke-', { section: 'stroke', opacityVariable: false, opacitySection: 'opacity' }),

  // Stroke Width
  matchTheme('stroke-', 'strokeWidth'),

  /* ACCESSIBILITY */
  // Screen Readers
  match('sr-only', {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    clip: 'rect(0,0,0,0)',
    borderWidth: '0',
  }),

  match('not-sr-only', {
    position: 'static',
    width: 'auto',
    height: 'auto',
    padding: '0',
    margin: '0',
    overflow: 'visible',
    whiteSpace: 'normal',
    clip: 'auto',
  }),
]

export default rules

function spacify(value: string | MatchResult): string {
  return (typeof value == 'string' ? value : value[1]).replace(/-/g, ' ').trim()
}

function columnify(value: string | MatchResult): string {
  return (typeof value == 'string' ? value : value[1]).replace('col', 'column')
}

function position(shorthand: string, separator = '-'): string {
  const longhand: string[] = []

  for (const short of shorthand) {
    longhand.push({ t: 'top', r: 'right', b: 'bottom', l: 'left' }[short] as string)
  }

  return longhand.join(separator)
}

function join(match: ThemeMatchResult<MaybeArray<string>>): string
function join(value: MaybeArray<string> | undefined): string | undefined

function join(
  value: ThemeMatchResult<MaybeArray<string>> | MaybeArray<string> | undefined,
): string | undefined {
  return value && '' + ((value as ThemeMatchResult<MaybeArray<string>>)._ || value)
}

function convertContentValue({ $$ }: MatchResult) {
  return (
    ({
      // /* aut*/ o: '',
      /* sta*/ r /*t*/: 'flex-',
      /* end*/ '': 'flex-',
      // /* cen*/ t /*er*/: '',
      /* bet*/ w /*een*/: 'space-',
      /* aro*/ u /*nd*/: 'space-',
      /* eve*/ n /*ly*/: 'space-',
      // /* str*/ e /*tch*/: '',
      // /* bas*/ l /*ine*/: '',
    }[$$[3] || ''] || '') + $$
  )
}

function edge(
  propertyPrefix: string,
  propertySuffix = '',
): ThemeRuleResolver<string | ColorFromThemeValue, TailwindTheme> {
  return ({ 1: $1, _ }) => {
    const edges =
      {
        x: 'lr',
        y: 'tb',
      }[$1 as 'x' | 'y'] || $1 + $1

    return edges
      ? {
          ...toCSS(propertyPrefix + '-' + position(edges[0]) + propertySuffix, _),
          ...toCSS(propertyPrefix + '-' + position(edges[1]) + propertySuffix, _),
        }
      : toCSS(propertyPrefix + propertySuffix, _)
  }
}

function filter(prefix = ''): Rule<TailwindTheme>[] {
  const filters = [
    'blur',
    'brightness',
    'contrast',
    'grayscale',
    'hue-rotate',
    'invert',
    prefix && 'opacity',
    'saturate',
    'sepia',
    !prefix && 'drop-shadow',
  ].filter(Boolean) as string[]

  let defaults = {} as CSSObject

  // first create properties defaults
  for (const key of filters) {
    defaults[`--tw-${prefix}${key}` as '--tw-blur'] = 'var(--tw-empty,/*!*/ /*!*/)'
  }

  defaults = {
    // move defaults
    ...asDefaults(defaults),
    // add default filter which allows standalone usage
    [`${prefix}filter`]: filters.map((key) => `var(--tw-${prefix}${key})`).join(' '),
  } as CSSObject

  return [
    `(${prefix}filter)-(none)`,

    match(`${prefix}filter`, defaults),

    ...filters.map((key) =>
      matchTheme<TailwindTheme, 'hueRotate' | 'dropShadow'>(
        // hue-rotate can be negated
        `${key[0] == 'h' ? '-?' : ''}(${prefix}${key})(?:$|-)`,

        key as 'hueRotate' | 'dropShadow',
        ({ 1: $1, _ }) =>
          ({
            [`--tw-${$1}`]: asArray(_)
              .map((value) => `${key}(${value})`)
              .join(' '),
            ...defaults,
          } as CSSObject),
      ),
    ),
  ]
}

function transform({ 1: $1, _ }: ThemeMatchResult<string>): CSSObject {
  return {
    ['--tw-' + $1]: _,
    ...tranformDefaults(),
  } as CSSObject
}

function tranformDefaults(): CSSObject {
  return {
    ...asDefaults({
      '--tw-translate-x': '0',
      '--tw-translate-y': '0',
      '--tw-rotate': '0',
      '--tw-skew-x': '0',
      '--tw-skew-y': '0',
      '--tw-scale-x': '1',
      '--tw-scale-y': '1',
      '--tw-transform': transformValue(),
    }),
    transform: 'var(--tw-transform)',
  }
}

function transformValue(gpu?: boolean): string {
  return [
    gpu // -gpu
      ? 'translate3d(var(--tw-translate-x),var(--tw-translate-y),0)'
      : 'translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y))',
    'rotate(var(--tw-rotate))',
    'skewX(var(--tw-skew-x))',
    'skewY(var(--tw-skew-y))',
    'scaleX(var(--tw-scale-x))',
    'scaleY(var(--tw-scale-y))',
  ].join(' ')
}
function span({ 1: $1, 2: $2 }: MatchResult) {
  return `${$1} ${$2} / ${$1} ${$2}`
}

function gridTemplate({ 1: $1 }: MatchResult) {
  return `repeat(${$1},minmax(0,1fr))`
}

function range({
  start = 1,
  end,
  step = 1,
}: {
  start?: number
  end: number
  step?: number
}): string[] {
  const result: string[] = []

  for (let index = start; index <= end; index += step) {
    result.push(`${index}`)
  }

  return result
}

function asDefaults(props: CSSObject): { '@layer defaults': CSSBase } {
  return {
    '@layer defaults': {
      '*,::before,::after': props,
      '::backdrop': props,
    },
  }
}
