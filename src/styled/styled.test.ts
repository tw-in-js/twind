import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance } from '../types'
import type { VirtualSheet } from '../sheets/index'
import type { Styled, StyledComponent, WithTags } from './index'

import { create, strict } from '../index'
import { virtualSheet } from '../sheets/index'
import { css } from '../css/index'
import { styled } from './index'

interface Result {
  type: unknown
  props: Record<string, unknown>
  children: unknown[]
}

const test = suite<{
  sheet: VirtualSheet
  tw: Instance['tw']
  styled: WithTags<Styled<Result>>
}>('styled')

test.before.each((context) => {
  context.sheet = virtualSheet()
  const instance = create({
    sheet: context.sheet,
    mode: strict,
    preflight: false,
    hash: false,
    prefix: false,
  })
  context.tw = instance.tw
  context.styled = styled.bind({
    createElement: (type, props, ...children) => ({ type, props, children }),
    tw: instance.tw,
  })
})

test('styled with template literal', ({ styled, sheet }) => {
  const H1 = styled('h1')`text-5xl font-bold`

  assert.is(H1.displayName, 'Styled(h1)')
  assert.is(H1.toString(), '.tw-g83ynq')

  // Nothing injected yet
  assert.equal(sheet.target, [])

  assert.equal(H1({}), {
    type: 'h1',
    props: { className: 'tw-g83ynq text-5xl font-bold' },
    children: [],
  })
  assert.equal(sheet.target, [
    '.text-5xl{font-size:3rem;line-height:1}',
    '.font-bold{font-weight:700}',
  ])
})

test('tag with template literal', ({ styled, sheet }) => {
  const H1 = styled.h1`text-5xl font-bold`

  assert.is(H1.displayName, 'Styled(h1)')
  assert.is(H1.toString(), '.tw-g83ynq')

  // Nothing injected yet
  assert.equal(sheet.target, [])

  assert.equal(H1({}), {
    type: 'h1',
    props: { className: 'tw-g83ynq text-5xl font-bold' },
    children: [],
  })
  assert.equal(sheet.target, [
    '.text-5xl{font-size:3rem;line-height:1}',
    '.font-bold{font-weight:700}',
  ])
})

test('styled with css', ({ styled, sheet }) => {
  const H2 = styled('h2')(css({ fontSize: '2rem' }))

  assert.is(H2.displayName, 'Styled(h2)')
  assert.is(H2.toString(), '.tw-14x761z')

  // Nothing injected yet
  assert.equal(sheet.target, [])

  assert.equal(H2({}), {
    type: 'h2',
    props: { className: 'tw-14x761z tw-1dgs2lc' },
    children: [],
  })
  assert.equal(sheet.target, ['.tw-1dgs2lc{font-size:2rem}'])
})

test('tag with css', ({ styled, sheet }) => {
  const H2 = styled.h2([css({ fontSize: '2rem' })])

  assert.is(H2.displayName, 'Styled(h2)')
  assert.is(H2.toString(), '.tw-ahl28d')

  // Nothing injected yet
  assert.equal(sheet.target, [])

  assert.equal(H2({}), {
    type: 'h2',
    props: { className: 'tw-ahl28d tw-1dgs2lc' },
    children: [],
  })
  assert.equal(sheet.target, ['.tw-1dgs2lc{font-size:2rem}'])
})

test('styled with props', ({ styled, sheet }) => {
  const Btn = styled('button')((props: { primary?: boolean }) => [
    props.primary ? 'text(purple-600)' : 'text(indigo-500)',
  ])

  assert.is(Btn.displayName, 'Styled(button)')
  assert.is(Btn.toString(), '.tw-u1t3pg')

  // Nothing injected yet
  assert.equal(sheet.target, [])

  assert.equal(Btn({}), {
    type: 'button',
    props: { className: 'tw-u1t3pg text-indigo-500' },
    children: [],
  })
  assert.equal(sheet.target, [
    '.text-indigo-500{--tw-text-opacity:1;color:#6366f1;color:rgba(99,102,241,var(--tw-text-opacity))}',
  ])

  assert.equal(Btn({ primary: true }), {
    type: 'button',
    props: { className: 'tw-u1t3pg text-purple-600' },
    children: [],
  })
  assert.equal(sheet.target, [
    '.text-indigo-500{--tw-text-opacity:1;color:#6366f1;color:rgba(99,102,241,var(--tw-text-opacity))}',
    '.text-purple-600{--tw-text-opacity:1;color:#7c3aed;color:rgba(124,58,237,var(--tw-text-opacity))}',
  ])
})

test('tag with props', ({ styled, sheet }) => {
  const Button = styled.button`
    ${(props: { primary?: boolean }) =>
      props.primary ? 'text-purple-600' : 'text-indigo-600'} rounded
  `

  assert.is(Button.displayName, 'Styled(button)')
  assert.is(Button.toString(), '.tw-19zjimz')

  // Nothing injected yet
  assert.equal(sheet.target, [])

  assert.equal(Button({}), {
    type: 'button',
    props: { className: 'tw-19zjimz text-indigo-600 rounded' },
    children: [],
  })
  assert.equal(sheet.target, [
    '.text-indigo-600{--tw-text-opacity:1;color:#4f46e5;color:rgba(79,70,229,var(--tw-text-opacity))}',
    '.rounded{border-radius:0.25rem}',
  ])

  assert.equal(Button({ primary: true }), {
    type: 'button',
    props: { className: 'tw-19zjimz text-purple-600 rounded' },
    children: [],
  })
  assert.equal(sheet.target, [
    '.text-indigo-600{--tw-text-opacity:1;color:#6366f1;color:rgba(99,102,241,var(--tw-text-opacity))}',
    '.text-purple-600{--tw-text-opacity:1;color:#7c3aed;color:rgba(124,58,237,var(--tw-text-opacity))}',
    '.rounded{border-radius:0.25rem}',
  ])
})

test('tag with inline prop', ({ styled, sheet }) => {
  const Btn = styled.button`
    text-${(props: { primary?: boolean }) => (props.primary ? 'purple-600' : 'indigo-500')}
    sm:${css({
      border: '1px dashed darkgreen',
    })}
  `

  assert.is(Btn.displayName, 'Styled(button)')
  assert.is(Btn.toString(), '.tw-4gg6zc')

  // Nothing injected yet
  assert.equal(sheet.target, [])

  assert.equal(Btn({}), {
    type: 'button',
    props: { className: 'tw-4gg6zc text-indigo-500 sm:tw-rzyaiu' },
    children: [],
  })
  assert.equal(sheet.target, [
    '.text-indigo-500{--tw-text-opacity:1;color:#6366f1;color:rgba(99,102,241,var(--tw-text-opacity))}',
    '@media (min-width: 640px){.sm\\:tw-rzyaiu{border:1px dashed darkgreen}}',
  ])

  assert.equal(Btn({ primary: true }), {
    type: 'button',
    props: { className: 'tw-4gg6zc text-purple-600 sm:tw-rzyaiu' },
    children: [],
  })
  assert.equal(sheet.target, [
    '.text-indigo-500{--tw-text-opacity:1;color:#6366f1;color:rgba(99,102,241,var(--tw-text-opacity))}',
    '.text-purple-600{--tw-text-opacity:1;color:#7c3aed;color:rgba(124,58,237,var(--tw-text-opacity))}',
    '@media (min-width: 640px){.sm\\:tw-rzyaiu{border:1px dashed darkgreen}}',
  ])
})

test('styled with props using tw', ({ styled, sheet }) => {
  const Btn = styled('button')(
    (props: { primary?: boolean }, { tw }) =>
      tw`text-${props.primary ? 'purple-600' : 'indigo-500'}`,
  )

  assert.is(Btn.displayName, 'Styled(button)')
  assert.is(Btn.toString(), '.tw-qo692d')

  // Nothing injected yet
  assert.equal(sheet.target, [])

  assert.equal(Btn({}), {
    type: 'button',
    props: { className: 'tw-qo692d text-indigo-500' },
    children: [],
  })
  assert.equal(sheet.target, [
    '.text-indigo-500{--tw-text-opacity:1;color:#6366f1;color:rgba(99,102,241,var(--tw-text-opacity))}',
  ])

  assert.equal(Btn({ primary: true }), {
    type: 'button',
    props: { className: 'tw-qo692d text-purple-600' },
    children: [],
  })
  assert.equal(sheet.target, [
    '.text-indigo-500{--tw-text-opacity:1;color:#6366f1;color:rgba(99,102,241,var(--tw-text-opacity))}',
    '.text-purple-600{--tw-text-opacity:1;color:#7c3aed;color:rgba(124,58,237,var(--tw-text-opacity))}',
  ])
})

test('targeting another component', ({ styled, sheet }) => {
  const Child = styled('div')(() => css({ color: 'red' }))
  const Parent = styled('div')(() =>
    css({
      [`& ${Child}`]: {
        color: 'green',
      },
    }),
  )

  assert.is(Child.displayName, 'Styled(div)')
  assert.is(Child.toString(), '.tw-jsnw01')

  assert.is(Parent.displayName, 'Styled(div)')
  assert.is(Parent.toString(), '.tw-y53d82')

  // Nothing injected yet
  assert.equal(sheet.target, [])

  assert.equal(Child({}), {
    type: 'div',
    props: { className: 'tw-jsnw01 tw-18kwa36' },
    children: [],
  })
  assert.equal(sheet.target, ['.tw-18kwa36{color:red}'])

  assert.equal(Parent({ children: Child({}) }), {
    type: 'div',
    props: {
      className: 'tw-y53d82 tw-lcg02s',
      children: {
        type: 'div',
        props: {
          className: 'tw-jsnw01 tw-18kwa36',
        },
        children: [],
      },
    },
    children: [],
  })
  assert.equal(sheet.target, ['.tw-18kwa36{color:red}', '.tw-lcg02s .tw-jsnw01{color:green}'])
})

test('using "as" prop', ({ styled, sheet }) => {
  const Button = styled<{ href?: string }>('button')({
    sm: 'text-sm',
    md: 'text-lg',
  })

  // Nothing injected yet
  assert.equal(sheet.target, [])

  assert.equal(Button({}), {
    type: 'button',
    props: { className: 'tw-1rtu6k5 sm:text-sm md:text-lg' },
    children: [],
  })

  assert.equal(Button({ as: 'a', href: 'https://github.com/tw-in-js/twind' }), {
    type: 'a',
    props: {
      href: 'https://github.com/tw-in-js/twind',
      className: 'tw-1rtu6k5 sm:text-sm md:text-lg',
    },
    children: [],
  })
  assert.equal(sheet.target, [
    '@media (min-width: 640px){.sm\\:text-sm{font-size:0.875rem;line-height:1.25rem}}',
    '@media (min-width: 768px){.md\\:text-lg{font-size:1.125rem;line-height:1.75rem}}',
  ])
})

test('using "as" prop on Components', ({ styled, sheet }) => {
  const Span = styled.span('text-sm')

  const Button = styled(Span)<{ href?: string }>('rounded-md')

  // Nothing injected yet
  assert.equal(sheet.target, [])

  assert.equal(Span({}), {
    type: 'span',
    props: { className: 'tw-1x55nc9 text-sm' },
    children: [],
  })

  // The as prop is passed through
  assert.equal(Button({ as: 'button', href: 'https://github.com/tw-in-js/twind' }), {
    type: Span,
    props: {
      as: 'button',
      href: 'https://github.com/tw-in-js/twind',
      className: 'tw-7eiqsw rounded-md',
    },
    children: [],
  })
  assert.equal(sheet.target, [
    '.text-sm{font-size:0.875rem;line-height:1.25rem}',
    '.rounded-md{border-radius:0.375rem}',
  ])
})

test('merge "className" prop', ({ styled, sheet, tw }) => {
  const Span = styled.span`text-sm`

  // Nothing injected yet
  assert.equal(sheet.target, [])

  assert.equal(Span({ className: tw`rounded-md` }), {
    type: 'span',
    props: { className: 'rounded-md tw-6mvkxr text-sm' },
    children: [],
  })

  assert.equal(sheet.target, [
    '.text-sm{font-size:0.875rem;line-height:1.25rem}',
    '.rounded-md{border-radius:0.375rem}',
  ])
})

test('merge "class" prop', ({ styled, sheet }) => {
  const Span = styled.span`text-sm`

  // Nothing injected yet
  assert.equal(sheet.target, [])

  assert.equal(Span({ class: 'hero' }), {
    type: 'span',
    props: { className: 'hero tw-6mvkxr text-sm' },
    children: [],
  })

  assert.equal(sheet.target, ['.text-sm{font-size:0.875rem;line-height:1.25rem}'])
})

test('attrs', ({ styled, sheet }) => {
  const Span = styled('span', { shouldForwardProp: () => true }).attrs({ a: 23 })<{
    b: number
  }>`text-sm`.attrs((props) => ({
    x: props.a * props.b,
  }))

  const b = Math.random()

  assert.equal(Span({ class: 'hero', b }), {
    type: 'span',
    props: { className: 'hero tw-qyp3x2 text-sm', a: 23, b, x: 23 * b },
    children: [],
  })

  assert.equal(sheet.target, ['.text-sm{font-size:0.875rem;line-height:1.25rem}'])
})

test('using attrs to change rendered tag', ({ styled, sheet }) => {
  const Span = styled.span`text-sm`
  const Div = Span.attrs({ as: 'div' })

  // Still renders a span
  assert.equal(Span({}), {
    type: 'span',
    props: { className: 'tw-6mvkxr text-sm' },
    children: [],
  })

  assert.equal(Div({}), {
    type: 'div',
    props: { className: 'tw-u4kn28 text-sm' },
    children: [],
  })

  assert.equal(sheet.target, ['.text-sm{font-size:0.875rem;line-height:1.25rem}'])
})

test('attrs merges className', ({ styled, sheet }) => {
  const Div = styled.div.attrs({ className: 'hero' })`text-sm`.attrs(() => ({ className: 'large' }))

  assert.equal(Div({ className: 'primary' }), {
    type: 'div',
    props: { className: 'primary hero large tw-1m43mr3 text-sm' },
    children: [],
  })

  assert.equal(sheet.target, ['.text-sm{font-size:0.875rem;line-height:1.25rem}'])
})

test.run()
