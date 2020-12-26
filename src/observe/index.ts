import type { TW } from '../types'
import { tw as defaultTW } from '../index'

export interface ShimConfiguration {
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

export const createObserver = ({ tw = defaultTW }: ShimConfiguration = {}): TwindObserver => {
  const rulesToClassCache = getCache(tw)

  const handleMutation = ({ target, addedNodes }: MutationRecord): void => {
    // Not using target.classList.value (not supported in all browsers) or target.class (this is an SVGAnimatedString for svg)
    const rules = (target as Element).getAttribute?.('class')

    if (rules) {
      let className = rulesToClassCache.get(rules)

      if (!className) {
        className = tw(rules)

        // Remember the generated class name
        rulesToClassCache.set(rules, className)

        // Ensure the cache does not grow unlimited
        if (rulesToClassCache.size > 10000) {
          rulesToClassCache.delete(rulesToClassCache.keys().next().value)
        }
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

  const handleMutations = (mutations: MutationRecord[]): void => mutations.forEach(handleMutation)

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
export function observe(
  this: ShimConfiguration | undefined | void,
  target: Node,
  config: ShimConfiguration | undefined | void = this,
): TwindObserver {
  return createObserver(config as ShimConfiguration | undefined).observe(target)
}

interface NodeList {
  readonly length: number

  [index: number]: Node
}

interface MutationRecord {
  readonly addedNodes: NodeList
  readonly target: Node
}
