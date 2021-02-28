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

test('The "tw" property is evaluated', ({ sheet, tw }) => {
  const component = styled({
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaults: {
      size: 'md',
    },
  })

  assert.equal(sheet.target, [])

  assert.is(tw(component({ tw: `underline` })), 'tw-17aav39 tw-1i159b5')
  assert.equal(sheet.target, [
    '.tw-17aav39{font-size:1rem;line-height:1.5rem;text-decoration:underline}',
  ])

  sheet.reset()

  assert.is(tw(component({ tw: `text-xl` })), 'tw-nziaos tw-1i159b5')
  assert.equal(sheet.target, ['.tw-nziaos{font-size:1.25rem;line-height:1.75rem}'])

  sheet.reset()

  assert.is(tw(component({ tw: apply`text-${'xl'}` })), 'tw-nziaos tw-1i159b5')
  assert.equal(sheet.target, ['.tw-nziaos{font-size:1.25rem;line-height:1.75rem}'])

  sheet.reset()
})

test('The "css" property is evaluated', ({ sheet, tw }) => {
  const component = styled({
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaults: {
      size: 'md',
    },
  })

  assert.equal(sheet.target, [])

  assert.is(tw(component({ css: { lineHeight: '1' } })), 'tw-vfrhza tw-1i159b5')
  assert.equal(sheet.target, ['.tw-vfrhza{font-size:1rem;line-height:1}'])
})

test('The "className" property is passed through', ({ sheet, tw }) => {
  const component = styled({
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaults: {
      size: 'md',
    },
  })

  assert.equal(sheet.target, [])

  assert.is(tw(component({ className: 'xyz' })), 'tw-as3rz2 tw-1i159b5 xyz')
  assert.equal(sheet.target, ['.tw-as3rz2{font-size:1rem;line-height:1.5rem}'])

  assert.is(tw(component({ className: 'xyz', class: 'abc' })), 'tw-as3rz2 tw-1i159b5 xyz abc')
  assert.equal(sheet.target, ['.tw-as3rz2{font-size:1rem;line-height:1.5rem}'])
})

test('The "class" property is passed through', ({ sheet, tw }) => {
  const component = styled({
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaults: {
      size: 'md',
    },
  })

  assert.equal(sheet.target, [])

  assert.is(tw(component({ class: 'abc' })), 'tw-as3rz2 tw-1i159b5 abc')
  assert.equal(sheet.target, ['.tw-as3rz2{font-size:1rem;line-height:1.5rem}'])

  assert.is(tw(component({ class: 'abc', className: 'x y z' })), 'tw-as3rz2 tw-1i159b5 x y z abc')
  assert.equal(sheet.target, ['.tw-as3rz2{font-size:1rem;line-height:1.5rem}'])
})

test('Components can reference each other', ({ sheet, tw }) => {
  const a = styled({
    variants: {
      variant: {
        primary: 'text-purple-400',
        secondary: 'text-indigo-400',
      },
    },
    defaults: {
      variant: 'primary',
    },
  })

  const b = styled({
    variants: {
      size: {
        md: {
          [a]: apply`text-base`,
        },
        xl: {
          [`&${a}`]: apply`text-xl`,
        },
      },
    },
    defaults: {
      size: 'md',
    },
  })

  assert.equal(sheet.target, [])

  assert.is(a.className, 'tw-1o9ohh4')
  assert.is(tw(a()), 'tw-ylq0if tw-1o9ohh4')
  assert.equal(sheet.target, [
    '.tw-ylq0if{--tw-text-opacity:1;color:#a78bfa;color:rgba(167,139,250,var(--tw-text-opacity))}',
  ])

  sheet.reset()

  assert.is(b.className, 'tw-1ujx7s2')
  assert.is(tw(b()), 'tw-10c4gem tw-1ujx7s2')
  assert.equal(sheet.target, ['.tw-10c4gem .tw-1o9ohh4{font-size:1rem;line-height:1.5rem}'])

  sheet.reset()

  assert.is(tw(a(), b({ size: 'xl' })), 'tw-ylq0if tw-1o9ohh4 tw-368a9k tw-1ujx7s2')
  assert.equal(sheet.target, [
    '.tw-ylq0if{--tw-text-opacity:1;color:#a78bfa;color:rgba(167,139,250,var(--tw-text-opacity))}',
    '.tw-368a9k.tw-1o9ohh4{font-size:1.25rem;line-height:1.75rem}',
  ])
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

  assert.is(tw(component({ as: 'button' })), 'tw-1xx19ac tw-d1mvb7')
  assert.equal(sheet.target, ['.tw-1xx19ac{color:dodgerblue}'])

  sheet.reset()

  assert.is(tw(component({ as: 'a' })), 'tw-10coynn tw-d1mvb7')
  assert.equal(sheet.target, ['.tw-10coynn{color:tomato}'])
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
  assert.is(tw(component()), 'tw-1h4nwdw tw-e5ryml')
  assert.equal(sheet.target, [])

  sheet.reset()

  // Renders a component with 1 matching variant
  assert.is(tw(component({ size: 'small' })), 'tw-b751nw tw-e5ryml')
  assert.equal(sheet.target, ['.tw-b751nw{font-size:16px}'])

  sheet.reset()

  assert.is(tw(component({ color: 'blue' })), 'tw-v8pw09 tw-e5ryml')
  assert.equal(sheet.target, ['.tw-v8pw09{background-color:dodgerblue;color:white}'])

  sheet.reset()

  // Renders a component with 2 matching variants
  assert.is(tw(component({ size: 'small', level: 1 })), 'tw-1i8lxuk tw-e5ryml')
  assert.equal(sheet.target, ['.tw-1i8lxuk{font-size:16px;padding:0.5em}'])

  sheet.reset()

  // Renders a component with a 2 matching variants and 1 matching compound
  assert.is(tw(component({ size: 'small', color: 'blue' })), 'tw-1md0ysu tw-e5ryml')
  assert.equal(sheet.target, [
    '.tw-1md0ysu{background-color:dodgerblue;color:white;font-size:16px;transform:scale(1.2)}',
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
  assert.is(tw(component()), 'tw-b751nw tw-vemdia')
  assert.equal(sheet.target, ['.tw-b751nw{font-size:16px}'])

  sheet.reset()

  // Renders a component with the default variant explicitly applied
  assert.is(tw(component({ size: 'small' })), 'tw-b751nw tw-vemdia')
  assert.equal(sheet.target, ['.tw-b751nw{font-size:16px}'])

  sheet.reset()

  // Renders a component with the non-default variant explicitly applied
  assert.is(tw(component({ size: 'large' })), 'tw-kfmf2 tw-vemdia')
  assert.equal(sheet.target, ['.tw-kfmf2{font-size:24px}'])

  sheet.reset()

  // Renders a component with the default variant applied and a different variant explicitly applied
  assert.is(tw(component({ level: 1 })), 'tw-1i8lxuk tw-vemdia')
  assert.equal(sheet.target, ['.tw-1i8lxuk{font-size:16px;padding:0.5em}'])

  sheet.reset()

  // Renders a component with the default variant applied, a different variant explicitly applied, and a compound applied
  assert.is(tw(component({ color: 'blue' })), 'tw-1md0ysu tw-vemdia')
  // explicit color:blue -> background-color:dodgerblue;color:white;
  // implicit size:small -> font-size:16px;
  // compound color:blue + size:small -> transform:scale(1.2);
  assert.equal(sheet.target, [
    '.tw-1md0ysu{background-color:dodgerblue;color:white;font-size:16px;transform:scale(1.2)}',
  ])

  sheet.reset()

  // Returns a component selector without the default variant applied when toString is used
  assert.is(component.toString(), '.tw-vemdia')
  assert.equal(sheet.target, [])

  assert.is(component.selector, '.tw-vemdia')
  assert.equal(sheet.target, [])

  assert.is(component.className, 'tw-vemdia')
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
  assert.is(tw(component()), 'tw-1h4nwdw tw-e5ryml')
  assert.equal(sheet.target, [])

  sheet.reset()

  // Renders a component with one variant applied
  assert.is(tw(component({ size: 'small' })), 'tw-b751nw tw-e5ryml')
  assert.equal(sheet.target, ['.tw-b751nw{font-size:16px}'])

  sheet.reset()

  // Renders a component with one conditional variant on one breakpoint applied
  assert.is(tw(component({ size: { md: 'small' } })), 'tw-1g29hvc tw-e5ryml')
  assert.equal(sheet.target, ['@media (min-width:768px){.tw-1g29hvc{font-size:16px}}'])

  sheet.reset()

  // Renders a component with one conditional variant on two breakpoints applied
  assert.is(tw(component({ size: { md: 'small', lg: 'large' } })), 'tw-1ev3j2j tw-e5ryml')
  assert.equal(sheet.target, [
    '@media (min-width:768px){.tw-1ev3j2j{font-size:16px}}',
    '@media (min-width:1024px){.tw-1ev3j2j{font-size:24px}}',
  ])

  sheet.reset()

  assert.is(
    tw(component({ size: { initial: 'large', md: 'small', lg: 'large' } })),
    'tw-1cl98ab tw-e5ryml',
  )
  assert.equal(sheet.target, [
    '.tw-1cl98ab{font-size:24px}',
    '@media (min-width:768px){.tw-1cl98ab{font-size:16px}}',
    '@media (min-width:1024px){.tw-1cl98ab{font-size:24px}}',
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

  assert.is(tw(component()), 'tw-17smojb tw-zcdqn9')
  assert.equal(sheet.target, [
    '.tw-17smojb{font-size:16px}',
    '@media (min-width:768px){.tw-17smojb{font-size:24px}}',
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

  assert.is(tw(button()), 'tw-giv9a tw-10iu5cz')
  assert.equal(sheet.target, [
    '.tw-giv9a{border-radius:9999px;padding-left:0.625rem;padding-right:0.625rem;font-size:0.875rem;line-height:1.25rem;height:1.5rem;background-color:#9ca3af}',
    '.tw-giv9a:hover{background-color:#6b7280}',
  ])

  sheet.reset()

  assert.is(tw(button({ size: 'large', outlined: true })), 'tw-ri8lhj tw-10iu5cz')

  assert.equal(sheet.target, [
    '*{--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,var(--tw-ring-opacity,0.5));--tw-ring-offset-shadow:0 0 transparent;--tw-ring-shadow:0 0 transparent}',
    '.tw-ri8lhj{border-radius:9999px;padding-left:0.625rem;padding-right:0.625rem;font-size:3rem;height:3rem;background-color:transparent;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 transparent);--tw-ring-opacity:1;--tw-ring-color:rgba(156,163,175,var(--tw-ring-opacity))}',
    '.tw-ri8lhj:hover{background-color:#6b7280}',
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

  assert.is(tw(button()), 'tw-1pliije tw-1htxdy9')
  assert.equal(sheet.target, [
    '.tw-1pliije{border-radius:9999px;padding-left:0.625rem;padding-right:0.625rem;font-size:0.875rem;line-height:1.25rem;height:1.5rem;--tw-bg-opacity:1;background-color:#9ca3af;background-color:rgba(156,163,175,var(--tw-bg-opacity))}',
    '.tw-1pliije:hover{--tw-bg-opacity:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
  ])

  sheet.reset()

  assert.is(tw(button({ outlined: true })), 'tw-1w4f9fn tw-1htxdy9')

  assert.equal(sheet.target, [
    '*{--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,var(--tw-ring-opacity,0.5));--tw-ring-offset-shadow:0 0 transparent;--tw-ring-shadow:0 0 transparent}',
    '.tw-1w4f9fn{border-radius:9999px;padding-left:0.625rem;padding-right:0.625rem;font-size:0.875rem;line-height:1.25rem;height:1.5rem;--tw-bg-opacity:1;background-color:transparent;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 transparent);--tw-ring-opacity:1;--tw-ring-color:rgba(156,163,175,var(--tw-ring-opacity))}',
    '.tw-1w4f9fn:hover{--tw-bg-opacity:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
  ])

  sheet.reset()

  assert.is(tw(button({ variant: 'gray', outlined: { sm: true } })), 'tw-r3irf3 tw-1htxdy9')

  assert.equal(sheet.target, [
    '*{--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,var(--tw-ring-opacity,0.5));--tw-ring-offset-shadow:0 0 transparent;--tw-ring-shadow:0 0 transparent}',
    '.tw-r3irf3{border-radius:9999px;padding-left:0.625rem;padding-right:0.625rem;font-size:0.875rem;line-height:1.25rem;height:1.5rem;--tw-bg-opacity:1;background-color:#9ca3af;background-color:rgba(156,163,175,var(--tw-bg-opacity));--tw-ring-opacity:1;--tw-ring-color:rgba(156,163,175,var(--tw-ring-opacity))}',
    '.tw-r3irf3:hover{--tw-bg-opacity:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
    '@media (min-width:640px){.tw-r3irf3{background-color:transparent;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 transparent);--tw-ring-opacity:1;--tw-ring-color:rgba(156,163,175,var(--tw-ring-opacity))}}',
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

  assert.is(tw(extendedButton({ rounded: true, size: 'xl' })), 'tw-dvzbke tw-1htxdy9 tw-hmhdmo')

  assert.equal(sheet.target, [
    '.tw-dvzbke{border-radius:9999px;padding-left:0.625rem;padding-right:0.625rem;--tw-bg-opacity:1;background-color:#9ca3af;background-color:rgba(156,163,175,var(--tw-bg-opacity));font-size:1.25rem;line-height:1.75rem;height:3rem}',
    '.tw-dvzbke:hover{--tw-bg-opacity:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
  ])

  sheet.reset()

  assert.is(tw(extendedButton({ rounded: 'sm' })), 'tw-8wetu6 tw-1htxdy9 tw-hmhdmo')

  assert.equal(sheet.target, [
    '.tw-8wetu6{border-radius:0.125rem;padding-left:0.625rem;padding-right:0.625rem;font-size:0.875rem;line-height:1.25rem;height:1.5rem;--tw-bg-opacity:1;background-color:#9ca3af;background-color:rgba(156,163,175,var(--tw-bg-opacity))}',
    '.tw-8wetu6:hover{--tw-bg-opacity:1;background-color:#6b7280;background-color:rgba(107,114,128,var(--tw-bg-opacity))}',
  ])
})

test.run()
