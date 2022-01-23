/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Twind,
  BaseTheme,
  TwindConfig,
  Sheet,
  TwindUserConfig,
  ExtractThemes,
  Preset,
} from './types'

import { twind } from './twind'
import { observe } from './observe'
import { cssom, virtual } from './sheets'
import { noop } from './utils'

export function auto(setup: () => void): () => void {
  // If we run in the browser we call setup at latest when the body is inserted
  // This algorith works well for _normal_ scripts (`<script src="..."></script>`)
  // but not for modules because those are executed __after__ the DOM is ready
  // and we would have FOUC
  if (typeof document != 'undefined' && document.currentScript) {
    const cancelAutoSetup = () => observer.disconnect()

    const observer: MutationObserver = new MutationObserver((mutationsList) => {
      for (const { target } of mutationsList) {
        // If we reach the body we immediately run the setup to prevent FOUC
        if (target === document.body) {
          setup()
          return cancelAutoSetup()
        }
      }
    })

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })

    return cancelAutoSetup
  }

  return noop
}

/**
 * A proxy to the currently active Twind instance.
 */
export const tw = /* @__PURE__ */ Object.defineProperties(
  function tw(...args) {
    return active(...args)
  } as Twind,
  Object.getOwnPropertyDescriptors({
    get target() {
      return active.target
    },
    theme(...args: unknown[]) {
      return active.theme(...(args as []))
    },

    clear() {
      return active.clear()
    },

    destroy() {
      return active.destroy()
    },
  }),
)

let active: Twind

/**
 * Manages a single Twind instance — works in browser, Node.js, Deno, workers...
 *
 * @param config
 * @param sheet
 * @param target
 * @returns
 */
export function setup<Theme extends BaseTheme = BaseTheme, SheetTarget = unknown>(
  config?: TwindConfig<Theme>,
  sheet?: Sheet<SheetTarget>,
  target?: HTMLElement,
): Twind<Theme, SheetTarget>

export function setup<
  Theme = BaseTheme,
  Presets extends Preset<any>[] = Preset[],
  SheetTarget = unknown,
>(
  config?: TwindUserConfig<Theme, Presets>,
  sheet?: Sheet<SheetTarget>,
  target?: HTMLElement,
): Twind<BaseTheme & ExtractThemes<Theme, Presets>, SheetTarget>

export function setup<Theme extends BaseTheme = BaseTheme, SheetTarget = unknown>(
  config: TwindConfig<any> | TwindUserConfig<any> = {},
  sheet: Sheet<SheetTarget> = (typeof document != 'undefined'
    ? cssom()
    : virtual()) as unknown as Sheet<SheetTarget>,
  target?: HTMLElement,
): Twind<Theme, SheetTarget> {
  const firstRun = !active

  if (!firstRun) {
    active.destroy()
  }

  active = observe(twind(config as TwindUserConfig<Theme>, sheet), target)

  if (firstRun && typeof document != 'undefined') {
    // first run in browser

    // remove server-side generated style element
    // after `observe` twind has taken over and the SSR styles are no longer used
    document.querySelector('style[data-twind]')?.remove()

    // If they body was hidden autofocus the first element
    if (!document.activeElement) {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi, @typescript-eslint/no-unnecessary-type-assertion
      ;(document.querySelector('[autofocus]') as HTMLElement | null)?.focus()
    }
  }

  return active as Twind<Theme, SheetTarget>
}
