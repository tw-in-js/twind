/**
 * [[include:src/sheets/README.md]]
 *
 * @packageDocumentation
 * @module twind/sheets
 */

import type { SheetConfig, Sheet, SheetInit, SheetInitCallback } from '../types'
import { getStyleElement, STYLE_ELEMENT_ID } from '../internal/dom'

/**
 * Creates an sheet which inserts style rules through the Document Object Model.
 */
export const domSheet = ({
  nonce,
  target = getStyleElement(nonce),
}: SheetConfig<HTMLStyleElement> = {}): Sheet<HTMLStyleElement> => {
  const offset = target.childNodes.length

  return {
    target,
    insert: (rule, index) =>
      target.insertBefore(document.createTextNode(rule), target.childNodes[offset + index]),
  }
}

/**
 * Allows to reset and snaphot the current state of an sheet and
 * in extension the internal mutable state (caches, ...) of `tw`.
 */
export interface Storage {
  /**
   * Register a function that should be called to create a new state.
   */
  init: SheetInit

  /**
   * Creates a snapshot of the current state, invokes all init callbacks to create a fresh state
   * and returns the snaphot.
   */
  reset: (snapshot?: unknown[] | undefined) => unknown[]
}

const createStorage = (): Storage => {
  const callbacks: SheetInitCallback[] = []
  let state: unknown[] = []

  const invoke = <T>(callback: SheetInitCallback<T>, index: number): T =>
    (state[index] = callback(state[index] as T))

  return {
    init: (callback) => invoke(callback, callbacks.push(callback as SheetInitCallback) - 1),
    reset: (snapshot = []) => {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;[snapshot, state] = [state, snapshot]
      callbacks.forEach(invoke)
      return snapshot
    },
  }
}

/**
 * A sheet that collects styles into an array.
 */
export interface VirtualSheet extends Sheet<string[]>, Storage {
  init: SheetInit
}

/**
 * Creates an sheet which collects style rules into an array.
 */
export const virtualSheet = (): VirtualSheet => {
  const storage = createStorage()

  let target: string[]
  storage.init<string[]>((value = []) => (target = value))

  return {
    ...storage,
    get target() {
      return [...target]
    },
    insert: (rule, index) => target.splice(index, 0, rule),
  }
}

export interface StyleTagProperties {
  id: string
  textContent: string
}

export interface HasTarget {
  readonly target: readonly string[]
}

export type StyleTagSheet = HasTarget | readonly string[]

/**
 * Transforms css rules into `<style>` tag properties.
 */
export const getStyleTagProperties = (sheet: StyleTagSheet): StyleTagProperties => ({
  id: STYLE_ELEMENT_ID,
  textContent: (Array.isArray(sheet) ? sheet : (sheet as HasTarget).target).join(''),
})

/**
 * Transforms css rules into a `<style>` tag string.
 */
export const getStyleTag = (sheet: StyleTagSheet, attributes?: Record<string, string>): string => {
  const { id, textContent } = getStyleTagProperties(sheet)

  attributes = { ...attributes, id }

  return `<style${Object.keys(attributes).reduce(
    (attrs, key) =>
      `${attrs} ${key}=${JSON.stringify((attributes as Record<string, string>)[key])}`,
    '',
  )}>${textContent}</style>`
}
