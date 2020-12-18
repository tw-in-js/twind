import type { TW } from '../types'
import { tw as defaultTW } from '../index'

export interface ShimOptions {
  target?: HTMLElement
  attributes?: string[]
  tw?: TW
}

interface NodeList {
  readonly length: number

  [index: number]: Node
}

interface MutationRecord {
  readonly addedNodes: NodeList
  readonly target?: Node
}

export const shim = ({
  target = document.documentElement,
  attributes = ['tw', 'data-tw'],
  tw = defaultTW,
}: ShimOptions = {}): MutationObserver => {
  const classNamesCache = new WeakMap<Node, string[]>()

  const update = (node: Node) => {
    const { classList, getAttribute } = node as Element

    if (classList && getAttribute) {
      const tokens = attributes.map(getAttribute.bind(node)).filter(Boolean)

      const oldClassNames = classNamesCache.get(node) || []
      const newClassNames = tokens.length ? tw(tokens).split(' ') : []

      oldClassNames.forEach(
        (className) => !newClassNames.includes(className) && classList.remove(className),
      )

      newClassNames.forEach(
        (className) => !oldClassNames.includes(className) && classList.add(className),
      )

      if (newClassNames.length) {
        classNamesCache.set(node, newClassNames)
      } else if (oldClassNames.length) {
        classNamesCache.delete(node)
      }
    }
  }

  const handleMutations = (mutations: MutationRecord[]): void =>
    mutations.forEach(({ target, addedNodes }) => {
      target && update(target)

      for (let index = addedNodes.length; index--; ) {
        const node = addedNodes[index]

        handleMutations([
          {
            target: node,
            addedNodes: (node as Element).children || [],
          },
        ])
      }
    })

  handleMutations([{ target, addedNodes: [target] }])

  const observer = new MutationObserver(handleMutations)

  observer.observe(target, {
    attributes: true,
    attributeFilter: attributes,
    subtree: true,
    childList: true,
  })

  return observer
}
