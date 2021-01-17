import type {
  TW,
  CSSRules,
  CSSAtKeyframes,
  InlineDirective,
  LazyInjected,
  Context,
  CSSProperties,
  Falsy,
} from '../types'

import { tw as defaultTW, hash } from '../index'
import * as is from '../internal/is'
import { hyphenate } from '../twind/util'

export interface CSSDirective extends LazyInjected {
  (context: Context): CSSRules
}

export type MaybeThunk<T> = T | ((context: Context) => T)

export type MaybeArray<T> = T | readonly T[]

export interface CSSFactory<T, I, R> {
  (
    strings: TemplateStringsArray,
    ...interpolations: readonly MaybeThunk<MaybeArray<I | string | number | Falsy>>[]
  ): R
  (tokens: MaybeThunk<MaybeArray<T | Falsy>>): R
  (...tokens: readonly MaybeThunk<T | Falsy>[]): R
}

function evaluateFunctions(this: TW, key: string, value: unknown): unknown {
  return is.function(value) ? this(value as InlineDirective) : value
}

// TODO move to utils
const evalThunk = <T>(value: MaybeThunk<T>, context: Context): T => {
  while (is.function(value)) {
    value = value(context)
  }

  return value
}

// TODO use utils once tw.apply is merged
const merge = (target: CSSRules, source: CSSRules, context: Context): CSSRules =>
  source
    ? Object.keys(source).reduce((target, key) => {
        const value = evalThunk(source[key], context)

        // hyphenate target key only if key is property like (\w-)
        const targetKey = /^[A-Z0-9-]+$/i.test(key) ? hyphenate(key) : key

        target[targetKey] =
          is.object(value) && !Array.isArray(value)
            ? merge((target[targetKey] || {}) as CSSRules, value as CSSRules, context)
            : value

        return target
      }, target)
    : target

// TODO use once tw.apply is merged
// eslint-disable-next-line @typescript-eslint/ban-types
const lazy = <T extends Function>(
  directive: T,
  data: unknown,
  tw: TW | null | undefined | void,
): T & LazyInjected => {
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

const translate = (tokens: unknown[], context: Context): CSSRules => {
  const collect = (target: CSSRules, token: MaybeThunk<CSSRules>): CSSRules =>
    Array.isArray(token)
      ? token.reduce(collect, target)
      : merge(target as CSSRules, evalThunk(token, context), context)

  return (tokens as MaybeThunk<CSSRules>[]).reduce(collect, {} as CSSRules)
}

// Based on https://github.com/cristianbote/goober/blob/master/src/core/astish.js
const newRule = /\s*(?:([\w-%@]+)\s*:?\s*([^{;]+?)\s*(?:;|$|})|([^;}{]*?)\s*{)|(})/gi
const ruleClean = /\/\*[\s\S]*?\*\/|\s+|\n/gm

const decorate = (selectors: string[], currentBlock: CSSRules): CSSRules =>
  selectors.reduceRight((rules, selector) => ({ [selector]: rules }), currentBlock)

const saveBlock = (
  rules: CSSRules[],
  selectors: string[],
  currentBlock: CSSRules | undefined | void,
): void => {
  if (currentBlock) {
    rules.push(decorate(selectors, currentBlock))
  }
}

const interleave = (
  strings: TemplateStringsArray,
  interpolations: unknown[],
  context: Context,
): unknown[] => {
  const result: unknown[] = [strings[0]]

  for (let index = 0; index < interpolations.length; ) {
    const interpolation = evalThunk(interpolations[index], context)

    if (is.object(interpolation)) {
      if (interpolation) {
        result.push(interpolation)
      }

      result.push(strings[++index])
    } else {
      // Join consecutive strings
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(result[result.length - 1] as string) += ((interpolation || '') as string) + strings[++index]
    }
  }

  return result
}

const astish = (values: unknown[]): CSSRules[] => {
  // Keep track of active selectors => these are the nested keys
  const selectors: string[] = []
  const rules: CSSRules[] = []

  let currentBlock: CSSRules | undefined | void
  let match: RegExpExecArray | null

  for (let index = 0; index < values.length; index++) {
    const value = values[index]

    if (is.string(value)) {
      while ((match = newRule.exec(value.replace(ruleClean, ' ')))) {
        if (!match[0]) continue

        // `}` => Save current block
        if (match[4]) {
          currentBlock = saveBlock(rules, selectors, currentBlock)
          selectors.pop()
        }

        // `... {` => Start a new block
        if (match[3]) {
          // selector {
          currentBlock = saveBlock(rules, selectors, currentBlock)
          selectors.push(match[3])
        } else if (!match[4]) {
          if (!currentBlock) currentBlock = {}

          if (match[2] && /\S/.test(match[2])) {
            // a) property: value
            currentBlock[match[1]] = match[2]
          } else if (values[++index]) {
            // b) property: ${interpolation}
            currentBlock[match[1]] = values[index] as CSSRules
          }
        }
      }
    } else {
      currentBlock = saveBlock(rules, selectors, currentBlock)

      rules.push(decorate(selectors, value as CSSRules))
    }
  }

  saveBlock(rules, selectors, currentBlock)

  return rules
}

export const css: CSSFactory<CSSRules, CSSRules, CSSDirective> = function (
  this: TW | null | undefined | void,
  ...tokens: unknown[]
): CSSDirective {
  if (
    Array.isArray(tokens[0] as TemplateStringsArray) &&
    Array.isArray((tokens[0] as TemplateStringsArray).raw)
  ) {
    // eslint-disable-next-line no-var
    var strings = tokens[0] as TemplateStringsArray
    tokens = tokens.slice(1)
  }

  return lazy(
    (context: Context): CSSRules =>
      translate(strings ? astish(interleave(strings, tokens, context)) : tokens, context),
    tokens,
    this,
  )
}

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
export const keyframes: CSSFactory<
  CSSAtKeyframes,
  CSSAtKeyframes | CSSProperties,
  CSSKeyframes
> = function (this: TW | null | undefined | void, ...tokens: unknown[]): CSSKeyframes {
  let id: string
  const waypoints = css.apply(this, tokens as CSSRules[])

  const keyframes: InlineDirective = (context) => {
    id = hash(JSON.stringify(tokens, evaluateFunctions.bind(context.tw)))

    return { [`@keyframes ${id}`]: waypoints(context) }
  }

  return lazy(
    (({ tw }) => {
      // Inject the keyframes
      tw(keyframes)

      // but return the keyframe id
      return id
    }) as CSSKeyframes,
    tokens,
    this,
  )
}

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
    ...(is.object(value) ? value : { animation: value }),
    animationName: is.function(waypoints) ? waypoints : keyframes.call(this, waypoints),
  })
}
