import { DEV } from 'distilt/env'

import { hash } from '../utils'
import { define } from './define'
import { format } from './format'
import { Layer } from './precedence'

export interface ParsedRule {
  /**
   * The utility name including `-` if set, but without `!` and variants
   */
  readonly n: string

  /**
   * All variants without trailing colon: `hover`, `after:`, `[...]`
   */
  readonly v: string[]

  /**
   * Something like `!underline` or `!bg-red-500` or `!red-500`
   */
  readonly i?: boolean
}

export interface ParsedDevRule extends ParsedRule {
  readonly a: string[]
  readonly l: [start: number, end: number]
}

function createRule(
  active: string[],
  current: ParsedRule[][],
  loc?: ParsedDevRule['l'] | false,
): void {
  if (active[active.length - 1] != '(') {
    const variants: string[] = []
    let important = false
    let negated = false
    let name = ''

    for (let value of active) {
      if (value == '(' || /[~@]$/.test(value)) continue

      if (value[0] == '!') {
        value = value.slice(1)
        important = !important
      }

      if (value.endsWith(':')) {
        variants[value == 'dark:' ? 'unshift' : 'push'](value.slice(0, -1))
        continue
      }

      if (value[0] == '-') {
        value = value.slice(1)
        negated = !negated
      }

      if (value.endsWith('-')) {
        value = value.slice(0, -1)
      }

      if (value && value != '&') {
        name += (name && '-') + value
      }
    }

    if (name) {
      if (negated) name = '-' + name

      current[0].push(
        DEV
          ? Object.defineProperties(
              { n: name, v: variants.filter(uniq), i: important },
              {
                a: { value: [...active] },
                l: { value: loc },
              },
            )
          : { n: name, v: variants.filter(uniq), i: important },
      )
    }
  }
}

function uniq<T>(value: T, index: number, values: T[]): boolean {
  return values.indexOf(value) == index
}

const cache = new Map<string, ParsedRule[]>()

export function parse(token: string): ParsedRule[] {
  let parsed = cache.get(token)

  if (!parsed) {
    // Stack of active groupings (`(`), variants, or nested (`~` or `@`)
    const active: string[] = []

    // Stack of current rule list to put new rules in
    // the first `0` element is the current list
    const current: ParsedRule[][] = [[]]

    let startIndex = 0
    let skip = 0
    let comment: RegExp | null = null
    let position = 0

    // eslint-disable-next-line no-inner-declarations
    const commit = (isRule?: boolean, endOffset = 0) => {
      if (startIndex != position) {
        active.push(token.slice(startIndex, position + endOffset))

        if (isRule) {
          createRule(active, current, DEV && [startIndex, position + endOffset])
        }
      }
      startIndex = position + 1
    }

    for (; position < token.length; position++) {
      const char = token[position]

      if (skip) {
        // within [...]
        // skip over until not skipping
        // ignore escaped chars
        if (token[position - 1] != '\\') {
          skip += +(char == '[') || -(char == ']')
        }
      } else if (char == '[') {
        // start to skip
        skip += 1
      } else if (comment) {
        if (token[position - 1] != '\\' && comment.test(token.slice(position))) {
          comment = null
          startIndex = position + RegExp.lastMatch.length
        }
      } else if (
        char == '/' &&
        token[position - 1] != '\\' &&
        (token[position + 1] == '*' || token[position + 1] == '/')
      ) {
        // multiline or single line comment
        comment = token[position + 1] == '*' ? /^\*\// : /^[\r\n]/
      } else if (char == '(') {
        // hover:(...) or utilitity-(...)
        commit()
        active.push(char)
      } else if (char == ':') {
        // hover: or after::
        if (token[position + 1] != ':') {
          commit(false, 1)
        }
      } else if (/[\s,)]/.test(char)) {
        // whitespace, comma or closing brace
        commit(true)

        let lastGroup = active.lastIndexOf('(')

        if (char == ')') {
          // Close nested block
          const nested = active[lastGroup - 1]

          if (/[~@]$/.test(nested)) {
            const rules = current.shift() as ParsedRule[]

            active.length = lastGroup

            // remove variants that are already applied through active
            createRule([...active, '#'], current, DEV && [startIndex, position])
            const { v } = current[0].pop() as ParsedRule

            for (const rule of rules) {
              // if a rule has dark we need to splice after the first entry eg dark
              rule.v.splice(+(rule.v[0] == 'dark') - +(v[0] == 'dark'), v.length)
            }

            createRule(
              [
                ...active,
                define(
                  // named nested
                  nested.length > 1
                    ? nested.slice(0, -1) + hash(JSON.stringify([nested, rules]))
                    : nested + '(' + format(rules) + ')',
                  Layer.s,
                  rules,
                  /@$/.test(nested),
                ),
              ],
              current,
              DEV && [startIndex, position],
            )
          }

          lastGroup = active.lastIndexOf('(', lastGroup - 1)
        }

        active.length = lastGroup + 1
      } else if (/[~@]/.test(char) && token[position + 1] == '(') {
        // start nested block
        // ~(...) or button~(...)
        // @(...) or button@(...)
        current.unshift([])
      }
    }

    // Consume remaining stack
    commit(true)

    cache.set(token, (parsed = current[0]))
  }

  return parsed
}
