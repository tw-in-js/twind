import { tw, setup, strict } from '..'

setup({ mode: strict })

test('all tailwind directives are available', async () => {
  const { processPlugins } = await import('../__fixtures__/process-plugins')

  const { directives } = processPlugins()

  for (const directive of Object.keys(directives)) {
    try {
      expect(tw(directive)).toBeTruthy()
    } catch (error) {
      console.warn(directive, directives[directive])
      throw error
    }
  }
})
