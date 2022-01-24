import type { CSSObject, Falsey } from './types'

import { register } from './internal/registry'
import { serialize } from './internal/serialize'
import { hash } from './utils'
import { Layer } from './internal/precedence'
import { interleave } from './internal/interleave'
import { removeComments } from './internal/parse'
import { merge } from './internal/merge'

export type CSSValue = string | number | bigint | Falsey

export function css(strings: TemplateStringsArray, ...interpolations: readonly CSSValue[]): string

export function css(style: CSSObject | string): string

export function css(
  strings: CSSObject | string | TemplateStringsArray,
  ...interpolations: readonly CSSValue[]
): string {
  const ast = Array.isArray(strings)
    ? astish(
        interleave(strings as TemplateStringsArray, interpolations, (interpolation) =>
          interpolation != null && typeof interpolation != 'boolean'
            ? (interpolation as unknown as string)
            : '',
        ),
      )
    : typeof strings == 'string'
    ? astish(strings)
    : [strings as CSSObject]

  const className = (ast.find((o) => o.label)?.label || 'css') + hash(JSON.stringify(ast))

  return register(className, (rule, context) =>
    merge(
      ast.flatMap((css) => serialize(css, rule, context, Layer.o)),
      className,
    ),
  )
}

// Based on https://github.com/cristianbote/goober/blob/master/src/core/astish.js
const newRule = / *(?:(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}))/g

/**
 * Convert a css style string into a object
 */
function astish(css: string): CSSObject[] {
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
