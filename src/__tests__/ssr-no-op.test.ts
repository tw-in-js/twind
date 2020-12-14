import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { tw } from '..'

const test = suite('ssr')

test('uses the no-op injector by default', () => {
  assert.is(tw('group flex text-center md:text-left'), 'group flex text-center md:text-left')
})

test.run()
