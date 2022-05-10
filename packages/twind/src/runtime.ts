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
import { getSheet } from './sheets'
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

export const tw = /* #__PURE__ */ new Proxy(
  // just exposing the active as tw should work with most bundlers
  // as ES module export can be re-assigned BUT some bundlers to not honor this
  // -> using a delegation proxy here
  noop as unknown as Twind<any, any>,
  {
    apply(target, thisArg, args) {
      return active(args[0])
    },
    get(target, property) {
      const value = (active || target)[property as keyof Twind]

      if (typeof value === 'function') {
        return value.bind(active)
      }

      return value
    },
  },
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
  sheet?: Sheet<SheetTarget>,
  target?: HTMLElement,
): Twind<Theme, SheetTarget> {
  active?.destroy()

  sheet ??= getSheet() as unknown as Sheet<SheetTarget>

  active = observe(twind(config as TwindUserConfig, sheet), target)

  return active as unknown as Twind<Theme, SheetTarget>
}
