import { assert, test } from 'vitest'

import { shortcut } from '.'

test('comments', () => {
  assert.strictEqual(
    shortcut`
      underline
      /* multi
        line
        comment
      */
      hover:focus:!(
        sm:(italic why)
        lg:-(px)
        -mx-1
      )
      ${false} ${undefined} ${null} ${''}
      // Position
      !top-1 !-bottom-${2} mx-${0}
      text-(xl black)
    `,
    '~(underline,hover:focus:sm:!italic,hover:focus:sm:!why,hover:focus:lg:!-px,hover:focus:!-mx-1,!top-1,!-bottom-2,mx-0,text-xl,text-black)',
  )
})
