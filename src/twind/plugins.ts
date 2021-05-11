/* eslint-disable no-return-assign, no-cond-assign, @typescript-eslint/consistent-type-assertions */
import type {
  Theme,
  CSSRules,
  CSSProperties,
  Plugin,
  ThemeResolver,
  Context,
  Falsy,
  ThemeContainer,
  ThemeScreen,
} from '../types'

import {
  includes,
  join,
  joinTruthy,
  tail,
  capitalize,
  hyphenate,
  buildMediaQuery,
} from '../internal/util'
import { corners, expandEdges, edges } from './helpers'

type PluginHandler = (
  parameters: string[],
  context: Context,
  id: string,
) => CSSRules | string | Falsy

// Shared variables
let _: undefined | string | CSSRules | CSSProperties | string[] | boolean | Falsy | number
let __: undefined | string | CSSProperties
let $: undefined | string | number | ThemeScreen

const toColumnsOrRows = (x: string): 'columns' | 'rows' => (x == 'cols' ? 'columns' : 'rows')

const property = (property: string) => (
  params: string[],
  context: unknown,
  id: string,
): CSSRules => ({
  [property]: id + ((_ = join(params)) && '-' + _),
})

const propertyValue = (property?: string, separator?: string) => (
  params: string[],
  context?: Context,
  id?: string,
): CSSRules | string =>
  (_ = join(params, separator)) && {
    [property || (id as string)]: _,
  }

const themeProperty = (section?: keyof Theme): PluginHandler => (params: string[], { theme }, id) =>
  (_ = theme(section || (id as keyof Theme), params) as string) && {
    [section || id]: _,
  }

const themePropertyFallback = (section?: keyof Theme, separator?: string): PluginHandler => (
  params: string[],
  { theme },
  id,
) =>
  (_ = theme(section || (id as keyof Theme), params, join(params, separator)) as string) && {
    [section || id]: _,
  }

const alias = (handler: PluginHandler, name: string): PluginHandler => (params, context) =>
  handler(params, context, name)

const display = property('display')
const position = property('position')
const textTransform = property('textTransform')
const textDecoration = property('textDecoration')
const fontStyle = property('fontStyle')
const fontVariantNumeric = (key: string): PluginHandler => (params, context, id) => ({
  ['--tw-' + key]: id,
  fontVariantNumeric:
    'var(--tw-ordinal,/*!*/ /*!*/) var(--tw-slashed-zero,/*!*/ /*!*/) var(--tw-numeric-figure,/*!*/ /*!*/) var(--tw-numeric-spacing,/*!*/ /*!*/) var(--tw-numeric-fraction,/*!*/ /*!*/)',
})

const inset: PluginHandler = (params, { theme }, id) => (_ = theme('inset', params)) && { [id]: _ }

const opacityProperty = (
  params: string[],
  theme: ThemeResolver,
  id: string,
  section = id,
): CSSRules | undefined =>
  (_ = theme((section + 'Opacity') as 'textOpacity', tail(params)) as undefined) && {
    [`--tw-${id}-opacity`]: _,
  }

const parseColorComponent = (chars: string, factor: number): number =>
  Math.round(parseInt(chars, 16) * factor)

const asRGBA = <T extends string | undefined>(
  color: T,
  opacityProperty: string,
  opacityDefault?: string,
): T | string => {
  if (color && color[0] == '#' && (_ = (color.length - 1) / 3) && ($ = [17, 1, 0.062272][_ - 1])) {
    return `rgba(${parseColorComponent(color.substr(1, _), $)},${parseColorComponent(
      color.substr(1 + _, _),
      $,
    )},${parseColorComponent(color.substr(1 + 2 * _, _), $)},${
      opacityProperty
        ? `var(--tw-${opacityProperty}${opacityDefault ? ',' + opacityDefault : ''})`
        : opacityDefault || 1
    })`
  }

  return color
}

const withOpacityFallback = (
  property: string,
  kind: string,
  color: string | undefined,
): CSSRules | undefined =>
  color && typeof color == 'string'
    ? (_ = asRGBA(color, kind + '-opacity')) && _ !== color
      ? {
          [`--tw-${kind}-opacity`]: '1',
          [property]: [color, _],
        }
      : { [property]: color }
    : undefined

const transparentTo = (color: string) => (($ = asRGBA(color, '', '0')) == _ ? 'transparent' : $)

const reversableEdge = (
  params: string[],
  { theme }: Context,
  id: string,
  section: 'divideWidth' | 'space',
  prefix: string,
  suffix?: string,
  // eslint-disable-next-line max-params
): CSSRules | undefined =>
  (_ = ({ x: ['right', 'left'], y: ['bottom', 'top'] } as Record<string, undefined | string[]>)[
    params[0]
  ]) && ($ = `--tw-${id}-${params[0]}-reverse`)
    ? params[1] == 'reverse'
      ? {
          [$]: '1',
        }
      : {
          [$]: '0',
          [joinTruthy([prefix, _[0], suffix])]:
            (__ = theme(section, tail(params))) && `calc(${__} * var(${$}))`,
          // With fallback
          [joinTruthy([prefix, _[1], suffix])]: __ && [__, `calc(${__} * calc(1 - var(${$})))`],
        }
    : undefined

const placeHelper = (property: string, params: string[]): CSSRules | string =>
  params[0] && {
    // 'auto'
    // 'start'
    // 'end'
    // 'center'
    // 'stretch'
    // 'between'
    // 'around'
    // 'evenly'
    // 'between', 'around', 'evenly' => space-$0
    // 4th char is unique
    [property]: (includes('wun', (params[0] || '')[3]) ? 'space-' : '') + params[0],
  }

const contentPluginFor = (property: string) => (params: string[]): CSSRules | string =>
  includes(['start', 'end'], params[0])
    ? { [property]: 'flex-' + params[0] }
    : placeHelper(property, params)

const gridPlugin = (kind: 'column' | 'row'): PluginHandler => (params, { theme }) => {
  if ((_ = theme(('grid' + capitalize(kind)) as 'gridRow', params, ''))) {
    return { ['grid-' + kind]: _ }
  }

  switch (params[0]) {
    case 'span':
      return (
        params[1] && {
          ['grid-' + kind]: `span ${params[1]} / span ${params[1]}`,
        }
      )
    case 'start':
    case 'end':
      return (
        (_ = theme(
          ('grid' + capitalize(kind) + capitalize(params[0])) as 'gridRowStart',
          tail(params),
          join(tail(params)),
        )) && {
          [`grid-${kind}-${params[0]}`]: _,
        }
      )
  }
}

const border: PluginHandler = (params, { theme }, id): CSSRules | string | undefined => {
  switch (params[0]) {
    case 'solid':
    case 'dashed':
    case 'dotted':
    case 'double':
    case 'none':
      return propertyValue('borderStyle')(params)
    case 'collapse':
    case 'separate':
      return propertyValue('borderCollapse')(params)
    case 'opacity':
      return opacityProperty(params, theme, id)
  }

  return (_ = theme((id + 'Width') as 'borderWidth' | 'divideWidth', params, '' /* Optional */))
    ? { borderWidth: _ }
    : withOpacityFallback(
        'borderColor',
        id,
        theme((id + 'Color') as 'borderColor' | 'divideColor', params) as string,
      )
}

const transform = (gpu?: boolean): string =>
  (gpu
    ? 'translate3d(var(--tw-translate-x,0),var(--tw-translate-y,0),0)'
    : 'translateX(var(--tw-translate-x,0)) translateY(var(--tw-translate-y,0))') +
  ' rotate(var(--tw-rotate,0)) skewX(var(--tw-skew-x,0)) skewY(var(--tw-skew-y,0)) scaleX(var(--tw-scale-x,1)) scaleY(var(--tw-scale-y,1))'

// .scale-0	--scale-x: 0;
// .scale-x-150
// .scale-y-0
// .translate-x-0	--translate-x: 0;
// .translate-x-1	--translate-x: 0.25rem;
// .translate-y-px	--translate-y: 1px;
// .translate-y-full	--translate-y: 100%;
// .translate-y-1/2	--translate-y: 50%;
// .skew-y-0	--skew-y: 0;
// .skew-y-1	--skew-y: 1deg;
const transformXYFunction: PluginHandler = (params, context, id) =>
  params[0] &&
  (_ = context.theme(id as 'scale' | 'skew' | 'translate', params[1] || params[0])) && {
    [`--tw-${id}-x`]: params[0] !== 'y' && _,
    [`--tw-${id}-y`]: params[0] !== 'x' && _,
    transform: [`${id}${params[1] ? params[0].toUpperCase() : ''}(${_})`, transform()],
  }

const edgesPluginFor = (key: 'margin' | 'padding'): PluginHandler => (params, context, id) =>
  id[1] ? edges(context.theme(key, params), id[1], key) : themeProperty(key)(params, context, id)

// For p-*, px-*, pt-*
const padding = edgesPluginFor('padding')

// For m-*, mx-*, mt-*
const margin = edgesPluginFor('margin')

// 'min-w-full' -> minWidth
// 'max-h-0.5' -> maxHeight
const minMax: PluginHandler = (params, { theme }, id) =>
  (_ = ({ w: 'width', h: 'height' } as Record<string, undefined | string>)[params[0]]) && {
    [(_ = `${id}${capitalize(_)}`)]: theme(
      _ as 'minWidth' | 'minHeight' | 'maxWidth' | 'maxHeight',
      tail(params),
    ),
  }

const filter: Plugin = (params, { theme }, id) => {
  const parts = id.split('-')
  const prefix = parts[0] == 'backdrop' ? parts[0] + '-' : ''
  if (!prefix) {
    params.unshift(...parts)
  }

  if (params[0] == 'filter') {
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
    ].filter(Boolean)

    return params[1] == 'none'
      ? { [prefix + 'filter']: 'none' }
      : filters.reduce(
          (css, key) => {
            css['--tw-' + prefix + key] = 'var(--tw-empty,/*!*/ /*!*/)'
            return css
          },
          {
            [prefix + 'filter']: filters.map((key) => `var(--tw-${prefix}${key})`).join(' '),
          } as CSSRules,
        )
  }

  $ = params.shift()
  // hue-rotate, drop-shadow
  if (includes(['hue', 'drop'], $)) $ += capitalize(params.shift() as string)

  return (
    (_ = theme((prefix ? 'backdrop' + capitalize($ as string) : $) as 'blur', params)) && {
      ['--tw-' + prefix + $]: (Array.isArray(_) ? (_ as string[]) : [_])
        .map((_) => `${hyphenate($ as string)}(${_})`)
        .join(' '),
    }
  )
}

export const corePlugins: Record<string, Plugin | undefined> = {
  group: (params, { tag }, id) => tag(join([id, ...params])),

  hidden: alias(display, 'none'),
  inline: display,
  block: display,
  contents: display,
  flow: display,

  table: (params, context, id) =>
    includes(['auto', 'fixed'], params[0])
      ? { tableLayout: params[0] }
      : display(params, context, id),

  flex(params, context, id) {
    switch (params[0]) {
      case 'row':
      case 'col':
        return {
          flexDirection: join(params[0] == 'col' ? ['column', ...tail(params)] : params),
        }
      case 'nowrap':
      case 'wrap':
        return { flexWrap: join(params) }
      case 'grow':
      case 'shrink':
        _ = context.theme(
          ('flex' + capitalize(params[0])) as 'flexGrow',
          tail(params),
          (params[1] || 1) as number,
        )

        return (
          _ != null && {
            ['flex-' + params[0]]: '' + _,
          }
        )
    }

    return (_ = context.theme('flex', params, '' /* Optional */))
      ? { flex: _ }
      : display(params, context, id)
  },

  grid(params, context, id) {
    switch (params[0]) {
      case 'cols':
      case 'rows':
        return (
          (_ = context.theme(
            ('gridTemplate' + capitalize(toColumnsOrRows(params[0]))) as 'gridTemplateRows',
            tail(params),
            params.length == 2 && Number(params[1])
              ? `repeat(${params[1]},minmax(0,1fr))`
              : join(tail(params)),
          )) && {
            ['gridTemplate-' + toColumnsOrRows(params[0])]: _,
          }
        )

      case 'flow':
        return (
          params.length > 1 && {
            gridAutoFlow: join(
              params[1] == 'col' ? ['column', ...tail(params, 2)] : tail(params),
              ' ',
            ),
          }
        )
    }

    return display(params, context, id)
  },

  auto: (params, { theme }) =>
    includes(['cols', 'rows'], params[0]) &&
    (_ = theme(
      ('gridAuto' + capitalize(toColumnsOrRows(params[0]))) as 'gridAutoRows' | 'gridAutoColumns',
      tail(params),
      join(tail(params)),
    )) && {
      ['gridAuto-' + toColumnsOrRows(params[0])]: _,
    },

  static: position,
  fixed: position,
  absolute: position,
  relative: position,
  sticky: position,

  visible: { visibility: 'visible' },
  invisible: { visibility: 'hidden' },

  antialiased: {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },

  'subpixel-antialiased': {
    WebkitFontSmoothing: 'auto',
    MozOsxFontSmoothing: 'auto',
  },

  truncate: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  'sr-only': {
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

  'not-sr-only': {
    position: 'static',
    width: 'auto',
    height: 'auto',
    padding: '0',
    margin: '0',
    overflow: 'visible',
    whiteSpace: 'normal',
    clip: 'auto',
  },

  resize: (params) => ({
    resize:
      ({ x: 'horizontal', y: 'vertical' } as Record<string, string | undefined>)[params[0]] ||
      params[0] ||
      'both',
  }),

  box: (params) => params[0] && { boxSizing: params[0] + '-box' },

  // .appearance-none -> appearance: none;
  // .appearance-auto -> appearance: auto;
  // .appearance-menulist-button; -> appearance: menulist-button;
  // .appearance-textfield -> appearance: textfield;
  appearance: propertyValue(),
  cursor: themePropertyFallback(),

  float: propertyValue(),
  clear: propertyValue(),
  decoration: propertyValue('boxDecorationBreak'),

  isolate: { isolation: 'isolate' },
  isolation: propertyValue(),

  'mix-blend': propertyValue('mixBlendMode'),

  top: inset,
  right: inset,
  bottom: inset,
  left: inset,

  // 'inset-0'
  // 'inset-1.5'
  // 'inset-x-1.5'
  inset: (params, { theme }) =>
    (_ = expandEdges(params[0]))
      ? edges(theme('inset', tail(params)), params[0])
      : (_ = theme('inset', params)) && {
          top: _,
          right: _,
          bottom: _,
          left: _,
        },

  underline: textDecoration,
  'line-through': textDecoration,
  'no-underline': alias(textDecoration, 'none'),

  'text-underline': alias(textDecoration, 'underline'),
  'text-no-underline': alias(textDecoration, 'none'),
  'text-line-through': alias(textDecoration, 'line-through'),

  uppercase: textTransform,
  lowercase: textTransform,
  capitalize: textTransform,

  'normal-case': alias(textTransform, 'none'),
  'text-normal-case': alias(textTransform, 'none'),

  italic: fontStyle,
  'not-italic': alias(fontStyle, 'normal'),

  'font-italic': alias(fontStyle, 'italic'),
  'font-not-italic': alias(fontStyle, 'normal'),

  font: (params, context, id) =>
    (_ = context.theme('fontFamily', params, '' /* Optional */))
      ? { fontFamily: _ }
      : themeProperty('fontWeight')(params, context, id),

  items: (params) =>
    params[0] && {
      alignItems: includes(['start', 'end'], params[0]) ? 'flex-' + params[0] : join(params),
    },

  'justify-self': propertyValue(),
  'justify-items': propertyValue(),
  justify: contentPluginFor('justifyContent'),
  content: contentPluginFor('alignContent'),
  self: contentPluginFor('alignSelf'),

  place: (params) => params[0] && placeHelper('place-' + params[0], tail(params)),

  overscroll: (params) =>
    params[0] && {
      ['overscrollBehavior' + (params[1] ? '-' + params[0] : '')]: params[1] || params[0],
    },

  col: gridPlugin('column'),
  row: gridPlugin('row'),

  // .duration-75	transition-duration: 75ms;
  // .duration-75	transition-duration: 75ms;
  duration: themeProperty('transitionDuration'),

  // .delay-75	transition-delay: 75ms;
  // .delay-100	transition-delay: 100ms;
  delay: themeProperty('transitionDelay'),

  tracking: themeProperty('letterSpacing'),

  // .leading-10	line-height: 2.5rem;
  // .leading-none	line-height: 1;
  // .leading-tight	line-height: 1.25;
  leading: themeProperty('lineHeight'),

  // .z-50	z-index: 50;
  // .z-auto	z-index: auto;
  z: themeProperty('zIndex'),

  opacity: themeProperty(),

  ease: themeProperty('transitionTimingFunction'),

  p: padding,
  py: padding,
  px: padding,
  pt: padding,
  pr: padding,
  pb: padding,
  pl: padding,

  m: margin,
  my: margin,
  mx: margin,
  mt: margin,
  mr: margin,
  mb: margin,
  ml: margin,

  // .w-64	width: 16rem;
  // .w-auto	width: auto;
  // .w-px	width: 1px;
  // .w-1/2	width: 50%;
  // .w-full	width: 100%;
  // .w-screen	width: 100vw;
  w: themeProperty('width'),
  h: themeProperty('height'),

  min: minMax,
  max: minMax,

  fill: themeProperty(),

  order: themeProperty(),

  origin: themePropertyFallback('transformOrigin', ' '),

  select: propertyValue('userSelect'),

  'pointer-events': propertyValue(),

  align: propertyValue('verticalAlign'),

  whitespace: propertyValue('whiteSpace'),

  'normal-nums': { fontVariantNumeric: 'normal' },
  ordinal: fontVariantNumeric('ordinal'),
  'slashed-zero': fontVariantNumeric('slashed-zero'),
  'lining-nums': fontVariantNumeric('numeric-figure'),
  'oldstyle-nums': fontVariantNumeric('numeric-figure'),
  'proportional-nums': fontVariantNumeric('numeric-spacing'),
  'tabular-nums': fontVariantNumeric('numeric-spacing'),
  'diagonal-fractions': fontVariantNumeric('numeric-fraction'),
  'stacked-fractions': fontVariantNumeric('numeric-fraction'),

  // 'overflow-visible'
  // 'overflow-x-hidden'
  overflow: (params, context, id) =>
    includes(['ellipsis', 'clip'], params[0])
      ? propertyValue('textOverflow')(params)
      : params[1]
      ? { ['overflow-' + params[0]]: params[1] }
      : propertyValue()(params, context, id),

  transform: (params) =>
    params[0] == 'none'
      ? { transform: 'none' }
      : {
          '--tw-translate-x': '0',
          '--tw-translate-y': '0',
          '--tw-rotate': '0',
          '--tw-skew-x': '0',
          '--tw-skew-y': '0',
          '--tw-scale-x': '1',
          '--tw-scale-y': '1',
          transform: transform(params[0] == 'gpu'),
        },

  // .rotate-0	--transform-rotate: 0;
  // .rotate-1	--transform-rotate: 1deg;
  rotate: (params, { theme }) =>
    (_ = theme('rotate', params)) && {
      '--tw-rotate': _,
      transform: [`rotate(${_})`, transform()],
    },

  scale: transformXYFunction,
  translate: transformXYFunction,
  skew: transformXYFunction,

  // .gap-0	gap: 0;
  // .gap-1	gap: 0.25rem;
  // .gap-px	gap: 1px;
  // .gap-x-0	column-gap: 0;
  // .gap-x-1	column-gap: 0.25rem;
  gap: (params, context, id) =>
    (_ = ({ x: 'column', y: 'row' } as Record<string, string | undefined>)[params[0]])
      ? { [_ + 'Gap']: context.theme('gap', tail(params)) }
      : themeProperty('gap')(params, context, id),

  // .stroke-current	stroke: currentColor;
  // stroke-0	stroke-width: 0;
  // .stroke-1	stroke-width: 1;
  stroke: (params, context, id) =>
    (_ = context.theme('stroke', params, '' /* Optional */))
      ? { stroke: _ }
      : themeProperty('strokeWidth')(params, context, id),

  // .outline-none	outline: 2px solid transparent; outline-offset: 2px;
  // .outline-white	outline: 2px dotted white; outline-offset: 2px;
  outline: (params, { theme }) =>
    (_ = theme('outline', params)) && {
      outline: _[0],
      outlineOffset: _[1],
    },

  'break-normal': {
    wordBreak: 'normal',
    overflowWrap: 'normal',
  },
  'break-words': { overflowWrap: 'break-word' },
  'break-all': { wordBreak: 'break-all' },

  text(params, { theme }, id) {
    switch (params[0]) {
      case 'left':
      case 'center':
      case 'right':
      case 'justify':
        return { textAlign: params[0] }
      case 'uppercase':
      case 'lowercase':
      case 'capitalize':
        return textTransform([], _, params[0])
      case 'opacity':
        return opacityProperty(params, theme, id)
    }

    const fontSize = theme('fontSize', params, '' /* Optional */)

    if (fontSize) {
      return typeof fontSize == 'string'
        ? { fontSize }
        : {
            fontSize: fontSize[0],
            ...(typeof fontSize[1] == 'string' ? { lineHeight: fontSize[1] } : fontSize[1]),
          }
    }

    return withOpacityFallback('color', 'text', theme('textColor', params) as string)
  },

  // eslint-disable-next-line complexity
  bg(params, { theme }, id) {
    switch (params[0]) {
      case 'fixed':
      case 'local':
      case 'scroll':
        return propertyValue('backgroundAttachment', ',')(params)

      case 'bottom':
      case 'center':
      case 'left':
      case 'right':
      case 'top':
        return propertyValue('backgroundPosition', ' ')(params)

      case 'no':
        return params[1] == 'repeat' && propertyValue('backgroundRepeat')(params)

      case 'repeat':
        return includes('xy', params[1])
          ? propertyValue('backgroundRepeat')(params)
          : { backgroundRepeat: params[1] || params[0] }

      case 'opacity':
        return opacityProperty(params, theme, id, 'background')

      case 'clip':
      case 'origin':
        return (
          params[1] && {
            ['background-' + params[0]]: params[1] + (params[1] == 'text' ? '' : '-box'),
          }
        )

      case 'blend':
        return propertyValue('background-blend-mode')(tail(params))

      // .bg-gradient-to-r => linear-gradient(to right, ...)
      // .bg-gradient-to-r => linear-gradient(to right, ...)
      case 'gradient':
        if (params[1] == 'to' && (_ = expandEdges(params[2]))) {
          return {
            backgroundImage: `linear-gradient(to ${join(_, ' ')},var(--tw-gradient-stops))`,
          }
        }
    }

    return (_ = theme('backgroundPosition', params, '' /* Optional */))
      ? { backgroundPosition: _ }
      : (_ = theme('backgroundSize', params, '' /* Optional */))
      ? { backgroundSize: _ }
      : (_ = theme('backgroundImage', params, '' /* Optional */))
      ? { backgroundImage: _ }
      : withOpacityFallback('backgroundColor', 'bg', theme('backgroundColor', params) as string)
  },

  // .from-purple-400
  from: (params, { theme }) =>
    (_ = theme('gradientColorStops', params)) && {
      '--tw-gradient-from': _,
      '--tw-gradient-stops': `var(--tw-gradient-from),var(--tw-gradient-to,${transparentTo(
        _ as string,
      )})`,
    },

  // .via-pink-500
  via: (params, { theme }) =>
    (_ = theme('gradientColorStops', params)) && {
      '--tw-gradient-stops': `var(--tw-gradient-from),${_},var(--tw-gradient-to,${transparentTo(
        _ as string,
      )})`,
    },

  // .to-red-500
  to: (params, { theme }) =>
    (_ = theme('gradientColorStops', params)) && {
      '--tw-gradient-to': _ as string,
    },

  // .border	border-width: 1px;
  // .border-0	border-width: 0;
  // .border-2	border-width: 2px;
  // .border	border-width: 1px;
  // .border-t	border-top-width: 1px;
  // .border-t-0	border-top-width: 0px;
  // .border-t-xs
  border: (params, context, id) =>
    expandEdges(params[0])
      ? edges(context.theme('borderWidth', tail(params)), params[0], 'border', 'width')
      : border(params, context, id),

  // .divide-x
  // .divide-x-8
  divide: (params, context, id) =>
    (_ =
      reversableEdge(params, context, id, 'divideWidth', 'border', 'width') ||
      border(params, context, id)) && {
      '&>:not([hidden])~:not([hidden])': _ as CSSRules,
    },

  space: (params, context, id) =>
    (_ = reversableEdge(params, context, id, 'space', 'margin')) && {
      '&>:not([hidden])~:not([hidden])': _,
    },

  placeholder: (params, { theme }, id) =>
    (_ =
      params[0] == 'opacity'
        ? opacityProperty(params, theme, id)
        : withOpacityFallback(
            'color',
            'placeholder',
            theme('placeholderColor', params) as string,
          )) && {
      '&::placeholder': _,
    },

  // .shadow	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  // .shadow-md	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  // .shadow-none	box-shadow: none;
  shadow: (params, { theme }) =>
    (_ = theme('boxShadow', params)) && {
      ':global': {
        '*': {
          '--tw-shadow': '0 0 transparent',
        },
      },
      '--tw-shadow': _ == 'none' ? '0 0 transparent' : _,
      // Fallback first, then modern with ring-* support
      boxShadow: [
        _,
        `var(--tw-ring-offset-shadow,0 0 transparent),var(--tw-ring-shadow,0 0 transparent),var(--tw-shadow)`,
      ],
    },

  animate: (params, { theme, tag }) => {
    if (($ = theme('animation', params))) {
      // Try to auto inject keyframes
      const parts = $.split(' ')

      // Try to find a keyframe defintion in the theme using the first part
      // Provide a default (__ = {}) and check if that is returned
      if ((_ = theme('keyframes', parts[0], (__ = {}))) !== __) {
        // Use a hashed named for the keyframes
        return (
          ($ = tag(parts[0])) && {
            animation: $ + ' ' + join(tail(parts), ' '),
            ['@keyframes ' + $]: _,
          }
        )
      }

      return { animation: $ }
    }
  },

  // From theme.ringWidth
  // .ring
  // .ring-0
  // .ring-inset
  //
  // From theme.colors
  // .ring-current
  // .ring-transparent
  // .ring-gray-100
  //
  // From theme.opacity
  // .ring-opacity-50
  //
  // From theme.ringOffsetWidth
  // .ring-offset -> 2px
  // .ring-offset-8 -> 8px
  ring(params, { theme }, id) {
    switch (params[0]) {
      case 'inset':
        return { '--tw-ring-inset': 'inset' }

      case 'opacity':
        return opacityProperty(params, theme, id)

      case 'offset':
        // Either width or color
        return (_ = theme('ringOffsetWidth', tail(params), '' /* Optional */))
          ? {
              '--tw-ring-offset-width': _,
            }
          : {
              '--tw-ring-offset-color': theme('ringOffsetColor', tail(params)),
            }
    }

    // Either width or color
    return (_ = theme('ringWidth', params, '' /* Optional */))
      ? {
          // A width
          '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
          '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${_} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
          boxShadow: `var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 transparent)`,

          ':global': {
            '*': {
              '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
              '--tw-ring-offset-width': theme('ringOffsetWidth', '', '0px'),
              '--tw-ring-offset-color': theme('ringOffsetColor', '', '#fff'),
              '--tw-ring-color': asRGBA(
                theme('ringColor', '', '#93c5fd') as string,
                'ring-opacity',
                theme('ringOpacity', '', '0.5'),
              ),
              '--tw-ring-offset-shadow': '0 0 transparent',
              '--tw-ring-shadow': '0 0 transparent',
            },
          },
        }
      : {
          // A color
          '--tw-ring-opacity': '1',
          '--tw-ring-color': asRGBA(theme('ringColor', params) as string, 'ring-opacity'),
        }
  },

  object: (params, context, id) =>
    includes(['contain', 'cover', 'fill', 'none', 'scale-down'], join(params))
      ? { objectFit: join(params) }
      : themePropertyFallback('objectPosition', ' ')(params, context, id),

  list: (params, context, id) =>
    join(params) == 'item'
      ? display(params, context, id)
      : includes(['inside', 'outside'], join(params))
      ? { listStylePosition: params[0] }
      : themePropertyFallback('listStyleType')(params, context, id),

  // .rounded	border-radius: 0.25rem;
  // .rounded-5	border-radius: 5px;
  // .rounded-md	border-radius: 0.375rem;
  // .rounded-lg	border-radius: 0.5rem;
  // .rounded-xl	border-radius: 0.75rem;
  // .rounded-2xl	border-radius: 1rem;
  // .rounded-3xl	border-radius: 1.5rem;
  // .rounded-full	border-radius: 9999px;
  // .rounded-t-none	border-top-left-radius: 0px; border-top-right-radius: 0px;
  // .rounded-t-4	border-radius: 4px;
  rounded: (params, context, id) =>
    corners(
      context.theme('borderRadius', tail(params), '' /* Optional */),
      params[0],
      'border',
      'radius',
    ) || themeProperty('borderRadius')(params, context, id),

  'transition-none': { transitionProperty: 'none' },

  transition: (params, { theme }) => ({
    transitionProperty: theme('transitionProperty', params),
    transitionTimingFunction: theme('transitionTimingFunction', ''),
    transitionDuration: theme('transitionDuration', ''),
  }),

  container: (params, { theme }) => {
    const { screens = theme('screens'), center, padding } = theme('container') as ThemeContainer

    const paddingFor = (screen: string): CSSRules =>
      (_ = padding && (typeof padding == 'string' ? padding : padding[screen] || padding.DEFAULT))
        ? {
            paddingRight: _,
            paddingLeft: _,
          }
        : {}

    return Object.keys(screens).reduce(
      (rules, screen) => {
        if (($ = screens[screen]) && typeof $ == 'string') {
          rules[buildMediaQuery($)] = {
            '&': {
              'max-width': $,
              ...paddingFor(screen),
            },
          }
        }

        return rules
      },
      {
        width: '100%',
        ...(center ? { marginRight: 'auto', marginLeft: 'auto' } : {}),
        ...paddingFor('xs'),
      } as CSSRules,
    )
  },

  filter,
  blur: filter,
  brightness: filter,
  contrast: filter,
  grayscale: filter,
  'hue-rotate': filter,
  invert: filter,
  saturate: filter,
  sepia: filter,
  'drop-shadow': filter,
  backdrop: filter,
}

/* eslint-enable no-return-assign, no-cond-assign, @typescript-eslint/consistent-type-assertions */
