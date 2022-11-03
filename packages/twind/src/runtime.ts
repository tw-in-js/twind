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
import { DEV } from 'distilt/env'

export function auto(install: () => void): () => void {
  // If we run in the browser we call install at latest when the body is inserted
  // This algorith works well for _normal_ scripts (`<script src="..."></script>`)
  // but not for modules because those are executed __after__ the DOM is ready
  // and we would have FOUC
  if (typeof document != 'undefined' && document.currentScript) {
    const cancelAutoInstall = () => observer.disconnect()

    const observer: MutationObserver = new MutationObserver((mutationsList) => {
      for (const { target } of mutationsList) {
        // If we reach the body we immediately run the install to prevent FOUC
        if (target === document.body) {
          install()
          return cancelAutoInstall()
        }
      }
    })

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })

    return cancelAutoInstall
  }

  return noop
}

let active: Twind

function assertActive() {
  if (DEV && !active) {
    throw new Error(
      `No active twind instance found. Make sure to call setup or install before accessing tw.`,
    )
  }
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
    apply(_target, _thisArg, args) {
      if (DEV) assertActive()

      return active(args[0])
    },
    get(_target, property) {
      if (DEV) assertActive()

      const value = active[property as keyof Twind]

      if (typeof value === 'function') {
        return function () {
          if (DEV) assertActive()

          // eslint-disable-next-line prefer-rest-params
          return value.apply(active, arguments)
        }
      }

      return value
    },
  },
)

export type SheetFactory<SheetTarget = unknown> = () => Sheet<SheetTarget>

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
  sheet?: Sheet<SheetTarget> | SheetFactory<SheetTarget>,
  target?: HTMLElement,
): Twind<Theme, SheetTarget>

export function setup<
  Theme = BaseTheme,
  Presets extends Preset<any>[] = Preset[],
  SheetTarget = unknown,
>(
  config?: TwindUserConfig<Theme, Presets>,
  sheet?: Sheet<SheetTarget> | SheetFactory<SheetTarget>,
  target?: HTMLElement,
): Twind<BaseTheme & ExtractThemes<Theme, Presets>, SheetTarget>

export function setup<Theme extends BaseTheme = BaseTheme, SheetTarget = unknown>(
  config: TwindConfig<any> | TwindUserConfig<any> = {},
  sheet: Sheet<SheetTarget> | SheetFactory<SheetTarget> = getSheet as SheetFactory<SheetTarget>,
  target?: HTMLElement,
): Twind<Theme, SheetTarget> {
  active?.destroy()

  active = observe(
    twind(config as TwindUserConfig, typeof sheet == 'function' ? sheet() : sheet),
    target,
  )

  return active as unknown as Twind<Theme, SheetTarget>
}
