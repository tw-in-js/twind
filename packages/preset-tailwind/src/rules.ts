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
} from 'twind'

import { DEV } from 'distilt/env'

import {
  mql,
  useMatch,
  useTheme,
  useColor,
  toColorValue,
  toCSS,
  asArray,
  arbitrary,
  withAutocomplete,
} from 'twind'

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
  useMatch('\\[([-\\w]+):(.+)]', ({ 1: $1, 2: $2 }, context) => ({
    '@layer overrides': {
      '&': {
        [$1]: arbitrary(`[${$2}]`, $1, context),
      },
    },
  })),

  /* Styling based on parent and peer state */
  withAutocomplete$(
    useMatch('(group|peer)(~[^-[]+)?', ({ input }, { h }) => [{ c: h(input) }]),
    DEV && (() => ['group', 'peer']),
  ),

  /* LAYOUT */
  useTheme('aspect-', 'aspectRatio'),

  useMatch('container', (_, { theme }) => {
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
  useTheme('content-', 'content', ({ _ }) => ({
    '--tw-content': _,
    content: 'var(--tw-content)',
  })),

  // Box Decoration Break
  useMatch('(?:box-)?decoration-(slice|clone)', 'boxDecorationBreak'),

  // Box Sizing
  useMatch('box-(border|content)', 'boxSizing', ({ 1: $1 }) => $1 + '-box'),

  // Display
  useMatch('hidden', { display: 'none' }),

  // Table Layout
  useMatch('table-(auto|fixed)', 'tableLayout'),

  useMatch(
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
  useMatch('isolate', 'isolation'),

  // Object Fit
  useMatch('object-(contain|cover|fill|none|scale-down)', 'objectFit'),

  // Object Position
  useTheme('object-', 'objectPosition'),
  useMatch('object-(top|bottom|center|(left|right)(-(top|bottom))?)', 'objectPosition', spacify),

  // Overscroll Behavior
  useMatch('overscroll(-[xy])?-(auto|contain|none)', ({ 1: $1 = '', 2: $2 }) => ({
    [('overscroll-behavior' + $1) as 'overscroll-behavior-x']: $2 as 'auto',
  })),

  // Position
  useMatch('(static|fixed|absolute|relative|sticky)', 'position'),

  // Top / Right / Bottom / Left
  useTheme('-?inset(-[xy])?(?:$|-)', 'inset', ({ 1: $1, _ }) => ({
    top: $1 != '-x' && _,
    right: $1 != '-y' && _,
    bottom: $1 != '-x' && _,
    left: $1 != '-y' && _,
  })),

  useTheme('-?(top|bottom|left|right)(?:$|-)', 'inset'),

  // Visibility
  useMatch('visible', 'visibility'),
  useMatch('invisible', { visibility: 'hidden' }),

  // Z-Index
  useTheme('-?z-', 'zIndex'),

  /* FLEXBOX */
  // Flex Direction
  useMatch('flex-((row|col)(-reverse)?)', 'flexDirection', columnify),

  useMatch('flex-(wrap|wrap-reverse|nowrap)', 'flexWrap'),
  useTheme('(flex-(?:grow|shrink))(?:$|-)' /*, 'flex-grow' | flex-shrink */),
  useTheme('(flex)-' /*, 'flex' */),
  useTheme('grow(?:$|-)', 'flexGrow'),
  useTheme('shrink(?:$|-)', 'flexShrink'),
  useTheme('basis-', 'flexBasis'),

  useTheme('-?(order)-' /*, 'order' */),
  withAutocomplete$('-?(order)-(\\d+)', DEV && (() => range({ end: 12 }))),

  /* GRID */
  // Grid Template Columns
  useTheme('grid-cols-', 'gridTemplateColumns'),
  withAutocomplete$(
    useMatch('grid-cols-(\\d+)', 'gridTemplateColumns', gridTemplate),
    DEV && (() => range({ end: 6 })),
  ),

  // Grid Column Start / End
  useTheme('col-', 'gridColumn'),
  withAutocomplete$(
    useMatch('col-(span)-(\\d+)', 'gridColumn', span),
    DEV && (() => range({ end: 12 })),
  ),

  useTheme('col-start-', 'gridColumnStart'),
  withAutocomplete$(
    useMatch('col-start-(auto|\\d+)', 'gridColumnStart'),
    DEV && (({ 1: $1 }) => ($1 === 'auto' ? [''] : range({ end: 13 }))),
  ),

  useTheme('col-end-', 'gridColumnEnd'),
  withAutocomplete$(
    useMatch('col-end-(auto|\\d+)', 'gridColumnEnd'),
    DEV && (({ 1: $1 }) => ($1 === 'auto' ? [''] : range({ end: 13 }))),
  ),

  // Grid Template Rows
  useTheme('grid-rows-', 'gridTemplateRows'),
  withAutocomplete$(
    useMatch('grid-rows-(\\d+)', 'gridTemplateRows', gridTemplate),
    DEV && (() => range({ end: 6 })),
  ),

  // Grid Row Start / End
  useTheme('row-', 'gridRow'),
  withAutocomplete$(
    useMatch('row-(span)-(\\d+)', 'gridRow', span),
    DEV && (() => range({ end: 6 })),
  ),

  useTheme('row-start-', 'gridRowStart'),
  withAutocomplete$(
    useMatch('row-start-(auto|\\d+)', 'gridRowStart'),
    DEV && (({ 1: $1 }) => ($1 === 'auto' ? [''] : range({ end: 7 }))),
  ),

  useTheme('row-end-', 'gridRowEnd'),
  withAutocomplete$(
    useMatch('row-end-(auto|\\d+)', 'gridRowEnd'),
    DEV && (({ 1: $1 }) => ($1 === 'auto' ? [''] : range({ end: 7 }))),
  ),

  // Grid Auto Flow
  useMatch('grid-flow-((row|col)(-dense)?)', 'gridAutoFlow', (match) => spacify(columnify(match))),
  useMatch('grid-flow-(dense)', 'gridAutoFlow'),

  // Grid Auto Columns
  useTheme('auto-cols-', 'gridAutoColumns'),

  // Grid Auto Rows
  useTheme('auto-rows-', 'gridAutoRows'),

  // Gap
  useTheme('gap-x(?:$|-)', 'gap', 'columnGap'),
  useTheme('gap-y(?:$|-)', 'gap', 'rowGap'),
  useTheme('gap(?:$|-)', 'gap'),

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
    useMatch('justify-', 'justifyContent', convertContentValue),
    DEV && (() => ['start', 'end', 'center', 'between', 'around', 'evenly']),
  ),

  // Align Content
  // Align Items
  // Align Self
  withAutocomplete$(
    useMatch('(content|items|self)-', (match) => ({
      [('align-' + match[1]) as 'align-content']: convertContentValue(match),
    })),
    DEV &&
      (({ 1: $1 }) =>
        $1 == 'content'
          ? ['center', 'start', 'end', 'between', 'around', 'evenly']
          : $1 == 'items'
          ? ['start', 'end', 'center', 'baseline', 'stretch']
          : /* $1 == 'self' */ ['auto', 'start', 'end', 'center', 'stretch', 'baseline']),
  ),

  // Place Content
  // Place Items
  // Place Self
  withAutocomplete$(
    useMatch('(place-(content|items|self))-', ({ 1: $1, $$ }) => ({
      [$1 as 'place-content']: ('wun'.includes($$[3]) ? 'space-' : '') + $$,
    })),
    DEV &&
      (({ 1: $1 }) =>
        $1 == 'content'
          ? ['center', 'start', 'end', 'between', 'around', 'evenly', 'stretch']
          : $1 == 'items'
          ? ['start', 'end', 'center', 'stretch']
          : /* $1 == 'self' */ ['auto', 'start', 'end', 'center', 'stretch']),
  ),

  /* SPACING */
  // Padding
  useTheme('p([xytrbl])?(?:$|-)', 'padding', edge('padding')),

  // Margin
  useTheme('-?m([xytrbl])?(?:$|-)', 'margin', edge('margin')),

  // Space Between
  useTheme('-?space-(x|y)(?:$|-)', 'space', ({ 1: $1, _ }) => ({
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

  useMatch('space-(x|y)-reverse', ({ 1: $1 }) => ({
    '&>:not([hidden])~:not([hidden])': {
      [`--tw-space-${$1}-reverse`]: '1',
    },
  })),

  /* SIZING */
  // Width
  useTheme('w-', 'width'),

  // Min-Width
  useTheme('min-w-', 'minWidth'),

  // Max-Width
  useTheme('max-w-', 'maxWidth'),

  // Height
  useTheme('h-', 'height'),

  // Min-Height
  useTheme('min-h-', 'minHeight'),

  // Max-Height
  useTheme('max-h-', 'maxHeight'),

  /* TYPOGRAPHY */
  // Font Weight
  useTheme('font-', 'fontWeight'),

  // Font Family
  useTheme('font-', 'fontFamily', 'fontFamily', join),

  // Font Smoothing
  useMatch('antialiased', {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  }),

  useMatch('subpixel-antialiased', {
    WebkitFontSmoothing: 'auto',
    MozOsxFontSmoothing: 'auto',
  }),

  // Font Style
  useMatch('italic', 'fontStyle'),
  useMatch('not-italic', { fontStyle: 'normal' }),

  // Font Variant Numeric
  useMatch(
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
            '@layer defaults': {
              '*,::before,::after,::backdrop': {
                '--tw-ordinal': 'var(--tw-empty,/*!*/ /*!*/)',
                '--tw-slashed-zero': 'var(--tw-empty,/*!*/ /*!*/)',
                '--tw-numeric-figure': 'var(--tw-empty,/*!*/ /*!*/)',
                '--tw-numeric-spacing': 'var(--tw-empty,/*!*/ /*!*/)',
                '--tw-numeric-fraction': 'var(--tw-empty,/*!*/ /*!*/)',
              },
            },
          },
  ),

  // Letter Spacing
  useTheme('tracking-', 'letterSpacing'),

  // Line Height
  useTheme('leading-', 'lineHeight'),

  // List Style Position
  useMatch('list-(inside|outside)', 'listStylePosition'),

  // List Style Type
  useTheme('list-', 'listStyleType'),
  withAutocomplete$(useMatch('list-', 'listStyleType'), DEV && (() => ['none', 'disc', 'decimal'])),

  // Placeholder Opacity
  useTheme('placeholder-opacity-', 'placeholderOpacity', ({ _ }) => ({
    ['&::placeholder']: { '--tw-placeholder-opacity': _ },
  })),

  // Placeholder Color
  useColor('placeholder-', { property: 'color', selector: '&::placeholder' }),

  // Text Alignment
  useMatch('text-(left|center|right|justify|start|end)', 'textAlign'),

  useMatch('text-(ellipsis|clip)', 'textOverflow'),

  // Text Opacity
  useTheme('text-opacity-', 'textOpacity', '--tw-text-opacity'),

  // Text Color
  useColor('text-', { property: 'color' }),

  // Font Size
  useTheme('text-', 'fontSize', ({ _ }) =>
    typeof _ == 'string'
      ? { fontSize: _ }
      : {
          fontSize: _[0],
          ...(typeof _[1] == 'string' ? { lineHeight: _[1] } : _[1]),
        },
  ),

  // Text Indent
  useTheme('indent-', 'textIndent'),

  // Text Decoration
  useMatch('(overline|underline|line-through)', 'textDecorationLine'),
  useMatch('no-underline', { textDecorationLine: 'none' }),

  // Text Underline offset
  useTheme('underline-', 'textUnderlineOffset'),

  // Text Decoration Color
  useColor('decoration-', {
    section: 'textDecorationColor',
    opacityVariable: false,
    opacitySection: 'opacity',
  }),

  // Text Decoration Thickness
  useTheme('decoration-', 'textDecorationThickness'),

  // Text Decoration Style
  withAutocomplete$(
    useMatch('decoration-', 'textDecorationStyle'),
    DEV && (() => ['solid', 'double', 'dotted', 'dashed', 'wavy']),
  ),

  // Text Transform
  useMatch('(uppercase|lowercase|capitalize)', 'textTransform'),
  useMatch('normal-case', { textTransform: 'none' }),

  // Text Overflow
  useMatch('truncate', {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),

  // Vertical Alignment
  withAutocomplete$(
    useMatch('align-', 'verticalAlign'),
    DEV &&
      (() => ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom', 'sub', 'super']),
  ),

  // Whitespace
  withAutocomplete$(
    useMatch('whitespace-', 'whiteSpace'),
    DEV && (() => ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap']),
  ),

  // Word Break
  useMatch('break-normal', { wordBreak: 'normal', overflowWrap: 'normal' }),
  useMatch('break-words', { overflowWrap: 'break-word' }),
  useMatch('break-all', { wordBreak: 'break-all' }),

  // Caret Color
  useColor('caret-', {
    // section: 'caretColor',
    opacityVariable: false,
    opacitySection: 'opacity',
  }),

  // Accent Color
  useColor('accent-', {
    // section: 'accentColor',
    opacityVariable: false,
    opacitySection: 'opacity',
  }),

  // Gradient Color Stops
  useMatch(
    'bg-gradient-to-([trbl]|[tb][rl])',
    'backgroundImage',
    ({ 1: $1 }) => `linear-gradient(to ${position($1, ' ')},var(--tw-gradient-stops))`,
  ),

  useColor(
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
  useColor(
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
  useColor('to-', {
    section: 'gradientColorStops',
    property: '--tw-gradient-to',
    opacityVariable: false,
    opacitySection: 'opacity',
  }),

  /* BACKGROUNDS */
  // Background Attachment
  useMatch('bg-(fixed|local|scroll)', 'backgroundAttachment'),

  // Background Origin
  useMatch('bg-origin-(border|padding|content)', 'backgroundOrigin', ({ 1: $1 }) => $1 + '-box'),

  // Background Repeat
  useMatch(['bg-(no-repeat|repeat(-[xy])?)', 'bg-repeat-(round|space)'], 'backgroundRepeat'),

  // Background Blend Mode
  withAutocomplete$(
    useMatch('bg-blend-', 'backgroundBlendMode'),
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
  useMatch(
    'bg-clip-(border|padding|content|text)',
    'backgroundClip',
    ({ 1: $1 }) => $1 + ($1 == 'text' ? '' : '-box'),
  ),

  // Background Opacity
  useTheme('bg-opacity-', 'backgroundOpacity', '--tw-bg-opacity'),

  // Background Color
  // bg-${backgroundColor}/${backgroundOpacity}
  useColor('bg-', { section: 'backgroundColor' }),

  // Background Image
  // supported arbitrary types are: length, color, angle, list
  useTheme('bg-', 'backgroundImage'),

  // Background Position
  useTheme('bg-', 'backgroundPosition'),
  useMatch('bg-(top|bottom|center|(left|right)(-(top|bottom))?)', 'backgroundPosition', spacify),

  // Background Size
  useTheme('bg-', 'backgroundSize'),

  /* BORDERS */
  // Border Radius
  useTheme('rounded(?:$|-)', 'borderRadius'),
  useTheme('rounded-([trbl]|[tb][rl])(?:$|-)', 'borderRadius', ({ 1: $1, _ }) => {
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
  useMatch('border-(collapse|separate)', 'borderCollapse'),

  // Border Opacity
  useTheme('border-opacity(?:$|-)', 'borderOpacity', '--tw-border-opacity'),

  // Border Style
  useMatch('border-(solid|dashed|dotted|double|none)', 'borderStyle'),

  // Border Spacing
  useTheme('border-spacing(-[xy])?(?:$|-)', 'borderSpacing', ({ 1: $1, _ }) => ({
    '@layer defaults': {
      '*,::before,::after,::backdrop': {
        '--tw-border-spacing-x': 0,
        '--tw-border-spacing-y': 0,
      },
    },
    [('--tw-border-spacing' + ($1 || '-x')) as '--tw-border-spacing-x']: _,
    [('--tw-border-spacing' + ($1 || '-y')) as '--tw-border-spacing-y']: _,
    'border-spacing': 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)',
  })),

  // Border Color
  useColor('border-([xytrbl])-', { section: 'borderColor' }, edge('border', 'Color')),
  useColor('border-'),

  // Border Width
  useTheme('border-([xytrbl])(?:$|-)', 'borderWidth', edge('border', 'Width')),
  useTheme('border(?:$|-)', 'borderWidth'),

  // Divide Opacity
  useTheme('divide-opacity(?:$|-)', 'divideOpacity', ({ _ }) => ({
    '&>:not([hidden])~:not([hidden])': { '--tw-divide-opacity': _ },
  })),

  // Divide Style
  useMatch('divide-(solid|dashed|dotted|double|none)', ({ 1: $1 }) => ({
    '&>:not([hidden])~:not([hidden])': { borderStyle: $1 },
  })),

  // Divide Width
  useMatch('divide-([xy]-reverse)', ({ 1: $1 }) => ({
    '&>:not([hidden])~:not([hidden])': { ['--tw-divide-' + $1]: '1' },
  })),

  useTheme('divide-([xy])(?:$|-)', 'divideWidth', ({ 1: $1, _ }) => {
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
  useColor('divide-', {
    // section: $0.replace('-', 'Color') -> 'divideColor'
    property: 'borderColor',
    // opacityVariable: '--tw-border-opacity',
    // opacitySection: section.replace('Color', 'Opacity') -> 'divideOpacity'
    selector: '&>:not([hidden])~:not([hidden])',
  }),

  // Ring Offset Opacity
  useTheme('ring-opacity(?:$|-)', 'ringOpacity', '--tw-ring-opacity'),

  // Ring Offset Color
  useColor('ring-offset-', {
    // section: 'ringOffsetColor',
    property: '--tw-ring-offset-color',
    opacityVariable: false,
    // opacitySection: section.replace('Color', 'Opacity') -> 'ringOffsetOpacity'
  }),

  // Ring Offset Width
  useTheme('ring-offset(?:$|-)', 'ringOffsetWidth', '--tw-ring-offset-width'),

  // Ring Inset
  useMatch('ring-inset', { '--tw-ring-inset': 'inset' }),

  // Ring Color
  useColor('ring-', {
    // section: 'ringColor',
    property: '--tw-ring-color',
    // opacityVariable: '--tw-ring-opacity',
    // opacitySection: section.replace('Color', 'Opacity') -> 'ringOpacity'
  }),

  // Ring Width
  useTheme('ring(?:$|-)', 'ringWidth', ({ _ }, { theme }) => ({
    '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
    '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${_} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
    boxShadow: `var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)`,
    '@layer defaults': {
      '*,::before,::after,::backdrop': {
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
      },
    },
  })),

  /* EFFECTS */
  // Box Shadow Color
  useColor(
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
  useTheme('shadow(?:$|-)', 'boxShadow', ({ _ }) => ({
    '--tw-shadow': join(_),
    // replace all colors with reference to --tw-shadow-colored
    // this matches colors after non-comma char (keyword, offset) before comma or the end
    '--tw-shadow-colored': (join(_) as string).replace(
      /([^,]\s+)(?:#[a-f\d]+|(?:(?:hsl|rgb)a?|hwb|lab|lch|color|var)\(.+?\)|[a-z]+)(,|$)/g,
      '$1var(--tw-shadow-color)$2',
    ),
    boxShadow: `var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)`,
    '@layer defaults': {
      '*,::before,::after,::backdrop': {
        '--tw-ring-offset-shadow': '0 0 #0000',
        '--tw-ring-shadow': '0 0 #0000',
        '--tw-shadow': '0 0 #0000',
        '--tw-shadow-colored': '0 0 #0000',
      },
    },
  })),

  // Opacity
  useTheme('(opacity)-' /*, 'opacity' */),

  // Mix Blend Mode
  withAutocomplete$(
    useMatch('mix-blend-', 'mixBlendMode'),
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
  useTheme('transition(?:$|-)', 'transitionProperty', (match, { theme }) => ({
    transitionProperty: join(match),
    transitionTimingFunction:
      match._ == 'none' ? undefined : join(theme('transitionTimingFunction', '')),
    transitionDuration: match._ == 'none' ? undefined : join(theme('transitionDuration', '')),
  })),

  // Transition Duration
  useTheme('duration(?:$|-)', 'transitionDuration', 'transitionDuration', join),

  // Transition Timing Function
  useTheme('ease(?:$|-)', 'transitionTimingFunction', 'transitionTimingFunction', join),

  // Transition Delay
  useTheme('delay(?:$|-)', 'transitionDelay', 'transitionDelay', join),

  useTheme('animate(?:$|-)', 'animation', (match, { theme, h }) => {
    const animation: string = join(match)

    // Try to auto inject keyframes
    const parts = animation.split(' ')
    const keyframeValues = theme('keyframes', parts[0]) as CSSBase

    if (keyframeValues) {
      return {
        [('@keyframes ' + (parts[0] = h(parts[0]))) as '@keyframes xxx']: keyframeValues,
        animation: parts.join(' '),
      }
    }

    return { animation }
  }),

  /* TRANSFORMS */
  // Transform
  '(transform)-(none)',
  useMatch('transform', tranformDefaults),
  useMatch('transform-(cpu|gpu)', ({ 1: $1 }) => ({
    '--tw-transform': transformValue($1 == 'gpu'),
  })),

  // Scale
  useTheme(
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
  useTheme('-?(rotate)-', 'rotate', transform),

  // Translate
  useTheme('-?(translate-[xy])-', 'translate', transform),

  // Skew
  useTheme('-?(skew-[xy])-', 'skew', transform),

  // Transform Origin
  useMatch('origin-(center|((top|bottom)(-(left|right))?)|left|right)', 'transformOrigin', spacify),

  /* INTERACTIVITY */
  // Appearance
  withAutocomplete$('(appearance)-', DEV && (() => ['auto', 'none'])),

  // Columns
  useTheme('(columns)-' /*, 'columns' */),
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
  useTheme('(cursor)-' /*, 'cursor' */),
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
  useMatch('snap-(none)', 'scroll-snap-type'),
  useMatch('snap-(x|y|both)', ({ 1: $1 }) => ({
    'scroll-snap-type': $1 + ' var(--tw-scroll-snap-strictness)',
    '@layer defaults': {
      '*,::before,::after,::backdrop': {
        '--tw-scroll-snap-strictness': 'proximity',
      },
    },
  })),
  useMatch('snap-(mandatory|proximity)', '--tw-scroll-snap-strictness'),

  // Scroll Snap Align
  useMatch('snap-(?:(start|end|center)|align-(none))', 'scroll-snap-align'),

  // Scroll Snap Stop
  useMatch('snap-(normal|always)', 'scroll-snap-stop'),

  useMatch('scroll-(auto|smooth)', 'scroll-behavior'),

  // Scroll Margin
  // Padding
  useTheme('scroll-p([xytrbl])?(?:$|-)', 'padding', edge('scroll-padding')),

  // Margin
  useTheme<TailwindTheme, 'scrollMargin'>(
    '-?scroll-m([xytrbl])?(?:$|-)',
    'scroll-margin',
    edge('scroll-margin'),
  ),

  // Touch Action
  useMatch('touch-(auto|none|manipulation)', 'touch-action'),
  useMatch('touch-(pinch-zoom|pan-(?:(x|left|right)|(y|up|down)))', ({ 1: $1, 2: $2, 3: $3 }) => ({
    // x, left, right -> pan-x
    // y, up, down -> pan-y
    // -> pinch-zoom
    [`--tw-${$2 ? 'pan-x' : $3 ? 'pan-y' : $1}` as '--tw-pan-x']: $1,
    'touch-action': 'var(--tw-touch-action)',
    '@layer defaults': {
      '*,::before,::after,::backdrop': {
        '--tw-pan-x': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-pan-y': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-pinch-zoom': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-touch-action': 'var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)',
      },
    },
  })),

  // Outline Style
  useMatch('outline-none', {
    outline: '2px solid transparent',
    'outline-offset': '2px',
  }),
  useMatch('outline', { outlineStyle: 'solid' }),
  useMatch('outline-(dashed|dotted|double|hidden)', 'outlineStyle'),

  // Outline Offset
  useTheme('(outline-offset)-' /*, 'outlineOffset'*/),

  // Outline Color
  useColor('outline-', {
    opacityVariable: false,
    opacitySection: 'opacity',
  }),

  // Outline Width
  useTheme('outline-', 'outlineWidth'),

  // Pointer Events
  withAutocomplete$('(pointer-events)-', DEV && (() => ['auto', 'none'])),

  // Will Change
  useTheme('(will-change)-' /*, 'willChange' */),
  withAutocomplete$('(will-change)-', DEV && (() => ['auto', 'contents', 'transform'])),

  // Resize
  [
    'resize(?:-(none|x|y))?',
    'resize',
    ({ 1: $1 }) => ({ x: 'horizontal', y: 'vertical' }[$1] || $1 || 'both'),
  ],

  // User Select
  useMatch('select-(none|text|all|auto)', 'userSelect'),

  /* SVG */
  // Fill, Stroke
  useColor('fill-', { section: 'fill', opacityVariable: false, opacitySection: 'opacity' }),
  useColor('stroke-', { section: 'stroke', opacityVariable: false, opacitySection: 'opacity' }),

  // Stroke Width
  useTheme('stroke-', 'strokeWidth'),

  /* ACCESSIBILITY */
  // Screen Readers
  useMatch('sr-only', {
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

  useMatch('not-sr-only', {
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
    // add default filter which allows standalone usage
    [`${prefix}filter`]: filters.map((key) => `var(--tw-${prefix}${key})`).join(' '),
    // move defaults
    '@layer defaults': {
      '*,::before,::after,::backdrop': defaults,
    },
  } as CSSObject

  return [
    `(${prefix}filter)-(none)`,

    useMatch(`${prefix}filter`, defaults),

    ...filters.map((key) =>
      useTheme<TailwindTheme, 'hueRotate' | 'dropShadow'>(
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
    transform: 'var(--tw-transform)',
    '@layer defaults': {
      '*,::before,::after,::backdrop': {
        '--tw-translate-x': '0',
        '--tw-translate-y': '0',
        '--tw-rotate': '0',
        '--tw-skew-x': '0',
        '--tw-skew-y': '0',
        '--tw-scale-x': '1',
        '--tw-scale-y': '1',
        '--tw-transform': transformValue(),
      },
    },
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
