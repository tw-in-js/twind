import type { ParsedRule } from '../types'

function createRule(active: string[], current: ParsedRule[][]): void {
  if (active[active.length - 1] != '{') {
    const variants: string[] = []
    let important = false
    let negated = false
    let name = ''

    for (let value of active) {
      if (value == '{' || value == '~') continue

      if (value[0] == '!') {
        value = value.slice(1)
        important = !important
      }

      if (value[value.length - 1] == ':') {
        variants.push(value.slice(0, -1))
        continue
      }

      if (value[0] == '-') {
        value = value.slice(1)
        negated = !negated
      }

      if (value[value.length - 1] == '-') {
        value = value.slice(0, -1)
      }

      if (value && value != '&') {
        name += (name && '-') + value
      }
    }

    if (name) {
      if (negated) name = '-' + name

      current[0].push({ name, variants, important })
    }
  }
}

// Remove comments (multiline and single line) and collapse whitespace
export const collapse = /({)?\s*(?:\/\*[^]*?\*\/|\/\/[^]*?$|\s+|$)\s*(})?/gm

export function replace(
  _: string,
  opening: string | undefined,
  closing: string | undefined,
): string {
  return opening || closing || ' '
}

const parts = /([ ,}])|\{|[^ ,}{[:]*(?:\[[^ ]+(?![^(]*\))])*:?/g

const cache = new Map<string, ParsedRule[]>()

export function parse(token: string): ParsedRule[] {
  let parsed = cache.get(token)

  if (!parsed) {
    token = token.replace(collapse, replace)

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
        // whitespace or closing brace
        // create rule
        createRule(active, current)
        let lastGroup = active.lastIndexOf('{')

        if (match[1] == '}') {
          // Close nested block
          if (active[lastGroup - 1] == '~') {
            current.shift()
          }
          lastGroup = active.lastIndexOf('{', lastGroup - 1)
        }

        active.length = lastGroup + 1
      } else {
        // - open brace
        // - new variant: `focus:`, `after::`, `[...]:`
        // - new rule

        // Start nested block
        if (match[0] == '~') {
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
