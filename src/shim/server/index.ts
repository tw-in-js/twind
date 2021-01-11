/* eslint-env node */
// ^^^^ This comment is need to prevent browser bundles of this file

import type { Node, HTMLElement } from 'node-html-parser'
import * as HTMLParser from 'node-html-parser'

import { tw as defaultTW } from '../../index'

export { virtualSheet, getStyleTag, getStyleTagProperties } from '../../sheets/index'

const isElementNode = (node: Node): node is HTMLElement =>
  node && node.nodeType === HTMLParser.NodeType.ELEMENT_NODE

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
