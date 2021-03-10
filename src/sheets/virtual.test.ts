import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { getStyleTag, virtualSheet } from 'twind/sheets'

const test = suite('virtualSheet')

test('insert', () => {
  const sheet = virtualSheet()

  sheet.insert('html{margin:0}', 0)
  assert.equal(sheet.target, ['html{margin:0}'])

  sheet.insert('body{margin:0}', 0)
  assert.equal(sheet.target, ['body{margin:0}', 'html{margin:0}'])

  sheet.insert('*{margin:0}', 1)
  assert.equal(sheet.target, ['body{margin:0}', '*{margin:0}', 'html{margin:0}'])
})

test('reset', () => {
  const sheet = virtualSheet()

  sheet.insert('html{margin:0}', 0)
  assert.equal(sheet.target, ['html{margin:0}'])
  const snapshot = sheet.reset()
  assert.equal(sheet.target, [])

  sheet.insert('body{margin:0}', 0)
  assert.equal(sheet.target, ['body{margin:0}'])

  sheet.reset(snapshot)
  assert.equal(sheet.target, ['html{margin:0}'])
})

test('getStyleTag', () => {
  const sheet = virtualSheet()

  sheet.insert('html{margin:0}', 0)
  sheet.insert('body{margin:0}', 1)

  assert.is(getStyleTag(sheet), '<style id="__twind">html{margin:0}body{margin:0}</style>')

  assert.is(
    getStyleTag(sheet, { nonce: '123456' }),
    '<style nonce="123456" id="__twind">html{margin:0}body{margin:0}</style>',
  )
})
test.run()
