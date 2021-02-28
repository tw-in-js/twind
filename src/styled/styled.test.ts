import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance, Directive } from '../types'
import type { VirtualSheet } from '../sheets/index'

import { virtualSheet } from '../sheets/index'
import { create, strict, apply } from '../index'
import { css, theme } from '../css'

import { styled } from './index'

const test = suite<{
  sheet: VirtualSheet
  tw: Instance['tw']
}>('css')

test.before((context) => {
  context.sheet = virtualSheet()
  const instance = create({
    sheet: context.sheet,
    mode: strict,
    preflight: false,
    prefix: false,
  })
  context.tw = instance.tw
})

test.after.each(({ sheet }) => {
  sheet.reset()
})

test('The "as" property is passed through', ({ sheet, tw }) => {
  const component = styled({
    variants: {
      as: {
        button: {
          color: 'dodgerblue',
        },
        a: {
          color: 'tomato',
        },
      },
    },
  })

  assert.equal(sheet.target, [])

  assert.is(tw(component({ as: 'button' })), 'tw-7e76a2 tw-1es5jbm')
  assert.equal(sheet.target, ['.tw-7e76a2{color:dodgerblue}'])

  sheet.reset()

  assert.is(tw(component({ as: 'a' })), 'tw-14ofitt tw-1es5jbm')
  assert.equal(sheet.target, ['.tw-14ofitt{color:tomato}'])
})

test('Variants', ({ sheet, tw }) => {
  const component = styled({
    variants: {
      color: {
        blue: {
          backgroundColor: 'dodgerblue',
          color: 'white',
        },
        red: {
          backgroundColor: 'tomato',
          color: 'white',
        },
      },
      size: {
        small: {
          fontSize: '16px',
        },
        large: {
          fontSize: '24px',
        },
      },
      level: {
        1: {
          padding: '0.5em',
        },
        2: {
          padding: '1em',
        },
      },
    },
    compounds: [
      {
        size: 'small',
        color: 'blue',
        style: {
          transform: 'scale(1.2)',
        },
      },
    ],
  })

  assert.equal(sheet.target, [])

  // Renders a component without any initial styles
  assert.is(tw(component()), 'tw-1d1derl tw-e5ryml')
  assert.equal(sheet.target, [])

  sheet.reset()

  // Renders a component with 1 matching variant
  assert.is(tw(component({ size: 'small' })), 'tw-yfvz3f tw-e5ryml')
  assert.equal(sheet.target, ['.tw-yfvz3f{font-size:16px}'])

  sheet.reset()

  assert.is(tw(component({ color: 'blue' })), 'tw-pwx3rt tw-e5ryml')
  assert.equal(sheet.target, ['.tw-pwx3rt{background-color:dodgerblue;color:white}'])

  sheet.reset()

  // Renders a component with 2 matching variants
  assert.is(tw(component({ size: 'small', level: 1 })), 'tw-1l8w0rz tw-e5ryml')
  assert.equal(sheet.target, ['.tw-1l8w0rz{font-size:16px;padding:0.5em}'])

  sheet.reset()

  // Renders a component with a 2 matching variants and 1 matching compound
  assert.is(tw(component({ size: 'small', color: 'blue' })), 'tw-1i6d39h tw-e5ryml')
  assert.equal(sheet.target, [
    '.tw-1i6d39h{background-color:dodgerblue;color:white;font-size:16px;transform:scale(1.2)}',
  ])
})

test('Variants with defaults', ({ sheet, tw }) => {
  const component = styled({
    variants: {
      color: {
        blue: {
          backgroundColor: 'dodgerblue',
          color: 'white',
        },
        red: {
          backgroundColor: 'tomato',
          color: 'white',
        },
      },
      size: {
        small: {
          fontSize: '16px',
        },
        large: {
          fontSize: '24px',
        },
      },
      level: {
        1: {
          padding: '0.5em',
        },
        2: {
          padding: '1em',
        },
      },
    },
    compounds: [
      {
        size: 'small',
        color: 'blue',
        style: {
          transform: 'scale(1.2)',
        },
      },
    ],
    defaults: {
      size: 'small',
    },
  })

  assert.equal(sheet.target, [])

  // Renders a component with the default variant applied
  assert.is(tw(component()), 'tw-59it4k tw-lg9y0a')
  assert.equal(sheet.target, ['.tw-59it4k{font-size:16px}'])

  sheet.reset()

  // Renders a component with the default variant explicitly applied
  assert.is(tw(component({ size: 'small' })), 'tw-59it4k tw-lg9y0a')
  assert.equal(sheet.target, ['.tw-59it4k{font-size:16px}'])

  sheet.reset()

  // Renders a component with the non-default variant explicitly applied
  assert.is(tw(component({ size: 'large' })), 'tw-47l5an tw-lg9y0a')
  assert.equal(sheet.target, ['.tw-47l5an{font-size:24px}'])

  sheet.reset()

  // Renders a component with the default variant applied and a different variant explicitly applied
  assert.is(tw(component({ level: 1 })), 'tw-hgx8wy tw-lg9y0a')
  assert.equal(sheet.target, ['.tw-hgx8wy{font-size:16px;padding:0.5em}'])

  sheet.reset()

  // Renders a component with the default variant applied, a different variant explicitly applied, and a compound applied
  assert.is(tw(component({ color: 'blue' })), 'tw-1l3b2m4 tw-lg9y0a')
  // explicit color:blue -> background-color:dodgerblue;color:white;
  // implicit size:small -> font-size:16px;
  // compound color:blue + size:small -> transform:scale(1.2);
  assert.equal(sheet.target, [
    '.tw-1l3b2m4{background-color:dodgerblue;color:white;font-size:16px;transform:scale(1.2)}',
  ])

  sheet.reset()

  // Returns a component selector without the default variant applied when toString is used
  assert.is(component.toString(), '.tw-lg9y0a')
  assert.equal(sheet.target, [])

  assert.is(component.selector, '.tw-lg9y0a')
  assert.equal(sheet.target, [])

  assert.is(component.className, 'tw-lg9y0a')
  assert.equal(sheet.target, [])

  sheet.reset()
})

test('Conditional variants', ({ sheet, tw }) => {
  const component = styled({
    variants: {
      color: {
        blue: {
          backgroundColor: 'dodgerblue',
          color: 'white',
        },
        red: {
          backgroundColor: 'tomato',
          color: 'white',
        },
      },
      size: {
        small: {
          fontSize: '16px',
        },
        large: {
          fontSize: '24px',
        },
      },
      level: {
        1: {
          padding: '0.5em',
        },
        2: {
          padding: '1em',
        },
      },
    },
    compounds: [
      {
        size: 'small',
        color: 'blue',
        style: {
          transform: 'scale(1.2)',
        },
      },
    ],
  })

  assert.equal(sheet.target, [])
  assert.is(component.className, 'tw-e5ryml')

  // Renders a component with no variant applied
  assert.is(tw(component()), 'tw-1d1derl tw-e5ryml')
  assert.equal(sheet.target, [])

  sheet.reset()

  // Renders a component with one variant applied
  assert.is(tw(component({ size: 'small' })), 'tw-yfvz3f tw-e5ryml')
  assert.equal(sheet.target, ['.tw-yfvz3f{font-size:16px}'])

  sheet.reset()

  // Renders a component with one conditional variant on one breakpoint applied
  assert.is(tw(component({ size: { md: 'small' } })), 'tw-1fph079 tw-e5ryml')
  assert.equal(sheet.target, ['@media (min-width:768px){.tw-1fph079{font-size:16px}}'])

  sheet.reset()

  // Renders a component with one conditional variant on two breakpoints applied
  assert.is(tw(component({ size: { md: 'small', lg: 'large' } })), 'tw-81ymt4 tw-e5ryml')
  assert.equal(sheet.target, [
    '@media (min-width:768px){.tw-81ymt4{font-size:16px}}',
    '@media (min-width:1024px){.tw-81ymt4{font-size:24px}}',
  ])

  sheet.reset()

  assert.is(
    tw(component({ size: { initial: 'large', md: 'small', lg: 'large' } })),
    'tw-1hb7l8h tw-e5ryml',
  )
  assert.equal(sheet.target, [
    '.tw-1hb7l8h{font-size:24px}',
    '@media (min-width:768px){.tw-1hb7l8h{font-size:16px}}',
    '@media (min-width:1024px){.tw-1hb7l8h{font-size:24px}}',
  ])

  sheet.reset()
})

test('Component Conditions', ({ sheet, tw }) => {
  const component = styled({
    style: {
      fontSize: '16px',
      '@screen md': {
        fontSize: '24px',
      },
    },
  })

  assert.is(tw(component()), 'tw-1pn76x8 tw-17lj1i4')
  assert.equal(sheet.target, [
    '.tw-1pn76x8{font-size:16px}',
    '@media (min-width:768px){.tw-1pn76x8{font-size:24px}}',
  ])
})

test('Mixing string, apply, css and object', ({ sheet, tw }) => {
  const button = styled({
    style: 'rounded-full px-2.5',

    variants: {
      size: {
        sm: 'text-sm h-6',
        base: apply`text-base h-9`,
        large: css`
          font-size: 3rem;
          height: ${theme('spacing.12')};
        `,
      },
      variant: {
        gray: {
          backgroundColor: theme('colors.gray.400') as Directive<string>,
          '&:hover': {
            backgroundColor: theme('colors.gray.500') as Directive<string>,
          },
        },
        primary: `
          text-white bg-purple-400
          hover:bg-purple-500
        `,
      },
      outlined: {
        true: 'bg-transparent ring-1',
      },
    },

    defaults: {
      variant: 'gray',
      size: 'sm',
    },

    compounds: [
      {
        variant: 'gray',
        outlined: true,
        style: apply`ring-gray-400`,
      },
    ],
  })

  // Nothing inserted yet
  assert.equal(sheet.target, [])

  assert.is(tw(button()), 'tw-1c4ukmw tw-10iu5cz')
  assert.equal(sheet.target, [
    '.tw-1c4ukmw{border-radius:9999px;padding-left:0.625rem;padding-right:0.625rem;font-size:0.875rem;line-height:1.25rem;height:1.5rem;background-color:#9ca3af}',
    '.tw-1c4ukmw:hover{background-color:#6b7280}',
  ])

  sheet.reset()

  assert.is(tw(button({ size: 'large', outlined: true })), 'tw-17ydchj tw-10iu5cz')

  assert.equal(sheet.target, [
    '*{--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,var(--tw-ring-opacity,0.5));--tw-ring-offset-shadow:0 0 transparent;--tw-ring-shadow:0 0 transparent}',
    '.tw-17ydchj{border-radius:9999px;padding-left:0.625rem;padding-right:0.625rem;font-size:3rem;height:3rem;background-color:transparent;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 transparent);--tw-ring-opacity:1;--tw-ring-color:rgba(156,163,175,var(--tw-ring-opacity))}',
    '.tw-17ydchj:hover{background-color:#6b7280}',
  ])
})

test('With a Base component', ({ sheet, tw }) => {
  const button = styled({
    style: `rounded-full px-2.5`,

    variants: {
      size: {
        sm: `text-sm h-6`,
        base: `text-base h-9`,
      },
      variant: {
        gray: `
          bg-gray-400
          hover:bg-gray-500
        `,
        primary: `
          text-white bg-purple-400
          hover:bg-purple-500
        `,
      },
      outlined: {
        true: `bg-transparent ring-1`,
      },
    },

    defaults: {
      variant: 'gray',
      size: 'sm',
    },

    compounds: [
      {
        variant: 'gray',
        outlined: true,
        style: `ring-gray-400`,
      },
    ],
  })

  // Nothing inserted yet
  assert.equal(sheet.target, [])

  assert.is(tw(button()), 'tw-9e57zu tw-1htxdy9')
  assert.equal(sheet.target, [
    '.tw-9e57zu{border-radius:9999px;padding-left:0.625rem;padding-right:0.625rem;font-size:0.875rem;line-height:1.25rem;height:1.5rem;--tw-bg-opacity:1;background-color:#9ca3af;background-color:rgba(156,163,175,var(--tw-bg-opacity))}',
    '.tw-9e57zu:hover{--tw-bg-opacity:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
  ])

  sheet.reset()

  assert.is(tw(button({ outlined: true })), 'tw-185cdjp tw-1htxdy9')

  assert.equal(sheet.target, [
    '*{--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,var(--tw-ring-opacity,0.5));--tw-ring-offset-shadow:0 0 transparent;--tw-ring-shadow:0 0 transparent}',
    '.tw-185cdjp{border-radius:9999px;padding-left:0.625rem;padding-right:0.625rem;font-size:0.875rem;line-height:1.25rem;height:1.5rem;--tw-bg-opacity:1;background-color:transparent;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 transparent);--tw-ring-opacity:1;--tw-ring-color:rgba(156,163,175,var(--tw-ring-opacity))}',
    '.tw-185cdjp:hover{--tw-bg-opacity:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
  ])

  sheet.reset()

  assert.is(tw(button({ variant: 'gray', outlined: { sm: true } })), 'tw-rjssfd tw-1htxdy9')

  assert.equal(sheet.target, [
    '*{--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,var(--tw-ring-opacity,0.5));--tw-ring-offset-shadow:0 0 transparent;--tw-ring-shadow:0 0 transparent}',
    '.tw-rjssfd{border-radius:9999px;padding-left:0.625rem;padding-right:0.625rem;font-size:0.875rem;line-height:1.25rem;height:1.5rem;--tw-bg-opacity:1;background-color:#9ca3af;background-color:rgba(156,163,175,var(--tw-bg-opacity));--tw-ring-opacity:1;--tw-ring-color:rgba(156,163,175,var(--tw-ring-opacity))}',
    '.tw-rjssfd:hover{--tw-bg-opacity:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '@media (min-width:640px){.tw-rjssfd{background-color:transparent;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 transparent);--tw-ring-opacity:1;--tw-ring-color:rgba(156,163,175,var(--tw-ring-opacity))}}',
  ])

  // // 1. bg-gray-400 hover:bg-gray-500
  // // 2. @screen sm { `bg-transparent ring-1` }
  const extendedButton = styled(button, {
    variants: {
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

  sheet.reset()

  assert.is(tw(extendedButton({ rounded: true, size: 'xl' })), 'tw-pdnmr7 tw-1htxdy9 tw-a38m4x')

  assert.equal(sheet.target, [
    '.tw-pdnmr7{border-radius:9999px;padding-left:0.625rem;padding-right:0.625rem;--tw-bg-opacity:1;background-color:#9ca3af;background-color:rgba(156,163,175,var(--tw-bg-opacity));font-size:1.25rem;line-height:1.75rem;height:3rem}',
    '.tw-pdnmr7:hover{--tw-bg-opacity:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
  ])

  sheet.reset()

  assert.is(tw(extendedButton({ rounded: 'sm' })), 'tw-7bukb2 tw-1htxdy9 tw-a38m4x')

  assert.equal(sheet.target, [
    '.tw-7bukb2{border-radius:0.125rem;padding-left:0.625rem;padding-right:0.625rem;font-size:0.875rem;line-height:1.25rem;height:1.5rem;--tw-bg-opacity:1;background-color:#9ca3af;background-color:rgba(156,163,175,var(--tw-bg-opacity))}',
    '.tw-7bukb2:hover{--tw-bg-opacity:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
  ])
})

test.run()
