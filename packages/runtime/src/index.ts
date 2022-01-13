import type { Twind, BaseTheme, TwindConfig, Class, Sheet } from '@twind/core'
import { twind, cssom, virtual, observe, cx } from '@twind/core'

export function autoInit(setup: () => void): () => void {
  // If we run in the browser we call setup at latest when the body is inserted
  // This algorith works well for _normal_ script but not for modules: `<script src="..."></script>`
  // because those are executed __after__ the DOM is ready and we would have FOUC
  if (typeof document !== 'undefined' && document.currentScript) {
    const cancelAutoInit = () => observer.disconnect()

    const observer: MutationObserver = new MutationObserver((mutationsList) => {
      for (const { target } of mutationsList) {
        // If we reach the body we immediately run the setup to prevent FLOC
        if (target === document.body) {
          setup()
          return cancelAutoInit()
        }
      }
    })

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })

    return cancelAutoInit
  } else {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {}
  }
}

export let tw: Twind

export function init<Theme extends BaseTheme = BaseTheme, SheetTarget = CSSStyleSheet | string[]>(
  config: TwindConfig<Theme>,
  sheet: Sheet<SheetTarget> = (typeof document != undefined
    ? cssom()
    : virtual()) as unknown as Sheet<SheetTarget>,
  target?: HTMLElement,
): Twind<Theme, SheetTarget> {
  tw?.destroy()

  return (tw = observe(twind(config, sheet), target))
}
