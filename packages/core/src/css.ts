import type { CSSObject, Falsey } from './types'

import { register } from './internal/registry'
import { serialize } from './internal/serialize'
import { hash } from './utils'
import { Layer } from './internal/precedence'
import { interleave } from './internal/interleave'
import { removeComments } from './internal/parse'

export type CSSValue = string | number | Falsey

export function css(strings: TemplateStringsArray, ...interpolations: readonly CSSValue[]): string

export function css(style: CSSObject | string): string

export function css(
  strings: CSSObject | string | TemplateStringsArray,
  ...interpolations: readonly CSSValue[]
): string {
  const { label = 'css', ...ast } = Array.isArray(strings)
    ? astish(
        interleave(strings as TemplateStringsArray, interpolations, (interpolation) =>
          typeof interpolation == 'string' || typeof interpolation == 'number'
            ? (interpolation as unknown as string)
            : '',
        ),
      )
    : typeof strings == 'string'
    ? astish(strings)
    : (strings as CSSObject)

  const className = label + hash(JSON.stringify(ast))

  return register(className, (rule, context) => serialize(ast, rule, context, Layer.o))
}

// Based on https://github.com/cristianbote/goober/blob/master/src/core/astish.js
const newRule = / *(?:(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}))/g

/**
 * Convert a css style string into a object
 */
function astish(css: string): CSSObject {
  css = removeComments(css)

  const tree: CSSObject[] = [{}]
  let block: RegExpExecArray | null

  while ((block = newRule.exec(css))) {
    // Remove the current entry
    if (block[4]) tree.shift()

    if (block[3]) {
      tree.unshift((tree[0][block[3]] = (tree[0][block[3]] as CSSObject) || {}))
    } else if (!block[4]) {
      tree[0][block[1]] = block[2]
    }
  }

  return tree[0]
}
