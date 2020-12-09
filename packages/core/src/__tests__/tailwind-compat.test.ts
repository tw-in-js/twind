import { tw, setup, strict } from '..'

setup({ mode: strict })

test('all tailwind directives are available', async () => {
  const { processPlugins } = await import('../__fixtures__/process-plugins')

  const { directives } = processPlugins()

  for (const directive of Object.keys(directives)) {
    try {
      expect(tw(directive)).toBeTruthy()
    } catch (error) {
      if (isFontVariantNumeric(directive)) {
        // TODO https://tailwindcss.com/docs/font-variant-numeric
      } else {
        console.warn(directive, directives[directive])
        throw error
      }
    }
  }
})

function isFontVariantNumeric(directive: string): boolean {
  return (
    directive === 'ordinal' ||
    directive.endsWith('-zero') ||
    directive.endsWith('-nums') ||
    directive.endsWith('-fractions')
  )
}
