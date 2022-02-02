import { assert, test, afterEach } from 'vitest'

import { twind, virtual, style, colorFromTheme, fromTheme, shortcut, css, tx as tx$ } from '..'

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

  assert.strictEqual(component.selector, '.button\\#p8xtwh')
  assert.strictEqual(component.className, 'button#p8xtwh')
  assert.deepEqual(tw.target, [])

  // Renders a component with the default variant applied
  assert.strictEqual(tw(component()), 'button#p8xtwh button--color-orange#p8xtwh')
  assert.deepEqual(tw.target, [
    '.button--color-orange\\#p8xtwh{--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity))}',
    '.button--color-orange\\#p8xtwh:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}',
  ])
  tw.clear()

  assert.strictEqual(
    tw(component({ color: 'gray', size: 'large', outlined: true })),
    'button#p8xtwh button--color-gray#p8xtwh button--size-large#p8xtwh button-1--color-gray_outlined-true#p8xtwh',
  )
  assert.deepEqual(tw.target, [
    '.button--color-gray\\#p8xtwh{--tw-text-opacity:1;color:rgba(243,244,246,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity))}',
    '.button--size-large\\#p8xtwh{height:2rem;padding:2rem;font-size:2rem}',
    '.button--color-gray\\#p8xtwh:hover{--tw-bg-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '.button-1--color-gray_outlined-true\\#p8xtwh{--tw-text-opacity:1;color:rgba(107,114,128,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(243,244,246,var(--tw-bg-opacity));--tw-border-opacity:1;border-color:rgba(107,114,128,var(--tw-border-opacity))}',
    '.button-1--color-gray_outlined-true\\#p8xtwh:hover{--tw-text-opacity:1;color:rgba(17,24,39,var(--tw-text-opacity))}',
  ])
  tw.clear()

  assert.strictEqual(
    tw(component({ color: 'orange', size: 'small', outlined: true })),
    'button#p8xtwh button--color-orange#p8xtwh button--size-small#p8xtwh button-0--color-orange_outlined-true#p8xtwh',
  )
  assert.deepEqual(tw.target, [
    '.button--color-orange\\#p8xtwh{--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity))}',
    '.button--size-small\\#p8xtwh{height:1rem;padding:1rem;font-size:1rem}',
    '.button--color-orange\\#p8xtwh:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}',
    '.button-0--color-orange_outlined-true\\#p8xtwh{--tw-text-opacity:1;color:rgba(249,115,22,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(255,237,213,var(--tw-bg-opacity));--tw-border-opacity:1;border-color:rgba(249,115,22,var(--tw-border-opacity))}',
    '.button-0--color-orange_outlined-true\\#p8xtwh:hover{--tw-text-opacity:1;color:rgba(124,45,18,var(--tw-text-opacity))}',
  ])
  tw.clear()

  assert.strictEqual(
    tw(component({ color: 'orange', size: 'small', outlined: false })),
    'button#p8xtwh button--color-orange#p8xtwh button--size-small#p8xtwh',
  )
  assert.deepEqual(tw.target, [
    '.button--color-orange\\#p8xtwh{--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity))}',
    '.button--size-small\\#p8xtwh{height:1rem;padding:1rem;font-size:1rem}',
    '.button--color-orange\\#p8xtwh:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}',
  ])
  tw.clear()

  assert.strictEqual(
    tw(component({ color: { _: 'gray', lg: 'orange' } })),
    'button#p8xtwh button--color-@_-gray@lg-orange#p8xtwh',
  )
  assert.deepEqual(tw.target, [
    '.button--color-\\@_-gray\\@lg-orange\\#p8xtwh{--tw-text-opacity:1;color:rgba(243,244,246,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity))}',
    '.button--color-\\@_-gray\\@lg-orange\\#p8xtwh:hover{--tw-bg-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '@media (min-width:1024px){.button--color-\\@_-gray\\@lg-orange\\#p8xtwh{--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity))}}',
    '@media (min-width:1024px){.button--color-\\@_-gray\\@lg-orange\\#p8xtwh:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}}',
  ])
  tw.clear()

  // ignore inline responsive breakpoints for now
  assert.strictEqual(
    tw(component({ color: { _: 'gray', lg: 'orange' }, outlined: true })),
    'button#p8xtwh button--color-@_-gray@lg-orange#p8xtwh',
  )
  assert.deepEqual(tw.target, [
    '.button--color-\\@_-gray\\@lg-orange\\#p8xtwh{--tw-text-opacity:1;color:rgba(243,244,246,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity))}',
    '.button--color-\\@_-gray\\@lg-orange\\#p8xtwh:hover{--tw-bg-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '@media (min-width:1024px){.button--color-\\@_-gray\\@lg-orange\\#p8xtwh{--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity))}}',
    '@media (min-width:1024px){.button--color-\\@_-gray\\@lg-orange\\#p8xtwh:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}}',
  ])
  tw.clear()

  assert.strictEqual(
    tw(`sm:(${component({ outlined: true })})`),
    'sm:button#p8xtwh sm:button--color-orange#p8xtwh sm:button-0--color-orange_outlined-true#p8xtwh',
  )
  assert.deepEqual(tw.target, [
    '@media (min-width:640px){.sm\\:button--color-orange\\#p8xtwh{--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity))}}',
    '@media (min-width:640px){.sm\\:button--color-orange\\#p8xtwh:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}}',
    '@media (min-width:640px){.sm\\:button-0--color-orange_outlined-true\\#p8xtwh{--tw-text-opacity:1;color:rgba(249,115,22,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(255,237,213,var(--tw-bg-opacity));--tw-border-opacity:1;border-color:rgba(249,115,22,var(--tw-border-opacity))}}',
    '@media (min-width:640px){.sm\\:button-0--color-orange_outlined-true\\#p8xtwh:hover{--tw-text-opacity:1;color:rgba(124,45,18,var(--tw-text-opacity))}}',
  ])

  tw.clear()
})

test('without a label', () => {
  const component = style({
    base: 'p-1',
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

  assert.strictEqual(component.selector, '.style\\#4f78gw')
  assert.strictEqual(component.className, 'style#4f78gw')
  assert.deepEqual(tw.target, [])

  // Renders a component with the default variant applied
  assert.strictEqual(tw(component()), 'style#4f78gw style--color-orange#4f78gw')
  assert.deepEqual(tw.target, [
    '.style\\#4f78gw{padding:.25rem}',
    '.style--color-orange\\#4f78gw{--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity))}',
    '.style--color-orange\\#4f78gw:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}',
  ])
  tw.clear()

  assert.strictEqual(
    tw(component({ color: 'gray', size: 'large', outlined: true })),
    'style#4f78gw style--color-gray#4f78gw style--size-large#4f78gw style-1--color-gray_outlined-true#4f78gw',
  )
  assert.deepEqual(tw.target, [
    '.style\\#4f78gw{padding:.25rem}',
    '.style--color-gray\\#4f78gw{--tw-text-opacity:1;color:rgba(243,244,246,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity))}',
    '.style--size-large\\#4f78gw{height:2rem;padding:2rem;font-size:2rem}',
    '.style--color-gray\\#4f78gw:hover{--tw-bg-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '.style-1--color-gray_outlined-true\\#4f78gw{--tw-text-opacity:1;color:rgba(107,114,128,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(243,244,246,var(--tw-bg-opacity));--tw-border-opacity:1;border-color:rgba(107,114,128,var(--tw-border-opacity))}',
    '.style-1--color-gray_outlined-true\\#4f78gw:hover{--tw-text-opacity:1;color:rgba(17,24,39,var(--tw-text-opacity))}',
  ])
  tw.clear()

  assert.strictEqual(
    tw(component({ color: 'orange', size: 'small', outlined: true })),
    'style#4f78gw style--color-orange#4f78gw style--size-small#4f78gw style-0--color-orange_outlined-true#4f78gw',
  )
  assert.deepEqual(tw.target, [
    '.style\\#4f78gw{padding:.25rem}',
    '.style--color-orange\\#4f78gw{--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity))}',
    '.style--size-small\\#4f78gw{height:1rem;padding:1rem;font-size:1rem}',
    '.style--color-orange\\#4f78gw:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}',
    '.style-0--color-orange_outlined-true\\#4f78gw{--tw-text-opacity:1;color:rgba(249,115,22,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(255,237,213,var(--tw-bg-opacity));--tw-border-opacity:1;border-color:rgba(249,115,22,var(--tw-border-opacity))}',
    '.style-0--color-orange_outlined-true\\#4f78gw:hover{--tw-text-opacity:1;color:rgba(124,45,18,var(--tw-text-opacity))}',
  ])
  tw.clear()

  assert.strictEqual(
    tw(component({ color: 'orange', size: 'small', outlined: false })),
    'style#4f78gw style--color-orange#4f78gw style--size-small#4f78gw',
  )
  assert.deepEqual(tw.target, [
    '.style\\#4f78gw{padding:.25rem}',
    '.style--color-orange\\#4f78gw{--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity))}',
    '.style--size-small\\#4f78gw{height:1rem;padding:1rem;font-size:1rem}',
    '.style--color-orange\\#4f78gw:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}',
  ])
  tw.clear()

  assert.strictEqual(
    tw(component({ color: { _: 'gray', lg: 'orange' } })),
    'style#4f78gw style--color-@_-gray@lg-orange#4f78gw',
  )
  assert.deepEqual(tw.target, [
    '.style\\#4f78gw{padding:.25rem}',
    '.style--color-\\@_-gray\\@lg-orange\\#4f78gw{--tw-text-opacity:1;color:rgba(243,244,246,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity))}',
    '.style--color-\\@_-gray\\@lg-orange\\#4f78gw:hover{--tw-bg-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '@media (min-width:1024px){.style--color-\\@_-gray\\@lg-orange\\#4f78gw{--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity))}}',
    '@media (min-width:1024px){.style--color-\\@_-gray\\@lg-orange\\#4f78gw:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}}',
  ])
  tw.clear()

  // ignore inline responsive breakpoints for now
  assert.strictEqual(
    tw(component({ color: { _: 'gray', lg: 'orange' }, outlined: true })),
    'style#4f78gw style--color-@_-gray@lg-orange#4f78gw',
  )
  assert.deepEqual(tw.target, [
    '.style\\#4f78gw{padding:.25rem}',
    '.style--color-\\@_-gray\\@lg-orange\\#4f78gw{--tw-text-opacity:1;color:rgba(243,244,246,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity))}',
    '.style--color-\\@_-gray\\@lg-orange\\#4f78gw:hover{--tw-bg-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '@media (min-width:1024px){.style--color-\\@_-gray\\@lg-orange\\#4f78gw{--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity))}}',
    '@media (min-width:1024px){.style--color-\\@_-gray\\@lg-orange\\#4f78gw:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}}',
  ])
  tw.clear()

  assert.strictEqual(
    tw(`sm:(${component({ outlined: true })})`),
    'sm:style#4f78gw sm:style--color-orange#4f78gw sm:style-0--color-orange_outlined-true#4f78gw',
  )
  assert.deepEqual(tw.target, [
    '@media (min-width:640px){.sm\\:style\\#4f78gw{padding:.25rem}}',
    '@media (min-width:640px){.sm\\:style--color-orange\\#4f78gw{--tw-text-opacity:1;color:rgba(255,237,213,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(124,45,18,var(--tw-bg-opacity))}}',
    '@media (min-width:640px){.sm\\:style--color-orange\\#4f78gw:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}}',
    '@media (min-width:640px){.sm\\:style-0--color-orange_outlined-true\\#4f78gw{--tw-text-opacity:1;color:rgba(249,115,22,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(255,237,213,var(--tw-bg-opacity));--tw-border-opacity:1;border-color:rgba(249,115,22,var(--tw-border-opacity))}}',
    '@media (min-width:640px){.sm\\:style-0--color-orange_outlined-true\\#4f78gw:hover{--tw-text-opacity:1;color:rgba(124,45,18,var(--tw-text-opacity))}}',
  ])

  tw.clear()
})

test('mixing string, apply, css and object', () => {
  const button = style({
    base: 'p-sm',

    props: {
      size: {
        sm: 'text-sm h-6',
        base: shortcut`text-base h-9`,
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
        shortcut`border-gray-500`,
      ],
    ],
  })

  assert.strictEqual(
    tw(button()),
    'style#1ryoj5q style--size-sm#1ryoj5q style--variant-gray#1ryoj5q',
  )
  assert.deepEqual(tw.target, [
    '.style\\#1ryoj5q{padding:1rem}',
    '.style--size-sm\\#1ryoj5q{height:1.5rem;font-size:1rem}',
    '.style--variant-gray\\#1ryoj5q{background-color:#6b7280}',
    '.style--variant-gray\\#1ryoj5q:hover{background-color:#111827}',
  ])

  tw.clear()

  const tx = tx$.bind(tw)

  assert.strictEqual(
    tx(
      css`
        color: darkgreen;
      `,
      button({ outlined: true }),
      'text-sm',
      shortcut('text-6'),
    ),
    'style#1ryoj5q style--outlined-true#1ryoj5q style--size-sm#1ryoj5q style--variant-gray#1ryoj5q style-0--variant-gray_outlined-true#1ryoj5q ~(text-6) text-sm css#wvzpmg',
  )

  assert.deepEqual(tw.target, [
    '.style\\#1ryoj5q{padding:1rem}',
    '.style--outlined-true\\#1ryoj5q{--tw-border-opacity:1;border-color:rgba(243,244,246,var(--tw-border-opacity))}',
    '.style--size-sm\\#1ryoj5q{height:1.5rem;font-size:1rem}',
    '.style--variant-gray\\#1ryoj5q{background-color:#6b7280}',
    '.style--variant-gray\\#1ryoj5q:hover{background-color:#111827}',
    '.style-0--variant-gray_outlined-true\\#1ryoj5q{--tw-border-opacity:1;border-color:rgba(107,114,128,var(--tw-border-opacity))}',
    '.\\~\\(text-6\\){font-size:1.5rem}',
    '.text-sm{font-size:1rem}',
    '.css\\#wvzpmg{color:darkgreen}',
  ])
})

test('with a Base component', () => {
  const button = style({
    label: 'button',
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

  const extendedButton = style(button, {
    label: 'extended',
    base: `p-1`,
    props: {
      size: {
        base: `text-md`,
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
      size: 'base',
      rounded: true,
    },
    when: [
      [
        {
          variant: 'gray',
          rounded: true,
        },
        `border-gray-500`,
      ],
    ],
  })

  assert.strictEqual(
    tw(extendedButton({ rounded: true, size: 'xl' })),
    'button#yog38i button~extended#1abui02 button--variant-gray#yog38i button~extended--rounded-true#1abui02 button~extended--size-xl#1abui02 button~extended-0--variant-gray_rounded-true#1abui02',
  )

  assert.deepEqual(tw.target, [
    '.button\\#yog38i{padding:1.125rem}',
    '.button\\~extended\\#1abui02{padding:.25rem}',
    '.button--variant-gray\\#yog38i{--tw-bg-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '.button\\~extended--rounded-true\\#1abui02{border-radius:100%}',
    '.button\\~extended--size-xl\\#1abui02{height:3rem;font-size:3rem}',
    '.button--variant-gray\\#yog38i:hover{--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity))}',
    '.button\\~extended-0--variant-gray_rounded-true\\#1abui02{--tw-border-opacity:1;border-color:rgba(107,114,128,var(--tw-border-opacity))}',
  ])

  tw.clear()

  assert.strictEqual(
    tw(extendedButton({ rounded: true, outlined: true })),
    'button#yog38i button~extended#1abui02 button--outlined-true#yog38i button--size-base#yog38i button--variant-gray#yog38i button~extended--rounded-true#1abui02 button~extended--size-base#1abui02 button-0--variant-gray_outlined-true#yog38i button~extended-0--variant-gray_rounded-true#1abui02',
  )

  assert.deepEqual(tw.target, [
    '.button\\#yog38i{padding:1.125rem}',
    '.button\\~extended\\#1abui02{padding:.25rem}',
    '.button--outlined-true\\#yog38i{--tw-border-opacity:1;border-color:rgba(107,114,128,var(--tw-border-opacity));background-color:transparent}',
    '.button--size-base\\#yog38i{height:2.5rem;font-size:1.2rem}',
    '.button--variant-gray\\#yog38i{--tw-bg-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '.button\\~extended--rounded-true\\#1abui02{border-radius:100%}',
    '.button\\~extended--size-base\\#1abui02{font-size:1.5rem}',
    '.button--variant-gray\\#yog38i:hover{--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity))}',
    '.button-0--variant-gray_outlined-true\\#yog38i{--tw-border-opacity:1;border-color:rgba(17,24,39,var(--tw-border-opacity))}',
    '.button\\~extended-0--variant-gray_rounded-true\\#1abui02{--tw-border-opacity:1;border-color:rgba(107,114,128,var(--tw-border-opacity))}',
  ])

  tw.clear()

  assert.strictEqual(
    tw(extendedButton({ rounded: 'sm' })),
    'button#yog38i button~extended#1abui02 button--size-base#yog38i button--variant-gray#yog38i button~extended--rounded-sm#1abui02 button~extended--size-base#1abui02',
  )

  assert.deepEqual(tw.target, [
    '.button\\#yog38i{padding:1.125rem}',
    '.button\\~extended\\#1abui02{padding:.25rem}',
    '.button--size-base\\#yog38i{height:2.5rem;font-size:1.2rem}',
    '.button--variant-gray\\#yog38i{--tw-bg-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '.button\\~extended--rounded-sm\\#1abui02{border-radius:1rem}',
    '.button\\~extended--size-base\\#1abui02{font-size:1.5rem}',
    '.button--variant-gray\\#yog38i:hover{--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity))}',
  ])
})

test('is added to component layer', () => {
  const component = style({
    base: 'top-2',
  })

  assert.deepEqual(tw.target, [])

  assert.strictEqual(tw(`p-2 ${component()} top-1`), 'style#1lg9g8g p-2 top-1')
  assert.deepEqual(tw.target, [
    '.style\\#1lg9g8g{top:1rem}',
    '.p-2{padding:1rem}',
    '.top-1{top:.25rem}',
  ])
})
