// Based on https://github.com/kripod/otion/blob/main/packages/otion/src/injectors.ts
// License MIT
import type { InjectorConfig, Injector } from './types'

const STYLE_ELEMENT_ID = '__tw-in-js' as const

declare global {
  interface Window {
    [STYLE_ELEMENT_ID]?: HTMLStyleElement
  }
}

const getStyleElement = (nonce?: string): HTMLStyleElement => {
  // Hydrate existing style element if available
  // self[id] - every element with an id is available through the global object
  // eslint-disable-next-line no-restricted-globals
  let element = self[STYLE_ELEMENT_ID]

  if (!element) {
    // Create a new one otherwise
    element = document.head.appendChild(document.createElement('style'))

    element.id = STYLE_ELEMENT_ID
    nonce && (element.nonce = nonce)
  }

  return element
}

/**
 * Creates an injector which collects style rules during server-side rendering.
 */
export const virtualInjector = ({ target = [] }: InjectorConfig<string[]> = {}): Injector<
  string[]
> => ({
  target,
  insert: (rule, index) => target.splice(index, 0, rule),
  // delete: (index) => target.splice(index, 1),
})

/**
 * Creates an injector which inserts style rules through the CSS Object Model.
 */
export const cssomInjector = ({
  nonce,
  target = getStyleElement(nonce).sheet as CSSStyleSheet,
}: InjectorConfig<CSSStyleSheet> = {}): Injector<CSSStyleSheet> => ({
  target,
  insert: target.insertRule.bind(target),
  // delete: target.deleteRule.bind(target),
})

/**
 * An injector placeholder which performs no operations. Useful for avoiding errors in a non-browser environment.
 */
export const noOpInjector = (): Injector<null> => ({
  target: null,
  insert: () => {
    /* No-Op */
  },
  // delete: () => {
  //   /* No-Op */
  // },
})
