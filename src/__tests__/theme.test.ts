import { makeThemeResolver } from '../internal/theme'

test('no custom theme', () => {
  const theme = makeThemeResolver()

  expect(theme('borderColor', [])).toBe('#e5e7eb')
})

test('default color', () => {
  const theme = makeThemeResolver({
    extend: {
      colors: {
        gray: {
          DEFAULT: '#aaa',
        },
      },
    },
  })

  expect(theme('borderColor', 'gray')).toBe('#aaa')
})

test('negative is available and no-op', () => {
  const theme = makeThemeResolver({
    extend: {
      spacing: (theme, { negative }) => ({
        ...negative({ xs: '1rem' }),
      }),
    },
  })

  expect(theme('spacing', 'xs')).toBeUndefined()
  expect(theme('spacing', '-xs')).toBeUndefined()

  expect(theme('spacing', 'px')).toBe('1px')
})
