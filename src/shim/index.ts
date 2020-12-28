import type { Configuration } from '../types'
import type { TwindObserver } from '../observe'

import { setup as setupTW } from '../index'
import { createObserver } from '../observe/index'

export interface ShimConfiguration extends Configuration {
  target?: HTMLElement
}

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

const observer = createObserver()

export const disconnect = (): void => {
  // Removing the callbacks ensures that the setup is called only once
  // either programmatically from userland or by DOMContentLoaded/setTimeout
  removeEventListener('DOMContentLoaded', onload)
  clearTimeout(timeoutRef)

  observer.disconnect()
}

export const setup = ({
  target = document.documentElement,
  ...config
}: ShimConfiguration = {}): void => {
  if (Object.keys(config).length) {
    setupTW(config)
  }

  // Remove event listeners
  disconnect()

  observer.observe(target)

  target.hidden = false
}
