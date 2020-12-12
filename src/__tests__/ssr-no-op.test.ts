/*
 * @env node
 */
import { tw } from '..'

test('uses the no-op injector by default', () => {
  expect(tw('group flex text-center md:text-left')).toBe('group flex text-center md:text-left')
})
