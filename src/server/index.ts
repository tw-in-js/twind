/* eslint-env node */
// ^^^^ This comment is need to prevent browser bundles of this file

import { executionAsyncId, createHook } from 'async_hooks'

import type { Node, HTMLElement } from 'node-html-parser'
import * as HTMLParser from 'node-html-parser'

import type { Sheet, SheetInit } from '../types'
import { tw as defaultTW } from '../index'
import { virtualSheet } from '../sheets'

export type { Storage, StyleTagProperties, StyleTagSheet, VirtualSheet } from '../sheets'
export { virtualSheet, getStyleTag, getStyleTagProperties } from '../sheets'

export interface AsyncVirtualSheet extends Sheet {
  readonly target: readonly string[]
  init: SheetInit
  reset: () => void
  enable: () => void
  disable: () => void
}

interface Snapshot {
  state: unknown[] | undefined
}

export const asyncVirtualSheet = (): AsyncVirtualSheet => {
  const sheet = virtualSheet()
  const initial = sheet.reset()

  const store = new Map<number, Snapshot>()

  const asyncHook = createHook({
    init(asyncId, type, triggerAsyncId) {
      const snapshot = store.get(triggerAsyncId)

      if (snapshot) {
        store.set(asyncId, snapshot)
      }
    },

    before(asyncId) {
      const snapshot = store.get(asyncId)

      if (snapshot) {
        sheet.reset(snapshot.state)
      }
    },

    after(asyncId) {
      const snapshot = store.get(asyncId)

      if (snapshot) {
        snapshot.state = sheet.reset(initial)
      }
    },

    destroy(asyncId) {
      store.delete(asyncId)
    },
  }).enable()

  return {
    get target() {
      return sheet.target
    },
    insert: sheet.insert,
    init: sheet.init,
    reset: () => {
      const asyncId = executionAsyncId()

      const snapshot = store.get(asyncId)

      if (snapshot) {
        snapshot.state = undefined
      } else {
        store.set(asyncId, { state: undefined })
      }

      sheet.reset()
    },
    enable: () => asyncHook.enable(),
    disable: () => asyncHook.disable(),
  }
}

function isElementNode(node: Node): node is HTMLElement {
  return node && node.nodeType === HTMLParser.NodeType.ELEMENT_NODE
}

function* traverse(node: Node): IterableIterator<HTMLElement> {
  if (isElementNode(node) && node.getAttribute('class')) {
    yield node
  }

  for (const childNode of node.childNodes) {
    yield* traverse(childNode)
  }
}

export const shim = (html: string, tw = defaultTW): string => {
  const root = HTMLParser.parse(html)

  // Traverse tree to find all element with classNames
  for (const node of traverse(root)) {
    node.setAttribute('class', tw(node.getAttribute('class')))
  }

  return root.toString()
}
