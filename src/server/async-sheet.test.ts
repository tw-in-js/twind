import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { promisify } from 'util'

import type { AsyncVirtualSheet } from '.'
import { asyncVirtualSheet, getStyleTagProperties } from '.'
import { create } from '..'

const delay = promisify(setImmediate)

// We are using async_hooks and they are currently not working as expected on Node.JS v10
if (Number(process.versions.node.split('.')[0]) >= 12) {
  const test = suite<{
    sheet: AsyncVirtualSheet
  }>('asyncVirtualSheet')

  test.before((context) => {
    context.sheet = asyncVirtualSheet()
  })

  test('concurrent sheets', async ({ sheet }) => {
    const [first, second] = await Promise.all([
      delay().then(async () => {
        sheet.reset()

        sheet.insert('html{margin:0}', 0)
        assert.equal(sheet.target, ['html{margin:0}'])

        await delay()

        sheet.insert('body{margin:0}', 0)
        assert.equal(sheet.target, ['body{margin:0}', 'html{margin:0}'])

        return getStyleTagProperties(sheet)
      }),

      delay().then(async () => {
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

  test('includes preflight', async ({ sheet }) => {
    const { tw } = create({ sheet })

    const [first, second] = await Promise.all([
      Promise.resolve().then(async () => {
        sheet.reset()

        assert.is(tw`text-center font-bold`, 'text-center font-bold')

        await delay()

        assert.is(tw`text-xl`, 'text-xl')

        return getStyleTagProperties(sheet)
      }),

      Promise.resolve().then(async () => {
        sheet.reset()

        assert.is(tw`italic`, 'italic')

        await delay()

        assert.is(tw`underline`, 'underline')

        return getStyleTagProperties(sheet)
      }),
    ])

    assert.match(first.textContent, 'ol,ul{list-style:none}')
    assert.match(first.textContent, '.text-center{text-align:center}.font-bold{font-weight:700}')
    assert.not.match(
      first.textContent,
      '.italic{font-style:italic}.underline{-webkit-text-decoration:underline;text-decoration:underline}',
    )

    assert.match(second.textContent, 'ol,ul{list-style:none}')
    assert.match(
      second.textContent,
      '.italic{font-style:italic}.underline{-webkit-text-decoration:underline;text-decoration:underline}',
    )
    assert.not.match(
      second.textContent,
      '.text-center{text-align:center}.font-bold{font-weight:700}',
    )
  })

  test.run()
}
