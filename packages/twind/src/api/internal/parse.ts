import { hash } from '../utils'
import { define } from './define'
import { Layer } from './precedence'

export interface SingleParsedRule {
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

export type ParsedRule = SingleParsedRule | ParsedRule[]

function createRule(active: string[], current: ParsedRule[][]): void {
  if (active[active.length - 1] != '(') {
    const variants: string[] = []
    let important = false
    let negated = false
    let name = ''

    for (let value of active) {
      if (value == '(' || value.endsWith('~')) continue

      if (value[0] == '!') {
        value = value.slice(1)
        important = !important
      }

      if (value.endsWith(':')) {
        variants.push(value.slice(0, -1))
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

    // Stack of active groupings (`(`), variants, or nested (`~`)
    const active: string[] = []

    // Stack of current rule list to put new rules in
    // the first `0` element is the current list
    const current: ParsedRule[][] = [[]]

    let rule: ParsedRule
    let match: RegExpExecArray | null
    parts.lastIndex = 0
    while ((match = parts.exec(token)) && match[0]) {
      if (match[1]) {
        // whitespace, comma or closing brace
        // create rule
        createRule(active, current)

        let lastGroup = active.lastIndexOf('(')
        let shortcut: string | undefined
        let rules: ParsedRule[] | undefined

        if (match[1] == ')') {
          // Close nested block
          shortcut = active[lastGroup - 1]

          if (shortcut?.endsWith('~')) {
            rules = current.shift()
          }

          lastGroup = active.lastIndexOf('(', lastGroup - 1)
        }

        active.length = lastGroup + 1

        if (rules && shortcut != '~') {
          // Create named shortcut

          // remove existing anonymous shortcut
          current[0].pop()

          // ... and replace with new named shortcut
          createRule(
            [
              ...active,
              define(
                (shortcut as string).slice(0, -1) + hash(JSON.stringify(rules)),
                Layer.s,
                rules,
              ),
            ],
            current,
          )
        }
      } else {
        // - open brace
        // - new variant: `focus:`, `after::`, `[...]:`
        // - new rule

        // Start nested block
        // ~(...) or button~(...)
        if (match[0].endsWith('~')) {
          rule = []
          current[0].push(rule)
          current.unshift(rule)
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
