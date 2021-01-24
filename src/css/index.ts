/**
 * [[include:src/css/README.md]]
 *
 * @packageDocumentation
 * @module twind/css
 */

import type {
  CSSRules,
  CSSAtKeyframes,
  Context,
  CSSProperties,
  Directive,
  Falsy,
  MaybeThunk,
  MaybeArray,
} from '../types'

import { hash, directive } from '../index'
import * as is from '../internal/is'
import { evalThunk, merge } from '../internal/util'

export { tw, apply, setup, theme } from '../index'

export interface CSSFactory<T, I, R> {
  (
    strings: TemplateStringsArray,
    ...interpolations: readonly MaybeThunk<MaybeArray<I | string | number | Falsy>>[]
  ): Directive<R>
  (tokens: MaybeThunk<MaybeArray<T | Falsy>>): Directive<R>
  (...tokens: readonly MaybeThunk<T | Falsy>[]): Directive<R>
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
  let buffer = strings[0]
  const result: unknown[] = []

  for (let index = 0; index < interpolations.length; ) {
    const interpolation = evalThunk(interpolations[index], context)

    if (is.object(interpolation)) {
      result.push(buffer, interpolation)
      buffer = strings[++index]
    } else {
      // Join consecutive strings
      buffer += ((interpolation || '') as string) + strings[++index]
    }
  }

  result.push(buffer)

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

const cssFactory = (tokens: unknown[], context: Context): CSSRules =>
  translate(
    Array.isArray(tokens[0] as TemplateStringsArray) &&
      Array.isArray((tokens[0] as TemplateStringsArray).raw)
      ? astish(interleave(tokens[0] as TemplateStringsArray, tokens.slice(1), context))
      : tokens,
    context,
  )

export const css: CSSFactory<CSSRules, CSSRules, CSSRules> = (
  ...tokens: unknown[]
): Directive<CSSRules> => directive(cssFactory, tokens)

const keyframesFactory = (tokens: unknown[], context: Context): string => {
  const waypoints = cssFactory(tokens as CSSRules[], context)

  const id = hash(JSON.stringify(waypoints))

  // Inject the keyframes
  context.tw(() => ({ [`@keyframes ${id}`]: waypoints }))

  // but return the keyframe id
  return id
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
export const keyframes: CSSFactory<CSSAtKeyframes, CSSAtKeyframes | CSSProperties, string> = (
  ...tokens: unknown[]
): Directive<string> => directive(keyframesFactory, tokens)

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
export interface Animation {
  (value: string | CSSRules | ((context: Context) => string)): CSSFactory<
    CSSAtKeyframes,
    CSSAtKeyframes | CSSProperties,
    CSSRules
  >

  (
    value: string | CSSRules | ((context: Context) => string),
    waypoints: CSSAtKeyframes | Directive<string>,
  ): Directive<CSSRules>
}

export const animation = ((
  value: string | CSSRules | ((context: Context) => string),
  waypoints?: CSSAtKeyframes | Directive<string>,
): Directive<CSSRules> | CSSFactory<CSSAtKeyframes, CSSAtKeyframes | CSSProperties, CSSRules> =>
  waypoints === undefined
    ? (((...args: Parameters<typeof keyframes>): Directive<CSSRules> =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        animation(value, keyframes(...(args as any)))) as CSSFactory<
        CSSAtKeyframes,
        CSSAtKeyframes | CSSProperties,
        CSSRules
      >)
    : css({
        ...(is.object(value) ? value : { animation: value }),
        animationName: is.function(waypoints) ? waypoints : keyframes(waypoints),
      })) as Animation

export interface Screen {
  (size: string): Directive<string>
  (size: string, css: Directive<CSSRules> | MaybeArray<CSSRules | Falsy>): Directive<CSSRules>
}

const screenFactory = (
  { size, rules }: { size: string; rules?: Directive<CSSRules> | MaybeArray<CSSRules | Falsy> },
  context: Context,
): string | CSSRules => {
  const media = `@media (min-width: ${context.theme('screens', size)})`

  return rules === undefined
    ? media
    : {
        [media]: is.function(rules) ? evalThunk(rules, context) : cssFactory([rules], context),
      }
}

export const screen = ((size: string, rules?: Directive<CSSRules> | MaybeArray<CSSRules | Falsy>) =>
  directive(screenFactory, { size, rules })) as Screen
