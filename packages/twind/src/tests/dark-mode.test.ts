import { assert, test } from 'vitest'

import { twind, virtual } from '..'

test('should be possible to use the darkMode "class" mode', () => {
  const tw = twind(
    {
      darkMode: 'class',
      rules: [['font-', 'fontWeight']],
    },
    virtual(),
  )

  assert.strictEqual(tw('dark:font-700'), 'dark:font-700')

  assert.deepEqual(tw.target, ['.dark .dark\\:font-700{font-weight:700}'])
})

test('should be possible to change the class name', () => {
  const tw = twind(
    {
      darkMode: ['class', '.test-dark'],
      rules: [['font-', 'fontWeight']],
    },
    virtual(),
  )

  assert.strictEqual(tw('dark:font-700'), 'dark:font-700')

  assert.deepEqual(tw.target, ['.test-dark .dark\\:font-700{font-weight:700}'])
})

test('should be possible to use any selector', () => {
  const tw = twind(
    {
      darkMode: '[theme=dark] &',
      rules: [['font-', 'fontWeight']],
    },
    virtual(),
  )

  assert.strictEqual(tw('dark:font-700'), 'dark:font-700')

  assert.deepEqual(tw.target, ['[theme=dark] .dark\\:font-700{font-weight:700}'])
})

test('should be possible to use the darkMode "media" mode', () => {
  const tw = twind(
    {
      darkMode: 'media',
      rules: [['font-', 'fontWeight']],
    },
    virtual(),
  )

  assert.strictEqual(tw('dark:font-700'), 'dark:font-700')

  assert.deepEqual(tw.target, [
    '@media (prefers-color-scheme:dark){.dark\\:font-700{font-weight:700}}',
  ])
})

test('should default to the `media` mode when no mode is provided', () => {
  const tw = twind(
    {
      rules: [['font-', 'fontWeight']],
    },
    virtual(),
  )

  assert.strictEqual(tw('dark:font-700'), 'dark:font-700')

  assert.deepEqual(tw.target, [
    '@media (prefers-color-scheme:dark){.dark\\:font-700{font-weight:700}}',
  ])
})

test('should default to the `media` mode when mode is set to `false`', () => {
  const tw = twind(
    {
      darkMode: false,
      rules: [['font-', 'fontWeight']],
    },
    virtual(),
  )

  assert.strictEqual(tw('dark:font-700'), 'dark:font-700')

  assert.deepEqual(tw.target, [
    '@media (prefers-color-scheme:dark){.dark\\:font-700{font-weight:700}}',
  ])
})
