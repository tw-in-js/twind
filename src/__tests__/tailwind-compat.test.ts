import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { tw, setup, strict } from '..'

// Tailwind only supports Node.JS >=12.13.0
// use feature detection
if (Object.entries && [].flatMap) {
  const test = suite('tailwind compat')

  setup({ mode: strict })

  test('all tailwind directives are available', async () => {
    const { processPlugins } = await import('../__fixtures__/process-plugins')

    const { directives } = processPlugins()

    for (const directive of Object.keys(directives)) {
      try {
        assert.ok(tw(directive))
      } catch (error) {
        console.warn(directive, directives[directive])
        throw error
      }
    }
  })

  test.run()
}
