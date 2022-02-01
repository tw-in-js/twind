import type { Sheet, SheetRule } from './types'
import { asArray, noop } from './utils'

function getStyleElement(element?: Element | null | false): HTMLStyleElement {
  let style = element || document.querySelector('style[data-twind]')

  if (!style || style.tagName != 'STYLE') {
    style = document.createElement('style')
    ;(style as HTMLElement).dataset.twind = ''
    document.head.prepend(style)
  }

  return style as HTMLStyleElement
}

export function cssom(element?: CSSStyleSheet | Element | null | false): Sheet<CSSStyleSheet> {
  const target = (element as CSSStyleSheet)?.cssRules
    ? (element as CSSStyleSheet)
    : (getStyleElement(element as Element | null | false).sheet as CSSStyleSheet)

  return {
    target,

    clear() {
      // remove all added rules
      for (let index = target.cssRules.length; index--; ) {
        target.deleteRule(index)
      }
    },

    destroy() {
      target.ownerNode?.remove()
    },

    insert(css, index) {
      try {
        // Insert
        target.insertRule(css, index)
      } catch (error) {
        // Empty rule to keep index valid — not using `*{}` as that would show up in all rules (DX)
        target.insertRule(':root{}', index)

        // Some thrown errors are because of specific pseudo classes
        // lets filter them to prevent unnecessary warnings
        // ::-moz-focus-inner
        // :-moz-focusring
        if (!/:-[mwo]/.test(css)) {
          console.warn(error, css)
        }
      }
    },

    resume: noop,
  }
}

export function dom(element?: Element | null | false): Sheet<HTMLStyleElement> {
  const target = getStyleElement(element)

  return {
    target,

    clear() {
      target.innerHTML = ''
    },

    destroy() {
      target.remove()
    },

    insert(css, index) {
      target.insertBefore(document.createTextNode(css), target.childNodes[index] || null)
    },

    resume: noop,
  }
}

export function virtual(includeResumeData?: boolean): Sheet<string[]> {
  const target: string[] = []
  const rules: SheetRule[] = []
  return {
    get target() {
      return includeResumeData
        ? target.map((css, index) => {
            const rule = rules[index]
            const p = rule.p - (rules[index - 1]?.p || 0)
            return `/*!${p.toString(36)},${(rule.o * 2).toString(36)}${
              rule.n ? ',' + rule.n : ''
            }*/${css}`
          })
        : target
    },

    clear() {
      target.length = 0
    },

    destroy() {
      this.clear()
    },

    insert(css, index, rule) {
      target.splice(index, 0, css)
      rules.splice(index, 0, rule)
    },

    resume: noop,
  }
}

/**
 * Returns a sheet useable in the current environment.
 *
 * @param useDOMSheet usually something like `process.env.NODE_ENV != 'production'` (default: browser={@link cssom}, server={@link virtual})
 * @param disableResume to not include or use resume data
 * @returns a sheet to use
 */
export function getSheet(
  useDOMSheet?: boolean,
  disableResume?: boolean,
): Sheet<string[] | HTMLStyleElement | CSSStyleSheet> {
  const sheet =
    typeof document == 'undefined' ? virtual(!disableResume) : useDOMSheet ? dom() : cssom()

  if (!disableResume) sheet.resume = resume

  return sheet
}

export function stringify(target: unknown): string {
  // string[] | CSSStyleSheet | HTMLStyleElement
  return (
    // prefer the raw test content of a CSSStyleSheet as it may include the resume data
    ((target as CSSStyleSheet).ownerNode || (target as HTMLStyleElement))?.textContent ||
    ((target as CSSStyleSheet).cssRules
      ? Array.from((target as CSSStyleSheet).cssRules, (rule) => rule.cssText)
      : asArray(target)
    ).join('')
  )
}

function resume(
  this: Sheet,
  addClassName: (className: string) => void,
  insert: (rule: SheetRule, cssText: string) => void,
) {
  // hydration from SSR sheet
  const textContent = stringify(this.target)
  const RE = /\/\*!([\da-z]+),([\da-z]+)(?:,(.+?))?\*\//g

  // only if this is a hydratable sheet
  if (RE.test(textContent)) {
    // RE has global flag — reset index to get the first match as well
    RE.lastIndex = 0

    // 1. start with a fresh sheet
    this.clear()

    // 2. add all existing class attributes to the token/className cache
    if (typeof document != 'undefined') {
      for (const el of document.querySelectorAll('[class]')) {
        addClassName(el.getAttribute('class') as string)
      }
    }

    // 3. parse SSR styles
    let lastMatch: RegExpExecArray | null | undefined
    let lastPrecedence = 0

    while (
      (function commit(match?: RegExpExecArray | null) {
        if (lastMatch) {
          insert(
            {
              p: (lastPrecedence += parseInt(lastMatch[1], 36)),
              o: parseInt(lastMatch[2], 36) / 2,
              n: lastMatch[3] ?? undefined,
            },
            // grep the cssText from the previous match end up to this match start
            textContent.slice(lastMatch.index + lastMatch[0].length, match?.index),
          )
        }

        return (lastMatch = match)
      })(RE.exec(textContent))
    ) {
      /* no-op */
    }
  }
}
