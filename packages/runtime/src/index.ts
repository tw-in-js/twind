import type { Twind, BaseTheme, TwindConfig, Sheet } from '@twind/core'
import { twind, cssom, virtual, observe } from '@twind/core'

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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return () => {}
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
