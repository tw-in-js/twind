import { tw } from '..'

test('uses the no-op injector by default', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (global as any).window

  expect(tw('group flex text-center md:text-left')).toBe('group flex text-center md:text-left')
})
