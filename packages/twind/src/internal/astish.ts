import type { CSSObject, CSSValue } from '../types'
import { interleave } from './interleave'
import { removeComments } from './parse'

export function astish(
  strings: CSSObject | string | TemplateStringsArray,
  interpolations: readonly CSSValue[],
): CSSObject[] {
  return Array.isArray(strings)
    ? astish$(
        interleave(strings as TemplateStringsArray, interpolations, (interpolation) =>
          interpolation != null && typeof interpolation != 'boolean'
            ? (interpolation as unknown as string)
            : '',
        ),
      )
    : typeof strings == 'string'
    ? astish$(strings)
    : [strings as CSSObject]
}

// Based on https://github.com/cristianbote/goober/blob/master/src/core/astish.js
const newRule = / *(?:(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}))/g

/**
 * Convert a css style string into a object
 */
function astish$(css: string): CSSObject[] {
  css = removeComments(css)

  const tree: CSSObject[] = [{}]
  const rules: CSSObject[] = [tree[0]]
  const conditions: string[] = []
  let block: RegExpExecArray | null

  while ((block = newRule.exec(css))) {
    // Remove the current entry
    if (block[4]) {
      tree.shift()
      conditions.shift()
    }

    if (block[3]) {
      // new nested
      conditions.unshift(block[3])
      tree.unshift({})
      rules.push(conditions.reduce((body, condition) => ({ [condition]: body }), tree[0]))
    } else if (!block[4]) {
      // if we already have that property — start a new CSSObject
      if (tree[0][block[1]]) {
        tree.unshift({})
        rules.push(conditions.reduce((body, condition) => ({ [condition]: body }), tree[0]))
      }
      tree[0][block[1]] = block[2]
    }
  }

  // console.log(rules)
  return rules
}
