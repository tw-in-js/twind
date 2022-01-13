import type { Sheet } from './types'

function createStyleElement(parent: Element = document.head): HTMLStyleElement {
  // Find existing or create a new one
  const element =
    (parent.querySelector('#tw') as HTMLStyleElement) || document.createElement('style')

  // mark as twind stylesheet
  element.id = 'tw'

  parent.append(element)

  return element
}

export function cssom(sheet?: CSSStyleSheet): Sheet<CSSStyleSheet> {
  let offset = sheet?.cssRules.length || 0

  return {
    get target(): CSSStyleSheet {
      if (!sheet) {
        sheet = createStyleElement().sheet as CSSStyleSheet
        offset = 0
      }

      return sheet
    },

    clear() {
      // remove all added rules
      if (sheet) {
        while (sheet.cssRules.length > offset) {
          sheet.deleteRule(offset)
        }
      }
    },

    destroy() {
      if (offset) {
        this.clear()
      } else {
        sheet?.ownerNode?.remove()
      }
    },

    insert(css, index) {
      try {
        // Insert
        this.target.insertRule(css, offset + index)
      } catch (error) {
        // Empty rule to keep index valid
        this.target.insertRule('*{}', offset + index)

        // Some thrown errors are because of specific pseudo classes
        // lets filter them to prevent unnecessary warnings
        // ::-moz-focus-inner
        // :-moz-focusring
        if (!/:-[mwo]/.test(css)) {
          // TODO log css
          console.warn(error)
        }
      }
    },
  }
}

export function dom(element?: HTMLStyleElement): Sheet<HTMLStyleElement> {
  let offset = element?.childNodes.length || 0

  return {
    get target(): HTMLStyleElement {
      if (!element) {
        element = createStyleElement()
        offset = 0
      }

      return element
    },

    clear() {
      // remove all added nodes
      if (element) {
        while (element.childNodes.length > offset) {
          element.removeChild(element.lastChild as Node)
        }
      }
    },

    destroy() {
      if (offset) {
        this.clear()
      } else {
        element?.remove()
      }
    },

    insert(css, index) {
      this.target.insertBefore(
        document.createTextNode(css),
        this.target.childNodes[offset + index] || null,
      )
    },
  }
}

export function virtual(target: string[] = []): Sheet<string[]> {
  const offset = target.length

  return {
    target,

    clear() {
      target.length = offset
    },

    destroy() {
      this.clear()
    },

    insert(css, index) {
      target.splice(offset + index, 0, css)
    },
  }
}
