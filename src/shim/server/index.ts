/* eslint-env node */
// ^^^^ This comment is need to prevent browser bundles of this file

import type { Node, HTMLElement, Options as HTMLParserOptions } from 'node-html-parser'
import * as HTMLParser from 'node-html-parser'

import { tw as defaultTW } from '../../index'

export interface HTMLParserArgs {
  html: string
  options: HTMLParserOptions
}

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

export const shim = (markup: string | HTMLParserArgs, tw = defaultTW): string => {
  const root = HTMLParser.parse(
    typeof markup === 'string' ? markup : markup.html,
    typeof markup === 'object' ? markup.options : undefined,
  )

  // Traverse tree to find all element with classNames
  for (const node of traverse(root)) {
    node.setAttribute('class', tw(node.getAttribute('class')))
  }

  return root.toString()
}
