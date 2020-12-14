import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { makeThemeResolver } from '../internal/theme'

const test = suite('theme')

test('no custom theme', () => {
  const theme = makeThemeResolver()

  assert.is(theme('borderColor', []), '#e5e7eb')
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

  assert.is(theme('borderColor', 'gray'), '#aaa')
})

test('negative is available and no-op', () => {
  const theme = makeThemeResolver({
    extend: {
      spacing: (theme, { negative }) => ({
        ...negative({ xs: '1rem' }),
      }),
    },
  })

  assert.is(theme('spacing', 'xs'), undefined)
  assert.is(theme('spacing', '-xs'), undefined)

  assert.is(theme('spacing', 'px'), '1px')
})

test.run()
