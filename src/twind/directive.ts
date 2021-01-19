import type { InlineDirective, TW } from '../types'

import { tw as defaultTW } from './default'

export const directive = <T extends InlineDirective>(
  directive: T,
  data: unknown,
  tw: TW | null | undefined | void,
): T => {
  function toString(this: InlineDirective): string {
    return (tw || defaultTW)(this)
  }

  return Object.defineProperties(directive, {
    valueOf: {
      value: toString,
    },
    toString: {
      value: toString,
    },
    // Allow twind to generate a unique id for this directive
    // twind uses JSON.stringify which returns undefined for functions like this directive
    // providing a toJSON function allows to include this directive in the id generation
    toJSON: {
      value: () => data,
    },
  })
}
