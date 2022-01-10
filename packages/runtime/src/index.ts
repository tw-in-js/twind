import type { Twind, BaseTheme, TwindConfig, Class, Sheet } from '@twind/core'
import { twind, cssom, observe, cx } from '@twind/core'

export function autoInit(setup: () => void): () => void {
  // If we run in the browser we try to auto call `setup`
  // this works if used as _normal_ script: `<script src="..."></script>`
  // This algorith works well for _normal_ script but not for modules: `<script src="..."></script>`
  // because those are executed __after__ the DOM is ready and we would have FLOUC
  // as we can not know if the user wished to call `twind.setup()`
  // we simply enforce that the user must call `twind.setup()`
  if (typeof document !== 'undefined' && document.currentScript) {
    const cancelAutoInit = () => observer.disconnect()

    let runAutoSetup = false

    // eslint-disable-next-line no-var
    var observer: MutationObserver = new MutationObserver((mutationsList) => {
      if (runAutoSetup) {
        setup()
        return cancelAutoInit()
      }

      for (const { target } of mutationsList) {
        // Found a script tag, it may be the custom `twind.setup()`
        // after it has finished, eg we get notified about the next DOM change
        // we run setup() unless the script has run `twind.setup()`
        // then this observer has been disconnected already
        if ((runAutoSetup = target.nodeName === 'SCRIPT' || target === document.body)) {
          break
        }

        // If we reach the body then there was no custom script
        // run the setup immediately to prevent FLOC
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

let active: Twind | undefined

export function init<Theme extends BaseTheme = BaseTheme, SheetTarget = CSSStyleSheet>(
  config: TwindConfig<Theme>,
  target?: HTMLElement,
  sheet: Sheet<SheetTarget> = cssom() as unknown as Sheet<SheetTarget>,
): Twind<Theme, SheetTarget> {
  active?.destroy()

  return (active = observe(twind(config, sheet), target))
}

export function tw(strings: TemplateStringsArray | Class, ...interpolations: Class[]): string {
  const tokens = cx(strings, ...interpolations)
  return active ? active.inject(tokens) : tokens
}

// TODO theme function
export function theme() {
  // return active?.theme(...args)
}
