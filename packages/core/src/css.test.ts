import { assert, test, afterEach } from 'vitest'

import { twind, virtual, css, colorFromTheme, escape } from '.'

const tw = twind(
  {
    theme: {
      screens: {
        sm: '640px',
        md: '768px',
      },
      spacing: {
        lg: '2rem',
        xl: '3rem',
        '0.5': '0.5rem',
      },
      colors: {
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
      },
    },
    rules: [
      ['bg-', colorFromTheme({ section: 'colors', property: 'background-color' })],
      ['text-', colorFromTheme({ section: 'colors', property: 'color' })],
    ],
  },
  virtual(),
)

afterEach(() => tw.clear())

test('create css', () => {
  const style = css({
    backgroundColor: 'hotpink',
    '&:hover': {
      color: 'darkgreen',
    },
  })
  assert.strictEqual(style, 'css#5fqnnd')

  // It is lazy
  assert.deepEqual(tw.target, [])

  assert.strictEqual(tw(style), 'css#5fqnnd')

  assert.deepEqual(tw.target, [
    '.css\\#5fqnnd:hover{color:darkgreen}',
    '.css\\#5fqnnd{background-color:hotpink}',
  ])

  // it is cached
  assert.strictEqual(tw(style), 'css#5fqnnd')

  assert.deepEqual(tw.target, [
    '.css\\#5fqnnd:hover{color:darkgreen}',
    '.css\\#5fqnnd{background-color:hotpink}',
  ])
})

test('can be used with variants', () => {
  const style = css({
    backgroundColor: 'hotpink',
    '&:hover': {
      backgroundColor: 'darkgreen',
    },
  })

  assert.strictEqual(tw(`sm:${style} focus:${style}`), 'focus:css#1u5fwom sm:css#1u5fwom')

  assert.deepEqual(tw.target, [
    '.focus\\:css\\#1u5fwom:focus{background-color:hotpink}',
    '.focus\\:css\\#1u5fwom:hover:focus{background-color:darkgreen}',
    '@media (min-width:640px){.sm\\:css\\#1u5fwom{background-color:hotpink}}',
    '@media (min-width:640px){.sm\\:css\\#1u5fwom:hover{background-color:darkgreen}}',
  ])
})

test('using custom label', () => {
  const style = css({
    label: 'link',
    color: 'hotpink',
    '&:hover': {
      color: 'darkgreen',
    },
  })

  assert.strictEqual(tw(style), 'link#9hfd9w')

  assert.deepEqual(tw.target, [
    '.link\\#9hfd9w{color:hotpink}',
    '.link\\#9hfd9w:hover{color:darkgreen}',
  ])
})

test('nesting in template literal', () => {
  const style = css`
    /* all declarations will be prefixed */
    padding: 2em 1em;
    background: papayawhip;

    /* pseudo selectors work as well */
    &:hover {
      background: palevioletred;
    }

    /* media queries are no problem */
    @media (max-width: 600px) {
      background: tomato;
    }

    @media screen(sm) {
      /* nested rules work as expected */
      &:hover {
        background: yellow;
      }
    }

    & > p {
      /* descendant-selectors work as well, but are more of an escape hatch */
      text-decoration: underline;
    }

    /* Contextual selectors work as well */
    html.test & {
      display: none;
    }
  `

  assert.strictEqual(tw(style), 'css#sc2il9')

  assert.deepEqual(tw.target, [
    '.css\\#sc2il9{padding:2em 1em;background:papayawhip}',
    '.css\\#sc2il9:hover{background:palevioletred}',
    'html.test .css\\#sc2il9{display:none}',
    '.css\\#sc2il9 > p{text-decoration:underline}',
    '@media (max-width: 600px){.css\\#sc2il9{background:tomato}}',
    '@media (min-width:640px){.css\\#sc2il9:hover{background:yellow}}',
  ])
})

test('interpolation values', () => {
  const random = Math.ceil(Math.random() * 4)

  const style = css`
    background: dodgerblue;
    color: white;
    border: ${random}px solid white;
    margin: ${tw.theme('spacing', 'lg')};

    &:focus,
    &:hover {
      color: theme('colors.gray.600');
    }

    & .otherClass {
      padding: theme('spacing[0.5]');
    }

    /* Added to css layer */
    body {
      @apply ${css`
        color: darkgreen;
      `};
    }

    /* Explictily add to base layer */
    @layer base {
      body {
        @apply bg-gray-100 text-gray-700;
      }
    }
  `

  // No assert because of random
  const className = tw(style)

  assert.deepEqual(tw.target, [
    'body{--tw-bg-opacity:1;background-color:rgba(243,244,246,var(--tw-bg-opacity));--tw-text-opacity:1;color:rgba(55,65,81,var(--tw-text-opacity))}',
    `.${escape(
      className,
    )}{background:dodgerblue;color:white;border:${random}px solid white;margin:2rem}`,
    `.${escape(className)} .otherClass{padding:0.5rem}`,
    `.${escape(className)}:focus,.${escape(className)}:hover{color:#4b5563}`,
    'body{color:darkgreen}',
  ])
})
