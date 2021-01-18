/* eslint-env node */
// ^^^^ This comment is need to prevent browser bundles of this file

/**
 * [[include:src/shim/server/README.md]]
 *
 * @packageDocumentation
 * @module twind/shim/server
 */

import type { TW } from '../../types'
import type { Node, HTMLElement, Options as HTMLParserOptions } from 'node-html-parser'
import * as HTMLParser from 'node-html-parser'

import { tw as defaultTW } from '../../index'

/**
 * Options for {@link shim}.
 */
export interface ShimOptions extends Partial<HTMLParserOptions> {
  /**
   * Custom {@link twind.tw | tw} instance to use (default: {@link twind.tw}).
   */
  tw?: TW
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

/**
 * Shim the passed html.
 *
 * 1. parse the markup and process element classes with either the
 *    {@link twind.tw | default/global tw} instance or a {@link ShimOptions.tw | custom} instance
 * 2. populate the provided sheet with the generated rules
 * 3. output the HTML markup with the final element classes

 * @param markup the html to shim
 * @param options to use
 * @return the HTML markup with the final element classes
 */
export const shim = (markup: string, options: TW | ShimOptions = {}): string => {
  const { tw = defaultTW, ...parserOptions } =
    typeof options === 'function' ? { tw: options } : options

  const root = HTMLParser.parse(markup, parserOptions)

  // Traverse tree to find all element with classNames
  for (const node of traverse(root)) {
    node.setAttribute('class', tw(node.getAttribute('class')))
  }

  return root.toString()
}
