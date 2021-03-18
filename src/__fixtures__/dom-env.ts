import type { Test } from 'uvu'

import { JSDOM, VirtualConsole } from 'jsdom'

const GLOBAL_PROPERTIES = [
  'window',
  'self',
  'document',
  'navigator',
  'getComputedStyle',
  'MutationObserver',
] as const

const kDefaultView = Symbol('kDefaultView')

export function configure<T extends Test>(test: T, options?: SetupOptions & ResetOptions): T {
  test.before(() => {
    setup(options)
  })

  test.before.each(() => reset(options))

  test.after(destroy)

  return test
}

export interface SetupOptions {
  html?: string
  url?: string
  console?: Console
}

export function setup({
  html = '<!DOCTYPE html>',
  url = 'http://localhost',
  console = global.console,
}: SetupOptions = {}): JSDOM {
  const dom = new JSDOM(html, {
    pretendToBeVisual: true,
    runScripts: 'dangerously',
    url,
    virtualConsole: new VirtualConsole().sendTo(console),
  })

  const { defaultView } = dom.window.document
  if (!defaultView) {
    throw new TypeError('JSDOM did not return a Window object')
  }

  Object.defineProperty(global, kDefaultView, {
    configurable: true,
    get: () => defaultView,
  })

  defaultView.addEventListener('error', (event) => {
    process.emit('uncaughtException', event.error)
  })

  GLOBAL_PROPERTIES.forEach((property) =>
    Object.defineProperty(global, property, {
      enumerable: true,
      configurable: true,
      get: () => defaultView[property],
    }),
  )

  return dom
}

export interface ResetOptions {
  title?: string
  head?: string
  body?: string
}

export function reset({ title = '', head = '', body = '' }: ResetOptions = {}): void {
  document.title = title
  document.head.innerHTML = head
  document.body.innerHTML = body
}

export function destroy(): void {
  GLOBAL_PROPERTIES.forEach((property) => Reflect.deleteProperty(global, property))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultView = (global as any)[kDefaultView] as WindowProxy & typeof globalThis

  if (defaultView) {
    // Dispose "document" to prevent "load" event from triggering.
    Object.defineProperty(defaultView, 'document', { value: null })

    defaultView.close()
  }
}
