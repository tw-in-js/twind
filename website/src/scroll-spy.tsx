import type { PropsWithChildren } from 'react'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

interface ScrollSpyObserver {
  observe(target: Element): void
  unobserve(target: Element): void
  track(id: string, listener: (active: boolean) => void): void
  untrack(id: string, listener: (active: boolean) => void): void
}

const ScrollSpyContext = createContext<ScrollSpyObserver | null>(null)

export function ScrollSpy({ offset = 100, children }: PropsWithChildren<{ offset?: number }>) {
  const observed = useMemo(() => new Set<Element>(), [])
  const tracked = useMemo(() => new Map<string, Set<(active: boolean) => void>>(), [])
  const lastActive = useRef('')

  const observer = useMemo(() => {
    let updateTimer: number

    function update() {
      const elements = Array.from(observed, (element) => ({
        element,
        y: element.getBoundingClientRect().y - offset,
      }))
        .filter((a) => a.y <= 0 && tracked.has(a.element.id))
        .sort((a, b) => b.y - a.y)

      const newActive = elements[0]?.element?.id

      if (lastActive.current != newActive) {
        tracked.get(lastActive.current)?.forEach((listener) => listener(false))
        tracked.get(newActive)?.forEach((listener) => listener(true))
        lastActive.current = newActive
      }
    }

    function scheduleUpdate() {
      cancelAnimationFrame(updateTimer)
      updateTimer = requestAnimationFrame(update)
    }

    return {
      update() {
        scheduleUpdate()
      },
      destroy() {
        clearTimeout(updateTimer)
      },
      observe(target: Element) {
        observed.add(target)
        scheduleUpdate()
      },
      unobserve(target: Element) {
        observed.delete(target)
        scheduleUpdate()
      },
      track(id: string, listener: (active: boolean) => void) {
        let listeners = tracked.get(id)
        if (!listeners) {
          tracked.set(id, (listeners = new Set()))
        }
        listeners.add(listener)
        scheduleUpdate()
      },
      untrack(id: string, listener: (active: boolean) => void) {
        const listeners = tracked.get(id)
        if (listeners) {
          listeners.delete(listener)
        }
        scheduleUpdate()
      },
    }
  }, [offset, observed, tracked, lastActive])

  useEffect(() => {
    /* eslint-disable @typescript-eslint/unbound-method */
    if (observer) {
      addEventListener('scroll', observer.update, {
        capture: true,
        passive: true,
      })
      addEventListener('resize', observer.update, {
        capture: true,
        passive: true,
      })
      return () => {
        removeEventListener('scroll', observer.update, {
          capture: true,
          // passive: true,
        })
        removeEventListener('resize', observer.update, {
          capture: true,
          // passive: true,
        })
      }
    }
    /* eslint-enable @typescript-eslint/unbound-method */
  }, [observer])

  return <ScrollSpyContext.Provider value={observer}>{children}</ScrollSpyContext.Provider>
}

export function useScrollSpyRef() {
  const observer = useContext(ScrollSpyContext)
  const anchorsRef = useRef([] as { forEach(iteratee: (element: Element) => void): void })
  const mutationObserver = useRef<MutationObserver | null>(null)

  const wrapperRef = useCallback(
    (node: HTMLDivElement) => {
      mutationObserver.current?.disconnect()

      if (node) {
        const update = () => {
          if (observer) {
            anchorsRef.current.forEach((anchor) => observer.unobserve(anchor))
          }

          anchorsRef.current = node.querySelectorAll('[id]')

          if (observer) {
            anchorsRef.current.forEach((anchor) => observer.observe(anchor))
          }
        }
        update()
        mutationObserver.current = new MutationObserver(update)
        mutationObserver.current.observe(node, {
          childList: true,
          subtree: true,
        })
      }
    },
    [observer, anchorsRef, mutationObserver],
  )

  // cleanup
  useEffect(() => {
    return () => {
      anchorsRef.current.forEach((anchor) => observer?.unobserve(anchor))
      mutationObserver.current?.disconnect()
    }
  }, [observer, mutationObserver])

  return wrapperRef
}

export function useScrollSpyActive(id: string | undefined) {
  const observer = useContext(ScrollSpyContext)
  const [isActive, setActive] = useState(false)

  useEffect(() => {
    if (id && observer) {
      observer.track(id, setActive)
      return () => observer.untrack(id, setActive)
    }
  }, [observer, id, setActive])

  return isActive
}
