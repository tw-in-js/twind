export interface ClipboardCopyOptions {
  /**
   * ID of element that is to copy
   */
  for?: string

  /**
   * Text to copy
   */
  value?: string

  /**
   * Attribute name that is updated to `success` or `error` after copy (default: `data-clipboard-copy`).
   */
  status?: string

  /**
   * Milliseconds after which the status is reseted.
   */
  revert?: number
}

// Based on https://github.com/github/clipboard-copy-element/blob/main/src/clipboard-copy-element.ts
export default function clipboardCopy(node: Element, options: ClipboardCopyOptions = {}) {
  let alive = true
  let statusTimerRef: ReturnType<typeof setTimeout>

  if (!node.hasAttribute('tabindex')) {
    node.setAttribute('tabindex', '0')
  }

  if (!node.hasAttribute('role')) {
    node.setAttribute('role', 'button')
  }

  node.addEventListener('click', copy)
  ;(node as HTMLElement).addEventListener('keydown', keydown)

  return {
    update(newOptions: ClipboardCopyOptions = {}) {
      options = newOptions
    },
    destroy() {
      alive = false
      clearTimeout(statusTimerRef)
      node.removeEventListener('click', copy)
      ;(node as HTMLElement).removeEventListener('keydown', keydown)
    },
  }

  function copy() {
    const id = options.for || node.getAttribute('for')
    const content = id ? node.ownerDocument.getElementById(id) : node

    const text =
      options.value ||
      (content instanceof HTMLInputElement || content instanceof HTMLTextAreaElement
        ? content.value
        : content instanceof HTMLAnchorElement && content.hasAttribute('href')
        ? content.href
        : content?.hasAttribute('value')
        ? content.getAttribute('value')
        : content?.textContent)

    if ('clipboard' in navigator) {
      navigator.clipboard.writeText(text || '').then(
        () => setStatus('success'),
        () => setStatus('error'),
      )
    } else {
      setStatus('error')
    }
  }

  function setStatus(status: 'success' | 'error') {
    if (alive) {
      const attribute = options.status || 'data-clipboard-copy'
      node.setAttribute(attribute, status)

      // reset after a few seconds
      clearTimeout(statusTimerRef)
      statusTimerRef = setTimeout(() => node.setAttribute(attribute, ''), options.revert || 2500)

      // notify listeners
      node.dispatchEvent(new CustomEvent('clipboard-copy', { bubbles: true }))
    }
  }

  function keydown(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      copy()
    }
  }
}
