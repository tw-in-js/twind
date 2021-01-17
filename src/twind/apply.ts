import type { TWApply, Context, TW } from '../types'
import { parse } from './parse'

export const withApply = (tw: TW): TW => {
  function toString(this: TWApply): string {
    return tw(this)
  }

  tw.apply = (...tokens: unknown[]): TWApply => {
    return Object.defineProperties(({ css }: Context) => css(parse(tokens)), {
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
        value: () => tokens,
      },
    })
  }

  return tw
}
