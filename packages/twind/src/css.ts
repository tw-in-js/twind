import type { CSSObject, CSSValue } from './types'

import { register } from './internal/registry'
import { serialize } from './internal/serialize'
import { hash } from './utils'
import { Layer } from './internal/precedence'
import { merge } from './internal/merge'
import { astish } from './internal/astish'

/**
 * @group Class Name Generators
 * @param strings
 * @param interpolations
 */
export function css(strings: TemplateStringsArray, ...interpolations: readonly CSSValue[]): string

export function css(style: CSSObject | string): string

export function css(
  strings: CSSObject | string | TemplateStringsArray,
  ...interpolations: readonly CSSValue[]
): string {
  const ast = astish(strings, interpolations)

  const className = (ast.find((o) => o.label)?.label || 'css') + hash(JSON.stringify(ast))

  return register(className, (rule, context) =>
    merge(
      ast.flatMap((css) => serialize(css, rule, context, Layer.o)),
      className,
    ),
  )
}
