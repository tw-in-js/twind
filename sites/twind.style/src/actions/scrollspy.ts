import type { Action } from './types'
import mutationObserver from './mutation-observer'

export interface ScrollspyOptions {
  enabled?: boolean
  offset?: number
  anchorSelector?: string
  linkSelector?: string
  /** CSS classes to add for an active link */
  className?: string
}

export default function scrollspy(
  node: Element,
  initialOptions?: ScrollspyOptions,
): ReturnType<Action> {
  let options: Required<ScrollspyOptions>
  let checkTimer: ReturnType<typeof setTimeout>
  let observer: ReturnType<Action> | undefined | void
  let lastActive: Element | undefined
  let anchors: Map<string, Element>
  let links: Map<string, Element>

  update(initialOptions)

  function findElements() {
    anchors = new Map(
      Array.from(node.querySelectorAll(options.anchorSelector), (element) => [element.id, element]),
    )

    links = new Map(
      Array.from(node.querySelectorAll(options.linkSelector), (element) => [
        new URL((element as HTMLAnchorElement).href).hash.slice(1),
        element,
      ]),
    )

    scheduleCheck()
  }

  function check() {
    const nextActive = Array.from(anchors.values(), (element) => ({
      e: element,
      y: element.getBoundingClientRect().y - options.offset,
    }))
      .filter((a) => a.y <= 0)
      .sort((a, b) => b.y - a.y)
      .map((a) => links.get(a.e.id))
      .filter(Boolean)[0]

      if (lastActive !== nextActive) {
      const classList = options.className.split(/\s+/g)
      lastActive?.classList.remove(...classList)
      nextActive?.classList.add(...classList)
      lastActive = nextActive
    }
  }

  function scheduleCheck() {
    clearTimeout(checkTimer)
    checkTimer = setTimeout(check, 35)
  }

  function update({
    enabled = true,
    offset = 100,
    className = 'active',
    anchorSelector = '[id]',
    linkSelector = 'nav a[href]',
  }: ScrollspyOptions = {}) {
    destroy()

    options = { enabled, offset, className, anchorSelector, linkSelector }

    if (enabled) {
      observer = mutationObserver(node, {
        enabled,
        childList: true,
        subtree: true,
        callback: findElements,
      })

      addEventListener('scroll', scheduleCheck, {
        capture: true,
        passive: true,
      })

      addEventListener('resize', scheduleCheck, {
        capture: true,
        passive: true,
      })

      findElements()
    }
  }

  function destroy() {
    observer = observer?.destroy()

    if (options && lastActive) {
      lastActive.classList.remove(...options.className.split(/\s+/g))
      lastActive = undefined
    }

    removeEventListener('scroll', scheduleCheck, {
      capture: true,
      // passive: true,
    })
    removeEventListener('resize', scheduleCheck, {
      capture: true,
      // passive: true,
    })

    clearTimeout(checkTimer)
  }

  return { update, destroy }
}
