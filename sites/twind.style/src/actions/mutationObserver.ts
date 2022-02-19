import type { Action } from './types'

export interface MutationObserverOptions extends MutationObserverInit {
  enabled?: boolean
  callback?: MutationCallback
}

export function mutationObserver(
  node: HTMLElement,
  initialOptions?: MutationObserverOptions,
): ReturnType<Action> {
  let observer: MutationObserver | undefined | void

  update(initialOptions)

  function update({
    enabled = true,
    callback = (mutations, observer) => {
      node.dispatchEvent(
        new CustomEvent('mutation', {
          bubbles: false,
          cancelable: false,
          detail: { mutations, observer },
        }),
      )
    },
    ...options
  }: MutationObserverOptions = {}) {
    destroy()

    if (enabled) {
      observer = new MutationObserver(callback)
      observer.observe(node, options)
    }
  }

  function destroy() {
    observer?.disconnect()
  }

  return { update, destroy }
}
