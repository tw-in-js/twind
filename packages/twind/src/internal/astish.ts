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

  const rules: CSSObject[] = []
  const tree: string[] = []
  let block: RegExpExecArray | null

  while ((block = newRule.exec(css))) {
    // Remove the current entry
    if (block[4]) tree.pop()

    if (block[3]) {
      // new nested
      tree.push(block[3])
    } else if (!block[4]) {
      rules.push(
        tree.reduceRight((css, block) => ({ [block]: css }), {
          [block[1]]: block[2],
        } as CSSObject),
      )
    }
  }

  return rules
}
