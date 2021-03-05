/**
 * [[include:src/shim/README.md]]
 *
 * @packageDocumentation
 * @module twind/shim
 */

import type { Configuration } from '../types'

import { setup as setupTW, createObserver } from '../observe/index'

/**
 * Options for {@link setup}.
 */
export interface ShimConfiguration extends Configuration {
  /**
   * The root element to shim (default: `document.documentElement`).
   */
  target?: HTMLElement
}

if (typeof document !== 'undefined' && typeof addEventListener == 'function') {
  // eslint-disable-next-line no-var
  var onload = () => {
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
}

const observer = createObserver()

/**
 * Stop shimming/observing all nodes.
 */
export const disconnect = (): void => {
  if (onload) {
    // Removing the callbacks ensures that the setup is called only once
    // either programmatically from userland or by DOMContentLoaded/setTimeout
    removeEventListener('DOMContentLoaded', onload)
    clearTimeout(timeoutRef)
  }

  observer.disconnect()
}

/**
 * Configure the default {@link tw} and starts {@link observe | observing} the
 * {@link ShimConfiguration.target | target element} (default: `document.documentElement`).
 *
 * You do not need to call this method. As an alternativ you can provide a
 * `<script type="twind-config">...</script>` element within the document.
 * The content must be valid JSON and all {@link twind.setup | twind setup options}
 * (including hash) are supported.
 */
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
