import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { promisify } from 'util'

import type { AsyncVirtualSheet } from '.'
import { asyncVirtualSheet, getStyleTagProperties } from '.'

const delay = promisify(setImmediate)

const test = suite<{
  sheet: AsyncVirtualSheet
}>('asyncVirtualSheet')

test.before((context) => {
  context.sheet = asyncVirtualSheet()
})

test('concurrent sheets', async ({ sheet }) => {
  const [first, second] = await Promise.all([
    Promise.resolve().then(async () => {
      sheet.reset()

      sheet.insert('html{margin:0}', 0)
      assert.equal(sheet.target, ['html{margin:0}'])

      await delay()

      sheet.insert('body{margin:0}', 0)
      assert.equal(sheet.target, ['body{margin:0}', 'html{margin:0}'])

      return getStyleTagProperties(sheet)
    }),

    Promise.resolve().then(async () => {
      sheet.reset()

      sheet.insert('m0{margin:0}', 0)
      assert.equal(sheet.target, ['m0{margin:0}'])

      await delay()

      sheet.insert('p1{padding:1}', 1)
      assert.equal(sheet.target, ['m0{margin:0}', 'p1{padding:1}'])

      return getStyleTagProperties(sheet)
    }),
  ])

  assert.equal(first, {
    id: '__twind',
    textContent: 'body{margin:0}html{margin:0}',
  })
  assert.equal(second, {
    id: '__twind',
    textContent: 'm0{margin:0}p1{padding:1}',
  })
})

test.run()
