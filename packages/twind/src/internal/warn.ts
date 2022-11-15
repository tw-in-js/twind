import { DEV } from 'distilt/env'

declare global {
  interface WindowEventMap {
    warning: CustomEvent<Warning>
  }
}

export type Warning = {
  [Code in keyof WarningEventMap]: { message: string; code: Code; detail: WarningEventMap[Code] }
}[keyof WarningEventMap]

export interface WarningEventMap {
  TWIND_INVALID_CLASS: string
  TWIND_INVALID_CSS: string
}

export function warn<Code extends keyof WarningEventMap>(
  message: string,
  code: Code,
  detail: WarningEventMap[Code],
): void {
  if (DEV) {
    if (typeof dispatchEvent == 'function' && typeof CustomEvent === 'function') {
      // Browser
      const event = new CustomEvent('warning', { detail: { message, code, detail } })

      dispatchEvent(event)

      if (!event.defaultPrevented) {
        console.warn(`[${code}] ${message}`, { detail })
      }
    } else if (typeof process == 'object' && typeof process.emitWarning == 'function') {
      // Node.JS
      process.emitWarning(message, { code, detail } as unknown as string)
    } else {
      // Fallback
      console.warn(`[${code}] ${message}`, { detail })
    }
  }
}
