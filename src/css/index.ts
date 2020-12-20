import type { TW, CSSRules, CSSAtKeyframes, InlineDirective, Context } from '../types'

import { tw as defaultTW, hash } from '../index'

export interface LazyInjected {
  valueOf: () => string
  toString: () => string
}

export interface CSSDirective extends LazyInjected {
  (context: { tw: TW }): CSSRules
}

const create = <P, R>(
  factory: (parameter: P, key: string) => InlineDirective,
): ((parameter: P) => R) => {
  type Instance = (parameter: P) => R

  // Cache css directive by their JSON stringified value
  const instances = new WeakMap<TW, Instance>()

  const build = (tw: TW): Instance => {
    // Allows to invoke toString() on a directive:
    // document.body.className = css({ color: 'white' })
    function toString(this: InlineDirective): string {
      return tw(this)
    }

    const cache = new Map<string, R>()

    const evaluateFunctions = (key: string, value: unknown): unknown =>
      typeof value === 'function' ? tw(value as InlineDirective) : value

    return (rules: P): R => {
      const key = JSON.stringify(rules, evaluateFunctions)

      let directive = cache.get(key)

      if (!directive) {
        directive = Object.defineProperties(factory(rules, key), {
          valueOf: {
            value: toString,
          },
          toString: {
            value: toString,
          },
          // Allow twind to generate a unique id for this inline directive
          // twind uses JSON.stringify which returns undefined for functions like this directive
          // providing a toJSON function allows to include this directive in the id generation
          toJSON: {
            value: () => rules,
          },
        }) as R

        cache.set(key, directive)

        // Ensure the cache does not grow unlimited
        if (cache.size > 10000) {
          cache.delete(cache.keys().next().value)
        }
      }

      return directive
    }
  }

  return function (this: TW | null | undefined | void, rules: P): R {
    const tw = this || defaultTW

    let instance = instances.get(tw)

    if (!instance) {
      instance = build(tw)
      instances.set(tw, instance)
    }

    return instance(rules)
  }
}

export const css = create<CSSRules, CSSDirective>((rules) => {
  const plugin: InlineDirective = () => rules

  return ({ tw }) => tw(plugin)
})

export interface CSSKeyframes extends LazyInjected {
  (context: Context): string
}

/**
 *
 * ```js
 * const bounce = keyframes({
 *   'from, 20%, 53%, 80%, to': {
 *     transform: 'translate3d(0,0,0)',
 *   },
 *   '40%, 43%': {
 *     transform: 'translate3d(0, -30px, 0)',
 *   },
 *   '70%': {
 *     transform: 'translate3d(0, -15px, 0)',
 *   },
 *   '90%': {
 *     transform: 'translate3d(0, -4px, 0)',
 *   }
 * })
 *
 * css({
 *   animation: `${bounce} 1s ease infinite`,
 * })
 * ```
 * @param waypoints
 */
export const keyframes = create<CSSAtKeyframes, CSSKeyframes>((waypoints, key) => {
  const id = hash(key)

  // tw caches inline plugins by the identity
  const plugin: InlineDirective = () => ({
    [`@keyframes ${id}`]: waypoints,
  })

  return ({ tw }) => {
    // Inject the keyframes
    tw(plugin)
    // but return the keyframe id
    return id
  }
})

/**
 *
 * ```js
 * const bounce = animation('1s ease infinite', {
 *   'from, 20%, 53%, 80%, to': {
 *     transform: 'translate3d(0,0,0)',
 *   },
 *   '40%, 43%': {
 *     transform: 'translate3d(0, -30px, 0)',
 *   },
 *   '70%': {
 *     transform: 'translate3d(0, -15px, 0)',
 *   },
 *   '90%': {
 *     transform: 'translate3d(0, -4px, 0)',
 *   }
 * })
 * ```
 */
export function animation(
  this: TW | null | undefined | void,
  value: string | CSSRules | ((context: Context) => string),
  waypoints: CSSAtKeyframes | CSSKeyframes,
): CSSDirective {
  return css.call(this, {
    ...(typeof value === 'object' ? value : { animation: value }),
    animationName: typeof waypoints === 'function' ? waypoints : keyframes.call(this, waypoints),
  })
}
