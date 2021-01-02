// Based on https://github.com/kripod/otion/blob/main/packages/otion/src/injectors.ts
// License MIT
import type { SheetConfig, Sheet } from '../types'
import { noop } from './util'
import { getStyleElement } from '../internal/dom'

/**
 * Creates an sheet which inserts style rules through the CSS Object Model.
 */
export const cssomSheet = ({
  nonce,
  target = getStyleElement(nonce).sheet as CSSStyleSheet,
}: SheetConfig<CSSStyleSheet> = {}): Sheet<CSSStyleSheet> => {
  const offset = target.cssRules.length

  return {
    target,
    insert: (rule, index) => target.insertRule(rule, offset + index),
  }
}

/**
 * An sheet placeholder which performs no operations. Useful for avoiding errors in a non-browser environment.
 */
export const voidSheet = (): Sheet<null> => ({
  target: null,
  insert: noop,
})
