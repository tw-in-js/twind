/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type {
  MatchResult,
  Rule,
  MaybeArray,
  CSSProperties,
  CSSObject,
  CSSBase,
  ThemeMatchResult,
  ThemeRuleResolver,
} from 'twind'

import { mql, fromTheme, colorFromTheme, toColorValue, asArray, arbitrary } from 'twind'

import type { TailwindTheme } from './types'

const rules: Rule<TailwindTheme>[] = [
  /* arbitrary properties: [paint-order:markers] */
  [
    '\\[([-\\w]+):(.+)]',
    ({ 1: $1, 2: $2 }, context) => ({
      '@layer overrides': {
        '&': {
          [$1]: arbitrary(`[${$2}]`, $1, context),
        },
      },
    }),
  ],

  /* Styling based on parent and peer state */
  ['((group|peer)((?!-focus)-[^-]+)?)', ({ input }, { h }) => [{ c: h(input) }]],

  /* LAYOUT */
  ['aspect-', fromTheme('aspectRatio')],

  [
    'container',
    (_, { theme }) => {
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
    },
  ],

  // Content
  [
    'content-',
    fromTheme('content', ({ _ }) => ({
      '--tw-content': _,
      content: 'var(--tw-content)',
    })),
  ],

  // Box Decoration Break
  ['(?:box-)?decoration-(slice|clone)', 'boxDecorationBreak'],

  // Box Sizing
  ['box-(border|content)', 'boxSizing', ({ 1: $1 }) => $1 + '-box'],

  // Display
  ['hidden', { display: 'none' }],

  // Table Layout
  ['table-(auto|fixed)', 'tableLayout'],

  [
    [
      '(block|flex|table|grid|inline|contents|flow-root|list-item)',
      '(inline-(block|flex|table|grid))',
      '(table-(caption|cell|column|row|(column|row|footer|header)-group))',
    ],
    'display',
  ],

  // Floats
  '(float)-(left|right|none)',

  // Clear
  '(clear)-(left|right|none|both)',

  // Overflow
  '(overflow(?:-[xy])?)-(auto|hidden|clip|visible|scroll)',

  // Isolation
  '(isolation)-(auto)',

  // Isolation
  ['isolate', 'isolation'],

  // Object Fit
  ['object-(contain|cover|fill|none|scale-down)', 'objectFit'],

  // Object Position
  ['object-', fromTheme('objectPosition')],
  ['object-(top|bottom|center|(left|right)(-(top|bottom))?)', 'objectPosition', spacify],

  // Overscroll Behavior
  [
    'overscroll(-[xy])?-(auto|contain|none)',
    ({ 1: $1 = '', 2: $2 }) => ({
      [('overscroll-behavior' + $1) as 'overscroll-behavior-x']: $2 as 'auto',
    }),
  ],

  // Position
  ['(static|fixed|absolute|relative|sticky)', 'position'],

  // Top / Right / Bottom / Left
  [
    '-?inset(-[xy])?(?:-|$)',
    fromTheme('inset', ({ 1: $1, _ }) => ({
      top: $1 != '-x' && _,
      right: $1 != '-y' && _,
      bottom: $1 != '-x' && _,
      left: $1 != '-y' && _,
    })),
  ],

  ['-?(top|bottom|left|right)(?:-|$)', fromTheme('inset')],

  // Visibility
  ['visible', 'visibility'],
  ['invisible', { visibility: 'hidden' }],

  // Z-Index
  ['-?z-', fromTheme('zIndex')],

  /* FLEXBOX */
  // Flex Direction
  ['flex-((row|col)(-reverse)?)', 'flexDirection', columnify],

  ['flex-(wrap|wrap-reverse|nowrap)', 'flexWrap'],
  ['(flex-(?:grow|shrink))(?:-|$)', fromTheme(/* 'flex-grow' | flex-shrink */)],
  ['(flex)-', fromTheme(/* 'flex' */)],
  ['grow(?:-|$)', fromTheme('flexGrow')],
  ['shrink(?:-|$)', fromTheme('flexShrink')],
  ['basis-', fromTheme('flexBasis')],

  ['-?(order)-', fromTheme(/* 'order' */)],
  '-?(order)-(\\d+)',

  /* GRID */
  // Grid Template Columns
  ['grid-cols-', fromTheme('gridTemplateColumns')],
  ['grid-cols-(\\d+)', 'gridTemplateColumns', gridTemplate],

  // Grid Column Start / End
  ['col-', fromTheme('gridColumn')],
  ['col-(span)-(\\d+)', 'gridColumn', span],

  ['col-start-', fromTheme('gridColumnStart')],
  ['col-start-(\\d+|auto)', 'gridColumnStart'],

  ['col-end-', fromTheme('gridColumnEnd')],
  ['col-end-(\\d+|auto)', 'gridColumnEnd'],

  // Grid Template Rows
  ['grid-rows-', fromTheme('gridTemplateRows')],
  ['grid-rows-(\\d+)', 'gridTemplateRows', gridTemplate],

  // Grid Row Start / End
  ['row-', fromTheme('gridRow')],
  ['row-(span)-(\\d+)', 'gridRow', span],

  ['row-start-', fromTheme('gridRowStart')],
  ['row-start-(\\d+|auto)', 'gridRowStart'],

  ['row-end-', fromTheme('gridRowEnd')],
  ['row-end-(\\d+|auto)', 'gridRowEnd'],

  // Grid Auto Flow
  ['grid-flow-((row|col)(-dense)?)', 'gridAutoFlow', (match) => spacify(columnify(match))],

  // Grid Auto Columns
  ['auto-cols-', fromTheme('gridAutoColumns')],

  // Grid Auto Rows
  ['auto-rows-', fromTheme('gridAutoRows')],

  // Gap
  ['gap-x(?:-|$)', fromTheme('gap', 'columnGap')],
  ['gap-y(?:-|$)', fromTheme('gap', 'rowGap')],
  ['gap(?:-|$)', fromTheme('gap')],

  /* BOX ALIGNMENT */
  // Justify Items
  // Justify Self
  '(justify-(?:items|self))-',

  // Justify Content
  ['justify-', 'justifyContent', convertContentValue],

  // Align Content
  // Align Items
  // Align Self
  [
    '(content|items|self)-',
    (match) => ({
      [('align-' + match[1]) as 'align-content']: convertContentValue(match),
    }),
  ],

  // Place Content
  // Place Items
  // Place Self
  [
    '(place-(content|items|self))-',
    ({ 1: $1, $$ }) => ({
      [$1 as 'place-content']: ('wun'.includes($$[3]) ? 'space-' : '') + $$,
    }),
  ],

  /* SPACING */
  // Padding
  ['p([xytrbl])?(?:-|$)', fromTheme('padding', edge('padding'))],

  // Margin
  ['-?m([xytrbl])?(?:-|$)', fromTheme('margin', edge('margin'))],

  // Space Between
  [
    '-?space-(x|y)(?:-|$)',
    fromTheme('space', ({ 1: $1, _ }) => ({
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
  ],

  [
    'space-(x|y)-reverse',
    ({ 1: $1 }) => ({
      '&>:not([hidden])~:not([hidden])': {
        [`--tw-space-${$1}-reverse`]: '1',
      },
    }),
  ],

  /* SIZING */
  // Width
  ['w-', fromTheme('width')],

  // Min-Width
  ['min-w-', fromTheme('minWidth')],

  // Max-Width
  ['max-w-', fromTheme('maxWidth')],

  // Height
  ['h-', fromTheme('height')],

  // Min-Height
  ['min-h-', fromTheme('minHeight')],

  // Max-Height
  ['max-h-', fromTheme('maxHeight')],

  /* TYPOGRAPHY */
  // Font Weight
  ['font-', fromTheme('fontWeight')],

  // Font Family
  ['font-', fromTheme('fontFamily', 'fontFamily', join)],

  // Font Smoothing
  [
    'antialiased',
    {
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
  ],

  [
    'subpixel-antialiased',
    {
      WebkitFontSmoothing: 'auto',
      MozOsxFontSmoothing: 'auto',
    },
  ],

  // Font Style
  ['italic', 'fontStyle'],
  ['not-italic', { fontStyle: 'normal' }],

  // Font Variant Numeric
  [
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
              '*': {
                '--tw-ordinal': 'var(--tw-empty,/*!*/ /*!*/)',
                '--tw-slashed-zero': 'var(--tw-empty,/*!*/ /*!*/)',
                '--tw-numeric-figure': 'var(--tw-empty,/*!*/ /*!*/)',
                '--tw-numeric-spacing': 'var(--tw-empty,/*!*/ /*!*/)',
                '--tw-numeric-fraction': 'var(--tw-empty,/*!*/ /*!*/)',
              },
            },
          },
  ],

  // Letter Spacing
  ['tracking-', fromTheme('letterSpacing')],

  // Line Height
  ['leading-', fromTheme('lineHeight')],

  // List Style Position
  ['list-(inside|outside)', 'listStylePosition'],

  // List Style Type
  ['list-', fromTheme('listStyleType')],
  // fallback for list style type
  ['list-', 'listStyleType'],

  // Placeholder Opacity
  [
    'placeholder-opacity-',
    fromTheme('placeholderOpacity', ({ _ }) => ({
      ['&::placeholder']: { '--tw-placeholder-opacity': _ },
    })),
  ],

  // Placeholder Color
  ['placeholder-', colorFromTheme({ property: 'color', selector: '&::placeholder' })],

  // Text Alignment
  ['text-(left|center|right|justify)', 'textAlign'],

  // Text Opacity
  ['text-opacity-', fromTheme('textOpacity', '--tw-text-opacity')],

  // Text Color
  ['text-', colorFromTheme({ property: 'color' })],

  // Font Size
  [
    'text-',
    fromTheme('fontSize', ({ _ }) =>
      typeof _ == 'string'
        ? { fontSize: _ }
        : {
            fontSize: _[0],
            ...(typeof _[1] == 'string' ? { lineHeight: _[1] } : _[1]),
          },
    ),
  ],

  // Text Indent
  ['indent-', fromTheme('textIndent')],

  // Text Decoration
  ['(overline|underline|line-through)', 'textDecoration'],
  ['no-underline', { textDecoration: 'none' }],

  // Text Underline offset
  ['underline-', fromTheme('textUnderlineOffset')],

  // Text Decoration Color
  [
    'decoration-',
    colorFromTheme({
      section: 'textDecorationColor',
      opacityVariable: false,
      opacitySection: 'opacity',
    }),
  ],

  // Text Decoration Thickness
  ['decoration-', fromTheme('textDecorationThickness')],

  // Text Decoration Style
  ['decoration-', 'textDecorationStyle'],

  // Text Transform
  ['(uppercase|lowercase|capitalize)', 'textTransform'],
  ['normal-case', { textTransform: 'none' }],

  // Text Overflow
  [
    'truncate',
    {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  ],
  ['text-(ellipsis|clip)', 'textOverflow'],
  ['overflow-(ellipsis)', 'textOverflow'], // Deprecated

  // Vertical Alignment
  ['align-', 'verticalAlign'],

  // Whitespace
  ['whitespace-', 'whiteSpace'],

  // Word Break
  ['break-normal', { wordBreak: 'normal', overflowWrap: 'normal' }],
  ['break-words', { overflowWrap: 'break-word' }],
  ['break-all', { wordBreak: 'break-all' }],

  // Caret Color
  [
    'caret-',
    colorFromTheme({
      section: 'caretColor',
      opacityVariable: false,
      opacitySection: 'opacity',
    }),
  ],

  // Accent Color
  [
    'accent-',
    colorFromTheme({
      section: 'accentColor',
      opacityVariable: false,
      opacitySection: 'opacity',
    }),
  ],

  // Gradient Color Stops
  [
    'bg-gradient-to-([trbl]{1,2})',
    'backgroundImage',
    ({ 1: $1 }) => `linear-gradient(to ${position($1, ' ')},var(--tw-gradient-stops))`,
  ],

  [
    'from-',
    colorFromTheme(
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
  ],
  [
    'via-',
    colorFromTheme(
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
  ],
  [
    'to-',
    colorFromTheme({
      section: 'gradientColorStops',
      property: '--tw-gradient-to',
      opacityVariable: false,
      opacitySection: 'opacity',
    }),
  ],

  /* BACKGROUNDS */
  // Background Attachment
  ['bg-(fixed|local|scroll)', 'backgroundAttachment'],

  // Background Origin
  ['bg-origin-(border|padding|content)', 'backgroundOrigin', ({ 1: $1 }) => $1 + '-box'],

  // Background Repeat
  [['bg-(no-repeat|repeat(-[xy])?)', 'bg-repeat-(round|space)'], 'backgroundRepeat'],

  // Background Blend Mode
  ['bg-blend-', 'backgroundBlendMode'],

  // Background Clip
  [
    'bg-clip-(border|padding|content|text)',
    'backgroundClip',
    ({ 1: $1 }) => $1 + ($1 == 'text' ? '' : '-box'),
  ],

  // Background Opacity
  ['bg-opacity-', fromTheme('backgroundOpacity', '--tw-bg-opacity')],

  // Background Color
  // bg-${backgroundColor}/${backgroundOpacity}
  ['bg-', colorFromTheme({ section: 'backgroundColor' })],

  // Background Image
  // supported arbitrary types are: length, color, angle, list
  ['bg-', fromTheme('backgroundImage')],

  // Background Size
  ['bg-', fromTheme('backgroundSize')],

  // Background Position
  ['bg-', fromTheme('backgroundPosition')],
  ['bg-(top|bottom|center|(left|right)(-(top|bottom))?)', 'backgroundPosition', spacify],

  /* BORDERS */
  // Border Radius
  ['rounded(?:-|$)', fromTheme('borderRadius')],
  [
    'rounded-([trbl]{1,2})(?:-|$)',
    fromTheme('borderRadius', ({ 1: $1, _ }) => {
      const corners = {
        t: ['tl', 'tr'],
        r: ['tr', 'br'],
        b: ['bl', 'br'],
        l: ['bl', 'tl'],
      }[$1] || [$1, $1]

      return {
        [`border-${position(corners[0])}-radius` as 'border-top-left-radius']: _,
        [`border-${position(corners[1])}-radius` as 'border-top-right-radius']: _,
      }
    }),
  ],

  // Border Collapse
  ['border-(collapse|separate)', 'borderCollapse'],

  // Border Opacity
  ['border-opacity(?:-|$)', fromTheme('borderOpacity', '--tw-border-opacity')],

  // Border Style
  ['border-(solid|dashed|dotted|double|none)', 'borderStyle'],

  // Border Color
  ['border-', colorFromTheme()],

  // Border Width
  ['border-([xytrbl])(?:-|$)', fromTheme('borderWidth', edge('border', 'Width'))],
  ['border(?:-|$)', fromTheme('borderWidth')],

  // Divide Opacity
  [
    'divide-opacity(?:-|$)',
    fromTheme('divideOpacity', ({ _ }) => ({
      '&>:not([hidden])~:not([hidden])': { '--tw-divide-opacity': _ },
    })),
  ],

  // Divide Style
  [
    'divide-(solid|dashed|dotted|double|none)',
    ({ 1: $1 }) => ({
      '&>:not([hidden])~:not([hidden])': { borderStyle: $1 },
    }),
  ],

  // Divide Width
  [
    'divide-([xy]-reverse)',
    ({ 1: $1 }) => ({
      '&>:not([hidden])~:not([hidden])': { ['--tw-divide-' + $1]: '1' },
    }),
  ],

  [
    'divide-([xy])(?:-|$)',
    fromTheme('divideWidth', ({ 1: $1, _ }) => {
      const edges = {
        x: 'lr',
        y: 'tb',
      }[$1 as 'x' | 'y']

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
  ],

  // Divide Color
  [
    'divide-',
    colorFromTheme({
      // section: $0.replace('-', 'Color') -> 'divideColor'
      property: 'borderColor',
      // opacityVariable: '--tw-border-opacity',
      // opacitySection: section.replace('Color', 'Opacity') -> 'divideOpacity'
      selector: '&>:not([hidden])~:not([hidden])',
    }),
  ],

  // Ring Offset Opacity
  ['ring-opacity(?:-|$)', fromTheme('ringOpacity', '--tw-ring-opacity')],

  // Ring Offset Color
  [
    'ring-offset(?:-|$)',
    colorFromTheme({
      // section: 'ringOffsetColor',
      property: '--tw-ring-offset-color',
      opacityVariable: false,
      // opacitySection: section.replace('Color', 'Opacity') -> 'ringOffsetOpacity'
    }),
  ],

  // Ring Offset Width
  ['ring-offset(?:-|$)', fromTheme('ringOffsetWidth', '--tw-ring-offset-width')],

  // Ring Inset
  ['ring-inset', { '--tw-ring-inset': 'inset' }],

  // Ring Color
  [
    'ring-',
    colorFromTheme({
      // section: 'ringColor',
      property: '--tw-ring-color',
      // opacityVariable: '--tw-ring-opacity',
      // opacitySection: section.replace('Color', 'Opacity') -> 'ringOpacity'
    }),
  ],

  // Ring Width
  [
    'ring(?:-|$)',
    fromTheme('ringWidth', ({ _ }, { theme }) => ({
      '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
      '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${_} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
      boxShadow: `var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)`,
      '@layer defaults': {
        '*': {
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
  ],

  /* EFFECTS */
  // Box Shadow Color
  [
    'shadow(?:-|$)',
    colorFromTheme(
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
  ],

  // Box Shadow
  [
    'shadow(?:-|$)',
    fromTheme('boxShadow', ({ _ }) => ({
      '--tw-shadow': join(_),
      // replace all colors with reference to --tw-shadow-colored
      // this matches colors after non-comma char (keyword, offset) before comma or the end
      '--tw-shadow-colored': (join(_) as string).replace(
        /([^,]\s+)(?:#[a-f\d]+|(?:(?:hsl|rgb)a?|hwb|lab|lch|color|var)\(.+?\)|[a-z]+)(,|$)/g,
        '$1var(--tw-shadow-color)$2',
      ),
      boxShadow: `var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)`,
      '@layer defaults': {
        '*': {
          '--tw-ring-offset-shadow': '0 0 #0000',
          '--tw-ring-shadow': '0 0 #0000',
          '--tw-shadow': '0 0 #0000',
          '--tw-shadow-colored': '0 0 #0000',
        },
      },
    })),
  ],

  // Opacity
  ['(opacity)-', fromTheme(/* 'opacity' */)],

  // Mix Blend Mode
  ['mix-blend-', 'mixBlendMode'],

  /* FILTERS */
  ...filter(),
  ...filter('backdrop-'),

  /* TRANSITIONS AND ANIMATION */
  // Transition Property
  [
    'transition(?:-|$)',
    fromTheme('transitionProperty', (match, { theme }) => ({
      transitionProperty: join(match),
      transitionTimingFunction:
        match._ == 'none' ? undefined : join(theme('transitionTimingFunction', '')),
      transitionDuration: match._ == 'none' ? undefined : join(theme('transitionDuration', '')),
    })),
  ],

  // Transition Duration
  ['duration(?:-|$)', fromTheme('transitionDuration', 'transitionDuration', join)],

  // Transition Timing Function
  ['ease(?:-|$)', fromTheme('transitionTimingFunction', 'transitionTimingFunction', join)],

  // Transition Delay
  ['delay(?:-|$)', fromTheme('transitionDelay', 'transitionDelay', join)],

  [
    'animate(?:-|$)',
    fromTheme('animation', (match, { theme, h }) => {
      const animation = join(match)

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
  ],

  /* TRANSFORMS */
  // Transform
  '(transform)-(none)',
  ['transform', tranformDefaults],
  [
    'transform-(cpu|gpu)',
    ({ 1: $1 }) => ({
      '--tw-transform': transformValue($1 == 'gpu'),
    }),
  ],

  // Scale
  [
    'scale(-[xy])?-',
    fromTheme(
      'scale',
      ({ 1: $1, _ }) =>
        ({
          [('--tw-scale' + ($1 || '-x')) as '--tw-scale-x']: _,
          [('--tw-scale' + ($1 || '-y')) as '--tw-scale-y']: _,
          ...tranformDefaults(),
        } as CSSObject),
    ),
  ],

  // Rotate
  ['-?(rotate)-', fromTheme('rotate', transform)],

  // Translate
  ['-?(translate-[xy])-', fromTheme('translate', transform)],

  // Skew
  ['-?(skew-[xy])-', fromTheme('skew', transform)],

  // Transform Origin
  ['origin(-center|(-top|-bottom)?(-(left|right))?)', 'transformOrigin', spacify],

  /* INTERACTIVITY */
  // Appearance
  '(appearance)-',

  // Columns
  ['(columns)-', fromTheme(/* 'columns' */)],
  '(columns)-(\\d+)',

  // Break Before, After and Inside
  '(break-(?:before|after|inside))-',

  // Cursor
  ['(cursor)-', fromTheme(/* 'cursor' */)],
  '(cursor)-',

  // Scroll Snap Type
  ['snap-(none)', 'scroll-snap-type'],
  [
    'snap-(x|y|both)',
    ({ 1: $1 }) => ({
      'scroll-snap-type': $1 + ' var(--tw-scroll-snap-strictness)',
      '@layer defaults': {
        '*': {
          '--tw-scroll-snap-strictness': 'proximity',
        },
      },
    }),
  ],
  ['snap-(mandatory|proximity)', '--tw-scroll-snap-strictness'],

  // Scroll Snap Align
  ['snap-(?:(start|end|center)|align-(none))', 'scroll-snap-align'],

  // Scroll Snap Stop
  ['snap-(normal|always)', 'scroll-snap-stop'],

  ['scroll-(auto|smooth)', 'scroll-behavior'],

  // Scroll Margin
  // Padding
  ['scroll-p([xytrbl])?(?:-|$)', fromTheme('padding', edge('scroll-padding'))],

  // Margin
  [
    '-?scroll-m([xytrbl])?(?:-|$)',
    fromTheme<TailwindTheme, 'scrollMargin'>('scroll-margin', edge('scroll-margin')),
  ],

  // Touch Action
  ['touch-(auto|none|manipulation)', 'touch-action'],
  [
    'touch-(pinch-zoom|pan-(?:(x|left|right)|(y|up|down)))',
    ({ 1: $1, 2: $2, 3: $3 }) => ({
      // x, left, right -> pan-x
      // y, up, down -> pan-y
      // -> pinch-zoom
      [`--tw-${$2 ? 'pan-x' : $3 ? 'pan-y' : $1}` as '--tw-pan-x']: $1,
      'touch-action': 'var(--tw-touch-action)',
      '@layer defaults': {
        '*': {
          '--tw-pan-x': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-pan-y': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-pinch-zoom': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-touch-action': 'var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)',
        },
      },
    }),
  ],

  // Outline Style
  [
    'outline-none',
    {
      outline: '2px solid transparent',
      'outline-offset': '2px',
    },
  ],
  ['outline', { outlineStyle: 'solid' }],
  ['outline-(dashed|dotted|double|hidden)', 'outlineStyle'],

  // Outline Offset
  ['(outline-offset)-', fromTheme(/*'outlineOffset'*/)],

  // Outline Color
  [
    'outline-',
    colorFromTheme({
      section: 'outlineColor',
      opacityVariable: false,
      opacitySection: 'opacity',
    }),
  ],

  // Outline Width
  ['outline-', fromTheme('outlineWidth')],

  // Pointer Events
  '(pointer-events)-',

  // Will Change
  ['(will-change)-', fromTheme(/* 'willChange' */)],
  '(will-change)-',

  // Resize
  [
    'resize(?:-(none|x|y))?',
    'resize',
    ({ 1: $1 }) => ({ x: 'horizontal', y: 'vertical' }[$1] || $1 || 'both'),
  ],

  // User Select
  ['select-(none|text|all|auto)', 'userSelect'],

  /* SVG */
  // Fill, Stroke
  ['(fill|stroke)-', fromTheme(/* 'fill' | 'stroke' */)],

  // Stroke Width
  ['stroke-', fromTheme('strokeWidth')],

  /* ACCESSIBILITY */
  // Screen Readers
  [
    'sr-only',
    {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      clip: 'rect(0,0,0,0)',
      borderWidth: '0',
    },
  ],

  [
    'not-sr-only',
    {
      position: 'static',
      width: 'auto',
      height: 'auto',
      padding: '0',
      margin: '0',
      overflow: 'visible',
      whiteSpace: 'normal',
      clip: 'auto',
    },
  ],
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
): ThemeRuleResolver<string, TailwindTheme> {
  return ({ 1: $1, _ }) => {
    const edges =
      {
        x: 'lr',
        y: 'tb',
      }[$1 as 'x' | 'y'] || $1 + $1

    return (
      edges
        ? {
            [propertyPrefix + '-' + position(edges[0]) + propertySuffix]: _,
            [propertyPrefix + '-' + position(edges[1]) + propertySuffix]: _,
          }
        : { [propertyPrefix + propertySuffix]: _ }
    ) as CSSObject
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

  return [
    `(${prefix}filter)-(none)`,

    [
      `${prefix}filter`,
      () => {
        const css = {
          [`${prefix}filter`]: filters.map((key) => `var(--tw-${prefix}${key})`).join(' '),
        } as CSSObject

        for (const key of filters) {
          css[`--tw-${prefix}${key}` as '--tw-blur'] = 'var(--tw-empty,/*!*/ /*!*/)'
        }

        return css
      },
    ],

    ...filters.map(
      (key) =>
        [
          // hue-rotate can be negated
          `${key[0] == 'h' ? '-?' : ''}(${prefix}${key})(?:-|$)`,
          fromTheme<TailwindTheme, 'hueRotate'>(
            key as 'hueRotate',
            ({ 1: $1, _ }) =>
              ({
                [`--tw-${$1}`]: asArray(_)
                  .map((value) => `${key}(${value})`)
                  .join(' '),
              } as CSSObject),
          ),
        ] as Rule<TailwindTheme>,
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
      '*': {
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
