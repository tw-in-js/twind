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

function createRule(active: string[], current: ParsedRule[][]): void {
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

      current[0].push({ n: name, v: variants, i: important })
    }
  }
}

// Remove comments (multiline and single line)
export function removeComments(tokens: string): string {
  return tokens.replace(/\/\*[^]*?\*\/|\/\/[^]*?$|\s\s+|\n/gm, ' ')
}

// (?=[ ,)(:[]|$)
const parts = /([ ,)])|\(|[^ ,)(:[]*(?:\[[^ ]+])?:*/g

const cache = new Map<string, ParsedRule[]>()

export function parse(token: string): ParsedRule[] {
  let parsed = cache.get(token)

  if (!parsed) {
    token = removeComments(token)

    // Stack of active groupings (`(`), variants, or nested (`~` or `@`)
    const active: string[] = []

    // Stack of current rule list to put new rules in
    // the first `0` element is the current list
    const current: ParsedRule[][] = [[]]

    let match: RegExpExecArray | null
    parts.lastIndex = 0
    while ((match = parts.exec(token)) && match[0]) {
      if (match[1]) {
        // whitespace, comma or closing brace
        // create rule
        createRule(active, current)

        let lastGroup = active.lastIndexOf('(')

        if (match[1] == ')') {
          // Close nested block
          const nested = active[lastGroup - 1]

          if (/[~@]$/.test(nested)) {
            const rules = current.shift() as ParsedRule[]

            active.length = lastGroup

            // remove variants that are already applied through active
            createRule([...active, '#'], current)
            const { length } = (current[0].pop() as ParsedRule).v
            for (const rule of rules) {
              rule.v.splice(0, length)
            }

            createRule(
              [
                ...active,
                define(
                  // named nested
                  nested.length > 1
                    ? nested.slice(0, -1) + hash(JSON.stringify([nested, rules]))
                    : nested + '(' + format(rules, ',') + ')',
                  Layer.s,
                  rules,
                  /@$/.test(nested),
                ),
              ],
              current,
            )
          }

          lastGroup = active.lastIndexOf('(', lastGroup - 1)
        }

        active.length = lastGroup + 1
      } else {
        // - open brace
        // - new variant: `focus:`, `after::`, `[...]:`
        // - new rule

        // Start nested block
        // ~(...) or button~(...)
        // @(...) or button@(...)
        if (/[~@]$/.test(match[0])) {
          current.unshift([])
        }

        active.push(match[0])
      }
    }

    // Consume remaining stack
    createRule(active, current)

    cache.set(token, (parsed = current[0]))
  }

  return parsed
}
