import type { Configuration } from '../types'
import { tw, setup as setupTW } from '../index'

export interface ShimConfiguration extends Configuration {
  target?: HTMLElement
}

interface NodeList {
  readonly length: number

  [index: number]: Node
}

interface MutationRecord {
  readonly addedNodes: NodeList
  readonly target: Node
}

const handleMutation = ({ target, addedNodes }: MutationRecord): void => {
  // Not using target.classList.value (not supported in all browsers) or target.class (this is an SVGAnimatedString for svg)
  const tokens = (target as Element).getAttribute?.('class')

  if (tokens) {
    const className = tw(tokens)

    if (tokens !== className) {
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

export const stop = (): void => observer.disconnect()

const onload = () => {
  const script = document.querySelector('script[type="twind-config"]')

  setup(script ? JSON.parse(script.innerHTML) : {})
}

if (document.readyState === 'loading') {
  // Loading hasn't finished yet
  addEventListener('DOMContentLoaded', onload)
} else {
  // `DOMContentLoaded` has already fired
  // invoke on next tick to allow other setup methods to run
  // eslint-disable-next-line no-var
  var timeoutRef = setTimeout(onload)
}

export const setup = ({
  target = document.documentElement,
  ...config
}: ShimConfiguration = {}): void => {
  // Removing the callbacks ensures that the setup is called only once
  // either by programmatically from userland or by DOMContentLoaded/timeout
  removeEventListener('DOMContentLoaded', onload)
  clearTimeout(timeoutRef)

  if (Object.keys(config).length) {
    setupTW(config)
  }

  stop()

  handleMutations([{ target, addedNodes: [target] }])

  target.hidden = false

  observer.observe(target, {
    attributes: true,
    attributeFilter: ['class'],
    subtree: true,
    childList: true,
  })
}
