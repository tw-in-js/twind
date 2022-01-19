import { changed } from './internal/changed'
import type { BaseTheme, Twind } from './types'

export function observe<Theme extends BaseTheme = BaseTheme, Target = unknown>(
  tw: Twind<Theme, Target>,
  target = typeof document != 'undefined' && document.documentElement,
): Twind<Theme, Target> {
  if (!target) return tw

  const observer = new MutationObserver(handleMutations)

  handleMutations([{ target, addedNodes: document.querySelectorAll('[class]') }])

  observer.observe(target, {
    attributes: true,
    attributeFilter: ['class'],
    subtree: true,
    childList: true,
  })

  return Object.create(tw, {
    destroy: {
      enumerable: true,
      value: () => {
        observer.disconnect()
        tw.destroy()
      },
    },
  }) as Twind<Theme, Target>

  function handleMutation({ target, addedNodes }: MinimalMutationRecord): void {
    // Not using target.classList.value (not supported in all browsers) or target.class (this is an SVGAnimatedString for svg)
    const tokens = (target as Element)?.getAttribute?.('class')

    let className: string

    // try do keep classNames unmodified
    if (tokens && changed(tokens, (className = tw(tokens)))) {
      // Not using `target.className = ...` as that is read-only for SVGElements
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(target as Element).setAttribute('class', className)
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

  function handleMutations(mutations: MinimalMutationRecord[]): void {
    mutations.forEach(handleMutation)

    // handle any still-pending mutations
    observer.takeRecords().forEach(handleMutation)
  }
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
