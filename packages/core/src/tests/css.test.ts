import { assert, test, afterEach } from 'vitest'

import { twind, virtual, css, cx, shortcut, apply, colorFromTheme, escape } from '..'

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
  assert.strictEqual(style, 'css#a22z42')

  // It is lazy
  assert.deepEqual(tw.target, [])

  assert.strictEqual(tw(style), 'css#a22z42')

  assert.deepEqual(tw.target, [
    '.css\\#a22z42{background-color:hotpink}',
    '.css\\#a22z42:hover{color:darkgreen}',
  ])

  // it is cached
  assert.strictEqual(tw(style), 'css#a22z42')

  assert.deepEqual(tw.target, [
    '.css\\#a22z42{background-color:hotpink}',
    '.css\\#a22z42:hover{color:darkgreen}',
  ])
})

test('can be used with variants', () => {
  const style = css({
    backgroundColor: 'hotpink',
    '&:hover': {
      backgroundColor: 'darkgreen',
    },
  })

  assert.strictEqual(tw(`sm:${style} focus:${style}`), 'css#hxclon')

  assert.deepEqual(tw.target, [
    '@media (min-width:640px){.css\\#hxclon{background-color:hotpink}}',
    '@media (min-width:640px){.css\\#hxclon:hover{background-color:darkgreen}}',
    '.css\\#hxclon:focus{background-color:hotpink}',
    '.css\\#hxclon:focus:hover{background-color:darkgreen}',
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

  assert.strictEqual(tw(style), 'link#1xpxeti')

  assert.deepEqual(tw.target, [
    '.link\\#1xpxeti{color:hotpink}',
    '.link\\#1xpxeti:hover{color:darkgreen}',
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
      text-decoration-line: underline;
    }

    /* Contextual selectors work as well */
    html.test & {
      display: none;
    }
  `

  assert.strictEqual(tw(style), 'css#1h873n0')

  assert.deepEqual(tw.target, [
    '.css\\#1h873n0{padding:2em 1em;background:papayawhip}',
    '.css\\#1h873n0:hover{background:palevioletred}',
    '@media (max-width: 600px){.css\\#1h873n0{background:tomato}}',
    '@media (min-width:640px){.css\\#1h873n0:hover{background:yellow}}',
    '.css\\#1h873n0 > p{text-decoration-line:underline}',
    'html.test .css\\#1h873n0{display:none}',
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
        @apply text-gray-700 bg-gray-100;
      }
    }
  `

  // No assert because of random
  const className = tw(style)

  assert.deepEqual(tw.target, [
    'body{--tw-text-opacity:1;color:rgba(55,65,81,var(--tw-text-opacity));--tw-bg-opacity:1;background-color:rgba(243,244,246,var(--tw-bg-opacity))}',
    `.${escape(
      className,
    )}{background:dodgerblue;color:white;border:${random}px solid white;margin:2rem}`,
    `.${escape(className)}:focus,.${escape(className)}:hover{color:#4b5563}`,
    `.${escape(className)} .otherClass{padding:0.5rem}`,
    'body{color:darkgreen}',
  ])
})

test('with shortcut', () => {
  const className = tw(cx('bg-gray-900', shortcut(css({ lineHeight: '1' }), 'text-gray-300')))

  assert.strictEqual(className, '~(css#185oa3u,text-gray-300) bg-gray-900')

  assert.deepEqual(tw.target, [
    '.\\~\\(css\\#185oa3u\\,text-gray-300\\){--tw-text-opacity:1;color:rgba(209,213,219,var(--tw-text-opacity));line-height:1}',
    '.bg-gray-900{--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity))}',
  ])
})

test('with apply', () => {
  const className = tw(cx('bg-gray-900', apply(css({ lineHeight: '1' }), 'text-gray-300')))

  assert.strictEqual(className, '@(css#185oa3u,text-gray-300) bg-gray-900')

  assert.deepEqual(tw.target, [
    '.\\@\\(css\\#185oa3u\\,text-gray-300\\){line-height:1;--tw-text-opacity:1;color:rgba(209,213,219,var(--tw-text-opacity))}',
    '.bg-gray-900{--tw-bg-opacity:1;background-color:rgba(17,24,39,var(--tw-bg-opacity))}',
  ])
})

test('css within apply and nested selectors', () => {
  const nestedListItems = css`
    & > li::before {
      @apply text-gray-500;
    }
  `
  const prose = css`
    & ul {
      @apply ${nestedListItems};
    }
  `

  assert.strictEqual(tw(prose), 'css#1e8vcf')
  assert.deepEqual(tw.target, [
    '.css\\#1e8vcf ul > li::before{--tw-text-opacity:1;color:rgba(107,114,128,var(--tw-text-opacity))}',
  ])
})
