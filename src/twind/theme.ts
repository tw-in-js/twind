import type {
  Theme,
  ThemeColor,
  ThemeConfiguration,
  ThemeResolver,
  ThemeSectionResolver,
  ThemeSectionResolverContext,
} from '../types'

import * as is from '../internal/is'
import { join, tail, includes } from './util'

// '1/2': '50%',
// '1/3': '33.333333%',
// '2/3': '66.666667%',
// '1/4': '25%',
// '2/4': '50%',
// '3/4': '75%',
// '1/5': '20%',
// '2/5': '40%',
// '3/5': '60%',
// '4/5': '80%',
// '1/6': '16.666667%',
// '2/6': '33.333333%',
// '3/6': '50%',
// '4/6': '66.666667%',
// '5/6': '83.333333%',
const ratios = (start: number, end: number): Record<string, string> => {
  const result: Record<string, string> = {}

  do {
    for (let dividend = 1; dividend < start; dividend++) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      result[`${dividend}/${start}`] = Number(((dividend / start) * 100).toFixed(6)) + '%'
    }
  } while (++start <= end)

  return result
}

// 0: '0px',
// 2: '2px',
// 4: '4px',
// 8: '8px',
const exponential = (stop: number, unit: string, start = 0): Record<string, string> => {
  const result: Record<string, string> = {}

  for (; start <= stop; start = start * 2 || 1) {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    result[start] = start + unit
  }

  return result
}

// 3: '.75rem',
// 4: '1rem',
// 5: '1.25rem',
// 6: '1.5rem',
// 7: '1.75rem',
// 8: '2rem',
// 9: '2.25rem',
// 10: '2.5rem',
const linear = (
  stop: number,
  unit = '',
  divideBy = 1,
  start = 0,
  step = 1,
  // eslint-disable-next-line max-params
): Record<string, string> => {
  const result: Record<string, string> = {}

  for (; start <= stop; start += step) {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    result[start] = start / divideBy + unit
  }

  return result
}

const alias = (key: keyof Theme): ThemeSectionResolver => (theme) => theme(key)

export const defaultTheme: Theme = {
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  colors: {
    transparent: 'transparent',
    current: 'currentColor',

    // black: colors.black,
    black: '#000',

    // white: colors.white,
    white: '#fff',

    // gray: colors.coolGray,
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // red: colors.red,
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },

    // yellow: colors.amber,
    yellow: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },

    // green: colors.emerald,
    green: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },

    // blue: colors.blue,
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },

    // indigo: colors.indigo,
    indigo: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },

    // purple: colors.violet,
    purple: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },

    // pink: colors.pink,
    pink: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
    },
  },

  spacing: {
    px: '1px',
    0: '0px',
    ...linear(4, 'rem', 4, 0.5, 0.5),
    // 0.5: '0.125rem',
    // 1: '0.25rem',
    // 1.5: '0.375rem',
    // 2: '0.5rem',
    // 2.5: '0.625rem',
    // 3: '0.75rem',
    // 3.5: '0.875rem',
    // 4: '1rem',
    ...linear(12, 'rem', 4, 5),
    // 5: '1.25rem',
    // 6: '1.5rem',
    // 7: '1.75rem',
    // 8: '2rem',
    // 9: '2.25rem',
    // 10: '2.5rem',
    // 11: '2.75rem',
    // 12: '3rem',
    14: '3.5rem',
    ...linear(64, 'rem', 4, 16, 4),
    // 16: '4rem',
    // 20: '5rem',
    // 24: '6rem',
    // 28: '7rem',
    // 32: '8rem',
    // 36: '9rem',
    // 40: '10rem',
    // 44: '11rem',
    // 48: '12rem',
    // 52: '13rem',
    // 56: '14rem',
    // 60: '15rem',
    // 64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },

  durations: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },

  animation: {
    none: 'none',
    spin: 'spin 1s linear infinite',
    ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
  },

  backgroundColor: alias('colors'),
  backgroundImage: {
    none: 'none',
    // These are built-in
    // 'gradient-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
    // 'gradient-to-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))',
    // 'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
    // 'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
    // 'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
    // 'gradient-to-bl': 'linear-gradient(to bottom left, var(--tw-gradient-stops))',
    // 'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
    // 'gradient-to-tl': 'linear-gradient(to top left, var(--tw-gradient-stops))',
  },
  backgroundOpacity: alias('opacity'),
  borderColor: (theme) => ({
    ...theme('colors'),
    DEFAULT: theme('colors.gray.200', 'currentColor'),
  }),
  borderOpacity: alias('opacity'),
  borderRadius: {
    none: '0px',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  borderWidth: {
    DEFAULT: '1px',
    ...exponential(8, 'px'),
    // 0: '0px',
    // 2: '2px',
    // 4: '4px',
    // 8: '8px',
  },
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
  },
  container: {},
  divideColor: alias('borderColor'),
  divideOpacity: alias('borderOpacity'),
  divideWidth: alias('borderWidth'),
  fill: { current: 'currentColor' },
  flex: {
    1: '1 1 0%',
    auto: '1 1 auto',
    initial: '0 1 auto',
    none: 'none',
  },
  fontFamily: {
    sans: 'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'.split(
      ',',
    ),
    serif: 'ui-serif,Georgia,Cambria,"Times New Roman",Times,serif'.split(','),
    mono: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace'.split(
      ',',
    ),
  },
  fontSize: {
    xs: ['0.75rem', '1rem'],
    sm: ['0.875rem', '1.25rem'],
    base: ['1rem', '1.5rem'],
    lg: ['1.125rem', '1.75rem'],
    xl: ['1.25rem', '1.75rem'],
    '2xl': ['1.5rem', '2rem'],
    '3xl': ['1.875rem', '2.25rem'],
    '4xl': ['2.25rem', '2.5rem'],
    '5xl': ['3rem', '1'],
    '6xl': ['3.75rem', '1'],
    '7xl': ['4.5rem', '1'],
    '8xl': ['6rem', '1'],
    '9xl': ['8rem', '1'],
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  gap: alias('spacing'),
  gradientColorStops: alias('colors'),
  height: (theme) => ({
    auto: 'auto',
    ...theme('spacing'),
    ...ratios(2, 6),
    // '1/2': '50%',
    // '1/3': '33.333333%',
    // '2/3': '66.666667%',
    // '1/4': '25%',
    // '2/4': '50%',
    // '3/4': '75%',
    // '1/5': '20%',
    // '2/5': '40%',
    // '3/5': '60%',
    // '4/5': '80%',
    // '1/6': '16.666667%',
    // '2/6': '33.333333%',
    // '3/6': '50%',
    // '4/6': '66.666667%',
    // '5/6': '83.333333%',
    full: '100%',
    screen: '100vh',
  }),
  inset: (theme) => ({
    auto: 'auto',
    ...theme('spacing'),
    ...ratios(2, 4),
    // '1/2': '50%',
    // '1/3': '33.333333%',
    // '2/3': '66.666667%',
    // '1/4': '25%',
    // '2/4': '50%',
    // '3/4': '75%',
    full: '100%',
  }),
  keyframes: {
    spin: {
      from: {
        transform: 'rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg)',
      },
    },
    ping: {
      '0%': {
        transform: 'scale(1)',
        opacity: '1',
      },
      '75%,100%': {
        transform: 'scale(2)',
        opacity: '0',
      },
    },
    pulse: {
      '0%,100%': {
        opacity: '1',
      },
      '50%': {
        opacity: '.5',
      },
    },
    bounce: {
      '0%, 100%': {
        transform: 'translateY(-25%)',
        animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
      },
      '50%': {
        transform: 'none',
        animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
      },
    },
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
    ...linear(10, 'rem', 4, 3),
    // 3: '.75rem',
    // 4: '1rem',
    // 5: '1.25rem',
    // 6: '1.5rem',
    // 7: '1.75rem',
    // 8: '2rem',
    // 9: '2.25rem',
    // 10: '2.5rem',
  },
  margin: (theme) => ({
    auto: 'auto',
    ...theme('spacing'),
  }),
  maxHeight: (theme) => ({
    ...theme('spacing'),
    full: '100%',
    screen: '100vh',
  }),
  maxWidth: (theme, { breakpoints }) => ({
    none: 'none',
    0: '0rem',
    xs: '20rem',
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    '4xl': '56rem',
    '5xl': '64rem',
    '6xl': '72rem',
    '7xl': '80rem',
    full: '100%',
    min: 'min-content',
    max: 'max-content',
    prose: '65ch',
    ...breakpoints(theme('screens')),
  }),
  minHeight: {
    0: '0px',
    full: '100%',
    screen: '100vh',
  },
  minWidth: {
    0: '0px',
    full: '100%',
    min: 'min-content',
    max: 'max-content',
  },
  opacity: {
    ...linear(100, '', 100, 0, 10),
    // 0: '0',
    // 10: '0.1',
    // 20: '0.2',
    // 30: '0.3',
    // 40: '0.4',
    // 60: '0.6',
    // 70: '0.7',
    // 80: '0.8',
    // 90: '0.9',
    // 100: '1',
    5: '0.05',
    25: '0.25',
    75: '0.75',
    95: '0.95',
  },
  order: {
    first: '-9999',
    last: '9999',
    none: '0',
    ...linear(12, '', 1, 1),
    // 1: '1',
    // 2: '2',
    // 3: '3',
    // 4: '4',
    // 5: '5',
    // 6: '6',
    // 7: '7',
    // 8: '8',
    // 9: '9',
    // 10: '10',
    // 11: '11',
    // 12: '12',
  },
  outline: {
    none: ['2px solid transparent', '2px'],
    white: ['2px dotted white', '2px'],
    black: ['2px dotted black', '2px'],
  },
  padding: alias('spacing'),
  placeholderColor: alias('colors'),
  placeholderOpacity: alias('opacity'),
  ringColor: (theme) => ({
    DEFAULT: theme('colors.blue.500', '#3b82f6'),
    ...theme('colors'),
  }),
  ringOffsetColor: alias('colors'),
  ringOffsetWidth: exponential(8, 'px'),
  // 0: '0px',
  // 1: '1px',
  // 2: '2px',
  // 4: '4px',
  // 8: '8px',,
  ringOpacity: (theme) => ({
    DEFAULT: '0.5',
    ...theme('opacity'),
  }),
  ringWidth: {
    DEFAULT: '3px',
    ...exponential(8, 'px'),
    // 0: '0px',
    // 1: '1px',
    // 2: '2px',
    // 4: '4px',
    // 8: '8px',
  },
  rotate: {
    ...exponential(2, 'deg'),
    // 0: '0deg',
    // 1: '1deg',
    // 2: '2deg',
    ...exponential(12, 'deg', 3),
    // 3: '3deg',
    // 6: '6deg',
    // 12: '12deg',
    ...exponential(180, 'deg', 45),
    // 45: '45deg',
    // 90: '90deg',
    // 180: '180deg',
  },
  scale: {
    0: '0',
    50: '.5',
    75: '.75',
    ...linear(110, '', 100, 90, 5),
    // 90: '.9',
    // 95: '.95',
    // 100: '1',
    // 105: '1.05',
    // 110: '1.1',
    125: '1.25',
    150: '1.5',
  },
  skew: {
    ...exponential(2, 'deg'),
    // 0: '0deg',
    // 1: '1deg',
    // 2: '2deg',
    ...exponential(12, 'deg', 3),
    // 3: '3deg',
    // 6: '6deg',
    // 12: '12deg',
  },
  space: alias('spacing'),
  stroke: {
    current: 'currentColor',
  },
  strokeWidth: linear(2),
  // 0: '0',
  // 1: '1',
  // 2: '2',,
  textColor: alias('colors'),
  textOpacity: alias('opacity'),
  transitionDuration: (theme) => ({
    DEFAULT: '150ms',
    ...theme('durations'),
  }),
  transitionDelay: alias('durations'),
  transitionProperty: {
    none: 'none',
    all: 'all',
    DEFAULT: 'background-color,border-color,color,fill,stroke,opacity,box-shadow,transform',
    colors: 'background-color,border-color,color,fill,stroke',
    opacity: 'opacity',
    shadow: 'box-shadow',
    transform: 'transform',
  },
  transitionTimingFunction: {
    DEFAULT: 'cubic-bezier(0.4,0,0.2,1)',
    linear: 'linear',
    in: 'cubic-bezier(0.4,0,1,1)',
    out: 'cubic-bezier(0,0,0.2,1)',
    'in-out': 'cubic-bezier(0.4,0,0.2,1)',
  },
  translate: (theme) => ({
    ...theme('spacing'),
    ...ratios(2, 4),
    // '1/2': '50%',
    // '1/3': '33.333333%',
    // '2/3': '66.666667%',
    // '1/4': '25%',
    // '2/4': '50%',
    // '3/4': '75%',
    full: '100%',
  }),
  width: (theme) => ({
    auto: 'auto',
    ...theme('spacing'),
    ...ratios(2, 6),
    // '1/2': '50%',
    // '1/3': '33.333333%',
    // '2/3': '66.666667%',
    // '1/4': '25%',
    // '2/4': '50%',
    // '3/4': '75%',
    // '1/5': '20%',
    // '2/5': '40%',
    // '3/5': '60%',
    // '4/5': '80%',
    // '1/6': '16.666667%',
    // '2/6': '33.333333%',
    // '3/6': '50%',
    // '4/6': '66.666667%',
    // '5/6': '83.333333%',

    ...ratios(12, 12),
    // '1/12': '8.333333%',
    // '2/12': '16.666667%',
    // '3/12': '25%',
    // '4/12': '33.333333%',
    // '5/12': '41.666667%',
    // '6/12': '50%',
    // '7/12': '58.333333%',
    // '8/12': '66.666667%',
    // '9/12': '75%',
    // '10/12': '83.333333%',
    // '11/12': '91.666667%',

    screen: '100vw',
    full: '100%',
    min: 'min-content',
    max: 'max-content',
  }),
  zIndex: {
    auto: 'auto',
    ...linear(50, '', 1, 0, 10),
    // 0: '0',
    // 10: '10',
    // 20: '20',
    // 30: '30',
    // 40: '40',
    // 50: '50',
  },
}

// https://github.com/tailwindlabs/tailwindcss/blob/master/src/util/flattenColorPalette.js
const flattenColorPalette = (
  colors: Record<string, ThemeColor>,
  target: Record<string, ThemeColor> = {},
  prefix: string[] = [],
): Record<string, ThemeColor> => {
  Object.keys(colors).forEach((property) => {
    const value = colors[property]

    if (property === 'DEFAULT') {
      target[join(prefix)] = value
      target[join(prefix, '.')] = value
    }

    const key = [...prefix, property]
    target[join(key)] = value
    target[join(key, '.')] = value

    if (is.object(value)) {
      flattenColorPalette(value, target, key)
    }
  }, target)

  return target
}

const resolveContext: ThemeSectionResolverContext = {
  // ?negative: (source) =>
  //   Object.keys(source).reduce(
  //     (target, key) => {
  //       if (source[key]) target['-' + key] = '-' + (source[key] as string)

  //       return target
  //     },
  //     { ...source },
  //   ),
  // Stub implementation as negated values are automatically infered and do _not_ not to be in the theme
  negative: () => ({}),

  breakpoints: (source) =>
    Object.keys(source).reduce((target, key) => {
      target['screen-' + key] = source[key]

      return target
    }, {} as Record<string, string | undefined>),
}

export const makeThemeResolver = (config?: ThemeConfiguration): ThemeResolver => {
  const cache = new Map<keyof Theme, Record<string, unknown>>()

  const theme = { ...defaultTheme, ...config }

  const themeResolver = <T>(key: string, defaultValue?: T): T => {
    const keypath = key.split('.')

    /* eslint-disable @typescript-eslint/no-use-before-define, @typescript-eslint/no-explicit-any */
    return resolve(
      keypath[0] as keyof Theme,
      (keypath.length > 1 ? tail(keypath) : undefined) as any,
      defaultValue as any,
    ) as T
    /* eslint-enable @typescript-eslint/no-use-before-define, @typescript-eslint/no-explicit-any */
  }

  const deref = (
    theme: undefined | Partial<Theme>,
    section: keyof Theme,
  ): Record<string, unknown> | undefined => {
    const base = theme && theme[section]

    const value = is.function(base) ? base(themeResolver, resolveContext) : base

    return value && section === 'colors'
      ? flattenColorPalette(value as Record<string, ThemeColor>)
      : (value as Record<string, unknown>)
  }

  const resolve = ((
    section: keyof Theme,
    key?: string | string[],
    defaultValue?: unknown,
  ): unknown => {
    let base = cache.get(section)

    if (!base) {
      cache.set(
        section,
        (base = {
          ...deref(theme, section),
          ...deref(theme.extend, section),
        }),
      )
    }

    if (key != null) {
      const value: unknown = base[(Array.isArray(key) ? join(key) : key) || 'DEFAULT']

      return value == null
        ? defaultValue
        : Array.isArray(value) &&
          // https://github.com/tailwindlabs/tailwindcss/blob/master/src/util/transformThemeValue.js
          // only testing for sections that uses an array for values
          !includes(['fontSize', 'outline'], section)
        ? join(value, ',')
        : value
    }

    return base
  }) as ThemeResolver

  return resolve
}
