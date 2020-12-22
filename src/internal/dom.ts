export const STYLE_ELEMENT_ID = '__twind' as const

declare global {
  interface Window {
    [STYLE_ELEMENT_ID]?: HTMLStyleElement
  }
}

export const getStyleElement = (nonce?: string): HTMLStyleElement => {
  // Hydrate existing style element if available
  // self[id] - every element with an id is available through the global object
  // eslint-disable-next-line no-restricted-globals
  let element = self[STYLE_ELEMENT_ID]

  if (!element) {
    // Create a new one otherwise
    element = document.head.appendChild(document.createElement('style'))

    element.id = STYLE_ELEMENT_ID
    nonce && (element.nonce = nonce)

    // Avoid Edge bug where empty style elements doesn't create sheets
    element.appendChild(document.createTextNode(''))
  }

  return element
}
