import type { Class } from './types'
import { interpolate } from './internal/interpolate'
import { tw as tw$ } from './runtime'

/**
 * Combines {@link tw} and {@link cx}.
 *
 * Using the default `tw` instance:
 *
 * ```js
 * import { tw } from 'twind'
 * tx`underline ${falsy && 'italic'}`
 * tx('underline', falsy && 'italic')
 * tx({'underline': true, 'italic': false})
 *
 * // using a custom twind instance
 * import { tw } from './custom/twind'
 * import { tw } from './custom/twind'
 * tx.bind(tw)
 * ```
 *
 * Using a custom `tw` instance:
 *
 * ```js
 * import { tx as tx$ } from 'twind'
 * import { tw } from './custom/twind'
 *
 * export const tx = tx$.bind(tw)
 *
 * tx`underline ${falsy && 'italic'}`
 * tx('underline', falsy && 'italic')
 * tx({'underline': true, 'italic': false})
 * ```
 *
 * @param this {@link Twind} instance to use (default: {@link tw})
 * @param strings
 * @param interpolations
 * @returns the class name
 */
export function tx(
  this: ((tokens: string) => string) | undefined | void,
  strings: TemplateStringsArray | Class,
  ...interpolations: Class[]
): string {
  const tw = typeof this == 'function' ? this : tw$
  return tw(interpolate(strings, interpolations))
}
