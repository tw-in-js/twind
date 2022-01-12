import { assert, test, afterEach } from 'vitest'

import { twind, virtual, style, colorFromTheme, fromTheme, apply, css } from '.'

const tw = twind(
  {
    theme: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
      },
      spacing: {
        none: 'none',
        full: '100%',
        sm: '1rem',
        base: '1.2rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        0: '0px',
        '1': '.25rem',
        '0.5': '0.5rem',
        '2': '1rem',
        '2.5': '1.125rem',
        '6': '1.5rem',
        '9': '2.5rem',
        '12': '3rem',
      },
      colors: {
        transparent: 'transparent',
        white: '#fff',
        gray: {
          100: '#f3f4f6',
          500: '#6b7280',
          900: '#111827',
        },
        orange: {
          100: '#ffedd5',
          500: '#f97316',
          900: '#7c2d12',
        },
      },
    },
    rules: [
      ['h-', fromTheme('spacing', 'height')],
      ['p-', fromTheme('spacing', 'padding')],
      ['top-', fromTheme('spacing', 'top')],
      ['text-', fromTheme('spacing', 'font-size')],
      ['text-', colorFromTheme({ section: 'colors', property: 'color' })],
      ['bg-', colorFromTheme({ section: 'colors', property: 'background-color' })],
      ['border-', colorFromTheme({ section: 'colors', property: 'border-color' })],
      ['rounded-', fromTheme('spacing', 'borderRadius')],
    ],
  },
  virtual(),
)

afterEach(() => tw.clear())

test('basic style', () => {
  const component = style({
    label: 'button',
    // base: '',
    defaults: {
      color: 'orange',
    },
    props: {
      color: {
        orange: `bg-orange-900 text-orange-100 hover:text-white`,
        gray: `bg-gray-900 text-gray-100 hover:bg-gray-500`,
      },
      size: {
        small: `text-sm h-sm p-sm`,
        large: `text-lg h-lg p-lg`,
      },
      outlined: {
        true: '',
      },
    },
    when: [
      [
        { color: 'orange', outlined: true },
        `border-orange-500 bg-orange-100 text-orange-500 hover:text-orange-900`,
      ],
      [
        { color: 'gray', outlined: true },
        `border-gray-500 bg-gray-100 text-gray-500 hover:text-gray-900`,
      ],
      // [
      //   { outlined: true },
      //   ({ color }) =>
      //     typeof color == 'string' &&
      //     `border-${color}-500 bg-${color}-100 text-${color}-500 hover:text-${color}-900`,
      // ],
    ],
  })

  // Returns a component selector without the default variant applied when toString is used
  assert.strictEqual(component.toString(), '.button\\#p8xtwh')
  assert.strictEqual(component.selector, '.button\\#p8xtwh')
  assert.strictEqual(component.className, 'button#p8xtwh')
  assert.deepEqual(tw.target, [])

  // Renders a component with the default variant applied
  assert.strictEqual(tw.inject(component()), 'button#p8xtwh button--color-orange#p8xtwh')
  assert.deepEqual(tw.target, [
    '.button--color-orange\\#p8xtwh{--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity));--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity))}',
    '.button--color-orange\\#p8xtwh:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}',
  ])
  tw.clear()

  assert.strictEqual(
    tw.inject(component({ color: 'gray', size: 'large', outlined: true })),
    'button#p8xtwh button--color-gray#p8xtwh button--size-large#p8xtwh button--color-gray_outlined-true$1#p8xtwh',
  )
  assert.deepEqual(tw.target, [
    '.button--color-gray\\#p8xtwh{--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity));--tw-text-opacity:1;color:rgba(243,244,246,var(--tw-text-opacity))}',
    '.button--size-large\\#p8xtwh{height:2rem;padding:2rem;font-size:2rem}',
    '.button--color-gray\\#p8xtwh:hover{--tw-bg-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '.button--color-gray_outlined-true\\$1\\#p8xtwh{--tw-bg-opacity:1;background-color:rgba(243,244,246,var(--tw-bg-opacity));--tw-border-opacity:1;border-color:rgba(107,114,128,var(--tw-border-opacity));--tw-text-opacity:1;color:rgba(107,114,128,var(--tw-text-opacity))}',
    '.button--color-gray_outlined-true\\$1\\#p8xtwh:hover{--tw-text-opacity:1;color:rgba(17,24,39,var(--tw-text-opacity))}',
  ])
  tw.clear()

  assert.strictEqual(
    tw.inject(component({ color: 'orange', size: 'small', outlined: true })),
    'button#p8xtwh button--color-orange#p8xtwh button--size-small#p8xtwh button--color-orange_outlined-true$0#p8xtwh',
  )
  assert.deepEqual(tw.target, [
    '.button--color-orange\\#p8xtwh{--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity));--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity))}',
    '.button--size-small\\#p8xtwh{height:1rem;padding:1rem;font-size:1rem}',
    '.button--color-orange\\#p8xtwh:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}',
    '.button--color-orange_outlined-true\\$0\\#p8xtwh{--tw-bg-opacity:1;background-color:rgba(255,237,213,var(--tw-bg-opacity));--tw-border-opacity:1;border-color:rgba(249,115,22,var(--tw-border-opacity));--tw-text-opacity:1;color:rgba(249,115,22,var(--tw-text-opacity))}',
    '.button--color-orange_outlined-true\\$0\\#p8xtwh:hover{--tw-text-opacity:1;color:rgba(124,45,18,var(--tw-text-opacity))}',
  ])
  tw.clear()

  assert.strictEqual(
    tw.inject(component({ color: 'orange', size: 'small', outlined: false })),
    'button#p8xtwh button--color-orange#p8xtwh button--size-small#p8xtwh',
  )
  assert.deepEqual(tw.target, [
    '.button--color-orange\\#p8xtwh{--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity));--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity))}',
    '.button--size-small\\#p8xtwh{height:1rem;padding:1rem;font-size:1rem}',
    '.button--color-orange\\#p8xtwh:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}',
  ])
  tw.clear()

  assert.strictEqual(
    tw.inject(component({ color: { _: 'gray', lg: 'orange' } })),
    'button#p8xtwh button--color-@_-gray@lg-orange#p8xtwh',
  )
  assert.deepEqual(tw.target, [
    '.button--color-\\@_-gray\\@lg-orange\\#p8xtwh{--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity));--tw-text-opacity:1;color:rgba(243,244,246,var(--tw-text-opacity))}',
    '.button--color-\\@_-gray\\@lg-orange\\#p8xtwh:hover{--tw-bg-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '@media (min-width:1024px){.button--color-\\@_-gray\\@lg-orange\\#p8xtwh{--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity));--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity))}}',
    '@media (min-width:1024px){.button--color-\\@_-gray\\@lg-orange\\#p8xtwh:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}}',
  ])
  tw.clear()

  // ignore inline responsive breakpoints for now
  assert.strictEqual(
    tw.inject(component({ color: { _: 'gray', lg: 'orange' }, outlined: true })),
    'button#p8xtwh button--color-@_-gray@lg-orange#p8xtwh',
  )
  assert.deepEqual(tw.target, [
    '.button--color-\\@_-gray\\@lg-orange\\#p8xtwh{--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity));--tw-text-opacity:1;color:rgba(243,244,246,var(--tw-text-opacity))}',
    '.button--color-\\@_-gray\\@lg-orange\\#p8xtwh:hover{--tw-bg-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '@media (min-width:1024px){.button--color-\\@_-gray\\@lg-orange\\#p8xtwh{--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity));--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity))}}',
    '@media (min-width:1024px){.button--color-\\@_-gray\\@lg-orange\\#p8xtwh:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}}',
  ])
  tw.clear()
})

test('Mixing string, apply, css and object', () => {
  const button = style({
    base: 'p-sm',

    props: {
      size: {
        sm: 'text-sm h-6',
        base: apply`text-base h-9`,
        large: css`
          font-size: 3rem;
          height: theme('spacing.12');
        `,
      },
      variant: {
        gray: css({
          backgroundColor: `theme('colors.gray.500')`,
          '&:hover': {
            backgroundColor: `theme('colors.gray.900')`,
          },
        }),
        primary: `
          text-white bg-orange-500
          hover:bg-orange-900
        `,
      },
      outlined: {
        true: 'border-gray-100',
      },
    },

    defaults: {
      variant: 'gray',
      size: 'sm',
    },

    when: [
      [
        {
          variant: 'gray',
          outlined: true,
        },
        apply`border-gray-500`,
      ],
    ],
  })

  assert.strictEqual(
    tw.inject(button()),
    'style#1uuq3sz style--size-sm#1uuq3sz style--variant-gray#1uuq3sz',
  )
  assert.deepEqual(tw.target, [
    '.style\\#1uuq3sz{padding:1rem}',
    '.style--size-sm\\#1uuq3sz{height:1.5rem;font-size:1rem}',
    '.style--variant-gray\\#1uuq3sz{background-color:#6b7280;background-color:#111827}',
  ])

  tw.clear()

  assert.strictEqual(
    tw.inject(button({ size: 'large', outlined: true })),
    'style#1uuq3sz style--outlined-true#1uuq3sz style--variant-gray_outlined-true$0#1uuq3sz style--size-large#1uuq3sz style--variant-gray#1uuq3sz',
  )

  assert.deepEqual(tw.target, [
    '.style\\#1uuq3sz{padding:1rem}',
    '.style--outlined-true\\#1uuq3sz{--tw-border-opacity:1;border-color:rgba(243,244,246,var(--tw-border-opacity))}',
    '.style--variant-gray_outlined-true\\$0\\#1uuq3sz{--tw-border-opacity:1;border-color:rgba(107,114,128,var(--tw-border-opacity))}',
    '.style--size-large\\#1uuq3sz{font-size:3rem;height:3rem}',
    '.style--variant-gray\\#1uuq3sz{background-color:#6b7280;background-color:#111827}',
  ])
})

test('With a Base component', () => {
  const button = style({
    base: `p-2.5`,

    defaults: {
      variant: 'gray',
      size: 'sm',
    },

    props: {
      size: {
        sm: `text-sm h-6`,
        base: `text-base h-9`,
      },
      variant: {
        gray: `
          bg-gray-500
          hover:bg-gray-900
        `,
        primary: `
          text-white bg-orange-500
          hover:bg-orange-900
        `,
      },
      outlined: {
        true: `bg-transparent border-gray-500`,
      },
    },

    when: [
      [
        {
          variant: 'gray',
          outlined: true,
        },
        `border-gray-900`,
      ],
    ],
  })

  assert.strictEqual(
    tw.inject(button()),
    'style#1hvn013 style--variant-gray#1hvn013 style--size-sm#1hvn013',
  )
  assert.deepEqual(tw.target, [
    '.style\\#1hvn013{padding:1.125rem}',
    '.style--variant-gray\\#1hvn013{--tw-bg-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '.style--size-sm\\#1hvn013{height:1.5rem;font-size:1rem}',
    '.style--variant-gray\\#1hvn013:hover{--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity))}',
  ])

  tw.clear()

  assert.strictEqual(
    tw.inject(button({ outlined: true })),
    'style#1hvn013 style--outlined-true#1hvn013 style--variant-gray#1hvn013 style--size-sm#1hvn013 style--variant-gray_outlined-true$0#1hvn013',
  )

  assert.deepEqual(tw.target, [
    '.style\\#1hvn013{padding:1.125rem}',
    '.style--outlined-true\\#1hvn013{--tw-border-opacity:1;border-color:rgba(107,114,128,var(--tw-border-opacity));background-color:transparent}',
    '.style--variant-gray\\#1hvn013{--tw-bg-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '.style--size-sm\\#1hvn013{height:1.5rem;font-size:1rem}',
    '.style--variant-gray\\#1hvn013:hover{--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity))}',
    '.style--variant-gray_outlined-true\\$0\\#1hvn013{--tw-border-opacity:1;border-color:rgba(17,24,39,var(--tw-border-opacity))}',
  ])

  tw.clear()

  assert.strictEqual(
    tw.inject(button({ variant: 'gray', outlined: { sm: true } })),
    'style#1hvn013 style--variant-gray#1hvn013 style--size-sm#1hvn013 style--outlined-@sm-true#1hvn013',
  )

  assert.deepEqual(tw.target, [
    '.style\\#1hvn013{padding:1.125rem}',
    '.style--variant-gray\\#1hvn013{--tw-bg-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '.style--size-sm\\#1hvn013{height:1.5rem;font-size:1rem}',
    '.style--variant-gray\\#1hvn013:hover{--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity))}',
    '@media (min-width:640px){.style--outlined-\\@sm-true\\#1hvn013{--tw-border-opacity:1;border-color:rgba(107,114,128,var(--tw-border-opacity));background-color:transparent}}',
  ])

  // // 1. bg-gray-400 hover:bg-gray-500
  // // 2. @screen sm { `bg-transparent ring-1` }
  const extendedButton = style(button, {
    props: {
      size: {
        xl: `text-xl h-12`,
      },
      rounded: {
        true: 'rounded-full',
        false: `rounded-none`,
        sm: 'rounded-sm',
        md: 'rounded-md',
      },
    },
    defaults: {
      rounded: true,
    },
  })

  tw.clear()

  assert.strictEqual(
    tw.inject(extendedButton({ rounded: true, size: 'xl' })),
    'style#1rarrns style#1hvn013 style--rounded-true#1rarrns style--size-xl#1rarrns',
  )

  assert.deepEqual(tw.target, [
    '.style\\#1hvn013{padding:1.125rem}',
    '.style--rounded-true\\#1rarrns{border-radius:100%}',
    '.style--size-xl\\#1rarrns{height:3rem;font-size:3rem}',
  ])

  tw.clear()

  assert.strictEqual(
    tw.inject(extendedButton({ rounded: 'sm' })),
    'style#1rarrns style#1hvn013 style--rounded-sm#1rarrns',
  )

  assert.deepEqual(tw.target, [
    '.style\\#1hvn013{padding:1.125rem}',
    '.style--rounded-sm\\#1rarrns{border-radius:1rem}',
  ])
})

test('is added to component layer', () => {
  const component = style({
    base: 'top-2',
  })

  assert.deepEqual(tw.target, [])

  assert.strictEqual(tw.inject(`p-2 ${component()} top-1`), 'style#9tmjoq p-2 top-1')
  assert.deepEqual(tw.target, [
    '.style\\#9tmjoq{top:1rem}',
    '.p-2{padding:1rem}',
    '.top-1{top:.25rem}',
  ])
})
