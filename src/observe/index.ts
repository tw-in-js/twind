/**
 * [[include:src/observe/README.md]]
 *
 * @packageDocumentation
 * @module twind/observe
 */

import type { TW } from 'twind'
import { tw as defaultTW } from 'twind'
import { ensureMaxSize } from '../internal/util'

export * from 'twind'

/**
 * Options for {@link createObserver}.
 */
export interface ShimConfiguration {
  /**
   * Custom {@link twind.tw | tw} instance to use (default: {@link twind.tw}).
   */
  tw?: TW
}

/** Provides the ability to watch for changes being made to the DOM tree. */
export interface TwindObserver {
  /**
   * Stops observer from observing any mutations.
   */
  disconnect(): TwindObserver

  /**
   * Observe an additional element.
   */
  observe(target: Node): TwindObserver
}

const caches = new WeakMap<TW, Map<string, string>>()

const getCache = (tw: TW): Map<string, string> => {
  let rulesToClassCache = caches.get(tw)

  if (!rulesToClassCache) {
    rulesToClassCache = new Map<string, string>()
    caches.set(tw, rulesToClassCache)
  }

  return rulesToClassCache
}

const uniq = <T>(value: T, index: number, values: T[]) => values.indexOf(value) == index

/**
 * Creates a new {@link TwindObserver}.
 *
 * @param options to use
 */
export const createObserver = ({ tw = defaultTW }: ShimConfiguration = {}): TwindObserver => {
  if (typeof MutationObserver == 'function') {
    const rulesToClassCache = getCache(tw)

    const handleMutation = ({ target, addedNodes }: MinimalMutationRecord): void => {
      // Not using target.classList.value (not supported in all browsers) or target.class (this is an SVGAnimatedString for svg)
      const rules = (target as Element).getAttribute?.('class')

      if (rules) {
        let className = rulesToClassCache.get(rules)

        if (!className) {
          className = tw(rules).split(/ +/g).filter(uniq).join(' ')

          // Remember the generated class name
          rulesToClassCache.set(rules, className)
          rulesToClassCache.set(className, className)

          // Ensure the cache does not grow unlimited
          ensureMaxSize(rulesToClassCache, 30000)
        }

        if (rules !== className) {
          // Not using `target.className = ...` as that is read-only for SVGElements
          // eslint-disable-next-line @typescript-eslint/no-extra-semi
          ;(target as Element).setAttribute('class', className)
        }
      }

      for (let index = addedNodes.length; index--; ) {
        const node = addedNodes[index]

        handleMutations([
          {
            target: node,
            addedNodes: (node as Element).children || [],
          },
        ])
      }
    }

    const handleMutations = (mutations: MinimalMutationRecord[]): void => {
      mutations.forEach(handleMutation)

      // handle any still-pending mutations
      mutations = observer.takeRecords()
      if (mutations) mutations.forEach(handleMutation)
    }

    const observer = new MutationObserver(handleMutations)

    return {
      observe(target) {
        handleMutations([{ target, addedNodes: [target] }])

        observer.observe(target, {
          attributes: true,
          attributeFilter: ['class'],
          subtree: true,
          childList: true,
        })

        return this
      },

      disconnect() {
        observer.disconnect()
        return this
      },
    }
  }

  // Non-browser-like environment – return a no-op implementation
  return {
    observe() {
      return this
    },

    disconnect() {
      return this
    },
  }
}

/**
 * Creates a new {@link TwindObserver} and {@link TwindObserver.observe | start observing} the passed target element.
 * @param this to bind
 * @param target to shim
 * @param config to use
 */
export function observe(
  this: ShimConfiguration | undefined | void,
  target: Node,
  config: ShimConfiguration | undefined | void = typeof this == 'function' ? undefined : this,
): TwindObserver {
  return createObserver(config as ShimConfiguration | undefined).observe(target)
}

/**
 * Simplified MutationRecord which allows us to pass an
 * ArrayLike (compatible with Array and NodeList) `addedNodes` and
 * omit other properties we are not interested in.
 */
interface MinimalMutationRecord {
  readonly addedNodes: ArrayLike<Node>
  readonly target: Node
}
