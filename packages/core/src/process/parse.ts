import type { Rule, Token } from '@tw-in-js/types'

import * as is from '../internal/is'

import { join, tail } from '../internal/util'

// Shared variables used during parsing

// List of active groupings: either variant ('xxx:') or prefix
const groupings: string[] = []

// List of parsed rules
let rules: Rule[]

const interleave = (strings: TemplateStringsArray, interpolations: Token[]): Token[] => {
  const result: Token[] = [strings[0]]

  for (let index = 0; index < interpolations.length; ) {
    // Join consecutive strings
    if (is.string(interpolations[index])) {
      ;(result[result.length - 1] as string) += (interpolations[index] as string) + strings[++index]
    } else {
      if (interpolations[index]) {
        result.push(interpolations[index])
      }

      result.push(strings[++index])
    }
  }

  return result
}

const asTokens = (tokens: unknown[]): Token[] =>
  is.array(tokens[0]) && is.array(((tokens[0] as unknown) as TemplateStringsArray).raw)
    ? interleave((tokens[0] as unknown) as TemplateStringsArray, tail(tokens) as Token[])
    : (tokens as Token[])

const startGrouping = (value = ''): '' => {
  groupings.push(value)
  return ''
}

const endGrouping = (isWhitespace?: boolean): void => {
  // If isWhitespace is true
  // ['', ':sm', ':hover'] => ['']
  // ['', ':sm', ':hover', ''] => ['', ':sm', ':hover']

  // If isWhitespace is falsey
  // ['', ':sm', ':hover'] => ['']
  // ['', ':sm', ':hover', ''] => ['', ':sm', ':hover', '']

  const index = groupings.lastIndexOf('')

  if (~index) {
    /* eslint-disable unicorn/prefer-math-trunc */
    groupings.splice(
      index + ~~(isWhitespace as boolean),
      groupings.length - index + ~~(isWhitespace as boolean),
    )
    /* eslint-enable unicorn/prefer-math-trunc */
  }
}

const onlyPrefixes = (s: string): '' | boolean => s && s[0] !== ':'
const onlyVariants = (s: string): '' | boolean => s[0] === ':'

const saveRule = (buffer: string): '' => {
  if (buffer) {
    let negate = false

    if (buffer[0] === '-') {
      negate = true
      buffer = tail(buffer)
    }

    const prefix = join(groupings.filter(onlyPrefixes))

    rules.push({
      variants: groupings.filter(onlyVariants),
      directive: buffer === '&' ? prefix : (prefix && prefix + '-') + buffer,
      negate,
    })
  }

  return ''
}

const parseString = (token: string, isVariant?: boolean): void => {
  let char: string
  let buffer = ''

  for (let position = 0; position < token.length; ) {
    switch ((char = token[position++])) {
      case ':':
        if (buffer) {
          buffer = startGrouping(':' + buffer)
        }

        break

      case '(':
        // If there is a buffer this is the prefix for all grouped tokens
        if (buffer) {
          buffer = startGrouping(buffer)
        }

        startGrouping()

        break

      case ')':
      case ' ':
      case '\t':
      case '\n':
      case '\r':
        buffer = saveRule(buffer)
        endGrouping(char !== ')')

        break

      default:
        buffer += char
    }
  }

  if (isVariant) {
    if (buffer) {
      startGrouping(':' + buffer)
    }
  } else {
    saveRule(buffer)
  }
}

const parseGroupedToken = (token: Token): void => {
  if (token) {
    startGrouping()

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    parseToken(token)

    endGrouping()
  }
}

const parseGroup = (key: string, token: Token): void => {
  if (token) {
    startGrouping()

    const isVariant = is.string(token) || is.object(token) // => is.array is already matched by is.object

    parseString(key, isVariant)

    if (isVariant) {
      parseGroupedToken(token)
    }

    endGrouping()
  }
}

const parseToken = (token: Token): void => {
  if (is.string(token)) {
    parseString(token)
  } else if (is.array(token)) {
    token.forEach(parseGroupedToken)
  } else if (is.object(token)) {
    Object.keys(token).forEach((key) => {
      parseGroup(key, token[key])
    })
  }
}

export const parse = (tokens: unknown[]): Rule[] => {
  groupings.length = 0
  rules = []

  asTokens(tokens).forEach(parseGroupedToken)

  return rules
}
