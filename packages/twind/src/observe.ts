import type { BaseTheme, Twind } from './types'

import { changed } from './internal/changed'
import { tw as tw$ } from './runtime'

export function observe<Theme extends BaseTheme = BaseTheme, Target = unknown>(
  tw: Twind<Theme, Target> = tw$ as unknown as Twind<Theme, Target>,
  target = typeof document != 'undefined' && document.documentElement,
): Twind<Theme, Target> {
  if (!target) return tw

  const observer = new MutationObserver(handleMutationRecords)

  observer.observe(target, {
    attributeFilter: ['class'],
    subtree: true,
    childList: true,
  })

  // handle class attribute on target
  handleClassAttributeChange(target)

  // handle children of target
  handleMutationRecords([{ target, type: '' }])

  // monkey patch tw.destroy to disconnect this observer
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { destroy } = tw
  tw.destroy = () => {
    observer.disconnect()
    destroy.call(tw)
  }

  return tw

  function handleMutationRecords(records: MinimalMutationRecord[]): void {
    for (const { type, target } of records) {
      if (type[0] == 'a' /* attribute */) {
        // class attribute has been changed
        handleClassAttributeChange(target as Element)
      } else {
        /* childList */
        // some nodes have been added — find all with a class attribute
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;(target as Element).querySelectorAll('[class]').forEach(handleClassAttributeChange)
      }
    }

    // remove pending mutations — these are triggered by updating the class attributes
    observer.takeRecords()
    // XXX maybe we need to handle all pending mutations
    // observer.takeRecords().forEach(handleMutation)
  }

  function handleClassAttributeChange(target: Element): void {
    // Not using target.classList.value (not supported in all browsers) or target.class (this is an SVGAnimatedString for svg)
    const tokens = target.getAttribute('class')

    let className: string

    // try do keep classNames unmodified
    if (tokens && changed(tokens, (className = tw(tokens)))) {
      // Not using `target.className = ...` as that is read-only for SVGElements
      target.setAttribute('class', className)
    }
  }
}

/**
 * Simplified MutationRecord which allows us to pass an
 * ArrayLike (compatible with Array and NodeList) `addedNodes` and
 * omit other properties we are not interested in.
 */
interface MinimalMutationRecord {
  readonly type: string
  readonly target: Node
}
